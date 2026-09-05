# Autonomous build readiness

This is the front-door checklist for handing ThinkSo to the coordinator and letting it build the stacked backlog with as few human interruptions as possible. Detailed ownership and evidence live in [Human prerequisites](./human-prerequisites.md).

## Ground rule

The human handles only legal agreements, identity/account ownership, payments, privileged GUI prompts, secret entry, and interactive provider approval. Agents install ordinary development dependencies, scaffold projects, generate non-provider secrets, create the GitHub repository, configure code and CI, run emulators, create branches and pull requests, and maintain the wiki.

Never paste passwords, two-factor codes, recovery data, provider secrets, or private keys into chat, tickets, the wiki, or committed files. When a secret is needed, the agent first creates the ignored local file or platform-secret destination and gives the human one exact placement instruction.

## Batch A — establish once, without blocking unrelated work

Complete each capability once. Provider-independent work starts immediately; an incomplete row blocks only work that truly requires that provider. Once a CLI session or secret is configured, the coordinator validates it and proceeds under the standing authorization in [Human prerequisites](./human-prerequisites.md).

### A-1 macOS developer authorization

- [x] Xcode license and first-launch setup are complete; `xcodebuild -checkFirstLaunchStatus` exits successfully.
- [x] A current iOS Simulator runtime (iOS 26.5) is installed.
- [x] No administrator or privacy prompt blocks the currently verified toolchain.

**Why human:** accepting Apple's agreement and entering administrator credentials cannot be delegated.

### A-2 Android and iOS virtual devices

- [x] Complete Android SDK first-run setup; the command-line SDK is sufficient and Android Studio is not a prerequisite for the current agent workflow.
- [x] Install the Android SDK/platform tools and create one supported Android virtual device (`ThinkSo_API_36`, Pixel 8, Android 16/API 36).
- [x] Boot the Android emulator once and verify it reaches the launcher (`emulator-5556`, verified 2026-09-04).
- [x] Boot the iOS Simulator once and verify it reaches the home screen (`ThinkSo-iPhone-17`, verified 2026-09-04).

Agents own normal simulator/emulator use after this first-run setup. Paid Apple membership is not needed for these simulator checks.

### A-3 AutoMobile access

- [x] Install and configure [AutoMobile](https://github.com/kaeawc/auto-mobile) `0.0.67` as an exact-version Codex MCP.
- [x] Grant the access required for the verified Android and iOS sessions.
- [x] Verify it can list and inspect both targets, navigate each to its home screen, and capture screenshots. Feature-ticket UI verification owns further tap/type/scroll evidence.

### A-4 GitHub account authorization

- [x] Ensure the intended GitHub owner account may create a public repository and run Actions.
- [x] Authenticate GitHub CLI interactively with `gh auth login`.
- [x] Complete any browser, two-factor, or organization authorization GitHub requests.

GitHub CLI 2.100.0 and `github/gh-stack` 0.1.1 are installed and verified. The public repository is connected, and the coordinator owns the native stack and CI from this point forward.

### A-5 Expo owner account

EAS CLI `23.2.0` is installed globally. Token authentication succeeds for personal owner `mitchelljackson`, and the canonical project is linked as `@mitchelljackson/thinkso` with project ID `a53d6e77-474f-4f27-a5d4-35627d7c405e`.

- [x] Create the free Expo account that will own ThinkSo.
- [x] Verify the account sufficiently for authenticated EAS access; recovery/two-factor settings remain private owner maintenance.
- [x] Authenticate Expo/EAS using the dedicated `EXPO_TOKEN` in ignored root `.env.local`.

The agent created and linked the Expo project through the CLI. The canonical slug/scheme is `thinkso` and both native identifiers are `com.thinkso.app`.

### A-6 Provider owner accounts

- [x] Confirm access to the Google account that owns ThinkSo's Firebase project.
- [x] Confirm access to the Facebook account that will own the Meta developer app. Meta developer enrollment or identity agreements remain pending if prompted.
- [x] Confirm access to the OpenRouter account.

Creating exact clients, callbacks, scopes, and credentials belongs to Batch B because the agent must first generate canonical identifiers and redirect URLs.

### A-7 OpenRouter financial guard

- [ ] Add only the prepaid credit intended for the demo.
- [ ] Disable automatic top-up.
- [ ] Set the provider-side daily limit to the locked USD $25 value.
- [ ] Create a dedicated ThinkSo API key; do not reuse a general personal key.
- [ ] Put the key directly in `services/api/.env.local` as `OPENROUTER_API_KEY`; report only `configured`.

## Batch B — one consolidated provider activation checkpoint

The coordinator prepares every identifier, ignored destination, callback, and verification command before presenting this single checkpoint. After the owner completes it, the coordinator detects the configured state and resumes automatically; the owner does not hold credentials waiting for another request.

### B-1 Firebase email/password identity

- [x] Create Firebase project `thinkso-5768a`, register both `com.thinkso.app` platform apps, and install their config files in ignored destinations.
- [x] Enable Firebase Authentication Email/Password; a non-creating REST probe reached normal credential validation on 2026-09-04.
- [x] Confirm Email enumeration protection is enabled; an unknown-account sign-in probe returned generic `INVALID_LOGIN_CREDENTIALS` on 2026-09-04.
- [ ] Review the Password Reset email template before live smoke testing; Firebase's hosted action handler is sufficient for MVP. Email confirmation is deferred.
- [ ] Create one disposable live email/password account only when the smoke test requests it. Automated QA uses deterministic Firebase Auth Emulator users.

### B-2 Meta and Threads

- [x] Create and own the Meta app with the Threads use case, configure the designated Threads tester, and accept its invitation.
- [ ] Complete any remaining Meta agreements, identity checks, or dashboard-only requirements encountered during OAuth verification.
- [ ] Approve the exact redirect URI, requested Threads scopes, and app identifiers supplied by the agent.
- [x] Put the Meta app secret into `services/api/.env.local`; its presence and client-credential validity were verified without exposing it.
- [ ] Interactively authorize a designated Threads test account when the smoke test requests it.

### B-3 Expo and Android push

- [ ] Complete any Expo or Firebase console ownership/credential step that the CLI cannot perform.
- [ ] Put Android push credentials into the exact EAS/Firebase secret destination supplied by the agent.
- [ ] Confirm a test notification may be sent to the Android emulator/device used for verification.

### B-4 OpenRouter live-agent access

- [ ] Put the dedicated OpenRouter key into the exact ignored backend secret destination supplied by the agent.
- [ ] Confirm the account still has prepaid credit, automatic top-up is disabled, and the USD $25 provider cap is active.

### B-5 Non-secret handoff

Return only the non-secret values requested in the worksheet, such as project IDs, public client IDs, owner names, app IDs, approved redirect URIs, granted scope names, and safe test-account handles. Confirm secret placement with `configured`; never echo the value.

## Later human gates — not required to start or finish the local Android-first demo

- [ ] **Apple Developer Program:** paid membership, APNs, TestFlight, and App Store work remain deferred. Apple login is not part of MVP.
- [ ] **Railway:** account, billing, hosted Postgres, production secrets, and deployment remain deferred until deployment is chosen.
- [ ] **Production domain:** purchase, DNS, canonical web/deep-link URLs, and provider production URLs remain deferred.
- [ ] **Hosted mobile E2E:** paid emulator/device hosting is not assumed; local AutoMobile verification is sufficient initially.

## Agent-owned setup after Batch A

The human should not be interrupted for these ordinary tasks:

- install/update Homebrew packages, Node, pnpm, Python/uv, `just`, and repository dependencies;
- upgrade `gh`, install and configure the native stack extension, and maintain stacked PRs;
- scaffold Expo/React Native, FastAPI, Postgres/Docker Compose, tests, linting, and GitHub Actions;
- create ignored local secret templates and generate application-owned random secrets;
- create temporary development tunnels and provide exact callback URLs;
- create the public repository after a secret/private-content audit;
- run migrations, local services, unit/integration tests, code review, and AutoMobile verification;
- update tickets, BDD links, architecture pages, and the append-only wiki log.

## Continuation rule

The coordinator must always take the next safe action. It may not stop merely because a later provider credential is absent. It records the narrow dependency, substitutes fakes where appropriate, advances the stack through all independent work, and returns to the live integration as soon as readiness is machine-detectable.

Once the owner says a listed destination is `configured`, the coordinator validates it without printing secrets and continues. It asks again only for a failed interactive authorization, a missing legal/account decision, secret rotation, a higher spend limit, a destructive provider action, or a public production action.

## Ready signal

The local toolchain, GitHub, emulators, and agent UI-control gate is already ready. Provider-independent work continues now. Each provider becomes ready when its account login/secret row is machine-verifiable; it does not require a separate conversational approval. Deferred gates never block the local Android-first demo.
