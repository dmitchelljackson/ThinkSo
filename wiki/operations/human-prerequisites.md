# Human prerequisites

Some setup requires account ownership, secrets, administrator privileges, or GUI work that an implementation agent must not attempt to improvise. Tickets label these dependencies `STOP: HUMAN REQUIRED` and place them before dependent autonomous work.

Start with the ordered [Autonomous build readiness](./autonomous-build-readiness.md) checklist. This page is the detailed ownership and acceptance reference for each prerequisite.

## H-001 Native mobile toolchains and agent UI control

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

- Codex can list the configured iOS Simulator and Android emulator through AutoMobile.
- Codex can install or launch the ThinkSo app on each target. The iOS build may use Google login and omit paid Apple capabilities until H-002 is completed.
- Codex can inspect visible elements, tap/type/scroll, and capture screenshots on each target.
- The commands and any non-secret machine-specific notes needed to repeat verification are recorded here or in a linked local setup runbook.

After this checkpoint, agents own using AutoMobile for interactive UI review. Humans remain responsible for toolchain upgrades, privileged prompts, GUI-only repair, and physical-device trust or signing steps.

## H-002 Apple Developer Program

**Timing:** Deferred for the Android-first demo. Implement and fake-test the Apple provider beside Google, while free Xcode and iOS Simulator work proceeds using Google login. Complete paid enrollment before live Sign in with Apple credentials/entitlements and end-to-end verification, real iOS notification delivery, TestFlight, or App Store distribution.

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

- Create the Expo project/account and Firebase project used for Android notification credentials.
- Put provider credentials into EAS/platform secret storage or the documented local secret store; never commit or paste them into the wiki.
- Confirm the implementation agent may use the resulting non-secret project identifiers.

**Acceptance evidence**

- ThinkSo obtains and registers an Expo push token on an Android test target supported by the provider setup.
- A backend test notification sent through Expo Push Service arrives on Android and opens the intended protected route.
- iOS registration and delivery remain an explicit deferred verification item until H-002 is complete.

## H-004 Google project ownership

**Status:** Owner account available; project configuration not yet completed.

**Timing:** Complete before the identity vertical slice.

**Human owns**

- Use the available Google account to create dedicated ThinkSo Google OAuth and Firebase projects rather than embedding unrelated project credentials.
- Configure consent-screen ownership and any provider verification that requires interactive account access.
- Put client secrets and Firebase credentials directly into their designated local or platform secret stores.

**Acceptance evidence**

- The implementation agent receives the non-secret project IDs, OAuth client IDs, approved redirect URIs, and confirmation that required secrets exist.
- The agent never receives the Google account password, two-factor codes, recovery information, or raw secrets in chat or the wiki.

## H-005 Expo account and project

**Status:** Account must be created.

**Timing:** Complete during repository foundation, before EAS project configuration or Android push setup.

**Human owns**

- Create the Expo account and dedicated ThinkSo project on the free plan.
- Complete email verification, interactive login, and any recovery or two-factor configuration.
- Keep account credentials private and place any generated access token directly into the designated local or CI secret store.

**Acceptance evidence**

- The implementation agent receives the non-secret Expo owner and project ID plus confirmation that any required token is configured.
- The local mobile project is linked to the correct Expo project.

## H-006 Meta developer and Threads app

**Status:** Facebook owner account available; Meta developer app not yet created.

**Timing:** Create the developer app early enough to expose provider constraints; complete credentials and callbacks before the Threads onboarding vertical slice.

**Human owns**

- Use the available Facebook account to register for Meta developer access and create a dedicated ThinkSo app.
- Accept provider agreements and complete any interactive identity, business, or app-review steps Meta requires.
- Create/configure Threads API credentials, allowed callbacks, test users, scopes, and production access when the implementation ticket provides exact values.
- Put the app secret and long-lived/provider credentials directly into the designated backend secret store.

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
