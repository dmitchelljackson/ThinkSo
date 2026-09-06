# Firebase email/password setup

Owner and coordinator guide for Firebase Authentication in T-030/T-040. ThinkSo uses Firebase email/password for primary account access; Google and Apple social login are not part of MVP.

## Current project

- Firebase project: `thinkso-5768a`
- Android application ID: `com.thinkso.app`
- iOS bundle identifier: `com.thinkso.app`
- ignored platform configs: `apps/mobile/secrets/google-services.json` and `apps/mobile/secrets/GoogleService-Info.plist`
- deterministic QA: Firebase Auth Emulator with repository-seeded users
- live QA: one disposable email/password account created only for a controlled smoke test

The platform config files identify public Firebase apps; they are not backend administrative credentials. The repository keeps them in ignored paths anyway to maintain a simple secret-handoff rule.

## Locked MVP behavior

- Register asks for email and password only.
- Sign In asks for email and password.
- ThinkSo stores no plaintext password or password hash.
- Email confirmation is not required for MVP and is recorded as a known limitation.
- Forgot Password opens the normal ThinkSo dialog, asks for an email, calls Firebase once, and always shows a neutral check-email result.
- Firebase's hosted action page handles the new password for MVP.
- The backend exchanges a Firebase ID token for the existing opaque ThinkSo session only after Admin SDK validation.
- Email enumeration protection stays enabled. UI errors must not reveal whether an account exists.

## One-time owner checks

1. Open [Firebase Authentication providers](https://console.firebase.google.com/project/thinkso-5768a/authentication/providers).
2. Enable **Email/Password** and leave **Email link** disabled.
3. Open [Firebase Authentication settings](https://console.firebase.google.com/project/thinkso-5768a/authentication/settings).
4. Under user actions, confirm **Email enumeration protection** is enabled.
5. Before the live smoke test, review the Password Reset template. The default Firebase-hosted action handler is acceptable for MVP.

The owner does not create Google OAuth clients, Apple credentials, phone authentication, MFA, or a permanent shared QA login for this feature.

## Coordinator-owned setup

The coordinator must:

1. install/pin the Firebase tooling used by the repository;
2. add project-local emulator configuration without committing account credentials;
3. initialize the mobile Firebase adapter from the existing platform/project configuration;
4. seed deterministic Auth Emulator accounts from test setup rather than checked-in passwords;
5. point the backend Admin SDK at the Auth Emulator only in explicit local/test environments;
6. verify production configuration fails closed if emulator mode is accidentally requested;
7. add the Firebase Admin credential contract for deployment without requiring a production credential during local development;
8. run a bounded live register/sign-in/reset smoke test only after the owner checks above are complete.

## Backend credentials

Local Auth Emulator verification needs `FIREBASE_PROJECT_ID=thinkso-5768a` and `FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099`; it does not need a service-account key. A future non-Google-hosted deployment supplies Application Default Credentials or an ignored service-account path through `GOOGLE_APPLICATION_CREDENTIALS`. Never commit a service-account JSON file.

## Firebase-to-ThinkSo revocation bridge

**DERIVED:** Firebase password resets and major account changes revoke Firebase refresh tokens, while ThinkSo issues a separate opaque session. Each ThinkSo session therefore retains only the creating Firebase token's `auth_time`; the user row retains Firebase's `tokens_valid_after` epoch and its last-check time. An authenticated ThinkSo request whose check is at least five minutes old asks the Admin SDK for the current epoch. A newer epoch atomically revokes every ThinkSo session family for that user before access is granted. T-030 owns the schema and pure policy tests; T-040 owns request authentication, the bounded Admin lookup, atomic revocation, and integration tests. No Firebase ID or refresh token is stored for this bridge.

## Acceptance evidence

- Email/Password activation was verified on 2026-09-04 with a non-creating invalid-input probe that reached ordinary credential validation rather than `OPERATION_NOT_ALLOWED`.
- Email enumeration protection was verified on 2026-09-04 when a fabricated unknown-account sign-in returned generic `INVALID_LOGIN_CREDENTIALS` rather than `EMAIL_NOT_FOUND`.
- Android and iOS builds initialize Firebase without embedding an administrative credential.
- T-030: Auth Emulator registration, sign-in, wrong-password, and duplicate-email cases pass deterministically.
- T-035: reset-request behavior passes deterministically.
- T-040: logout, relaunch, refresh rotation, and Firebase-to-ThinkSo revocation enforcement pass deterministically.
- The backend accepts a valid emulator ID token only in explicit emulator mode and rejects malformed/expired/wrong-project tokens.
- One controlled live smoke test succeeds without logging email addresses, passwords, ID tokens, or session credentials.

## References

- [Firebase password authentication](https://firebase.google.com/docs/auth/web/password-auth)
- [Firebase Auth Emulator](https://firebase.google.com/docs/emulator-suite/connect_auth)
- [Verify Firebase ID tokens](https://firebase.google.com/docs/auth/admin/verify-id-tokens)
- [Manage Firebase sessions and revocation](https://firebase.google.com/docs/auth/admin/manage-sessions)
- [Email enumeration protection](https://docs.cloud.google.com/identity-platform/docs/admin/email-enumeration-protection)
