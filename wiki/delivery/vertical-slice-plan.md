# Vertical-slice implementation plan

Each phase ends in a behavior a person can exercise. Split a phase into smaller tickets when needed, but do not split it into “frontend only” and “backend only” projects.

The reviewed execution units are the smaller ordered files in the [ticket tracker](../tickets/index.md). This phase plan remains the roadmap; it must not be used to collapse those tickets back into oversized pull requests.

## Phase 0 — repository and executable skeleton

Deliver Expo and FastAPI apps, Postgres/Alembic, local Compose, environment/config handling, lint/type/test commands, generated OpenAPI client path, TanStack Query + Obsidian mobile composition skeleton, Dishka application/request/job composition, PgQueuer worker skeleton, and deployment configuration that can later provision Railway without requiring a Railway account during local development.

Once the Expo skeleton runs, establish only the shared mobile design foundations required by Login and Connect Threads using the [design-system implementation brief](./design-system-implementation-brief.md). Grow the system with later vertical slices rather than implementing every exported component upfront.

Done when a fresh checkout can boot the mobile app and API, migrate an empty DB, call a health endpoint, inject a fixture repository/query definition into a presenter, render its `UiState`, send an event through `onEvent`, and run all checks from documented commands. The production Expo/Hermes build, Fast Refresh, and test runner must all execute the Obsidian decorator/transform setup successfully.

## Phase 1 — identity and session

Implement Apple and Google UI/provider adapters, backend credential verification through the shared `/auth/login`, session persistence, `/me`, logout, user/session tables, protected navigation, and relaunch restoration together. Build and fake-test both provider paths; defer only live Apple credentials, entitlement/signing, and end-to-end Apple verification until paid Apple Developer enrollment.

Acceptance scenario: launch → authenticate → backend user exists → relaunch remains authenticated → sign out immediately clears the current device and returns to Login even when best-effort server revocation cannot complete.

Use the locked session lifetimes, refresh behavior, and retired-login response from the API and Login BDD.

## Phase 2 — Threads onboarding

Implement acknowledgment gating, Threads OAuth start/callback, encrypted connection persistence, onboarding routing, and Account connection display. Do not implement retirement yet.

Acceptance scenario: authenticated unconnected user cannot press Connect until acknowledging; successful OAuth creates one connection and routes to Main; relaunch remains ready.

Resolve: exact mobile OAuth callback/deep-link protocol.

## Phase 3 — authenticated profile, canonical contract, and Main shell

Implement canonical serializers, authenticated and Threads-gated user/contract/Record reads, seeded contracts, one unpaginated OPEN+CLOSED Record response, Challenge Card variants, Main empty/loading/error states, and deep-linkable Contract screen.

Acceptance scenario: one real API call returns seeded OPEN and CLOSED history with explicit order fields; tab switching is local; a cold Contract link displays no Contract data before Login and Threads connection, then opens the intended Contract rather than Main.

Use the locked CLOSED ordering and intentionally minimal public `UserRef` fields.

## Phase 4 — creation chat transport

Implement chats/messages/turns tables, create chat, GET SSE snapshot/live protocol, POST messages, client UUID conflict recovery, one-turn concurrency, stream reconnection, persisted assistant messages, safe tool-activity UI, the durable usage ledger, and the $0.25 UTC-day minting budget with configured owner exemption. The initial PydanticAI agent uses the separately configured fixed OpenRouter model and may only converse.

Acceptance scenario: send a message → see streamed response → kill the stream mid-turn → backend finishes → reconnect returns the complete authoritative history with no duplicate turn.

## Phase 5 — creation agent and immutable proposals

Add structured PydanticAI creation-agent output, the OpenRouter-backed `WebResearch` boundary, deterministic validation, persisted `PROPOSED` contracts, `proposal_created`, inline proposal UI, and revision-as-new-proposal behavior.

Acceptance scenario: conversation yields a DB-backed proposal; revision creates a second ID; both survive relaunch and either can be selected.

Add a small manual regression corpus based on actual failures, not a generalized eval platform.

## Phase 6 — proposal to send and share

Implement creator confirmation, atomic send, canonical response replacement, protected invite URL, and native share sheet.

Acceptance scenario: creator selects an older proposal → confirms → it changes `PROPOSED → SENT` → native share sheet opens → dismissing returns to the same SENT contract. No custom success screen.

## Phase 7 — accept

Implement protected invite deep-link restoration through Login/Threads gates, recipient confirmation, atomic acceptance race, local-only `REJECT` navigation, stable accepted-domain event output, and Main refresh. Push registration and delivery remain deliberately absent until Phase 10.

Acceptance scenario: two users race to accept; exactly one becomes challenger, the loser receives conflict/toast, and all later reads agree. Tapping `REJECT` simply closes the Contract without changing server state.

The API and UI both forbid creator self-acceptance for MVP. Solo/self challenges are deferred to V2.

## Phase 8 — judging and receipts

Implement due query, idempotent Railway command, JUDGING claim, judge attempts, research/evidence, retry behavior, POSTING/UNRESOLVED transitions, verdict Markdown, and the Contract's pending-post treatment. Run manually locally before enabling the scheduler.

Acceptance scenario: a known historical contract is processed once under overlapping worker invocations and displays the correct TRUE/FALSE evidence with supporting links in POSTING. Notification delivery is integrated later.

Schedule no more than eight substantive evidence attempts across the judgment window, including First Judgment and Resolve By. Infrastructure retries retain the same attempt slot. Evidence sufficiency, resolution expiration, and the lack of MVP appeals or user overrides are already defined by the Judging Agent BDD.

## Phase 9 — consequences

Implement deterministic destination selection from verdict, exact pre-approved Threads publication, recent-post reconciliation after ambiguous timeouts, temporary/auth/permanent failure handling, reconnect-driven resume, `POSTING → RESOLVED`, publication-failure `POSTING → VOIDED`, and receipt status.

Acceptance scenario: a losing consequence posts exactly once despite worker retry; revoked authorization pauses without rerunning the judge; reconnection resumes publication; and the Contract moves from POST PENDING to the final receipt with its Threads link.

## Phase 10 — push registration and transactional notifications

Implement the one-time permission primer, Expo installation-token registration, accepted/POSTING/UNRESOLVED event delivery, exact recipients/copy, protected navigation, deduplication, nonblocking provider handling, and invalid-token cleanup. Verify real delivery on Android; keep iOS behind the same adapter and defer live APNs verification.

Acceptance scenario: a clean two-user flow prompts only after demonstrated value, the creator receives acceptance push, both participants receive `Your judgment is in!` at POSTING, unresolved delivery uses its defined event, and RESOLVED never sends a duplicate result push.

## Phase 11 — permanent retirement

Implement both warnings, DELETE Threads/retirement transaction, voiding unresolved contracts, session/token cleanup, provider revocation outbox/retry, retired login denial, and preserved public history.

Acceptance scenario: a user in JUDGING or POSTING may retire; the profile becomes permanently unusable, unresolved challenges become VOIDED, pending publication is cancelled, all sessions/push tokens stop working, and historical terminal contracts stay public.

## Phase 12 — hardening and release

Deep links from share/push, offline/network behavior, SSE torture/race tests, privacy/terms, migration/deployment rehearsal, observability/alerts, OAuth production requirements, and store builds. Configure and verify the dedicated OpenRouter production key's USD $25 daily provider limit, matching application limit, prepaid funding, and disabled automatic top-up. Broader screen-reader/accessibility hardening remains post-demo work.

Release gate: clean environment deployment and migrations, end-to-end two-user challenge, judge and consequence dry runs, recovery tests, no high-severity security failures, and a documented operator runbook.

The release gate also requires adversarial minting-policy evals demonstrating that profanity, ordinary insults, harsh self-deprecation, and consensual embarrassment remain usable while protected-class attacks, targeted harassment, threats, private information, impersonation, illegal acts, and dangerous consequences are refused. Boundary failures become permanent regression cases.

MVP hardening also adds the USD $1.00 cumulative judging-spend cap per Contract and operator-visible pause/resume path. Budget exhaustion must never be serialized as an evidence-based UNRESOLVED result.
