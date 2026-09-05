# ThinkSo wiki log

This is an append-only history of material wiki operations.

## [2026-09-04] convention | Focused pull-request presentation

Locked pull-request titles to `[T-NNN] Simple title` and reduced the standard body to ticket, changes, test instructions, UI screenshots when relevant, and brief notes. General wiki and planning changes that do not belong to a ticket are committed separately to `main`; ticket-specific documentation remains with its feature pull request.

## [2026-09-04] update | Firebase authentication plan and revised UI sources

Replaced the Apple/Google-first authentication plan with Firebase email/password authentication and a separate password-recovery slice. Added the revised login and registration design archive, updated the affected BDDs, API and data contracts, architecture, operations guides, ticket map, known issues, and screen indexes. These general planning changes were committed directly to `main` so implementation pull requests remain focused on their ticket-specific behavior.

## [2026-09-04] setup | Android emulator and stack tooling verified

Installed and verified the Android command-line toolchain and a dedicated `ThinkSo_API_36` Pixel 8 AVD running Android 16/API 36. The emulator boots to the launcher and is visible to `adb`; login-shell Android paths live in the user-level shell configuration rather than the repository. GitHub CLI 2.100.0 and `github/gh-stack` 0.1.1 are also active. iOS remains blocked only by Xcode first-run components, license acceptance, and a simulator runtime; AutoMobile installation is agent-owned, with only any actual macOS permission prompt reserved for the human.

## [2026-09-04] decision | Foundation configuration approved

The product owner approved and locked the foundation configuration, including runtime baselines, repository shape, Expo CNG and development builds, strict TypeScript boundaries, TanStack Query, React Obsidian with a mandatory compatibility spike, FastAPI/Postgres/PgQueuer backend conventions, generated OpenAPI transport, CI shape, and repository governance. T-000 entered implementation and T-010/T-020 became ready in dependency order.

## [2026-09-04] add | Implementation-oriented provider setup guides

Added owner-facing setup guides for Expo account/EAS project ownership, Google OAuth and Firebase, Meta developer/Threads API, and OpenRouter key and budget controls. Each guide separates work possible before scaffolding from work requiring agent-generated identifiers or callback URLs, uses safe placeholders, records secret-handling warnings, defines acceptance evidence, and provides explicit agent handoff fields. The guides link current official provider documentation and note where console labels, plan entitlements, or provider review requirements must be verified rather than assumed.

## [2026-09-04] publish | Initial public GitHub repository

Accepted the Xcode tooling prerequisite, initialized the local workspace on `main`, connected the existing empty public `dmitchelljackson/ThinkSo` repository, and published commit `ebb4f587d862`. Before publication, added repository-wide ignore rules, removed Finder metadata from the candidate tree, sanitized one machine-local source path, validated all relative Markdown links, ran staged whitespace checks, and completed a redacted Gitleaks scan with no findings. The repository now exposes the portfolio README, literal design captures, preserved sources, canonical wiki, BDDs, API specification, architecture, and ordered ticket backlog.

## [2026-09-03] correction | README uses literal exported designs

Replaced the initially selected generated reference examples with browser-rendered captures of the actual `ThinkSo Create Challenge.dc.html`, `ThinkSo The Record.dc.html`, and `ThinkSo Challenge Contract.dc.html` design documents. Updated the Contract caption to describe the displayed active-state screen rather than implying that one image shows every lifecycle state.

## [2026-09-03] add | Portfolio-facing repository README

Replaced the repository placeholder with an honest public-facing project overview covering the product loop, representative concept screens, mobile/backend/agent architecture, engineering boundaries, target monorepo, planned stack, documentation map, implementation status, and source-available terms. Added clean README asset copies of the creation flow, Record, and Contract lifecycle exports while preserving their original immutable sources under `raw/`.

## [2026-09-03] decision | Build Apple with Google and defer push integration

Moved Apple provider implementation, backend verification, configuration shape, and fake tests into the same T-030 slice as Google; only paid-capability credentials, entitlements, and live end-to-end Apple verification remain deferred. Reordered the stack so Contract acceptance, judging, and Threads consequence publication are complete before push registration and transactional acceptance/judgment delivery are added in T-150/T-160.

## [2026-09-03] decision | Source-available with all rights reserved

Locked the public repository as source-available but not open source. Added an explicit Mitchell Jackson copyright notice, no general reuse/modification/distribution/commercial grant, and a no-outside-contributions policy to preserve ownership and future relicensing options. A possible later GPL release remains deferred.

## [2026-09-03] add | Reviewable foundation and full-stack ticket backlog

Created the empty public `dmitchelljackson/ThinkSo` repository without pushing local content after a credential scan. Added a concrete owner-review sheet proposing Node 24 LTS, Expo SDK 57/React Native 0.86, development builds with CNG, CPython 3.13, Postgres 17, and an `openapi-typescript`/`openapi-fetch` transport boundary. Added nineteen ordered enabling/product tickets with explicit mobile/backend/agent/test/wiki work, BDD/design/API/architecture links, human gates, activity/observation sections, and a complete BDD ownership map. All tickets remain DRAFT pending owner review; product code has not started.

## [2026-09-03] decision | GitHub native stacked pull requests

Replaced the proposed manual branch retargeting, cascading rebase, temporary-worktree repair, and force-push workflow with GitHub's native stacked-PR public preview and official `github/gh-stack` extension. Recorded the required CLI version, non-interactive coordinator commands, preview caveat, per-layer CI semantics, and local setup blocker.

## [2026-09-03] add | Autonomous build readiness checklist

Added a front-door human setup checklist split into an initial machine/account batch, one consolidated provider-activation checkpoint after agents generate exact identifiers and callbacks, and explicitly deferred deployment/Apple gates. Clarified that agents own ordinary package installation, repository creation, native stacked-PR tooling, scaffolding, CI, and verification. Recorded the local GitHub CLI 2.83.1 upgrade requirement and the Xcode-license blocker.

## [2026-09-03] decision | Coordinator-owned shared checkout and Git state

Simplified forward stack construction to one coordinator-owned checkout. One implementer subagent at a time returns uncommitted changes; the coordinator inspects, records, commits, pushes, and creates or updates the stacked PR. CI, code review, and AutoMobile verification then run concurrently and read-only against the frozen candidate while the checkout remains unchanged. Worktrees are reserved for repairing older stack layers without disturbing the tip. Only the coordinator mutates Git, GitHub, and canonical ticket files.

## [2026-09-03] decision | Coordinator-owned Jira-like ticket communication

Made each Markdown ticket the durable work specification and inter-agent conversation. The coordinator is the sole writer of canonical ticket status, gates, and append-only activity to prevent parallel verifier conflicts. Workers return structured reports; the coordinator persists candidates, findings with stable IDs, fixes, blockers, decisions, and gate results before dispatching dependent work. Added the harness-aware ticket tracker and template.

## [2026-09-03] decision | Sequential stacked-PR agent harness

Locked a coordinator-led deep PR stack. Exactly one implementer advances the write path; once a candidate commit exists, CI, independent code review, and AutoMobile verification run concurrently against that immutable candidate. The next full-stack ticket begins only after all gates pass, while human PR review and bottom-up merging may wait until the full stack is ready. Added durable coordinator, implementer, code-reviewer, and UI-verifier role prompts.

All spawned worker roles default to `gpt-5.6-luna` for cost control. Implementation and review use high reasoning and UI verification uses medium. After two repair cycles hit the same blocker, or a worker identifies a bounded task requiring materially stronger judgment, the coordinator may escalate that role to `gpt-5.6-terra` and must record why.

## [2026-09-03] decision | Small full-stack tickets and pull requests

Locked normal tickets to small observable full-stack features that usually land as one pull request. Required frontend, backend, data, agent, test, and wiki changes merge together so the feature is done. Delivery phases group these tickets; explicitly labeled enabling infrastructure tickets are permitted but cannot claim completed product behavior.

## [2026-09-03] decision | Defer domain and production URLs

Deferred domain purchase, stable production invite URLs, and production callback configuration until deployment is chosen. Local development keeps URL construction configurable and may use app schemes plus a temporary documented HTTPS tunnel where providers require one.

## [2026-09-03] decision | CI toolchain

Locked Expo ESLint, Prettier, TypeScript no-emit checking, Jest, and React Native Testing Library for mobile quality gates; locked Ruff format/check, mypy, and pytest for backend gates. CI reports useful coverage but does not impose an arbitrary global percentage; ticket and BDD behavior determines required tests.

## [2026-09-03] decision | Public GitHub CI and low-cost native testing

Locked a public GitHub monorepo created by an agent through authenticated GitHub CLI after a public-content audit. GitHub Actions gates formatting, linting, type checks, generated-client drift, container builds, and mobile/backend tests. Ordinary CI remains emulator-free on standard Linux runners; AutoMobile drives local native verification. Later hosted E2E begins with Android, and hosted iOS is added only when free or clearly worth its cost.

## [2026-09-03] decision | Defer Railway account and deployment

Deferred Railway account creation, billing, secrets, and live services until the release/deployment phase. Development remains local through Docker Compose; agents prepare deployment configuration earlier without requiring cloud access. Provider callbacks may use a temporary documented development tunnel when necessary.

## [2026-09-03] decision | Android-first push and free iOS coverage

Kept Expo Push Service rather than adding direct FCM integration. The demo receives real end-to-end notification coverage on Android and exercises all other feasible behavior on the free iOS Simulator using Google login. Sign in with Apple, live APNs delivery, TestFlight, and App Store verification are deferred until paid Apple Developer enrollment; they remain isolated behind the same authentication and notification adapters.

## [2026-09-03] prerequisite | Apple Developer enrollment

Recorded paid Apple Developer Program enrollment as a human-owned prerequisite before ThinkSo's authentication/push vertical slice. Free Xcode and simulator work can begin first. Enrollment ownership, identity verification, agreements, payment, privileged account access, and secret placement remain human responsibilities; agents receive only required non-secret identifiers and confirmation that secrets are configured.

## [2026-09-03] decision | Container-first tooling and AutoMobile

Locked pnpm workspaces for TypeScript, uv for Python, a container-first Docker Compose backend, host-native Expo tooling, and a root `justfile`; Nx/Turborepo remain out until justified. Working iOS and Android virtual devices plus AutoMobile MCP configuration are an early human-owned prerequisite. After setup, agents use AutoMobile for interactive native UI review while deterministic automated E2E remains a later suite.

## [2026-09-03] decision | Feature-oriented monorepo organization

Locked ThinkSo as a monorepo containing mobile, backend, wiki, generated API client, and preserved sources. Mobile product code is organized by feature/screen. Backend product code is organized by feature, with each feature owning HTTP and durable-job adapters alongside its application, domain, and persistence code. HTTP, worker, and scheduler remain separate thin entrypoints. Minting and judging own their specific agent implementations while genuinely shared agent execution infrastructure lives in `agent_runtime`.

## [2026-09-03] decision | Ambiguous Threads publication recovery

Replaced indefinite STALLED/operator handling with bounded reconciliation. After an ambiguous publish timeout, check the losing account's recent posts for the exact approved text before any repost; recover a found receipt, retry only when absence is confirmed, and never repost while ambiguity remains. Permanent rejection or failure to establish safe completion within eight attempts over 24 active delivery hours now transitions POSTING to VOIDED. Authorization pauses remain resumable and pause that delivery clock.

## [2026-09-03] decision | Demo-wide OpenRouter spend ceiling

Locked matching application-side and OpenRouter-side USD $25 daily limits for the dedicated production key. The demo uses prepaid credits, manual refill, and no automatic top-up. This is adjustable operations configuration rather than a permanent monetization or pricing rule.

## [2026-09-03] decision | Backend and agent architecture

Locked the backend to a feature-oriented FastAPI modular monolith using Dishka application/request/job scopes, async SQLAlchemy and psycopg I/O, application-owned transactions, and PgQueuer durable work behind a `TaskQueue` port. Redis and Celery remain out of scope without a demonstrated need.

Locked PydanticAI as the minting/judging harness and OpenRouter as the initial gateway. Both agents initially use separately configurable fixed `z-ai/glm-5.3-flash` IDs; OpenRouter web search sits behind a typed research port. Added a durable usage ledger and a $0.25 per-user UTC-day gate for new user-initiated minting turns. System-required work is never budget-blocked, and verified owner emails are exempt through uncommitted deployment-secret configuration.

## [2026-09-03] decision | Daily minting-budget UX

Locked budget exhaustion as an authoritative chat submission gate and SSE event. A rejected draft remains editable while the screen stays mounted; the conversation shows a non-agent daily-limit notice, the global toast repeats it without retry, and further submission remains disabled until the server-supplied UTC reset. Existing proposals can still be sent. Leaving uses the ordinary discard flow and provides no special recovery for the draft or chat.

## [2026-09-03] correction | Enforce user budget inside agent turns

Removed the proposed separate $0.05 per-turn cap. Each non-exempt minting run now receives the user's remaining $0.25 UTC-day budget, records actual model and search spend after every provider response, and stops before another step when exhausted. Only one bounded in-flight request may overshoot. Budget-ended turns preserve visible partial output as incomplete and may retry the same persisted user message after reset. Added provider-request search/output bounds and a provider-enforced production-key limit as independent runaway protection.

## [2026-09-03] decision | Judgment retry schedule and spend hardening

Locked at most eight substantive evidence attempts distributed from First Judgment through Resolve By, including both endpoints; infrastructure recovery retains the same evidence slot. Added a USD $1.00 cumulative judging-spend cap per Contract as an MVP hardening improvement. Reaching it pauses automatic work for operator review and is never presented as evidence-based UNRESOLVED.

## [2026-09-03] decision | Fixed model, provider routing, and minting scope

Kept `z-ai/glm-5.3-flash` fixed per agent version while allowing OpenRouter to route and fail over among providers serving that model; cross-model fallback is disabled. Added a minting-agent scope boundary: Contract-directed questions and research remain allowed, while unrelated general-assistant work such as standalone schoolwork is declined and redirected without unnecessary tool use.

## [2026-09-02] decision | Circuit-style presenters and Obsidian injection

Superseded the RxJS repository-stream architecture with a Presenter/UDF design modeled on Slack Circuit. Data-layer TanStack Query definitions now own server caching and subscriptions; Obsidian owns dependency graphs and presenter injection; custom-hook presenters own transient React state and emit discriminated `UiState` with one typed `onEvent` callback; React Native screens only render and emit events. Locked presenter-owned navigation and one-shot effects through injected typed ports, unconditional presenter composition under the Rules of Hooks, presenter lifetime tied to mount lifetime, and direct presenter unit tests through `renderHook` with injected fakes. Removed RxJS, Zustand, Redux, generic external-store adapters, field injection, Obsidian observables, and service location from the initial architecture.

## [2026-09-02] cleanup | Notification and decision-register ambiguity

Moved already-locked judging rules out of the open-question section, treated exact minting failure/refusal prose as flexible within its behavioral contract, and narrowed the silent-notification BDD to events explicitly discussed. Marked EXPIRED and VOIDED notification behavior as open rather than silently treating both as notification-free.

## [2026-09-02] decision | Contract participant labels and Threads handles

Locked immutable Contract-specific creator and intended-opponent labels. Creator text defaults from the account name captured through primary login and may be changed by the minting agent per proposal without editing the profile. The creator's Threads handle is shown on every Contract; after acceptance, the bound challenger's Threads handle is shown alongside the preserved intended-opponent text. Updated the canonical API example to show both identities in an ACCEPTED Contract.

## [2026-09-02] decision | Exact judgment-window timestamps

Replaced date-only or countdown-style First Judgment and Resolve By presentation with exact device-local date, clock time, and timezone values. Non-minute-aligned stored instants include seconds so short-fuse Contract boundaries remain unambiguous. Acceptance retains its separately defined snapshot-relative label.

## [2026-09-02] decision | Silent expiration

Locked SENT-to-EXPIRED as notification-free for MVP. An unaccepted expired Contract moves into the creator's CLOSED Record without sending a push.

## [2026-09-02] decision | Silent voiding

Locked VOIDED as notification-free for MVP. The remaining active participant learns that the challenge was voided through CLOSED or an authoritative Contract refresh; a dedicated void notification is deferred.

## [2026-09-02] decision | Tablet and rotation scope

Locked tablets to the same phone composition centered within a maximum-width content column, with no separate tablet navigation or design. Portrait usability is required. Rotation may remain enabled when the ordinary responsive layout works, but MVP may lock portrait rather than add a special landscape design or delay implementation.

## [2026-09-02] update | Continued product decisions and BDD additions

During SSE loss, retain transcript, proposal interaction, and editable draft text while replacing the composer action with `RECONNECTING...` and the loading S. Reconnected authoritative chat state restores Stop or Submit.

After automatic SSE reconnection attempts are exhausted, change the composer action to tappable `RETRY CONNECTION` without clearing the draft or hiding proposal cards.

Allow proposal selection and `CREATE + SEND` while the minting agent is actively responding; streaming and the send flow may overlap.

When send succeeds during an active minting turn, cancel the turn, finalize the chat, and suppress late output. The chosen sent contract is final.

Auto-follow Create Challenge streaming only while the user is near the bottom. Preserve the user's position after they scroll upward.

Do not add a new-content indicator or jump-to-latest control in MVP; retain it as a possible post-MVP improvement.

Cap the expanding Create Challenge composer at five visible lines, then scroll its text internally.

Use Return for newlines in the Create Challenge composer; only the arrow submits.

When a persisted user message's minting turn fails, retry only the failed agent turn and never resend or duplicate the user message.

Created Section 5 Create Challenge Screen BDD with numbered acceptance cases and per-case links to the exported UI evidence.

Locked ordinary Sign Out as current-device-only and local-first. Server revocation is best-effort and can never block or reverse local logout; other devices remain signed in.

Locked the exported five-second hold-to-retire interaction. Early release resets it; completed holds wait for authoritative retirement with disabled actions and the loading S rather than assuming success locally.

Created Section 6 Account Screen BDD with numbered cases and per-case links to the Account and retirement-warning exports.

Locked a permissive-but-bounded minting safety policy: profanity, ordinary name-calling, harsh self-deprecation, edgy consensual trash talk, and embarrassment are allowed within reason. Protected-class attacks, targeted harassment, threats, privacy abuse, deception, illegality, and dangerous conduct are refused. Added adversarial and regression evals to the release requirements.

Changed acceptance presentation from a date-only Accept By label to a snapshot-relative `ACCEPT IN ...` label backed by an exact UTC instant. It floors the largest full day/hour/minute unit and uses `NOW` below one minute. It updates on authoritative load/refresh rather than running a busy local countdown; the server remains authoritative.

Locked judgment sources into the immutable official resolution terms rather than a separate structured field. The judging prompt must foreground those terms and use their source hierarchy directly.

Corrected the exported consequence example: MVP mints only exact pre-approved Threads posts, one for the losing participant in each possible outcome. Profile changes and all other manual or off-platform consequences are noncanonical.

Created Section 7 Minting Agent BDD from the locked creation, research, source, timing, consequence, safety, persistence, cancellation, and retry decisions.

Clarified that agent evals and regression corpora verify product behavior but do not receive their own BDD. The agent BDD remains the product contract; test design belongs in implementation documentation.

Locked judging to the immutable resolution terms and their stated source hierarchy. If permitted evidence is unavailable, retry until Resolve By and then mark UNRESOLVED; never silently substitute an unmentioned source.

Made evidence sufficiency contract-specific. One authoritative official score or number can be enough; consensus/reporting claims must define and satisfy a source quorum, such as agreement among three qualifying major trackers. No universal citation-count padding.

Locked supported TRUE/FALSE verdicts as final for MVP. Participant appeals, rejudge requests, overrides, and formal corrections are deferred to V2.

Created Section 8 Judging Agent BDD from the locked First Judgment, immutable terms, source hierarchy, evidence sufficiency, retry-window, UNRESOLVED, POSTING, retirement, and verdict-finality decisions.

Superseded the prior result-notification timing. Acceptance notifies the creator. A supported verdict entering POSTING sends one result push to both participants immediately; RESOLVED sends no duplicate. UNRESOLVED also notifies both participants. Every notification opens the canonical Contract.

Locked result-notification copy to `Your judgment is in!`, withholding TRUE/FALSE until the user opens the Contract.

Locked acceptance-notification copy to `Your challenge was accepted!`; tapping it opens the accepted Contract.

Locked UNRESOLVED-notification copy to `We couldn't resolve your challenge.`; both participants receive it and tapping opens the Contract.

Locked contextual push-permission timing: after the first successful send or acceptance on a device, show a ThinkSo primer and only then invoke the native prompt. Notification permission never gates the successful Contract action.

Locked the notification primer's paper-notice composition, exact copy, actions, one-time-per-installation behavior, and suppression when permission is already granted or permanently denied.

Created Section 9 Notifications BDD covering the primer, native permission, device tokens, acceptance, POSTING and UNRESOLVED pushes, exact copy, protected Contract navigation, delivery isolation, and deduplication.

Created Section 10 Consequence Publication BDD covering deterministic exact post selection, durable POSTING work, temporary retry budget, Threads authorization pause/resume, receipts, idempotency, operator-stalled delivery, and retirement.

Sanitized screen numbering and MVP placeholder behavior: Contract remains Section 4, Create Challenge Section 5, and How It Works/Terms/Privacy are nonfunctional controls rather than implied destinations. Updated the vertical-slice plan for local-first logout, locked Record behavior, POSTING notification timing, final verdict policy, and deferred demo accessibility hardening.

Reconciled the canonical API with locked BDD behavior: separated judged, resolved, and terminal timestamps; removed undeclared public profile/action fields; corrected Record sort naming; made chat creation retry-safe with its persisted greeting; defined stopped-message and active-turn shapes; added cancel, retry, and abandon commands; and made creator send finalize its chat and recover an ambiguous repeated request idempotently.

## [2026-09-01] decision | Initial minting-chat failure

Retain the Create Challenge shell and Back control on chat-creation failure, keep composition disabled, and show the global retry toast. Retry creates one chat and one persisted greeting without duplication.

## [2026-09-01] decision | Initial minting-chat loading

Show the Create Challenge shell, centered loading S, and disabled composer while the chat and persisted greeting are created. Enable the flow only after creation succeeds.

## [2026-09-01] decision | Persist minting greeting

Persist the opening greeting as the chat's first assistant message so stored transcript, rendered UI, and future model context remain identical.

## [2026-09-01] decision | Minting opening greeting

New Create Challenge flows open with the minting-agent line: `Okay, let's hear it. What are you so sure about?`

## [2026-09-01] decision | Creator send failure and retry

During send, disable both confirmation actions and show the loading S. Failure closes the dialog, retains the PROPOSED card, and uses the global retry toast; retry repeats the already-confirmed send without another confirmation.

## [2026-09-01] decision | Creator confirmation membership copy

Updated the send confirmation to say that anyone on ThinkSo with the link may view it and the first person to accept is locked in, rather than implying anonymous internet access.

## [2026-09-01] decision | Explicit minting dates and validation

The proposal tool requires all three Contract dates and supplies no fallback. Code enforces Accept By before First Judgment and at least 48 hours through Resolve By; a seven-day judging window and event-aware acceptance threshold are prompt guidance rather than hard defaults.

## [2026-09-01] decision | Prospective source verification

Future-event proposals need a credible evidence path and source hierarchy, not a final-result URL that cannot exist yet. If no objectively judgeable path exists, minting refuses to persist a proposal and explains what must change.

## [2026-09-01] decision | Verify judgment sources during minting

Require every proposed Contract to state and verify its future evidence sources or source hierarchy. The minting agent researches whenever existing verified context is insufficient, without repeating searches solely to meet a fixed tool-call count.

## [2026-09-01] correction | Minting discard-guard boundary and copy

Superseded the first-message-only boundary. Show `THROW THIS OUT?` whenever submitted messages exist or the composer contains unsent text; only a completely empty untouched flow exits immediately. Locked KEEP WORKING, red DISCARD, and `commitment issues already?` copy treatment.

## [2026-09-01] decision | Restore failed minting submission

On message-submission failure, restore the exact text to the composer, reconcile the optimistic message, and show the global retry toast without losing or duplicating content.

## [2026-09-01] decision | Preserve minting composer draft through Stop

Keep the text field editable while the minting agent turns. Stop never clears the draft; the field clears only after that exact text is successfully submitted as the next user message.

## [2026-09-01] decision | Preserve stopped minting context

Persist partial visible output from a stopped minting turn as a STOPPED assistant message and include it with an interruption marker in later app-managed model context. Do not replay incomplete provider tool-call protocol items.

## [2026-09-01] decision | Stop active minting turn

While the minting agent is turning, replace Submit with a red Stop control. No messages queue behind an active turn. Stop cancels the turn and then restores normal sending without abandoning the chat.

## [2026-09-01] decision | Minting discard-guard boundary

The Create Challenge exit confirmation begins only after the first user message is successfully submitted. An empty flow or unsent composer text may exit immediately; unsent text is not retained.

## [2026-09-01] decision | Cancel abandoned active minting turns

Explicit discard marks the chat ABANDONED before requesting active-turn cancellation. Late provider output may remain private operational history but cannot reactivate the flow or create user-visible messages or proposals.

## [2026-09-01] decision | Retain abandoned minting records

DISCARD marks a minting chat ABANDONED and permanently removes it from user-facing access without physical deletion. Retain messages, turns, and unsent proposals privately for evaluation, possible disclosed training use, and historical analysis; final retention and disclosure policy remains release work.

## [2026-09-01] decision | New minting flow and exit confirmation

Every Make a Challenge action starts a new persisted chat rather than resuming an unfinished one. Leaving after work begins is gated by a DISCARD or CONTINUE confirmation.

## [2026-09-01] defer | Minting chat attachments

Made the MVP Create Challenge composer text-only. The exported attachment control is hidden and no upload API is implemented; attachment use cases and policy are deferred.

## [2026-09-01] add | Section 4 Challenge Contract BDD

Created the numbered canonical Contract BDD with per-case UI references covering platform gates, loading/errors, shared structure, creator and invite behavior, local-only rejection, acceptance confirmation and races, self-acceptance denial, active/judging/posting/resolved and terminal variants, retirement, refresh triggers, motion, navigation, links, and responsive implementation.

## [2026-09-01] add | Section 3 The Record BDD

Created the numbered Main / The Record BDD with per-case UI references covering structure, tabs, empty state, server ordering, POSTING membership, card navigation, position preservation, animation, initial and retained-data loading/errors, atomic refresh, focus refresh, navigation controls, gates, and responsive implementation. Linked it from the root screen directory and wiki index.

## [2026-09-01] decision | Intended opponent versus acceptor

Made intended-opponent text immutable and descriptive rather than identity-bound. When another link-holder accepts first, the Contract retains the original intended name and separately displays the authenticated challenger who actually accepted.

## [2026-09-01] decision | Contract refresh and motion

The MVP Contract does not poll or subscribe to a live stream. It refreshes after local mutations, navigation focus, app foregrounding, and fresh push/deep-link opens. Visible state changes use restrained fades/layout transitions rather than dramatic full-screen motion.

## [2026-09-01] decision | Contract loading and read failures

Use the Contract shell with the centered loading S for initial loading. Read failures use the global retry toast; cached Contract content remains visible when available. No dedicated full-screen Contract error composition is required for MVP.

## [2026-09-01] defer | Creator self-acceptance

Forbid creator self-acceptance in both UI and API for MVP. Preserve solo/self challenges as an explicit V2 use case rather than inferring behavior from the exported solo-card visual.

## [2026-09-01] defer | True rejection and DECLINED state

Removed DECLINED from the MVP state machine, API, Record ordering, notifications, and implementation plan. The exported `REJECT` button remains but only closes the Contract locally. Recipient-bound rejection, DECLINED history, the confirmation treatment, and burn-away motion are V2 work.

## [2026-09-01] decision | Platform-public MVP access

Replaced anonymous public access with a platform-membership gate. Contract, Record, profile, invite, and receipt reads require Login plus connected Threads, but are not participant-restricted. Added Login and Connect Threads BDD coverage for preserving a Contract deep link through both gates; anonymous previews remain a V2 possibility.

## [2026-09-01] decision | Retirement during POSTING

Confirmed POSTING is nonterminal and follows the existing retirement rule: participant retirement transitions the Contract to VOIDED, cancels pending publication, and keeps any unpublished verdict out of the public Contract.

## [2026-09-01] decision | POSTING contract state

Added POSTING between JUDGING and RESOLVED. The final verdict is visible with POST PENDING while durable Threads publication runs; successful publication stores the receipt and resolves the Contract. Defined paused authorization, transient retry, stalled-work, and reconnect-resume behavior, and updated the Connect Threads BDD accordingly.

## [2026-09-01] defer | Rejection burn-away transition

Kept successful rejection simple for MVP: close the Contract and return to The Record. Recorded a branded burn-away transition as a post-MVP enhancement while preserving the declined contract as public history.

## [2026-09-01] decision | Record navigation and live movement

Locked challenge-card navigation to the canonical Contract screen, preservation of the selected tab and scroll position on return, and live animated card reordering/removal. Recorded the deliberate MVP omission of an explanatory toast as a post-MVP improvement candidate.

## [2026-09-01] add | Root screen and UI-source directory

Added root `SCREENS.md` linking completed BDDs, in-progress and remaining screens, shared components, the complete flow, and canonical supporting docs. Linked it prominently from the repository README, wiki index, and agent instructions.

## [2026-09-01] update | UI source links and Record retry behavior

Added primary/shared UI-source sections and per-case exported-file links to the Login and Connect Threads BDD documents, and made this mandatory for future screen BDDs. Locked initial Record retry to retain the exported error composition, disable `TRY AGAIN`, show the separate loading S, and keep the Make a Challenge FAB available.

## [2026-09-01] correction | One-call unpaginated MVP Record

Superseded per-tab fetching and the earlier pagination decision. One public Record request now returns both complete OPEN and CLOSED collections with explicit `record_order`; tab switching is local. Pull/focus refresh replace both collections atomically, retained data survives failure, and pagination is deferred until observed scale or performance requires it.

## [2026-09-01] decision | Closed first-load behavior

Locked CLOSED to the same initial-load/cache/error model as OPEN: first uncached selection shows the full loading S, later selection renders retained data immediately, and an initial failure without usable data shows the full-screen Record error.

## [2026-09-01] decision | Defer Open list group headings

Kept the MVP OPEN list as one continuous ordered stack without bucket headings. Individual cards retain status labels; group headings may be revisited later.

## [2026-09-01] decision | Open Record ordering

Locked server-owned OPEN order: awaiting acceptance newest-sent first, then judging/retrying earliest-due first, then accepted/upcoming earliest-judgment first. The server applies a stable unique tie-breaker and emits the resulting `record_order`.

## [2026-09-01] decision | Explicit Record ordering metadata

Changed contract-list responses to wrap the unchanged canonical contract with an explicit zero-based server-issued `record_order`. Clients merge and display pages by that field rather than assuming response-array order; refresh replaces ranks, and the server applies a stable unique tie-breaker before assigning them.

## [2026-09-01] decision | Closed Record ordering

Locked CLOSED ordering by terminal-state timestamp descending across resolved, declined, expired, voided, and terminal-unresolved challenges, independent of original creation time.

## [2026-09-01] decision | The Record pagination

Locked automatic near-end pagination per tab with one in-flight next-page request, a footer loading S, retained cards on failure, retry, and end-of-file treatment only after the server confirms the final page.

## [2026-09-01] decision | The Record focus refresh

Recorded the previously agreed MVP focus behavior: Main immediately renders retained cards, silently refreshes stale selected-tab data through the repository, preserves usable data on failure, and reserves full-screen loading for absence of usable data. Marked the policy as revisitable after real usage.

## [2026-09-01] decision | Test implementation sequencing

Locked unit and layer-level tests as part of implementing each piece of production code. Deferred full E2E automation until the complete product flow exists; it will be a separate suite and will intentionally overlap critical unit-tested behaviors.

## [2026-09-01] decision | Reactive mobile client architecture

Locked separate DTO, domain, aggregate, and UI-state models; TanStack Query Core hidden inside repositories; RxJS observable repository and feature streams; stateless domain composition; pure presentation mapping; and a generic React external-store adapter. React screens observe only presentation-ready `UiState`, while repository cache/invalidation—not rerendering—controls network work. Added layer dependency rules and a fast-test contract; Redux is excluded.

## [2026-09-01] decision | The Record pull-to-refresh

Locked selected-tab pull-to-refresh with existing cards preserved, a small loading S, and global retry-toast failure handling. The full-screen list error is reserved for cases with no usable data.

## [2026-08-31] decision | Persistent Make a Challenge FAB

Locked the Make a Challenge FAB as visible and enabled across Main's OPEN/CLOSED, list, empty, loading, and recoverable-error states. Only application-level session or Threads authorization gates suppress access.

## [2026-08-31] decision | Universal Open empty state

Locked one OPEN empty-state variant regardless of CLOSED history: `NOTHING OPEN` with `No challenges need your attention. Go start something.`, retaining the crossed-out document and direction toward Make a Challenge.

## [2026-08-31] decision | Preserve Open default when empty

Locked Main to remain on the OPEN empty state when no open challenges exist, including when CLOSED has history. The app never automatically selects CLOSED.

## [2026-08-31] decision | Hide empty Closed tab

Locked the CLOSED tab as conditional: show it only when the server-defined closed set contains at least one challenge. OPEN remains visible and remains the default on fresh entry.

## [2026-08-31] decision | The Record default tab

Locked OPEN as the default on every fresh entry to Main/The Record. The app does not preserve the previously selected OPEN/CLOSED tab across entries.

## [2026-08-31] add | Mobile design system and Codex brief

Inventoried repeated visual patterns in the Claude Design export and added a canonical design-system page covering provisional semantic tokens, shared primitives, intentional exceptions, responsive/native rules, incremental extraction, and verification. Added a Codex-ready implementation brief and placed the first-screen foundation work after the executable Expo skeleton in Phase 0.

## [2026-08-31] add | Claude Design export and responsive-source warning

Imported the complete Claude Design archive unchanged under `raw/designs/thinkso-claude-export/`, added a durable source manifest, and documented that its fixed 393 × 852 shell and hardcoded web values are not React Native layout requirements. Added Section 2 Connect Threads BDD covering visible content, local acknowledgment, loading, OAuth success/cancellation/errors, missing scopes, claimed identities, interrupted returns, reauthorization, and the blocking gate.

## [2026-08-31] decision | Indeterminate Threads OAuth return

Locked a return from Meta with neither server success nor explicit error as cancellation: no toast, loading ends, the local acknowledgment remains checked, and Connect Threads is enabled again.

## [2026-08-31] decision | Recover missed Threads OAuth return

Locked the backend connection state as authoritative when the mobile OAuth return is interrupted. Connect Threads rechecks on focus and bootstrap; an already-completed connection routes directly to Main without a toast or redundant Meta authorization.

## [2026-08-31] decision | Defer Threads account transfer

Locked a hard MVP failure when a Threads identity is already linked to another active ThinkSo profile. Neither profile is changed, transferred, merged, or retired, and duplicate ownership is forbidden. Locked the `THREADS ACCOUNT CLAIMED` copy and `LOG OUT · 6` action; countdown expiry only dismisses the toast. Added a known-issues page documenting legitimate multi-profile recovery and account transfer as post-MVP work.

## [2026-08-31] decision | Threads partial authorization

Locked Threads connection as all-or-nothing. Withholding either required scope, including publishing permission, leaves the profile gated and does not count as connected; the user sees a specific retryable error and may restart the full Meta authorization flow.

## [2026-08-31] decision | Layered retired-user detection

Locked a proportionate, low-stakes identity model in which namespaced Apple and Google subjects, provider-verified normalized emails, and the Threads user ID are independent matching signals. Permanent retirement tombstones every observed signal, and a future match on any one prevents login, profile creation, or Threads reconnection. Documented that this is deterrence for a recreational product, not legal identity verification or guaranteed prevention of evasion.

## [2026-08-31] decision | Threads authorization and revocation gate

Locked server-side Threads OAuth exchange, required publishing scopes, six-hour verification, proactive long-lived-token refresh, cached bootstrap status, global reauthorization errors, and blocking `NEVER_CONNECTED`/`REAUTH_REQUIRED` gates. External revocation does not retire the profile; successful OAuth restores access to the existing profile.

## [2026-08-31] add | Mobile networking and session recovery

Documented that transport and transient server failures preserve stored credentials, while only a definitive invalid-refresh response signs the user out. Added coordinated refresh and mutation-safe retry rules.

## [2026-08-31] decision | ThinkSo session lifetimes

Locked opaque database-backed access tokens at 24 hours, on-demand refresh within the final hour or once after `401`, rotating refresh credentials with 30-day idle and 180-day absolute expiry, a 30-second previous-token recovery grace window, SecureStore persistence, and immediate server-side revocation.

## [2026-08-31] correction | Persist both ThinkSo session tokens

Corrected the native session design: both access and refresh tokens persist in SecureStore, with the access token additionally cached in memory during the running process.

## [2026-08-31] update | Mobile session architecture

Added Login BDD for stored-session restoration, coordinated refresh, refresh failure, and interrupted provider flows. Specified SecureStore-backed rotating refresh credentials, memory-resident access tokens, protected routing, layered mobile boundaries, and backend ownership of work that must outlive UI/background suspension.

## [2026-08-31] update | Defer Login accessibility hardening

Removed accessibility and screen-reader behavior from the Login demo acceptance criteria and recorded it as later production hardening.

## [2026-08-31] update | Login informational placeholders

Deferred How It Works, Terms, and Privacy content. Their Login controls remain visible dummy UI and do not navigate during the initial implementation.

## [2026-08-31] update | Login loading and toast timing

Clarified that both provider buttons use their disabled state until authentication terminates, and removed interaction-based pausing from the filing-error toast countdown.

## [2026-08-31] update | Login authentication loading state

Specified that Apple and Google buttons both remain visible and disabled during authentication, while a separate ThinkSo loading S communicates progress without altering provider branding.

## [2026-08-31] initialize | ThinkSo internal wiki

Created the monorepo-ready ThinkSo workspace, separated raw source pointers from synthesized wiki pages, migrated the engineering handoff, and added the Login Screen BDD specification.
