# Human prerequisites

This is the one-time owner handoff that lets the coordinator keep building without repeatedly asking for accounts, credentials, permission, or placement details. It is not a list of things for the owner to prepare and hold until an agent asks.

Start with the ordered [Autonomous build readiness](./autonomous-build-readiness.md) checklist. This page defines ownership, permanent handoff locations, standing authorization, and acceptance evidence.

## Zero-pause handoff contract

**LOCKED:** after the owner completes a row below, the coordinator owns discovery, validation, configuration, implementation, smoke testing, and continuation of all work within that provider's documented scope.

- The agent creates every ignored secret destination, config template, CLI install, canonical identifier, callback worksheet, and verification command as early as the repository permits. It must not wait until the implementation ticket is otherwise blocked.
- The owner performs only account creation, legal/identity acceptance, payment controls, privileged prompts, interactive login, and secret entry. The owner reports `configured`; secret values never enter chat or the wiki.
- A configured credential is standing authorization for agents to use it for bounded ThinkSo development and verification. Do not stop to ask whether it may be used again.
- The coordinator detects readiness itself with non-secret CLI/config checks. It does not ask the owner to remember project IDs or relay values that an authenticated CLI/API can read.
- If one provider remains unavailable, mark only that provider-dependent acceptance path blocked and continue every independent ticket, fake-backed test, UI state, contract, and integration seam.
- Stop again only for a new legal agreement, identity/2FA prompt, secret rotation, billing-limit increase, public production publication, destructive provider action, or a genuinely unresolved product choice.

## Permanent handoff locations

| Capability | Owner action | Durable handoff | What the coordinator does next |
| --- | --- | --- | --- |
| GitHub | Authenticate `gh` | GitHub CLI credential store | Detect with `gh auth status`; manage repository, Actions, branches, and PR stacks. |
| Expo/EAS | Create the owner account, then authenticate the CLI or configure a dedicated token | Standard Expo/EAS CLI credential store, or `EXPO_TOKEN` in ignored root `.env.local` when token auth is required | Detect with `eas whoami`; create/link the project and record its non-secret ID. |
| Firebase | Create/retain the owner account and complete interactive Firebase CLI login | Standard Firebase/Google CLI credential stores; platform artifacts go only to agent-created ignored paths | Discover the active project, configure the Auth Emulator and app SDK, validate Email/Password settings, and run login smoke tests. |
| Meta/Threads | Complete Meta developer enrollment and remain able to approve dashboard-only prompts | `THREADS_APP_ID`, `THREADS_APP_SECRET`, and `THREADS_OAUTH_REDIRECT_URI` in `services/api/.env.local`; the agent generates `THREADS_TOKEN_ENCRYPTION_KEY` | Validate presence without printing values, finish OAuth configuration, and run the designated test-account flow. |
| Local HTTPS tunnel | Create the free ngrok account and place its token once | `NGROK_AUTHTOKEN` in ignored root `.env.local` | Authenticate the CLI, retain the assigned development domain, operate the tunnel, and configure local callback URLs without further owner input. |
| OpenRouter | Create a dedicated capped key after disabling auto top-up | `OPENROUTER_API_KEY` in `services/api/.env.local` | Validate presence, run one bounded fixed-model smoke request, then continue agent implementation. |
| Local API | No human action | `services/api/.env.local`, copied initially from `services/api/.env.example` | Maintain names, validation, and redacted diagnostics. |

The ignored root `.env.local` and `services/api/.env.local` are the canonical local fill-in sheets and already contain every currently known variable. Their committed `.env.example` counterparts contain names and safe defaults only. Platform-specific files such as Firebase configuration are assigned an exact ignored or intentionally-public destination by the implementing ticket; the owner never has to invent a path.

## H-001 Native mobile toolchains and agent UI control

**Status:** Human/tooling gate complete on 2026-09-04. Launching the first ThinkSo native build remains agent-owned T-010 verification, not a human prerequisite.

**Timing:** Complete during repository foundation, before implementation tickets depend on visual or interactive mobile verification.

**Human owns**

- Accept Apple's Xcode license and any administrator prompt that cannot use an already-authorized noninteractive path.
- Grant any macOS privacy permission AutoMobile actually requests.
- Perform interactive provider login or signing steps when a later test requires them.

**Agent owns**

- Install and initialize Xcode command-line components and at least one supported iOS Simulator runtime after the human approves the license.
- Install the Android SDK/platform tools and at least one supported Android virtual device; Android Studio itself is optional when the command-line toolchain is complete.
- Install and configure [AutoMobile](https://github.com/kaeawc/auto-mobile) as a Codex MCP.
- Boot both virtual devices, verify AutoMobile discovery and harmless interaction, and confirm a basic Expo/React Native build can launch without paid Apple capabilities.

**Acceptance evidence**

- [x] `xcodebuild -checkFirstLaunchStatus` exits successfully.
- [x] Android AVD `ThinkSo_API_36` (Pixel 8, Android 16/API 36; `emulator-5556`) boots to the launcher.
- [x] iOS Simulator `ThinkSo-iPhone-17` (iOS 26.5; UDID `90966346-0052-4154-A9ED-23447875A8BB`) boots to the home screen.
- [x] AutoMobile `0.0.67` is installed as an exact-version Codex MCP and can list, observe, navigate to the home screen, and capture both targets.
- [ ] The ThinkSo native app launches on both targets. This is completed and recorded by T-010; it does not require another owner action.

After this checkpoint, agents own using AutoMobile for interactive UI review. Humans remain responsible for toolchain upgrades, privileged prompts, GUI-only repair, and physical-device trust or signing steps.

## H-002 Apple Developer Program

**Timing:** Deferred for the Android-first demo. Account access no longer depends on Apple login. Complete paid enrollment only before real iOS notification delivery, TestFlight, App Store distribution, or another paid Apple capability is introduced.

**Human owns**

- Choose individual versus organization enrollment; individual distribution displays the owner's legal name, while organization enrollment requires an eligible legal entity and D-U-N-S number.
- Create or select the Apple Account, enable two-factor authentication, complete identity verification, accept the agreements, and pay the current Apple Developer Program fee.
- Keep the Account Holder login, two-factor codes, recovery methods, and payment details private. Agents must never request or store them.
- Create the required app identifiers, capabilities, keys, and profiles when a ticket supplies exact non-secret names and callback/configuration values.
- Put downloaded private keys and credentials directly into the designated local/platform secret stores, never chat, the wiki, or committed files.

**Current cost reference:** Apple lists individual and organization Apple Developer Program enrollment at USD $99 per membership year, subject to regional pricing. Verify the current amount at enrollment.

**Acceptance evidence**

- Active Apple Developer Program membership exists under the chosen owner/entity.
- The implementation agent receives only the non-secret team ID, bundle identifier, key IDs, and confirmation that required secrets are present in their designated stores.

## H-003 Expo and Android push configuration

**Timing:** Complete before the notification vertical slice. This does not require a paid Expo plan or Apple Developer membership.

**Human owns**

- Create the Expo owner account and Google/Firebase owner access used for Android notification credentials. The coordinator creates and links ordinary project resources through authenticated tooling where supported.
- Put provider credentials into EAS/platform secret storage or the documented local secret store; never commit or paste them into the wiki.
- Confirm the implementation agent may use the resulting non-secret project identifiers.

Once Expo CLI authentication exists, that confirmation is implicit for ThinkSo development. The coordinator should discover and record identifiers itself and proceed.

**Acceptance evidence**

- ThinkSo obtains and registers an Expo push token on an Android test target supported by the provider setup.
- A backend test notification sent through Expo Push Service arrives on Android and opens the intended protected route.
- iOS registration and delivery remain an explicit deferred verification item until H-002 is complete.

## H-004 Firebase Authentication ownership

**Status:** Provider handoff ready on 2026-09-04. Firebase project `thinkso-5768a` exists, both `com.thinkso.app` platform apps are registered, refreshed ignored configs are installed, Email/Password accepts requests, and unknown-account login returns the enumeration-safe generic error. Live mobile/backend verification belongs to T-030.

**Timing:** Complete before the identity vertical slice.

**Human owns**

- Retain ownership of the dedicated ThinkSo Firebase project.
- Enable the Email/Password provider while leaving Email link disabled.
- Confirm email-enumeration protection remains enabled and review the Password Reset email template before live smoke testing. Email confirmation is deferred.
- Put any future Firebase Admin credential directly into its designated ignored/deployment secret store; never paste it into chat or the wiki.

Authenticated Google/Firebase CLI access is a handoff, not a signal to wait. The coordinator should perform every supported noninteractive project/configuration step and surface only console-only prompts as a consolidated human gate.

**Acceptance evidence**

- The implementation agent can detect project `thinkso-5768a`, both platform configs, enabled Email/Password authentication, and email-enumeration protection.
- The agent never receives the Google account password, two-factor codes, recovery information, or raw secrets in chat or the wiki.

## H-005 Expo account and project

**Status:** Complete on 2026-09-04. Dedicated token authentication succeeds for personal owner `mitchelljackson`; `@mitchelljackson/thinkso` is linked with project ID `a53d6e77-474f-4f27-a5d4-35627d7c405e`.

**Timing:** Complete during repository foundation, before EAS project configuration or Android push setup.

**Human owns**

- Create the Expo owner account on the free plan. The coordinator creates the dedicated ThinkSo project.
- Complete email verification, interactive login, and any recovery or two-factor configuration.
- Keep account credentials private and place any generated access token directly into the designated local or CI secret store.

The owner does not need to manually create the Expo project. After `eas whoami` succeeds, the coordinator creates or links the canonical `thinkso` project and continues without another approval.

**Acceptance evidence**

- The implementation agent receives the non-secret Expo owner and project ID plus confirmation that any required token is configured.
- The local mobile project is linked to the correct Expo project.

## H-006 Meta developer and Threads app

**Status:** Meta developer app and Threads use case created; Threads app credentials are configured in the ignored backend environment; the designated tester invitation is accepted. Exact callback configuration and end-to-end OAuth verification remain pending implementation.

**Timing:** Create the developer app early enough to expose provider constraints; complete credentials and callbacks before the Threads onboarding vertical slice.

**Human owns**

- Use the available Facebook account to register for Meta developer access and create a dedicated ThinkSo app.
- Accept provider agreements and complete any interactive identity, business, or app-review steps Meta requires.
- Create/configure Threads API credentials, allowed callbacks, test users, scopes, and production access when the implementation ticket provides exact values.
- Put the app secret and long-lived/provider credentials directly into the designated backend secret store.

Use `services/api/.env.local` for the local `THREADS_APP_ID` and `THREADS_APP_SECRET`. After they are configured, the coordinator may consume them for the documented OAuth/test-account flow without requesting the values or asking permission again.

**Acceptance evidence**

- The implementation agent receives only the non-secret Meta app ID, approved callback URIs, granted scopes, test-account handles/IDs safe to record, and confirmation that secrets are configured.
- The Threads authorization flow succeeds for an approved test account and the backend can perform the minimum required connection check and consequence publication operations.

## H-007 OpenRouter project credential and spend guard

**Status:** Account available; dedicated ThinkSo credential not yet created.

**Timing:** Complete before the first live minting-agent integration.

**Human owns**

- Create a dedicated OpenRouter API credential for ThinkSo rather than reusing a general personal key.
- Fund it with prepaid credit as needed, disable automatic top-up, and configure the locked USD $25 daily provider-side limit.
- Put the credential directly into the backend's local/deployment secret store as the documented environment variable; never paste it into chat or the wiki.
- Confirm that OpenRouter routing may select providers for the fixed configured model but may not fall back to a different model.

Use `services/api/.env.local` for `OPENROUTER_API_KEY`. The locked cost policy itself authorizes bounded development calls; no per-call approval is required. Agents must still enforce and verify the application and provider caps before broader live use.

**Acceptance evidence**

- The implementation agent can make a bounded development request using the configured secret without being shown its value.
- Application-side and provider-side spend controls are independently observable and testable.

## H-008 Railway deployment

**Status:** Account and project may be created at deployment time.

**Timing:** Deferred until the release/deployment phase. Local development uses Docker Compose and does not depend on Railway.

**Human owns**

- Create the Railway account/project, attach billing, and provision the API, worker, scheduled commands, and Postgres from the repository's prepared configuration.
- Configure deployment secrets directly in Railway.
- Start on the Hobby plan and set conservative usage alerts and a hard compute limit before leaving the demo online.

**Acceptance evidence**

- A clean deployment migrates Postgres and boots every required process from committed configuration.
- Secrets are present without appearing in source, logs, tickets, or the wiki.
- Billing alerts and the hard limit are visible in Railway settings.

Provider integration that requires a public callback before deployment may use a documented temporary development tunnel; it must not force early production hosting.

## H-009 GitHub CLI authorization

**Status:** Complete. The public repository is live at <https://github.com/dmitchelljackson/ThinkSo>; audited local content is pushed. GitHub CLI authentication succeeds for `dmitchelljackson`, GitHub CLI 2.100.0 is installed, and `github/gh-stack` 0.1.1 is verified.

**Timing:** Completed during repository foundation before the first stacked implementation pull request.

**Human owns**

- Authenticate GitHub CLI locally to the intended owner account with permission to create repositories and configure Actions.
- Keep the account password, two-factor codes, recovery information, and tokens private.
- Complete any browser, two-factor, organization, or privileged prompts required by GitHub authentication.

**Agent owns after authorization**

- Keep GitHub CLI at version 2.90.0 or later.
- Maintain the official native stack extension and verify `gh stack --help` after upgrades.
- Configure non-interactive stack prerequisites such as Git rerere and the default push remote.
- Audit the entire proposed public tree for credentials, personal data that should not be published, generated junk, and unsuitable source artifacts.
- Maintain Git configuration and the existing public ThinkSo repository through `gh`.
- Push reviewed stack branches, maintain GitHub Actions, and report protection/settings requiring human action.

**Acceptance evidence**

- `gh auth status` succeeds without exposing credential material.
- `gh --version` reports 2.90.0 or later and `gh stack --help` succeeds.
- The public repository contains the intended monorepo and no secret values.
- Required CI workflows run successfully from the pushed repository.

## H-010 Production domain and public URLs

**Status:** Deferred; the project may remain an undeployed demo.

**Timing:** Complete only if deployment or provider production approval requires stable public URLs.

**Human owns**

- Choose and purchase a domain if ThinkSo is actually deployed.
- Approve canonical invite, OAuth callback, privacy, and terms URLs before they are registered with providers.
- Configure registrar/DNS access without exposing account credentials to agents.

**Agent owns before deployment**

- Keep URL construction configuration-driven rather than hardcoding a speculative domain.
- Use app-scheme links and a documented temporary development tunnel where feasible.
- Produce the exact DNS records, callback URLs, and provider configuration values for the human to apply or approve.

The coordinator consolidates remaining provider setup into the Batch B worksheet in [Autonomous build readiness](./autonomous-build-readiness.md). Store secrets in ignored local files or platform secret managers, never in the wiki or committed source.
