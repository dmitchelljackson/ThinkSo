# T-010 — Boot the mobile/API/database skeleton

## Control

| Field | Value |
|---|---|
| Type / status | `ENABLING` / `DRAFT` |
| Owner review | `PENDING` |
| Stack position / predecessor | `010` / T-000 |
| Branch / PR | `stack/010-executable-skeleton` / — |

## Outcome

One command boots Postgres and the backend entrypoints, the Expo development app calls a typed health endpoint, and all architectural composition seams execute in tests and a production bundle.

## Sources

- [Vertical slice Phase 0](../delivery/vertical-slice-plan.md#phase-0--repository-and-executable-skeleton)
- [Backend architecture](../architecture/backend-architecture.md)
- [Mobile Presenter/UDF architecture](../architecture/mobile-client-architecture.md)
- [API status/conventions](../api/api-specification.md#status-and-conventions)

## Scope and work

- Expo SDK app, Router root, development-build/CNG config, strict TypeScript, TanStack provider, Obsidian application graph, and fixture presenter/UI.
- FastAPI health route, async SQLAlchemy/Alembic, Postgres Compose service, Dishka graphs, and thin HTTP/worker/scheduler entrypoints with PgQueuer startup seam.
- Generated OpenAPI types plus typed fetch transport; one mobile repository maps the health DTO to a domain model.
- Unit/integration tests prove graph injection, presenter events, migration boot, API call, and OpenAPI drift.

### Work breakdown

- [ ] **Mobile:** Expo app, Router/composition, fixture presenter and health rendering.
- [ ] **Backend:** FastAPI/DB/migrations/Dishka/PgQueuer entrypoint skeletons and health route.
- [ ] **Agent:** N/A; only a replaceable durable-job seam.
- [ ] **Tests/CI:** clean migration, health integration, presenter/injection/bundle, OpenAPI drift, containers.
- [ ] **Wiki:** actual commands, versions, directory decisions, and compatibility findings.

## Human requirements

- H-001 virtual-device/AutoMobile setup is required for the native verification gate, but code and non-native tests may proceed first.

## Acceptance and gates

- [ ] Clean database migrates and every process starts/stops cleanly.
- [ ] Mobile renders backend health through repository → TanStack definition → presenter → `UiState`.
- [ ] Hermes production bundle, Fast Refresh, Jest, decorators, and `injectHook` all work together.
- [ ] CI-equivalent root commands pass; native Android and iOS smoke evidence is recorded when H-001 is available.

## Activity log

Coordinator-only append-only entries go here.

## Observations and decisions

- A failed Obsidian compatibility spike returns evidence for owner review; it does not authorize silent DI replacement.

## Final handoff

Delivered behavior, candidate SHA, PR, tests, migrations, and limitations go here.
