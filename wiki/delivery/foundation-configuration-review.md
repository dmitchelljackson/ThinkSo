# Foundation configuration review

Status: **APPROVED AND LOCKED** on 2026-09-04. This page records the initial repository choices the product owner approved before code scaffolding began. Changes require a new explicit decision recorded in the wiki.

## Runtime baseline

| Area | Proposal | Why |
|---|---|---|
| Node | **LOCKED:** Node 24 LTS, pinned by `.node-version` and `packageManager`/Corepack metadata | Node recommends LTS for production. Expo SDK 57 requires Node 22.13+, so Node 24 is current, supported, and comfortably compatible. |
| Package manager | **LOCKED:** pnpm workspace with one root lockfile | Fast deterministic installs and explicit per-package dependencies without Nx/Turbo. |
| Mobile | **LOCKED:** Expo SDK 57, React Native 0.86, React 19.2.3 | Current stable Expo line; SDK 57 resolves the SDK 56 Hermes regression when using `expo@57.0.17` or later. |
| Mobile runtime | **LOCKED:** Hermes, new architecture, Expo development builds | This is Expo's production-grade path and supports native auth, push, deep links, SecureStore, and AutoMobile. Expo Go is not the application test target. |
| Native projects | **LOCKED:** Expo Continuous Native Generation; do not commit generated `ios/` or `android/` directories initially | Keeps native configuration reproducible through `app.config.ts` and config plugins while avoiding two generated source trees. Reconsider only if hand-written native code becomes necessary. |
| Python | **LOCKED:** CPython 3.13, `requires-python = ">=3.13,<3.14"`, pinned by `.python-version` and Docker image | Conservative supported baseline: modern async/runtime features without taking the newest Python minor before the dependency stack proves compatible. |
| Database | **LOCKED:** Postgres 17 for local Compose and tests | Mature, supported baseline with broad provider compatibility; upgrading is easier than debugging a brand-new database major during foundation work. |

Dependency versions are exact in lockfiles. Human-facing docs name major/minor baselines rather than duplicating every resolved package version.

## Repository root

**LOCKED tree:**

```text
ThinkSo/
├── .github/workflows/
├── apps/mobile/
├── services/api/
├── packages/api-client/
├── raw/
├── wiki/
├── AGENTS.md
├── compose.yaml
├── justfile
├── package.json
├── pnpm-workspace.yaml
└── pnpm-lock.yaml
```

- Root `package.json` is private and contains workspace-wide scripts only; application dependencies stay in their owning package.
- A pnpm catalog aligns shared TypeScript tooling versions when two packages actually share them.
- `justfile` is the human/agent command menu. It delegates to pnpm and Docker Compose rather than reimplementing their logic.
- `.editorconfig`, Prettier, ESLint, Ruff, and repository line-ending rules prevent formatter churn.
- `.env.example` files contain names and safe examples only. Real local secrets use ignored `.env.local` files or platform secret stores.
- `.DS_Store`, generated native folders, caches, build output, local databases, credentials, and environment files are ignored.

## Mobile configuration

- **LOCKED:** TypeScript strict mode; DTO, domain, and UI models remain separate.
- **LOCKED:** enable `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, and import-boundary lint rules from the first ticket.
- **LOCKED:** Expo Router owns navigation/protected routes.
- **LOCKED:** TanStack Query owns server-cache subscription and policy; presenters map domain state to presentation-ready `UiState` and accept one typed `onEvent` callback.
- **LOCKED:** `react-obsidian` owns dependency graphs and injection; no service locator, Redux, Zustand, or RxJS.
- **LOCKED validation spike:** the foundation test must prove `react-obsidian` 2.32.x decorators, graph transforms, `injectHook`, Hermes, Metro, Jest, and the Expo production bundle work together before feature code depends on it. Failure returns to the owner with evidence rather than silently replacing DI.
- **LOCKED:** Jest plus React Native Testing Library for presenter/component tests; MSW only if transport-level tests benefit from it.
- **LOCKED:** use application-owned React Native primitives for the visual system. Do not adopt Expo UI merely because it ships with the current template; it must earn use for a concrete component.

## API boundary

- FastAPI's generated OpenAPI document is authoritative.
- **LOCKED:** `openapi-typescript` 7.x generates immutable wire types into `packages/api-client`; `openapi-fetch` supplies the typed transport primitive.
- Do not generate TanStack hooks. Mobile repositories wrap the generated transport, validate/map DTOs to domain models, and data definitions own query policy. This preserves the locked layer separation.
- CI regenerates the schema/types and fails on drift.
- The generated package is internal/private and versioned in the monorepo; generated output is committed so diffs expose API changes.

## Backend configuration

- **LOCKED:** one FastAPI modular monolith with feature-owned HTTP/job adapters, application operations, domain rules, and persistence.
- **LOCKED:** Dishka composition, SQLAlchemy async sessions with psycopg 3, Alembic migrations, PgQueuer durable jobs, and separate HTTP/worker/scheduler entrypoints.
- **LOCKED:** one `services/api/pyproject.toml` and `uv.lock`; the service is not split into publishable Python packages for MVP.
- **LOCKED:** `src/` layout, pytest async tests, Ruff formatting/lint, and mypy strictness introduced incrementally but with no blanket `ignore_missing_imports` escape hatch.
- **LOCKED:** Pydantic Settings validates process configuration at startup. Each entrypoint fails fast with a safe list of missing variable names, never secret values.
- **LOCKED:** all I/O code is async; pure domain logic remains synchronous. Application operations own transaction boundaries.

## Local environment and CI

- Docker Compose runs Postgres, API, worker, and scheduler. Test commands may start an isolated disposable Postgres service.
- Mobile Metro/dev builds run on the host for emulator access.
- GitHub Actions uses standard Linux public-repository runners. Jobs are split into hygiene, mobile checks, backend checks, backend integration, OpenAPI drift, and container build.
- Native AutoMobile verification remains local; ordinary CI does not boot emulators.
- Dependency caches are performance aids only. Lockfiles and clean-build checks remain authoritative.
- GitHub's native `gh stack` extension owns stacked PR metadata after local Git becomes available.

## Repository governance requiring owner approval

1. **LOCKED — source license:** ThinkSo is source-available but not open source. Do not add an OSI or other software license; retain all rights and publish the explicit copyright/contribution notices. Outside contributions are not accepted initially so ownership remains clear. The owner may deliberately relicense owner-controlled work under the GPL or another license later.
2. **LOCKED — merge method:** squash each reviewed native stack layer so `main` receives one commit per ticket while PR history retains discussion.
3. **LOCKED — branch protection:** require all configured checks; do not require a second human approval on this personal repository; prevent force-push/deletion of `main`.
4. **LOCKED — dependency updates:** begin without an automated bot. Add grouped Renovate/Dependabot updates only after the initial lockfiles stabilize.
5. **LOCKED — generated files:** commit OpenAPI output and lockfiles; do not commit native CNG output, test artifacts, screenshots, coverage, or local agent traces.

## Official compatibility evidence

- Expo SDK 57 / React Native 0.86 release: <https://expo.dev/changelog/sdk-57>
- Expo SDK 57 runtime table: <https://docs.expo.dev/versions/latest/>
- Expo development builds: <https://docs.expo.dev/develop/development-builds/faq/>
- Node release status: <https://nodejs.org/en/about/previous-releases>
- uv Python support: <https://docs.astral.sh/uv/reference/policies/python/>
- PydanticAI install requirements: <https://pydantic.dev/docs/ai/overview/install/>
- OpenAPI TypeScript and fetch client: <https://openapi-ts.dev/introduction> and <https://openapi-ts.dev/openapi-fetch/>
- React Obsidian package/docs: <https://github.com/wix-incubator/react-obsidian>

## Approval effect

The product owner approved this configuration on 2026-09-04. Any requested change must update this page and affected architecture/tickets before implementation diverges.
