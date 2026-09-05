# CI and quality gates

## Locked direction

- Host ThinkSo in a public GitHub monorepo.
- An implementation agent creates the repository with GitHub CLI after human CLI authentication and a public-content/secrets audit. Repository creation is not a manual web-console task.
- Use GitHub Actions for continuous integration.
- Use GitHub's native stacked pull requests through GitHub CLI 2.90.0 or later and the official `github/gh-stack` extension. This public-preview dependency replaces hand-written PR retargeting and restack scripts.
- Pull requests must run formatting/code-style checks, standard linting, static type checks, generated API-client drift checks, and unit tests for both mobile and backend code.
- Unit tests are written with the implementation they protect.
- Keep ordinary CI emulator-free and run it on standard Linux runners. React Native presenters and components must be testable without booting Android or iOS.
- Use AutoMobile with locally configured virtual devices for agent-driven native interaction and screenshot review during implementation.
- Automated native E2E remains a later, separate suite. If hosted execution is added, begin with Android. Add hosted iOS only when it is free or its benefit clearly justifies its cost and maintenance.
- Prefer standard public-repository GitHub-hosted runners. Do not opt into billable larger runners without an explicit decision.
- A normal implementation ticket is one small, observable full-stack feature and normally produces one pull request. The pull request includes every required mobile, API, data, agent, test, and wiki change so merging it leaves that behavior done rather than landing a disconnected layer. Larger delivery phases group these tickets; they are not layer-specific pull requests.
- Repository foundation and other unavoidable enabling work may use explicitly labeled infrastructure tickets, but those tickets must not claim that product behavior is complete.

## Required CI boundaries

The initial workflow should expose separate, diagnosable jobs rather than one opaque script:

- repository hygiene and secret scanning;
- mobile format/lint/type/unit tests;
- backend format/lint/type/unit tests;
- backend integration tests against disposable Postgres where required;
- OpenAPI generation/client drift verification;
- container build verification.

Root `just` commands must run the same checks locally. CI should orchestrate repository commands rather than contain a second implementation of the build.

Live Firebase, Meta/Threads, Expo Push, OpenRouter, and deployment smoke tests must not run on untrusted pull requests with production credentials. Firebase Authentication tests use the local Auth Emulator; other provider contract tests use fakes by default. Explicitly controlled integration or release workflows own live-provider verification.

GitHub evaluates each PR in a native stack as though it targets the stack's root base branch. Keep required format, lint, type, unit, contract-drift, and applicable integration checks on every layer. If later jobs become expensive, use GitHub's stack event metadata to restrict those specific jobs to the lowest unmerged or top layer; do not weaken per-layer correctness gates preemptively.

## Locked tools

- Mobile formatting and linting: Prettier plus ESLint using Expo's standard configuration.
- Mobile static typing: TypeScript `tsc` with no emit.
- Mobile unit/presenter/component tests: Jest plus React Native Testing Library.
- Backend formatting and linting: Ruff format and Ruff check.
- Backend static typing: mypy.
- Backend unit and integration tests: pytest.

Do not impose an arbitrary repository-wide coverage percentage. Tickets and BDD cases identify required behavioral coverage, and CI may report coverage to expose regressions or untested areas.

## Open choices

- Dependency update automation and policy.
- Branch protection and required-review rules.
- The later native E2E framework and schedule.
