# T-010 — Boot the mobile/API/database skeleton

## Control

| Field | Value |
|---|---|
| Type / status | `ENABLING` / `MERGED` |
| Owner review | `APPROVED 2026-09-04` |
| Stack position / predecessor | `010` / T-000 |
| Branch / PR | `stack/010-executable-skeleton` / [#2](https://github.com/dmitchelljackson/ThinkSo/pull/2) |

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

`2026-09-04 | CODE_REVIEWER | VERIFIED | eea2ac87785bb2e40e190be7932a796037981817 | CR-001 resolved: runtime health DTO validation and malformed/missing/invalid-date tests now protect the repository boundary; PASS.`

`2026-09-04 | UI_VERIFIER | PASS | eea2ac87785bb2e40e190be7932a796037981817 | Android API 36/ThinkSo_API_36: AutoMobile observed the native Expo experience, tapped Refresh against the live local API, and observed “thinkso-api is ok” plus the server timestamp. iOS 26.5/ThinkSo-iPhone-17 loaded the same ThinkSo bundle in Expo Go; simulator screenshot evidence confirmed native rendering beneath Expo Go's first-run developer overlay.`

`2026-09-04 | COORDINATOR | STACKED | eea2ac87785bb2e40e190be7932a796037981817 | Independent review passed, native smoke passed, and all 12 push/pull-request GitHub Actions checks passed. PR #2 is the stable T-010 stack layer; the owner remains the sole merge authority.`

## Observations and decisions

- A failed Obsidian compatibility spike returns evidence for owner review; it does not authorize silent DI replacement.
- Expo Router treats every module under `src/app` as a route. Composition code therefore lives under `src/di`, leaving `src/app` for route files only.
- Expo Go is sufficient for this foundation smoke. Product integrations that require native configuration move to the repository's development-build path.

## Final handoff

- **Delivered:** executable Expo/Router mobile app, Obsidian composition graph, TanStack-backed health presenter slice, generated OpenAPI client, FastAPI/Dishka API, async Postgres/Alembic storage, and PgQueuer worker/scheduler seams.
- **Reviewed code candidate:** `eea2ac87785bb2e40e190be7932a796037981817`.
- **Pull request:** [#2 — Boot the mobile/API/database skeleton](https://github.com/dmitchelljackson/ThinkSo/pull/2).
- **Evidence:** root JS checks; backend format/lint/type/unit/integration/smoke; OpenAPI drift; container build; Markdown links; Gitleaks; Android/iOS Hermes exports; AutoMobile Android health refresh; iOS native bundle load.
- **Limitations:** the health validator accepts any JavaScript-parseable timestamp rather than enforcing strict RFC 3339 syntax; this does not affect the API-generated response. Expo Go is used only for this foundation smoke; native integrations use development builds.
