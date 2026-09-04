# Data model and state machines

## Core persistence model

### users

- `id`
- primary login identity linkage
- default display name captured from primary login account context
- `retired_at` nullable
- timestamps

Retirement is permanent. Historical rows remain.

### auth_identities / sessions

Model primary Apple/Google identities separately from social publishing connections. One shared login endpoint dispatches by provider. Sessions must be revocable individually and en masse at retirement.

One active user may link multiple login identities, including both Apple and Google. Persist each provider identity as the namespaced pair `(provider, provider_subject)`; never use a raw provider subject or email address as the sole primary key. Apple and Google subjects, every provider-verified normalized email observed for the user, and the connected Threads user ID form a layered identity set.

When a profile is permanently retired, preserve tombstones for all of those identifiers. A future authentication or Threads connection that matches any tombstoned identifier is treated as the same retired user and cannot create or activate a profile. This is a deliberate, proportionate deterrent for a low-stakes recreational product, not a claim of legal identity verification or an attempt to make ban evasion impossible. A returning person would need both a new login identity/email and a new Threads account to avoid every layer.

Persist sessions with enough data to enforce the locked policy:

- hashed opaque access-token identifier, `access_expires_at`, and revocation timestamp;
- hashed current and immediately previous refresh-token identifiers;
- refresh-token rotation/family identifier and previous-token grace expiry;
- `last_refreshed_at`, 30-day idle expiry, and 180-day absolute expiry;
- user/device association and creation/update timestamps.

Access tokens have a 24-hour nominal lifetime, but every authenticated request also checks that the database session is active. Refresh exchanges rotate the credential atomically and may return the same previously created successor during the 30-second grace window; they must never fork one token family into multiple successors.

### social_connections

- user
- provider (`THREADS` initially)
- provider user ID and public username
- encrypted access/refresh credentials and expiry
- connection state (`NEVER_CONNECTED | CONNECTED | REAUTH_REQUIRED`)
- granted scopes
- `connected_at`, `last_verified_at`, `last_refreshed_at`, `expires_at`, and revocation/error metadata

Keep the provider abstraction capable of later X, Bluesky, Instagram, or TikTok support, but do not build unused providers now.

External Threads revocation changes the social connection to `REAUTH_REQUIRED`; it does not retire the user. Only the explicit in-app retirement operation sets `users.retired_at`.

### user_push_tokens

- `id`, `user_id`, `token`, `platform`, timestamps
- one user to many tokens;
- globally unique `token`;
- permanently invalid tokens are deleted.

### chats, chat_messages, agent_turns

- chat belongs to its creator;
- chat creation uses a client-generated unique ID so an ambiguous creation response can be retried without duplicating the chat or greeting;
- chat lifecycle includes `ACTIVE | ABANDONED | SENT`; abandoning removes it permanently from user-facing access without deleting its internal record;
- a SENT chat records the one selected Contract ID; sending that same proposal is idempotent while attempts to send another proposal from the finalized chat conflict;
- chat creation persists the standard opening greeting as its first assistant message so transcript storage, UI state, and later model context agree;
- messages are persisted and ordered server-side;
- user message public ID is client-generated and unique within a chat;
- one active turn per chat (enforce in DB/transaction, not only process memory);
- agent turns record status and, later, agent/prompt/model versions and trace metadata; terminal turn status includes `BUDGET_EXHAUSTED` separately from provider/application failure.

Retain abandoned chats, messages, turns, and unsent proposal rows as private internal data for evaluation, model improvement, and historical analysis. They must never reappear as resumable user drafts. Actual training use requires appropriate Terms/Privacy disclosure and a locked retention/access policy before release.

Abandoning during an active turn marks the chat ABANDONED first, records cancellation on the turn, and requests provider cancellation where supported. Any late token, tool result, message, or proposal completion is retained only as private operational history and must not reactivate the chat or become user-visible.

### agent_usage

Maintain a durable append-only cost ledger keyed to the attributable user and operation/attempt. Store provider, model, model cost, research cost, total cost, occurred-at timestamp, and provider usage identifiers when available. Sum non-exempt user-initiated minting usage by UTC calendar day before accepting a new turn and after each completed provider step. Once exhausted, stop the loop before another step. The budget-exhaustion notice is derived presentation metadata and is never stored as an assistant message or included in model context.

### contracts

Each agent proposal is a new immutable contract row in `PROPOSED`. Revisions never overwrite a prior proposal. Contract content includes title, `creator_display_name`, intended-opponent display, resolution contract, dates, state timestamps, and a nullable `terminal_at` used for CLOSED ordering. The creator label defaults from the account display name but may be changed by the minting agent for that proposal without changing the user profile. The resolution contract itself contains the official evidence sources or source hierarchy; do not persist a competing structured judgment-source field. Descriptive participant names are not identity constraints. Participant binding/state timestamps change through guarded transitions; the agreed contract text does not. Contract serialization also includes the creator's Threads handle and, after acceptance, the authenticated challenger's Threads handle. If a different link-holder accepts first, retain the intended-opponent text and display the authenticated challenger separately. Preserved public Contract history retains both bound participants' handles after retirement.

### consequences and consequence_destinations

Store exact pre-approved Threads post text, the participant/outcome that triggers it, the Threads destination, and delivery state. Each possible losing side has one post consequence for MVP. Publishing is deterministic from the verdict; the publishing step must not ask an LLM to rewrite the text. Do not model profile changes or other manual/off-platform consequences in MVP.

### verdicts and judge_attempts

The public verdict stores TRUE/FALSE, evidence/reasoning Markdown, and `judged_at`. The Contract separately stores `resolved_at` when consequence publication succeeds and `terminal_at` for terminal ordering. Each private attempt stores start/end, outcome, error/retry information, sources/trace as appropriate, and agent/prompt/model versions. Attempts are operational records and are not in canonical client serialization.

Each Contract receives at most eight substantive evidence-attempt slots distributed from `resolution_date` through `resolution_expiration`, including both endpoints. Operational retries preserve the same slot/attempt lineage rather than consuming another substantive attempt. A supported verdict cancels future slots.

As an MVP hardening improvement, track cumulative judging cost per Contract and pause automatic attempts at USD $1.00 for operator review. Spend-cap exhaustion is an internal operational pause, not proof that the Contract is UNRESOLVED.

Judge attempts receive the immutable resolution terms prominently and may use only the evidence sources or hierarchy those terms permit. Absence of permitted evidence causes retry within the judgment window and UNRESOLVED at expiration, never an improvised source substitution.

Those terms also control evidence sufficiency. Official deterministic results may require only one authoritative source; consensus-style claims may require a stated quorum across a defined source class. A verdict is supported only after that contract-specific rule is met.

## Contract state machine

```text
PROPOSED --send--> SENT --accept--> ACCEPTED --due/claim--> JUDGING --verdict--> POSTING --published--> RESOLVED
                         |                              |
                         | expiration                  +--retry--> JUDGING
                         v                              +--terminal no verdict--> UNRESOLVED
                       EXPIRED

Any unresolved state involving a retired profile --retire--> VOIDED
POSTING --permanent/exhausted publication failure--> VOIDED
```

Allowed transitions:

| From | Event | To | Notes |
|---|---|---|---|
| PROPOSED | creator sends | SENT | content is already immutable |
| SENT | first valid user accepts | ACCEPTED | atomic compare-and-set; bind challenger |
| SENT | acceptance deadline passes | EXPIRED | scheduled expiry plus authoritative lazy enforcement on reads/mutations; set `terminal_at` once |
| ACCEPTED | resolution becomes due and job claims | JUDGING | idempotent worker claim |
| JUDGING | supported TRUE/FALSE verdict persisted | POSTING | verdict is final; create durable publication work before external side effects |
| JUDGING | evidence not yet available | JUDGING | retry without exposing mechanics |
| JUDGING | resolution window exhausted | UNRESOLVED | set `terminal_at` |
| POSTING | consequence published and receipt persisted | RESOLVED | Threads post ID/link is required; set `resolved_at` and `terminal_at` |
| POSTING | transient provider failure | POSTING | retry through the delivery job without rerunning the judge |
| POSTING | invalid/revoked authorization | POSTING | pause delivery as `BLOCKED_AUTH`; resume after successful Threads reconnection |
| POSTING | permanent rejection or exhausted 24-hour delivery window | VOIDED | stop delivery; keep unpublished verdict private |
| PROPOSED/SENT/ACCEPTED/JUDGING/POSTING | participant retires | VOIDED | set `terminal_at`; cancel pending judgment/publication work; do not publish an unpublished verdict |

No transition out of `RESOLVED`, `EXPIRED`, `VOIDED`, or `UNRESOLVED` is defined. No cancel, withdraw, edit, reopen, or delete transition exists. The MVP `REJECT` control is local navigation only and does not create a contract transition. POSTING is nonterminal: participant retirement voids it like every other unresolved state, cancels pending publication, and keeps any unpublished verdict private as operational history rather than public Contract content.

## Consequence delivery state

```text
PENDING --worker claim--> IN_PROGRESS --successful publish/reconcile--> POSTED
                              |--temporary failure--> RETRY_WAIT --due--> PENDING
                              |--ambiguous timeout--> RECONCILING --confirmed absent--> PENDING
                              |                                  |--post found--> POSTED
                              |                                  +--window exhausted--> VOIDED
                              |--invalid authorization--> BLOCKED_AUTH --reauthorized--> PENDING
                              +--permanent rejection/retry exhaustion--> VOIDED
```

Persist the verdict and durable publication intent before attempting delivery. Invalid authorization receives no blind retries; reconnecting Threads resumes blocked jobs immediately and the 24-hour delivery window excludes time paused for authorization. Transient failures receive eight attempts over 24 active delivery hours with backoff. After an ambiguous timeout, search the destination's recent posts for the exact approved text before retrying; retry only after absence is established. A recovered post completes normally. Permanent rejection or inability to establish safe completion by the end of the window makes the Contract VOIDED rather than risking a duplicate post.

## Chat turn state

```text
ACCEPTED/RUNNING --complete persistence--> COMPLETED
                 --terminal agent error--> FAILED
                 --explicit user stop--> CANCELLED
```

A client/SSE disconnect is not a transition. The active turn continues, persists its assistant message/proposals, then completes. Reconnect reconstructs UI from persisted state.

A retry of a FAILED turn reuses the already-persisted triggering user message and creates a new agent attempt; it does not create a second user message. Attempt lineage must make that retry distinguishable from a new user submission.

A `BUDGET_EXHAUSTED` turn follows the same no-duplication retry lineage but cannot retry before its supplied UTC reset. Persist any assistant text already shown as `INCOMPLETE`; exclude that incomplete provider protocol/output from the retry's model context so the triggering user message is processed once in the new attempt.

Explicit Stop or chat abandonment is different from disconnect: it transitions an active turn to cancellation and prevents late output from changing user-visible chat state. Stop leaves the chat ACTIVE for another user message; abandonment also makes the entire chat inaccessible.

For a user-stopped turn, persist the text already streamed as a `STOPPED` assistant message and show it with an interruption marker. Rebuild subsequent model context from ThinkSo's persisted messages, including that partial visible text plus a clear indication that the user interrupted it. Never pass a dangling or incomplete provider tool-call protocol item into the next request; retain incomplete tool internals only as private trace data.

## Retirement transaction

The retirement operation must be one database transaction where possible:

1. lock/check the active user;
2. set `retired_at` permanently;
3. transition every unresolved participating contract to VOIDED;
4. revoke/delete sessions and push-token rows;
5. preserve tombstones for every linked Apple/Google subject, verified normalized email, and Threads user ID;
6. commit;
7. revoke the provider token as an external side effect with retry/audit handling.

External revocation cannot be truly atomic with Postgres. The retry/outbox approach is **DERIVED** and recommended; public profile retirement must not be rolled back merely because Meta is temporarily unavailable.
