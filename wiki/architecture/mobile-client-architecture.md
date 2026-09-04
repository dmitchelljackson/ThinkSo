# Mobile client Presenter/UDF architecture

This page is the canonical architecture for the ThinkSo Expo/React Native client. The design deliberately mirrors Slack Circuit's `UiState + eventSink` model using ordinary React hooks.

## Locked objectives

- Network DTOs, domain models, domain aggregates, and presentation-ready UI models remain distinct types.
- Networking/cache behavior, domain rules, presentation logic, and React rendering remain independently testable.
- TanStack Query owns server-backed cache and subscriptions. React owns transient presenter state.
- Presenters are composable hooks that translate domain/query state into immutable `UiState` and receive UI intent through one typed `onEvent` callback.
- React components render `UiState` and emit events. They do not fetch, navigate, mutate domain state, or interpret transport errors.
- Obsidian provides the dependency graph, injection, and lifetimes. Do not build a parallel service locator.
- RxJS, Redux, and Zustand are not part of the initial architecture.

## Blessed data flow

```text
FastAPI response
    ↓
generated client + wire DTO
    ↓
repository
  - validates DTO
  - maps DTO → domain
    ↓
data-layer TanStack query/mutation definition
  - query keys
  - freshness, retention, retries, invalidation
    ↓
injected presenter hook
  - calls useQuery/useMutation
  - holds transient state with useState
  - invokes domain rules
  - maps results to UiState
  - handles typed UI events and injected effects
    ↓
UiState + onEvent
    ↓
React Native UI
```

TanStack notifies the mounted presenter when subscribed query state changes. React reruns the presenter hook, which emits a new `UiState`; the screen rerenders from that state. A React rerender by itself does not imply a network fetch—TanStack's query policy does.

## Layer contracts

### Transport

- The generated OpenAPI client and wire DTOs live here.
- DTOs mirror the API exactly, including nullability, wire enums, and serialized instants.
- DTOs do not leave the data layer.

### Repository and TanStack data layer

- Repository operations are promise-based and return domain models, never DTOs.
- Repositories own transport calls, response validation, and DTO → domain mapping.
- Data-layer query and mutation definitions wrap repository operations and own query keys, caching, freshness, retries, invalidation, and retained-data behavior.
- TanStack caches domain models, not DTOs or UI models.
- Presenters may use TanStack's generic query/mutation lifecycle but do not construct keys or define cache policy.
- React UI components never import repositories, generated clients, DTOs, TanStack hooks, or query definitions.

Representative boundary:

```ts
interface ContractRepository {
  getRecord(): Promise<RecordSnapshot>
  getContract(id: ContractId): Promise<Contract>
  acceptContract(id: ContractId): Promise<Contract>
}

interface ContractQueries {
  record(): QueryOptions<RecordSnapshot>
  detail(id: ContractId): QueryOptions<Contract>
  accept(id: ContractId): MutationOptions<Contract, ContractId>
}
```

Exact TanStack option types may evolve with the installed version. The invariant is that data-layer definitions—not presenters or screens—own keys and cache policy.

### Domain

- Domain models are immutable TypeScript data, not active-record objects.
- Domain functions enforce client-side invariants and combine models into meaningful aggregates.
- Domain code does not import React, React Native, Obsidian, navigation, TanStack, HTTP clients, SecureStore, or platform APIs.
- FastAPI remains authoritative for security and contract transitions; client rules improve behavior but are not authorization.

### Presenters

- A presenter is a custom React hook named `use<Feature>Presenter`.
- It is presentation/business orchestration, not UI. It emits no React elements.
- It receives dependencies through Obsidian injection rather than resolving arbitrary services itself.
- It may call injected query/mutation definitions, domain functions, child presenters, and typed effect ports.
- It owns transient interaction state with `useState`. Introduce `useReducer` only when a real local state machine makes it useful.
- Its complete output is an immutable presentation-ready `UiState` containing one `onEvent` callback.
- UI events are TypeScript discriminated unions named `<Feature>Event`.
- Materially different UI states use discriminated unions; simple independent properties remain ordinary fields.
- Formatting, visibility, enabled state, variants, and renderable UI models are decided here. Screens do not reinterpret domain enums or query status.

Representative presenter:

```ts
type ThreadsEvent =
  | { type: "acknowledgmentChanged"; checked: boolean }
  | { type: "connectPressed" }

type ThreadsUiState =
  | { type: "loading"; onEvent: (event: ThreadsEvent) => void }
  | {
      type: "ready"
      acknowledged: boolean
      connectEnabled: boolean
      onEvent: (event: ThreadsEvent) => void
    }

function useThreadsPresenterImpl(
  dependencies: ThreadsPresenterDependencies,
): ThreadsUiState {
  const [acknowledged, setAcknowledged] = useState(false)
  const connection = useQuery(dependencies.threadsQueries.connection())

  const onEvent = useCallback((event: ThreadsEvent) => {
    switch (event.type) {
      case "acknowledgmentChanged":
        setAcknowledged(event.checked)
        break
      case "connectPressed":
        dependencies.connectThreads()
        break
    }
  }, [dependencies, setAcknowledged])

  return connection.isPending
    ? { type: "loading", onEvent }
    : { type: "ready", acknowledged, connectEnabled: acknowledged, onEvent }
}
```

Production wraps the implementation with Obsidian `injectHook`. Tests exercise the implementation with explicit fakes.

### Presenter composition

- A parent presenter may call child presenters and combine their `UiState` values.
- Child presenter hooks must be called unconditionally and in a stable order under React's Rules of Hooks.
- Enable or disable child behavior through inputs; do not conditionally instantiate hooks.
- A parent routes its event union to the appropriate child `onEvent` when composing behavior.
- Compose domain models before presentation when a rule spans multiple repositories; do not derive domain truth by reverse-engineering child UI models.

### React UI

- A screen/component accepts presentation-ready `UiState`, renders it, and calls `state.onEvent(event)` for user interaction.
- Screens do not call navigation, repositories, provider SDKs, or TanStack directly.
- Components may own purely visual implementation state only when it has no product meaning, such as an animation driver. Product-visible interaction state belongs to the presenter.

Conceptually:

```tsx
function ThreadsScreen({ state }: { state: ThreadsUiState }) {
  if (state.type === "loading") return <LoadingS />

  return (
    <Acknowledgment
      checked={state.acknowledged}
      onChange={(checked) =>
        state.onEvent({ type: "acknowledgmentChanged", checked })
      }
    />
  )
}
```

## Dependency injection and effects

- Use Obsidian as the mobile DI framework.
- Use a singleton application graph for API clients, the TanStack `QueryClient`, repositories, session management, and application-wide provider adapters.
- Add feature-scoped graphs only when a dependency genuinely needs feature lifetime.
- Prefer constructor injection for classes and `injectHook` for presenters. Do not use field injection.
- Do not use Obsidian's observable state facilities; it provides dependency wiring only.
- Presenters own decisions caused by UI events, including navigation and one-shot effects.
- Navigation, native sharing, global toast presentation, provider authentication, and similar effects are narrow injected interfaces. React Navigation and Expo implementations stay behind adapters.
- Server mutations go through data-layer TanStack mutation definitions so cache reconciliation and invalidation remain centralized.
- Do not introduce a separate UI-effect stream. An event handler invokes its injected effect; resulting durable/loading/error state returns through TanStack or presenter state.

## State ownership and lifetime

- `useState` owns transient presenter state such as acknowledgments, selected tabs, dialog visibility, and composer text.
- Presenter state survives rerenders and normally survives while its route remains mounted. It is discarded when its presenter unmounts.
- State that must outlive a presenter is not transient presentation state. Put it in the appropriate repository/TanStack cache, application-scoped service, SecureStore/AsyncStorage, or backend.
- Do not add Zustand merely to extend presenter lifetime. Add a general client store only after a concrete cross-presenter state requirement and architecture decision.
- One application-scoped TanStack `QueryClient` owns server-cache state. Screen unmount does not immediately destroy retained query data.
- Logout and permanent retirement cancel protected work and purge protected cache/session state.
- Exact stale and garbage-collection times are feature policies and remain **OPEN** until each data type's freshness needs are known. Centralize them in data-layer query definitions.

## SSE and other genuine streams

- SSE remains a genuine multi-value transport but does not require RxJS.
- An SSE adapter validates events and exposes a narrow subscribe/unsubscribe callback contract or updates the appropriate TanStack cache directly.
- The initial authoritative snapshot replaces local chat state; incremental events reduce from that snapshot.
- SSE events may patch cached domain data or invalidate an affected query. Presenters update through their normal TanStack subscription.
- Unmounting UI may end a client subscription, but backend work continues and later reconnection rehydrates authoritative persisted state.

## Error and loading behavior

- Repositories normalize transport failures into typed application errors.
- TanStack represents server query/mutation lifecycle and retained-data refresh state.
- Presenters map those outcomes into finite product-specific `UiState` and invoke the global filing-error effect when required by BDD.
- React screens do not inspect HTTP codes or classify TanStack errors.

## Dependency direction

```text
React UI → UiState/Event types only
presenter → domain + injected data definitions/effect ports + React hooks
data definitions → repositories + TanStack
repository implementation → domain + transport
composition root → all concrete implementations
```

Forbidden dependencies:

- domain → React, Obsidian, TanStack, HTTP, navigation, or Expo APIs;
- React screen → repository, DTO, generated client, query key, TanStack, or concrete navigator;
- repository → presenter, UI model, or screen behavior;
- presenter → raw DTO, generated transport client, or concrete provider SDK;
- feature code → an ambient/global service locator.

## Testing contract

**Locked sequencing rule:** tests for a layer are written with the production code they protect. Full automated E2E is added as a separate suite after the complete product flow exists.

- DTO validation and DTO → domain mapping: fixture-driven unit tests.
- Domain models, rules, and aggregate functions: synchronous unit tests.
- Repository/query definitions: isolated `QueryClient` plus fake transport, covering mapping, caching, deduplication, invalidation, retries, retained data, and errors.
- Presenters: `renderHook` tests against the exported implementation with injected fakes and an isolated `QueryClient`; assert emitted `UiState`, send events through `onEvent`, and assert subsequent state/effects. No UI rendering is required.
- Do not automatically split presenter mapping into another layer merely to make it pure. Extract only genuine domain rules, reusable formatting, or sufficiently complex reusable transitions.
- UI components: focused tests proving each `UiState` renders correctly and interactions emit the correct typed event. Do not duplicate presenter/domain tests.
- Navigation: presenter unit tests use a fake typed navigator; separate integration tests exercise the real navigator and assert user-visible destinations.
- Full slices: integration tests cover transport response → cached domain model → presenter state → rendered behavior.
- End-to-end: the later separate suite intentionally overlaps critical lower-level behavior while exercising the assembled app, API, database, workers, and controlled provider adapters.

## Initial package direction

- `@tanstack/react-query` for server query/cache machinery and React subscription.
- Obsidian (`react-obsidian`) for dependency graphs, scoped lifetimes, and presenter injection.
- React `useState`/`useCallback` for transient presenter state and event sinks.
- React Native Testing Library `renderHook` for presenter tests.
- Generated OpenAPI TypeScript client plus runtime validation at the DTO boundary; exact generator/validator remains **OPEN**.
- No RxJS, Redux, or Zustand without a new concrete requirement and architecture decision.
