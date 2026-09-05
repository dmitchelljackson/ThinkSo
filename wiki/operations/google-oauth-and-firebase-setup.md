# Google OAuth and Firebase ownership setup

Implementation-oriented owner guide for H-004 and the Google portions of T-030/T-040. It covers one dedicated Google Cloud/Firebase project, native Google sign-in configuration, and the server credential handoff.

## Current boundary

As of 2026-09-04, ThinkSo has no generated Android application ID, iOS bundle identifier, Google Cloud project ID, Firebase app IDs, OAuth client IDs, redirect URIs, or backend secret destination. Do not create clients from guessed identifiers. The agent generates those values in T-010/T-030 and then supplies a worksheet.

Firebase is a project container that can hold separate Android, Apple, and other platform apps. Google documents the web-server OAuth flow as authorization-code based and explicitly says to keep `client_secret.json` outside a public source tree. See [Understand Firebase projects](https://firebase.google.com/docs/projects/learn-more) and [Google OAuth 2.0 for web-server applications](https://developers.google.com/identity/protocols/oauth2/web-server).

## Sequence

### 1. Owner work now (Batch A)

1. Confirm the Google account that will retain ownership of ThinkSo's dedicated Cloud/Firebase project. Keep its password, recovery methods, and two-factor codes private.
2. Decide whether a new dedicated project is required (recommended) or the owner has already created one specifically for ThinkSo. Do not use a work, client, or unrelated personal project.
3. Do not create OAuth clients or register mobile apps yet. Those records bind to identifiers and fingerprints that do not exist until the Expo scaffold is generated.

### 2. Agent work after T-010/T-030 preparation

The agent should first produce a configuration worksheet containing:

- the chosen Google Cloud project ID and Firebase project ID (normally the same project, but record both explicitly);
- the canonical Android application ID, iOS bundle identifier, and any development-build signing fingerprints;
- the required OAuth client types (Android, iOS, and backend/web only if the implementation uses one), exact redirect URIs, and the backend secret destination;
- the Firebase config-file destinations and whether each file is intentionally treated as a public client config or kept in ignored/platform storage;
- the test-account handle and the expected provider smoke command.

The agent owns ordinary CLI/API setup where it is safe and supported, but the owner must approve account ownership, consent-screen information, verification, and any interactive prompts. Never let an agent invent a redirect URI or create a second project to work around a mismatch.

### 3. Owner work after the worksheet (Batch B)

Use the current Google Cloud and Firebase consoles linked from the official documentation rather than relying on stale menu names. The current Google OAuth docs direct owners to the credentials/clients area; Firebase's official help describes registering platform apps from project settings.

1. Create or select the dedicated project and enable Firebase for it.
2. Register the Android app using the exact Android application ID. Add every development-build SHA-1 fingerprint supplied by the agent. Firebase's Android sign-in guide places the SHA-1 under the Android app's project settings and requires enabling Google in Firebase Authentication's sign-in-provider settings.
3. Register the iOS app using the exact bundle identifier. Download the current `GoogleService-Info.plist`; the iOS integration uses its `REVERSED_CLIENT_ID` for the native return URL scheme.
4. Create only the OAuth clients listed in the worksheet. For backend verification, the web client ID is the server client ID; the Android Firebase guide specifically says the Android flow's server client ID is the Web application client ID. Do not substitute an Android client ID for the backend audience.
5. Configure the consent/branding information and testing users required by the account's current Google Auth workflow. If Google presents an unverified-app or verification requirement, the owner handles the submission and records the result; the agent does not claim verification from a local test.
6. Download or copy the exact config artifacts into the agent-supplied ignored local, EAS, or CI secret destination. Store any backend OAuth client secret in the backend secret manager only. Do not upload a service-account private key for ordinary end-user sign-in.

Firebase's official platform guides are the source of truth for current SDK/config requirements: [Google sign-in on Android](https://firebase.google.com/docs/auth/android/google-signin) and [Google sign-in on Apple platforms](https://firebase.google.com/docs/auth/ios/google-signin). The Android guide requires a SHA-1, enabling the Google provider, and a refreshed `google-services.json`; the Apple guide requires enabling Google, a refreshed `GoogleService-Info.plist`, and the `REVERSED_CLIENT_ID` URL scheme.

### 4. Agent verification after owner activation

The agent should verify, without printing credentials:

- the mobile config maps to the selected project and exact application IDs;
- Android sign-in succeeds on the supported emulator after the supplied SHA-1 is present;
- iOS-simulator Google sign-in returns through the configured reversed-client-ID scheme;
- the backend accepts a real Google ID token only when its issuer, audience, signature, and expiry checks pass, then issues a ThinkSo session;
- repeated login reuses the active ThinkSo profile and a retired identity is rejected, per [T-030](../tickets/t-030-apple-google-login.md);
- provider tokens and backend client secrets never appear in logs, UI state, screenshots, tickets, or committed source.

## Secret and artifact rules

- Google OAuth client secrets, refresh credentials, service-account keys, and any backend private key are secrets. Enter them only into the exact ignored/deployment store supplied by the agent.
- Firebase mobile API keys are project identifiers used by Firebase client configuration, but they still must not be pasted into chat or casually copied into public issue text. Follow the repository's designated artifact path and review whether a value is embedded in the binary before treating it as confidential.
- Never commit `client_secret.json`, service-account JSON, raw ID tokens, refresh tokens, or unredacted Firebase config unless the agent explicitly documents that a client config is intentionally public and the repository audit approves it.
- Do not send account passwords, two-factor codes, recovery details, or raw credentials to the agent. Report only `configured` plus non-secret IDs.

## Acceptance evidence

The handoff is complete only when:

- the owner can identify the dedicated Cloud/Firebase project and account without sharing login material;
- the worksheet records the exact Android/iOS identifiers, SHA-1 fingerprints, OAuth client IDs, and approved redirect URIs;
- Google provider status is enabled in Firebase Authentication and the refreshed platform config files are in the designated destinations;
- any backend client secret is confirmed `configured` without revealing its value;
- one Android and one iOS-simulator Google smoke login reaches a ThinkSo session, with redacted logs showing no token material;
- the agent records any Google testing/verification limitation and the exact next human action.

## Handoff worksheet

```text
status: NOT_STARTED | READY_FOR_AGENT | WAITING_FOR_OWNER | BLOCKED | VERIFIED
owner_google_account: <safe account label or redacted email>
google_cloud_project_id: <non-secret project ID>
firebase_project_id: <non-secret project ID>
android_application_id: <agent-generated canonical value>
android_firebase_app_id: <non-secret Firebase app ID>
android_sha1_fingerprints: <redacted list of fingerprints supplied by agent>
ios_bundle_identifier: <agent-generated canonical value>
ios_firebase_app_id: <non-secret Firebase app ID>
oauth_client_ids: <client type -> non-secret ID map>
backend_redirect_uris: <exact approved URI list, or NONE if not used>
requested_scopes: <exact scope list supplied by agent>
firebase_config_destinations: <ignored/EAS/CI destinations; no raw file contents>
backend_secret_destination: <agent-supplied ignored path or secret name>
backend_secret_status: NOT_REQUESTED | CONFIGURED | ROTATE_REQUIRED
consent_or_verification_status: <TESTING | VERIFIED | OWNER_REVIEW_REQUIRED | NOT_APPLICABLE>
test_account: <safe label only>
evidence: <redacted command output, dashboard URL, or screenshot path>
next_agent_action: <one concrete action>
last_verified_utc: <ISO-8601 timestamp>
```

## Official references

- [Google OAuth 2.0 web-server flow](https://developers.google.com/identity/protocols/oauth2/web-server)
- [Google Cloud credentials/client IDs](https://console.cloud.google.com/apis/credentials)
- [Google Workspace credential setup](https://developers.google.com/workspace/guides/create-credentials)
- [Firebase project model and config files](https://firebase.google.com/docs/projects/learn-more)
- [Firebase: add an app](https://support.google.com/firebase/answer/9326094)
- [Firebase API-key handling](https://firebase.google.com/docs/projects/api-keys)
- [Firebase Google sign-in on Android](https://firebase.google.com/docs/auth/android/google-signin)
- [Firebase Google sign-in on Apple platforms](https://firebase.google.com/docs/auth/ios/google-signin)
