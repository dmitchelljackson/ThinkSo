# Autonomous build readiness

This is the front-door checklist for handing ThinkSo to the coordinator and letting it build the stacked backlog with as few human interruptions as possible. Detailed ownership and evidence live in [Human prerequisites](./human-prerequisites.md).

## Ground rule

The human handles only legal agreements, identity/account ownership, payments, privileged GUI prompts, secret entry, and interactive provider approval. Agents install ordinary development dependencies, scaffold projects, generate non-provider secrets, create the GitHub repository, configure code and CI, run emulators, create branches and pull requests, and maintain the wiki.

Never paste passwords, two-factor codes, recovery data, provider secrets, or private keys into chat, tickets, the wiki, or committed files. When a secret is needed, the agent first creates the ignored local file or platform-secret destination and gives the human one exact placement instruction.

## Batch A — do before autonomous implementation starts

Complete this batch once. After it passes, the coordinator can build the repository foundation and all provider-independent tickets without stopping.

### A-1 macOS developer authorization

- [ ] In Terminal, accept the Xcode license: `sudo xcodebuild -license accept`.
- [ ] Launch Xcode once, allow first-run components to install, and install at least one current iOS Simulator runtime.
- [ ] Resolve any macOS administrator or privacy prompts that block Xcode, Git, Homebrew, Simulator, Android Studio, or terminal automation.

**Why human:** accepting Apple's agreement and entering administrator credentials cannot be delegated.

### A-2 Android and iOS virtual devices

- [ ] Launch Android Studio once and finish its SDK setup.
- [ ] Install the Android SDK/platform tools and create one supported Android virtual device.
- [ ] Boot the Android emulator once and verify it reaches the launcher.
- [ ] Boot the iOS Simulator once and verify it reaches the home screen.

Agents own normal simulator/emulator use after this first-run setup. Paid Apple membership is not needed for these simulator checks.

### A-3 AutoMobile access

- [ ] Install and configure [AutoMobile](https://github.com/kaeawc/auto-mobile) as a Codex MCP.
- [ ] Grant its required local permissions.
- [ ] Verify it can see, inspect, tap, type, scroll, and capture screenshots on the Android emulator and iOS Simulator.

### A-4 GitHub account authorization

- [ ] Ensure the intended GitHub owner account may create a public repository and run Actions.
- [ ] Authenticate GitHub CLI interactively with `gh auth login`.
- [ ] Complete any browser, two-factor, or organization authorization GitHub requests.

After A-1 and A-4, the agent owns upgrading GitHub CLI to version 2.90.0 or later, installing `github/gh-stack`, verifying `gh stack`, auditing the public tree, creating the ThinkSo repository, and configuring CI. The currently installed CLI is 2.83.1 and is too old for GitHub's documented native stack workflow.

### A-5 Expo owner account

- [ ] Create the free Expo account that will own ThinkSo.
- [ ] Verify its email and complete recovery/two-factor setup.
- [ ] Authenticate the Expo/EAS CLI when the agent reaches the prepared login step, or place a dedicated Expo token into the exact ignored/CI secret destination the agent supplies.

The agent owns creating and linking the Expo project through the CLI. Do not manually invent project IDs or bundle/application identifiers ahead of the repository scaffold.

### A-6 Provider owner accounts

- [ ] Confirm access to the Google account that will own ThinkSo's Google OAuth and Firebase projects.
- [ ] Confirm access to the Facebook account that will own the Meta developer app, and complete Meta developer enrollment or identity agreements if prompted.
- [ ] Confirm access to the OpenRouter account.

Creating exact clients, callbacks, scopes, and credentials belongs to Batch B because the agent must first generate canonical identifiers and redirect URLs.

### A-7 OpenRouter financial guard

- [ ] Add only the prepaid credit intended for the demo.
- [ ] Disable automatic top-up.
- [ ] Set the provider-side daily limit to the locked USD $25 value.
- [ ] Create a dedicated ThinkSo API key; do not reuse a general personal key.
- [ ] Keep the key private until the agent supplies its ignored secret destination.

## Batch B — one consolidated provider activation checkpoint

The coordinator must first scaffold the apps, choose canonical identifiers, prepare ignored secret destinations, and produce an exact callback/credential worksheet. It should then request this batch as one consolidated `STOP: HUMAN REQUIRED`, not interrupt separately for every provider.

### B-1 Google identity and Firebase

- [ ] Complete any Google Cloud/Firebase console consent, terms, or project-ownership prompts that cannot be automated.
- [ ] Approve the exact Android, iOS-simulator, and backend OAuth identifiers/redirects supplied by the agent.
- [ ] Put any Google/Firebase private credential into the exact local, EAS, or GitHub secret destination supplied by the agent.
- [ ] Interactively sign into a designated Google test account on the virtual device when the smoke test requests it.

### B-2 Meta and Threads

- [ ] Complete Meta app ownership, agreements, identity checks, test-user approval, and any required dashboard-only settings.
- [ ] Approve the exact redirect URI, requested Threads scopes, and app identifiers supplied by the agent.
- [ ] Put the Meta app secret into the exact backend secret destination supplied by the agent.
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

- [ ] **Apple Developer Program:** paid membership and live Sign in with Apple entitlement/credential verification, APNs, TestFlight, and App Store work remain deferred. Apple login code/configuration and fake tests ship beside Google.
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

## Ready signal

The coordinator may begin when A-1 through A-7 are checked. Provider-independent work continues immediately. Provider-dependent work becomes fully autonomous after the single Batch B activation checkpoint passes. Deferred gates never block the local Android-first demo.
