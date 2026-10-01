# T-190 — Create a Firebase-backed ThinkSo account

## Control

| Field | Value |
|---|---|
| Type / status | `PRODUCT` / `CHANGES_REQUESTED` |
| Owner review | `VISUAL_APPROVED 2026-09-08 AS COMBINED FLOW` |
| Stack position / predecessor | `031` / T-030 |
| Branch / PR | `stack/190-firebase-create-account` / pending |

## Outcome

A person without an account can enter Create Account from Login, create a Firebase email/password identity with an independent `Name for the record`, receive a ThinkSo session, and continue to Connect Threads.

## Sources

- [Login BDD 1.6–1.7 and registration portions of 1.11–1.13](../behavior/login-screen-bdd.md#16-enter-create-account-mode)
- [Create Account UI — ThinkSo Register](<../../raw/designs/thinkso-login-email-password-2026-09-04/ThinkSo Register.dc.html>)
- [Mobile visual QA workflow](../design/visual-qa-workflow.md)
- [Firebase email/password setup](../operations/firebase-email-password-setup.md)
- T-030's [`POST /auth/login`](../api/api-specification.md#post-authlogin) and identity/session persistence

## Scope and work

- Add the dependent Create Account mode, required `Name for the record`, local validation, Firebase account creation/profile update, fresh ID-token acquisition, and exchange through the T-030 login/session boundary.
- Make account creation restart-safe: a Firebase identity created before a later step fails must be resumable without trapping the email behind `email-already-in-use`.
- Preserve the approved responsive Create Account composition and route successful creation directly to Connect Threads.
- Email confirmation, verification-email/resend UI, and cross-device verification reconciliation remain post-MVP known issues.

### Work breakdown

- [x] **Mobile:** Create Account presentation, validation, Firebase registration adapter, loading/error behavior, session receipt, and Threads-gate routing exist in the extracted candidate.
- [x] **Backend:** reuse T-030 token exchange, profile creation, retirement detection, and session issuance.
- [x] **Agent:** N/A.
- [ ] **Tests/CI:** retain registration presenter/component/emulator coverage and add restart-safe partial-failure coverage.
- [x] **Wiki:** record independent display-name behavior and the split from T-030.

## Human requirements

None for deterministic Firebase Auth Emulator testing. A controlled live registration smoke test still requires the owner checks in [Firebase email/password setup](../operations/firebase-email-password-setup.md).

## Acceptance and gates

- [x] BDD 1.6–1.7 and the registration portions of 1.11–1.13 are represented by the extracted implementation.
- [x] Create Account requires a normalized `Name for the record`, valid email, and Firebase-accepted password.
- [x] Successful registration stores the display name in Firebase, obtains a fresh ID token, creates exactly one ThinkSo profile, issues a session, and routes to Connect Threads.
- [ ] Registration resumes safely after Firebase account creation succeeds but profile update, token acquisition, ThinkSo exchange, or secure session storage fails.
- [x] The approved Create Account design remains responsive and scrolls only when the compact viewport requires it.

## Activity log

`2026-10-01 | OWNER | AUTHORIZED_SPLIT | 91ef9b5 | Split in-app Create Account from T-030 so Login can be reviewed and merged independently; existing ticket numbers remain unchanged.`

`2026-10-01 | COORDINATOR | CANDIDATE_EXTRACTED | 9b1be8e | Preserved the existing Create Account implementation on a branch stacked directly above the login-only T-030 candidate.`

`2026-10-01 | CODE_REVIEWER | CHANGES_REQUESTED | 9b1be8e | CR-001 blocks completion: registration must resume safely when Firebase identity creation succeeds before a later profile, token, exchange, or storage step fails.`

## Observations and decisions

- **LOCKED:** T-190 depends on T-030; it does not duplicate the backend login/session boundary.
- Reviewer finding CR-001 belongs here and blocks completion until registration is restart-safe.
- Reviewer finding CR-007 crosses both slices: T-030 must preserve a completed Firebase sign-in across exchange/storage failures, and T-190 must do the same after registration.

## Final handoff

Delivered behavior, candidate SHA, PR, tests, native verification, and remaining limitations go here.
