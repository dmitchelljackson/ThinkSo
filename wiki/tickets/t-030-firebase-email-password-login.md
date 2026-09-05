# T-030 — Authenticate with Firebase email/password and issue ThinkSo sessions

## Control

| Field | Value |
|---|---|
| Type / status | `PRODUCT` / `DRAFT` |
| Owner review | `PENDING` |
| Stack position / predecessor | `030` / T-020 |
| Branch / PR | `stack/030-firebase-email-password-login` / — |

## Outcome

A new or returning user can create or access a ThinkSo profile with Firebase email/password and receive a persisted ThinkSo session; retired identities are denied.

## Sources

- [Login BDD 1.1–1.7 and 1.12–1.13](../behavior/login-screen-bdd.md#11-display-login-mode)
- [Login UI — ThinkSo Access Form](<../../raw/designs/thinkso-login-email-password-2026-09-04/ThinkSo Access Form.dc.html>)
- [Create Account UI — ThinkSo Register](<../../raw/designs/thinkso-login-email-password-2026-09-04/ThinkSo Register.dc.html>) — omit the raw `Name for the record` field; public identity comes from Threads.
- [Firebase email/password setup](../operations/firebase-email-password-setup.md)
- [`POST /auth/login`](../api/api-specification.md#post-authlogin)
- [Users, identities, and sessions](../data/data-model-and-state-machines.md#users)

## Scope and work

- Login and Create Account presenter/UI, Firebase email/password adapter, loading/disabled/local-validation/generic-error behavior, placeholders, Firebase-token exchange, identity matching, profile creation/restoration, retired-profile rejection, session issuance, migrations, and tests.
- Registration proceeds directly from Firebase account creation to ThinkSo token exchange and the Threads gate. Email verification, verification-email/resend UI, and cross-device verification reconciliation are post-MVP known issues.
- The Register export's `Name for the record` field is preserved as evidence but is not implemented because public identity comes from Threads.

### Work breakdown

- [ ] **Mobile:** Login/Create Account presenters and forms, Firebase email/password effects, loading/error behavior, session receipt, and Threads-gate routing.
- [ ] **Backend:** Firebase ID-token validation, profile/identity/session persistence, retirement detection, and shared login endpoint.
- [ ] **Agent:** N/A.
- [ ] **Tests/CI:** presenter/component cases, Auth Emulator credential fakes, identity/link collisions, retired signals, API contracts, and migrations.
- [ ] **Wiki:** Firebase setup handoff and any emulator/live-smoke limitation.

## Human requirements

- Complete the owner checks in [Firebase email/password setup](../operations/firebase-email-password-setup.md) before live smoke testing. Deterministic Auth Emulator tests do not require production credentials.

## Acceptance and gates

- [ ] BDD 1.1–1.7 and 1.12–1.13 pass deterministically with Firebase email/password; no provider-button, display-name, or email-verification behavior is required for MVP.
- [ ] New registration exchanges the Firebase ID token exactly once, creates one incomplete profile, issues a ThinkSo session, and routes to Connect Threads.
- [ ] Repeated login reuses the active profile; identity collisions and retired signals follow the locked model.
- [ ] Access/refresh credentials and plaintext passwords are never logged or exposed to the UI model.
- [ ] Firebase Admin validation rejects malformed, expired, wrong-project, or retired identities.

## Activity log

Coordinator-only append-only entries go here.

## Observations and decisions

- Email confirmation is deferred from MVP; see [known issues](../product/known-issues.md).

## Final handoff

Delivered behavior, candidate SHA, PR, tests, migrations, provider evidence, and limitations go here.
