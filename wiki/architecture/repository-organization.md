# Repository organization

## Locked principles

ThinkSo is a monorepo containing the mobile app, backend service, internal wiki, generated API client, and preserved source material.

- Organize mobile product code by feature/screen.
- Organize backend product code by feature rather than global route, service, repository, or job folders.
- A backend feature owns its HTTP adapters, job adapters, application operations, domain rules, and persistence code.
- Keep HTTP, worker, and scheduler as separate process entrypoints. Those entrypoints compose and invoke feature-owned code; they do not become alternate homes for business logic.
- Keep minting and judging agent implementations within their owning backend features. Put genuinely reusable model-gateway, tool, trace, and execution infrastructure in a shared agent-runtime package.
- Deliver full-stack vertical slices. Repository boundaries must not turn work into frontend-first or backend-first phases.
- Keep the wiki in the monorepo and update it with implementation decisions and ticket history.

## Initial shape (DERIVED)

```text
ThinkSo/
├── AGENTS.md
├── apps/
│   └── mobile/
│       └── src/
│           ├── app/                 # navigation and application composition
│           ├── features/            # login, Threads, Record, Contract, Create, Account
│           ├── design-system/
│           └── core/                # narrowly shared client infrastructure
├── services/
│   └── api/
│       └── src/
│           └── thinkso/
│               ├── features/        # identity, contracts, minting, judging, etc.
│               ├── agent_runtime/   # shared agent execution infrastructure
│               ├── entrypoints/     # HTTP, worker, scheduler
│               └── core/            # narrowly shared backend infrastructure
├── packages/
│   └── api-client/                   # generated client/types from OpenAPI
├── wiki/
│   ├── tickets/
│   └── operations/
└── raw/                              # preserved source material
```

The exact folders inside a feature should follow actual needs rather than requiring empty ceremonial layers. A mature backend feature may contain `transport`, `application`, `domain`, and `persistence`; a small feature may use fewer folders while preserving the same dependency direction.

Mobile feature folders own their UI, presenter, UI models, TanStack data definitions, mappings, and tests when those elements are feature-specific. Promote code into `design-system` or `core` only after it is genuinely shared.

## Workspace and runtime tooling

- Use a pnpm workspace for the mobile app and generated TypeScript API client. Each package declares the dependencies it uses in its own `package.json`; commit one root `pnpm-lock.yaml`. Use a shared pnpm catalog when central version alignment is useful.
- Use uv for Python dependency resolution and locking.
- Run the backend container-first from the beginning. Docker Compose runs the API, worker, scheduler, and Postgres; Python dependencies are installed with uv inside the image. Running the backend must not require a host Python installation.
- Run React Native and Expo tooling on the host so it can use the normal iOS Simulator, Android emulator, and physical-device workflows.
- Use a root `justfile` as a thin command menu across pnpm, Docker Compose, and repository checks.
- Do not introduce Nx or Turborepo until a demonstrated build-graph or remote-cache requirement justifies it.

## Dependency direction

- Entrypoints and provider adapters depend inward on application/domain interfaces.
- Domain code does not import FastAPI, SQLAlchemy, Dishka, React, TanStack Query, Expo, or provider SDKs.
- Cross-language sharing happens through the OpenAPI contract and generated client, not shared runtime business logic.
- A feature may use another feature only through an explicit application/domain interface; do not reach into another feature's persistence implementation.

## Still open

- Whether deployment configuration lives at the repository root or beside each deployable after Railway and EAS setup is known.
