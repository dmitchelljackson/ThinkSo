# Architecture and engineering conventions

## Locked platform direction

- Expo / React Native mobile app for iOS and Android.
- FastAPI backend.
- Postgres with SQLAlchemy and Alembic.
- Local Docker Compose and Railway deployment/scheduled command.
- SSE over HTTP for creation chat; no WebSocket/realtime service for MVP.
- Native system share sheet after sending.
- Expo push tokens; a user may have many.

The monorepo uses pnpm for TypeScript, uv for Python, Docker Compose for the container-first backend, a root `justfile` for cross-language commands, and GitHub Actions for CI. Mobile checks use Expo ESLint, Prettier, `tsc`, Jest, and React Native Testing Library; backend checks use Ruff, mypy, and pytest. Exact Python and Node versions remain **OPEN**. Mobile server-data caching and subscription use TanStack Query; Obsidian injects repositories, data definitions, effects, and Circuit-style presenter hooks. See the canonical mobile client architecture and [CI and quality gates](./ci-and-quality.md).

## Monorepo organization

Use the feature-oriented monorepo shape and dependency direction in [Repository organization](./repository-organization.md). Do not share runtime business logic between TypeScript and Python. Treat OpenAPI as the language boundary and generate client types.

## Backend boundaries

- Use the feature-oriented modular-monolith, Dishka, async I/O, transaction, and PgQueuer conventions in [Backend architecture](./backend-architecture.md).
- Each backend feature owns its HTTP adapters and durable-job adapters alongside its application, domain, and persistence code. HTTP, worker, and scheduler remain thin separate entrypoints.
- HTTP routers validate/authorize and call application services.
- Application services own transactions and state transitions.
- Repositories/query modules isolate persistence details where it improves testing; avoid ceremonial layers.
- Provider adapters isolate Firebase Authentication, Threads, Expo push, model gateway, and web research.
- Workers call the same application services/state transition code as HTTP routes.
- Prompts are versioned files/config, not enormous inline strings.

## Mobile boundaries

### Design-source translation

The preserved Claude Design export is a visual source, not production layout code. It targets a 393 × 852 portrait preview and mixes responsive constructs with hardcoded web dimensions. Do not copy its device wrapper, literal pixel coordinates, DOM hierarchy, or inline CSS into React Native. Preserve its hierarchy, wording, controls, states, and visual character using native flex layout, safe-area insets, keyboard handling, and content-driven sizing. Test at the smallest and largest supported phone sizes. Tablets use the same phone composition centered in a bounded content column; there is no separate tablet design. Portrait is required. Rotation may remain enabled only when that responsive composition is usable without a special landscape design; otherwise the MVP may lock portrait orientation.

- Navigation destinations match the screen inventory; contract states are variants, not separate screens.
- One generated API client. Its DTOs, client domain models, and screen UI models remain separate; the API's canonical `Contract` serialization does not erase those client boundaries.
- Server responses are authoritative after mutations.
- SSE state handling has explicit snapshot replacement and incremental-event reducers.
- Unknown SSE events and response fields are ignored for forward compatibility.
- Meaningful UI is accessible without interpreting doodles, color, or animation.
- Email/password inputs use native React Native controls wrapped by the ThinkSo design system. Firebase SDK objects and error codes stay behind the authentication adapter and never enter UI models.

## Mobile application layers and lifecycle

Use the Presenter/UDF design specified in [Mobile client Presenter/UDF architecture](./mobile-client-architecture.md):

```text
transport DTO → repository<Domain> → TanStack data definition
              → injected presenter hook → UiState + onEvent
              → React Native UI
```

- Screens render presentation-ready UI state and forward typed events through one `onEvent` callback. They do not own queries, cache policy, navigation decisions, authentication, token refresh, agent runs, or persistence lifecycles.
- Repositories expose promise-based domain operations and map DTOs to domain models. Data-layer TanStack definitions own keys, cache policy, invalidation, and retries.
- Custom hook presenters call those TanStack definitions, hold transient state with React, invoke domain rules, and emit discriminated `UiState` values. Presenters can compose other presenters while obeying the Rules of Hooks.
- Obsidian supplies singleton and feature-scoped dependency graphs, constructor injection for classes, and `injectHook` for presenters. Do not use field injection, Obsidian observables, or a service locator.
- Presenter decisions may invoke injected typed ports for navigation, sharing, global toasts, and provider effects. Screens never import concrete adapters.
- Domain services remain plain TypeScript and do not import React, Obsidian, navigation, TanStack, or platform APIs.
- Presenter state normally dies with its mounted presenter. Anything that must outlive it belongs to an explicitly scoped repository/service, persistent client storage, or the backend.
- Do not introduce RxJS, Redux, or Zustand without a new concrete requirement and architecture decision.
- Adapters isolate FastAPI transport, `expo-secure-store`, Firebase Authentication, push, sharing, and app-lifecycle APIs.
- An application-scoped session manager owns session restoration, refresh coordination, sign-out, and retired-session rejection even when Login is unmounted.
- Expo Router protected routes derive from session state; screens do not imperatively duplicate authentication guards.
- Use React Native `AppState` to reconcile interrupted provider flows and stale foreground data when the app becomes active.
- Do not assume JavaScript continues running indefinitely while the app is backgrounded or suspended. Operations that must complete reliably—including minting, judging, and consequence delivery—are backend-owned and persisted there.

## Native session storage and refresh

See [Mobile networking and session recovery](./mobile-networking.md) for failure classification and retry behavior.

- Store both the ThinkSo access token and refresh credential in `expo-secure-store`, not Async Storage or component state.
- Cache the access token in application memory while the process is running so normal requests do not read SecureStore repeatedly. SecureStore remains its persistent home across process death and relaunch.
- ThinkSo access tokens are opaque, database-backed bearer credentials with a 24-hour lifetime. The backend verifies that their session remains active on every authenticated request, allowing immediate revocation before nominal expiry.
- At most five minutes after Firebase advances a user's token-valid-after epoch, the next authenticated request revokes every corresponding ThinkSo session family. Cache that Admin lookup per user; do not call Firebase on every request or retain Firebase credentials for the check.
- Rotating ThinkSo refresh credentials expire after 30 days without use and after an absolute maximum of 180 days, after which Firebase email/password authentication is required again.
- A fresh Firebase ID token is exchanged with the ThinkSo backend; the app then uses ThinkSo-issued session credentials for its API. Firebase credentials and ThinkSo session credentials remain separate concerns.
- Configure the Firebase client with explicit in-memory auth persistence. ThinkSo's access and refresh credentials in SecureStore are the only persistent application session; do not add a second Async Storage-backed Firebase session.
- At cold launch, hold protected routing in an initializing state while SecureStore is read. Use a stored access token if it is still valid; otherwise attempt refresh. Do not flash Login before restoration completes.
- Refresh on demand when an access token has less than one hour remaining. Do not run a periodic or background refresh timer.
- After an authenticated request returns `401`, permit one coordinated refresh and one replay of that request. A second `401` signs the user out rather than looping.
- Permit only one refresh request at a time. Concurrent authenticated requests await the same refresh result rather than rotating the credential multiple times.
- Rotate refresh credentials when the backend refreshes them and replace the stored value only after a successful response. The backend permits a 30-second reuse grace window for the immediately previous refresh credential to tolerate mobile response loss and races without producing multiple successor sessions.
- If refresh is unavailable or rejected, clear local credentials and protected cached state, transition the session to signed out, and let protected routing show Login.
- Sign-out and permanent retirement clear SecureStore even when the server-side revocation request reports an error; record/retry server cleanup as appropriate without leaving the app locally authenticated.

## Concurrency and idempotency

- Enforce contract transitions with row locks or conditional updates and transactions.
- Acceptance must have exactly one winner under races.
- Enforce one active turn per chat in persistence.
- Client-generated message UUIDs prevent duplicate turns; duplicates intentionally return conflict and trigger rehydration.
- Judge claims and consequence publishing must be safe under worker retry and overlap.
- Treat minting consequence safety as an evaluated product boundary, not prompt copy alone. The allow corpus must include profanity, non-protected name-calling, harsh self-deprecation, and consensual embarrassment; the refusal corpus must distinguish those from protected-class attacks, targeted harassment, threats, private information, impersonation, illegal acts, and dangerous conduct. Add every discovered boundary failure to the regression corpus.
- Never rely on in-process locks in a horizontally scaled deployment.

## Agent conventions

Use the PydanticAI/OpenRouter runtime, GLM 5.3 Flash model configuration, typed tool boundaries, persistence rules, and per-user spend control in [Agent architecture](./agent-architecture.md).

Creation agent:

- role: turn casual challenges into binary, publicly resolvable contracts;
- remain focused on that role: answer questions that reasonably develop or verify a Contract, but decline unrelated general-assistant work such as standalone schoolwork and redirect to challenge creation;
- clarify only when needed, research facts/dates when needed, never invent missing facts;
- produce structured proposal output that passes deterministic schema/date rules;
- persist the proposal before notifying the client.

Judge agent:

- follows the immutable resolution contract;
- only resolves after the resolution date and within its expiration window;
- cites public evidence;
- returns structured TRUE/FALSE plus evidence Markdown or an explicitly retryable/unresolved outcome;
- does not post consequences directly.

Do not expose hidden reasoning. Store safe traces/tool results and version `agent_version`, `prompt_version`, and `model` for later evaluation.

## Testing standard

Every vertical slice includes:

- unit tests for deterministic business rules;
- API contract tests for exact request/success/error shapes;
- migration tests or clean-database boot verification;
- integration tests for state transitions and races;
- mobile component/behavior tests where valuable;
- presenter `renderHook` unit tests with fake injected dependencies, asserting emitted `UiState` and behavior after `onEvent`;
- one manually exercised or focused integration-level full-stack happy path plus the material failure paths; this is not the deferred automated E2E suite.

Unit and layer-level tests are implemented with the code they protect. Automated end-to-end suites are a later, separate delivery phase after the complete product flow exists; do not block early vertical slices on building the E2E harness. Once added, E2E tests intentionally overlap critical unit-tested behavior to verify the assembled system.

Configure an Android emulator and the free iOS Simulator early. Agents use AutoMobile to launch and interact with real native builds, inspect screenshots and visible state, and manually exercise each vertical slice. Firebase email/password authentication is exercised on both simulators; deterministic auth tests use the Firebase Auth Emulator. Android receives real notification-delivery coverage. Real APNs delivery, TestFlight, and App Store verification remain deferred until paid Apple enrollment. Installing and configuring Xcode, Android Studio, the virtual devices, and AutoMobile is a human-owned prerequisite; using the configured capability during implementation is agent work. This interactive review complements Node-based presenter/component tests and does not pull the deferred deterministic end-to-end suite into the first slices.

AI features add small representative cases only after the agent works. Begin with manual inspection plus deterministic schema/date checks; add model graders for fuzzy resolvability/faithfulness later. Production failures become regression cases. APO/GEPA waits until behavior stabilizes and a meaningful held-out corpus exists.

## Observability and privacy

- structured logs with request/trace IDs; never log auth/provider tokens;
- metrics for endpoint failures, SSE disconnects/reconnects, active-turn conflicts, judge outcomes/retries, and consequence delivery;
- encrypt provider credentials at rest and minimize OAuth scopes;
- sanitize user-safe errors and public Markdown links;
- retain enough audit history to explain verdict and delivery outcomes without exposing private tokens or chain-of-thought.
