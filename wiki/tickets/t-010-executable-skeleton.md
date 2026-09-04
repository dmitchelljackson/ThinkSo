# T-010 — Boot the mobile/API/database skeleton

## Control

| Field | Value |
|---|---|
| Type / status | `ENABLING` / `VERIFYING` |
| Owner review | `APPROVED 2026-09-04` |
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

- [x] **Mobile:** Expo app, Router/composition, fixture presenter and health rendering.
- [x] **Backend:** FastAPI/DB/migrations/Dishka/PgQueuer entrypoint skeletons and health route.
- [x] **Agent:** N/A; only a replaceable durable-job seam.
- [x] **Tests/CI:** clean migration, health integration, presenter/injection/bundle, OpenAPI drift, containers.
- [x] **Wiki:** actual commands, versions, directory decisions, and compatibility findings.

## Human requirements

- H-001 virtual-device/AutoMobile setup is required for the native verification gate, but code and non-native tests may proceed first.

## Acceptance and gates

- [x] Clean database migrates and every process starts/stops cleanly.
- [x] Mobile renders backend health through repository → TanStack definition → presenter → `UiState`.
- [x] Hermes production bundle, Fast Refresh, Jest, decorators, and `injectHook` all work together.
- [x] CI-equivalent root commands pass; native Android and iOS smoke evidence is recorded when H-001 is available.

## Activity log

`2026-09-04 | COORDINATOR | DISPATCHED | — | Created stack/010-executable-skeleton on verified T-000 head a7743f3864d0aae44bfb723527e1b336cfb38c20. Android API 36 is available; iOS/AutoMobile setup continues independently and does not block non-native implementation.`

`2026-09-04 | IMPLEMENTER | CANDIDATE_READY | pending coordinator commit | Added the Expo/Router mobile composition root, Obsidian graph, TanStack-backed health slice, typed OpenAPI transport, FastAPI/Dishka/Postgres/Alembic/PgQueuer backend skeleton, and deterministic CI/container gates.`

`2026-09-04 | COORDINATOR | VERIFIED | pending coordinator commit | Root JS checks, backend format/lint/type/unit/integration/smoke, OpenAPI drift, Markdown links, Gitleaks, container build, Android/iOS Hermes exports, and git diff checks pass. ThinkSo rendered and reached the live health endpoint on Android; the iOS Simulator loaded the same bundle. Expo Router development-only files are now ignored so starting Metro cannot dirty or break lint.`

`2026-09-04 | CODE_REVIEWER | FINDING | e1eff72be2473316660ab879c719f97d2d0f989a | CR-001: mobile health repository trusts compile-time openapi-fetch types without runtime DTO validation; add boundary validation and malformed-payload/date tests before T-010 can pass review.`

`2026-09-04 | COORDINATOR | FIXED | pending coordinator commit | CR-001: the repository mapping boundary now validates every health DTO field and rejects invalid timestamps before constructing the domain model; malformed-value tests cover missing fields, wrong types, wrong status, and invalid dates.`

## Observations and decisions

- A failed Obsidian compatibility spike returns evidence for owner review; it does not authorize silent DI replacement.
- Expo Router treats every module under `src/app` as a route. Composition code therefore lives under `src/di`, leaving `src/app` for route files only.
- Expo Go is sufficient for this foundation smoke. Product integrations that require native configuration move to the repository's development-build path.

## Final handoff

Delivered behavior, candidate SHA, PR, tests, migrations, and limitations go here.
