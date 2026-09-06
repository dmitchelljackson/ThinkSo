# T-030 — Authenticate with Firebase email/password and issue ThinkSo sessions

## Control

| Field | Value |
|---|---|
| Type / status | `PRODUCT` / `VERIFYING` |
| Owner review | `AUTHORIZED 2026-09-05` |
| Stack position / predecessor | `030` / T-020 |
| Branch / PR | `stack/030-firebase-email-password-login` / [#5](https://github.com/dmitchelljackson/ThinkSo/pull/5) |

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

- [x] **Mobile:** Login/Create Account presenters and forms, Firebase email/password effects, loading/error behavior, session receipt, and Threads-gate routing.
- [x] **Backend:** Firebase ID-token validation, profile/identity/session persistence, retirement detection, and shared login endpoint.
- [x] **Agent:** N/A.
- [x] **Tests/CI:** presenter/component cases, Auth Emulator credential fakes, identity/link collisions, retired signals, API contracts, and migrations.
- [x] **Wiki:** Firebase setup handoff and any emulator/live-smoke limitation.

## Human requirements

- Complete the owner checks in [Firebase email/password setup](../operations/firebase-email-password-setup.md) before live smoke testing. Deterministic Auth Emulator tests do not require production credentials.

## Acceptance and gates

- [x] BDD 1.1–1.7 and 1.12–1.13 pass deterministically with Firebase email/password; no provider-button, display-name, or email-verification behavior is required for MVP.
- [x] New registration exchanges the Firebase ID token exactly once, creates one incomplete profile, issues a ThinkSo session, and routes to Connect Threads.
- [x] Repeated login reuses the active profile; identity collisions and retired signals follow the locked model.
- [x] Access/refresh credentials and plaintext passwords are never logged or exposed to the UI model.
- [x] Firebase Admin validation rejects malformed, expired, wrong-project, or retired identities.

## Activity log

`2026-09-05 | OWNER | AUTHORIZED | 6ee8a4f | Authorized implementation after merging T-020.`

`2026-09-05 | COORDINATOR | DISPATCHED | 6ee8a4f | Created stack/030-firebase-email-password-login from updated main. Implement T-030 without pulling password recovery or general session restoration forward.`

`2026-09-06 | IMPLEMENTER | CANDIDATE_READY | pending coordinator commit | Added Firebase email/password account access, opaque ThinkSo session issuance and secure storage, identity/retirement persistence, generated API contracts, and deterministic emulator coverage.`

`2026-09-06 | UI_VERIFIER | PASS | pending coordinator commit | Native registration completed on ThinkSo-iPhone-17 and ThinkSo_API_36 through Firebase Auth Emulator, FastAPI, and Postgres; each created one profile/session and routed directly to Connect Threads.`

`2026-09-06 | COORDINATOR | VERIFYING | pending coordinator commit | Mobile/unit/backend/integration/container/hygiene/link gates pass. Final generated-contract drift and GitHub Actions evidence follow the candidate commit.`

`2026-09-06 | COORDINATOR | STACK_SUBMITTED | 3ab5dee | Published review-ready PR #5 against main with the required ticket-prefixed title; GitHub Actions started.`

## Observations and decisions

- Email confirmation is deferred from MVP; see [known issues](../product/known-issues.md).
- **DERIVED:** Firebase revocation uses a five-minute per-user Admin epoch check. This slice persists and tests the required timestamps/policy; T-040 implements authenticated-request enforcement.
- Firebase Auth state is memory-only; ThinkSo's access and rotating refresh credentials are the sole persisted device session. T-040 owns restore, refresh, and local-first logout.
- Forgot Password remains an inert Login affordance in this slice. T-035 supplies its dialog and Firebase recovery behavior.

## Final handoff

- **Delivered:** native Login/Create Account, Firebase credential effects, `POST /v1/auth/login`, identity/session tables, secure token storage, and Threads-gate routing.
- **Candidate / PR:** implementation candidate `3ab5dee`; [PR #5](https://github.com/dmitchelljackson/ThinkSo/pull/5).
- **Evidence:** 45 mobile tests plus API-client tests; Python unit/integration and Firebase emulator contract tests; Android and iOS native registration smokes; container, hygiene, and documentation-link checks.
- **Limitations:** email verification and password recovery are deferred; T-040 supplies session restoration/rotation and request-time Firebase revocation enforcement; production Firebase smoke testing remains owner-controlled.
