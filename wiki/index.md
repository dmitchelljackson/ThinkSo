# ThinkSo wiki index

Screen-specific entry point: [Screens, BDD, and UI sources](../SCREENS.md)

## Product

- [Product overview](./product/overview.md) — product loop, MVP scope, roles, navigation, and visual language.
- [Known issues and post-MVP limitations](./product/known-issues.md) — accepted MVP limitations that need deliberate future product work.

## Design

- [Screens and behavior](./design/screens-and-behavior.md) — screen inventory and state-specific UX descriptions.
- [Design system](./design/design-system.md) — shared visual tokens, component boundaries, responsive rules, and extraction order.

## Behavior

- [Login Screen BDD](./behavior/login-screen-bdd.md) — numbered Given/When/Then acceptance criteria for Account Access.
- [Connect Threads Screen BDD](./behavior/connect-threads-screen-bdd.md) — numbered Given/When/Then acceptance criteria for the required Threads authorization gate.
- [The Record Screen BDD](./behavior/the-record-screen-bdd.md) — numbered Given/When/Then acceptance criteria for Main, lists, cards, refresh, and errors.
- [Challenge Contract Screen BDD](./behavior/challenge-contract-screen-bdd.md) — numbered Given/When/Then acceptance criteria for access, invitation actions, lifecycle variants, receipts, refresh, and errors.
- [Create Challenge Screen BDD](./behavior/create-challenge-screen-bdd.md) — numbered Given/When/Then acceptance criteria for the minting chat, streaming, proposals, creator confirmation, reconnecting, and discard behavior.
- [Account Screen BDD](./behavior/account-screen-bdd.md) — numbered Given/When/Then acceptance criteria for account display, local-first sign-out, retirement warnings, permanent retirement, and recovery.

## API

- [API specification](./api/api-specification.md) — canonical schemas, endpoints, SSE protocol, errors, and internal operations.

## Architecture

- [Engineering conventions](./architecture/engineering-conventions.md) — platform direction, boundaries, concurrency, agents, testing, and observability.
- [Repository organization](./architecture/repository-organization.md) — monorepo layout, feature ownership, entrypoints, dependency direction, and remaining tooling choices.
- [CI and quality gates](./architecture/ci-and-quality.md) — public GitHub repository ownership, Actions checks, local native review, cost policy, and open tool choices.
- [Backend architecture](./architecture/backend-architecture.md) — feature modules, Dishka scopes, async I/O, transactions, PgQueuer jobs, and backend test seams.
- [Agent architecture](./architecture/agent-architecture.md) — PydanticAI/OpenRouter execution, fixed model configuration, tools, persistence, spend controls, and tests.
- [Mobile client Presenter/UDF architecture](./architecture/mobile-client-architecture.md) — DTO/domain/UI separation, TanStack cache ownership, Obsidian injection, Circuit-style presenters, event sinks, lifetimes, and tests.
- [Mobile networking and session recovery](./architecture/mobile-networking.md) — failure classification, credential preservation, coordinated refresh, and safe retry rules.
- [Threads authorization lifecycle](./architecture/threads-authorization.md) — OAuth exchange, token maintenance, revocation detection, and the reauthorization gate.

## Data

- [Data model and state machines](./data/data-model-and-state-machines.md) — persistence model and lifecycle transitions.

## Agents

- [Stacked-PR agent harness](./agents/harness.md) — native GitHub stacks, sequential implementation, parallel verification, model policy, gates, and human stops.
- [Coordinator prompt](./agents/coordinator.md) — backlog dispatch, Luna worker policy, native stack operations, verification, and restacking rules.
- [Implementer prompt](./agents/implementer.md) — one-ticket full-stack implementation and PR contract.
- [Code-reviewer prompt](./agents/code-reviewer.md) — independent candidate-diff review and finding severity rules.
- [UI-verifier prompt](./agents/ui-verifier.md) — AutoMobile native behavior and visual verification contract.
- [Minting Agent BDD](./behavior/minting-agent-bdd.md) — numbered Given/When/Then acceptance criteria for clarification, research, official terms, timing, consequences, proposals, cancellation, and recovery.
- [Judging Agent BDD](./behavior/judging-agent-bdd.md) — numbered Given/When/Then acceptance criteria for terms-controlled evidence, source hierarchy and quorum, retries, final verdicts, unresolved outcomes, publication handoff, and retirement.
- [Notifications BDD](./behavior/notifications-bdd.md) — numbered Given/When/Then acceptance criteria for permission priming, push registration, transactional events, copy, recipients, and protected navigation.
- [Consequence Publication BDD](./behavior/consequence-publication-bdd.md) — numbered Given/When/Then acceptance criteria for exact Threads posting, POSTING, retries, ambiguous-result reconciliation, authorization pauses, receipts, voiding, and retirement.
- Agent evals and regression corpora belong to implementation/testing documentation rather than separate product BDDs.

## Delivery

- [Vertical-slice implementation plan](./delivery/vertical-slice-plan.md) — phased full-stack build plan and definitions of done.
- [Foundation configuration review](./delivery/foundation-configuration-review.md) — concrete runtime, Expo, OpenAPI, backend, CI, and governance proposals awaiting owner approval.
- [Design-system implementation brief](./delivery/design-system-implementation-brief.md) — Codex-ready prompt for the first mobile visual foundation.
- [Ticket tracker](./tickets/index.md) — ordered stacked-PR backlog, lifecycle, communication rules, and ticket template.

## Operations

- [Autonomous build readiness](./operations/autonomous-build-readiness.md) — ordered human setup batches that let the coordinator build with minimal interruption.
- [Human prerequisites](./operations/human-prerequisites.md) — early account, secret, privileged-toolchain, emulator, and agent-capability checkpoints.
- [Expo account and project setup](./operations/expo-account-and-project-setup.md) — owner sequence for Expo ownership, EAS linking, tokens, and build evidence.
- [Google OAuth and Firebase setup](./operations/google-oauth-and-firebase-setup.md) — owner sequence for dedicated Google/Firebase projects, native clients, callbacks, and secret handoff.
- [Meta developer and Threads API setup](./operations/meta-threads-api-setup.md) — owner sequence for the Threads use case, callbacks, scopes, test users, and server credentials.
- [OpenRouter key and budget guard](./operations/openrouter-key-and-budget-guard.md) — owner sequence for dedicated inference credentials, prepaid funding, and independent spend caps.

## Decisions

- [Decision register](./decisions/decision-register.md) — locked decisions, unresolved questions, and explicit non-questions.

## Sources

- [Referenced product conversation](../raw/conversations/assess-small-bets-legality.md)
- [Claude product-flow artifact](../raw/designs/claude-product-flow.md)
- [Claude Design export](../raw/designs/thinkso-claude-export.md) — preserved source files and interpretation warning.
- [LLM Wiki pattern](../raw/references/llm-wiki-pattern.md)
- [AutoMobile](../raw/references/automobile.md) — selected MCP source for agent-driven native mobile interaction.
- [GitHub native stacked pull requests](../raw/references/github-native-stacked-pull-requests.md) — official preview, CLI, management, merge, and CI references.
- [Foundation tooling references](../raw/references/foundation-tooling.md) — current Expo, Node, Python, OpenAPI, and DI compatibility sources used by the foundation proposal.
