# Expo account and project setup

Implementation-oriented owner guide for H-005 and the Expo portions of H-003. This guide is about ownership and handoff; the implementation agent still owns the Expo app scaffold and ordinary CLI work.

## Current boundary

As of 2026-09-04, T-010 defines the canonical local Expo config and EAS CLI `23.2.0` is installed globally. Dedicated token authentication succeeds for personal owner `mitchelljackson`. The coordinator created and linked `@mitchelljackson/thinkso` with EAS project ID `a53d6e77-474f-4f27-a5d4-35627d7c405e`, which is recorded in dynamic `app.config.ts`. The app name is `ThinkSo`, slug/scheme are `thinkso`, Android application ID is `com.thinkso.app`, and iOS bundle identifier is `com.thinkso.app`.

Expo says a Personal account is suitable for personal projects and an Organization account is intended for shared projects, role-based access, shared credentials, and future transfer. The owner should choose deliberately; do not put a project in an unrelated account merely to unblock a build. See [Expo account types](https://docs.expo.dev/accounts/account-types/).

## Sequence

### 1. Owner work now (Batch A)

1. Sign up at [expo.dev/signup](https://expo.dev/signup) with the account that will own ThinkSo.
2. Verify the email and configure recovery and two-factor authentication if offered. Never give the password or one-time codes to an agent.
3. Decide whether ThinkSo belongs in the Personal account or a dedicated Organization account. If an Organization is chosen, keep the owner role with the human and invite only the minimum collaborators.
4. Authenticate the Expo/EAS CLI, or place a dedicated token in ignored root `.env.local` as `EXPO_TOKEN`. Do not create an EAS project manually or guess its ID; the coordinator owns that step.

An Expo account and the Free plan are sufficient for EAS Build and EAS Update. A store developer membership is not required for a development build on an Android emulator or iOS Simulator; store distribution is a later gate. See [Create your first build](https://docs.expo.dev/build/setup/) and [Get started with EAS Update](https://docs.expo.dev/eas-update/getting-started/).

### 2. Agent work after T-010 scaffold

The agent should:

- establish the repository's canonical Expo app name, slug, Android application ID, iOS bundle identifier, and app-scheme/deep-link values in app config;
- install or invoke the pinned EAS CLI and run `eas whoami` only after owner authentication is available;
- run `eas project:init` (alias `eas init`) to create or link the EAS project for the selected owner, then record the returned `extra.eas.projectId` in the generated app config;
- run `eas build:configure`/`eas update:configure` only as required by the chosen development-build path, and verify the config diff;
- record the discovered account/project values and verification evidence in the worksheet; ask the owner only when an interactive login or token entry is actually required.

The EAS CLI reference documents `eas project:init --account <value>` and `--id <value>` for creating/linking a project. The command must target the owner-selected account; never silently create a second project. See [EAS CLI reference](https://docs.expo.dev/eas/cli/).

### 3. Owner work after the worksheet (Batch B)

If CI or EAS automation needs programmatic access, create a dedicated least-scope Expo token or robot-user token as instructed by the agent. Place it directly into the agent-supplied ignored local file or CI/EAS secret store. Expo documents `EXPO_TOKEN` for EAS CLI authentication and says tokens must be treated like passwords; revoke a leaked token from the Access Tokens page. See [Expo programmatic access](https://docs.expo.dev/accounts/programmatic-access/).

Do not paste the token into chat, a ticket, the wiki, source, shell history, or screenshots. Do not put a secret in a client-side `EXPO_PUBLIC_*` variable. EAS documents three visibility levels and warns that anything embedded in client code is public; use a secret visibility only for build-time values that do not need to ship in the app. See [EAS environment variables](https://docs.expo.dev/eas/environment-variables/).

## What the agent must not ask the owner to do

- Manually guess or pre-register a callback, package name, bundle ID, or EAS project ID.
- Share Expo login credentials or two-factor codes.
- Commit `.env`, `.env.local`, EAS tokens, signing material, or provider files.
- Use an EAS secret to pretend that a value embedded in a mobile binary is confidential.

## Acceptance evidence

The handoff is complete only when the following evidence exists:

- `eas whoami` identifies the intended owner/account without exposing credentials.
- `eas project:info` (or equivalent current CLI output) identifies exactly one ThinkSo EAS project.
- The generated app config contains the returned `extra.eas.projectId`; the value is recorded as non-secret.
- A development build can be produced or a documented local-build alternative is verified on the configured Android emulator and iOS Simulator.
- If a token is needed, the agent can run a bounded authenticated command without seeing or printing the token value.
- The owner has recorded whether the account is Personal or Organization and who owns it.

## Handoff worksheet

```text
status: VERIFIED
owner_account_type: personal
expo_owner_username_or_slug: mitchelljackson
expo_project_name: ThinkSo
expo_project_slug: thinkso
expo_project_id: a53d6e77-474f-4f27-a5d4-35627d7c405e
android_application_id: com.thinkso.app
ios_bundle_identifier: com.thinkso.app
app_scheme: thinkso
token_destination: ignored root .env.local as EXPO_TOKEN
token_status: CONFIGURED
evidence: `eas whoami` and `eas project:info --non-interactive` succeeded; no secret output retained
owner_notes: personal account selected for this personal/demo repository
next_agent_action: configure EAS build/update only when the relevant implementation ticket requires it
last_verified_utc: 2026-09-04
```

## Official references

- [Create an Expo project](https://docs.expo.dev/get-started/create-a-project/)
- [Expo account types](https://docs.expo.dev/accounts/account-types/)
- [EAS CLI](https://docs.expo.dev/eas/cli/)
- [Create your first EAS Build](https://docs.expo.dev/build/setup/)
- [EAS Update setup](https://docs.expo.dev/eas-update/getting-started/)
- [Expo programmatic access](https://docs.expo.dev/accounts/programmatic-access/)
- [EAS environment variables and visibility](https://docs.expo.dev/eas/environment-variables/)
