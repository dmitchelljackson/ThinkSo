# T-030 — Log in with Firebase email/password and issue ThinkSo sessions

## Control

| Field | Value |
|---|---|
| Type / status | `PRODUCT` / `READY_FOR_REVIEW` |
| Owner review | `VISUAL_APPROVED 2026-09-08` |
| Stack position / predecessor | `030` / T-020 |
| Branch / PR | `stack/030-firebase-email-password-login` / [#5](https://github.com/dmitchelljackson/ThinkSo/pull/5) |

## Outcome

A manually seeded Firebase email/password user can log in, create or restore the matching ThinkSo profile, and receive a persisted ThinkSo session; retired identities are denied. In-app Firebase account creation belongs to T-190.

## Sources

- [Login BDD 1.1–1.5 and login portions of 1.11–1.13](../behavior/login-screen-bdd.md#11-display-login-mode)
- [Login UI — ThinkSo Access Form](<../../raw/designs/thinkso-login-email-password-2026-09-04/ThinkSo Access Form.dc.html>)
- [Mobile visual QA workflow](../design/visual-qa-workflow.md)
- [Firebase email/password setup](../operations/firebase-email-password-setup.md)
- [`POST /auth/login`](../api/api-specification.md#post-authlogin)
- [Users, identities, and sessions](../data/data-model-and-state-machines.md#users)

## Scope and work

- Login presenter/UI, Firebase email/password sign-in adapter, loading/disabled/local-validation/generic-error behavior, placeholders, Firebase-token exchange, identity matching, profile creation/restoration, retired-profile rejection, session issuance, migrations, and tests.
- The Create Account affordance remains visible but shows the standard not-yet-implemented toast until T-190 supplies the dependent registration flow.
- Local Login QA manually seeds a Firebase Auth Emulator user, including its display name, before signing in through the app.

### Work breakdown

- [x] **Mobile:** Login presenter and form, Firebase email/password sign-in effect, loading/error behavior, session receipt, and Threads-gate routing.
- [x] **Backend:** Firebase ID-token validation, profile/identity/session persistence, retirement detection, and shared login endpoint.
- [x] **Agent:** N/A.
- [x] **Tests/CI:** presenter/component cases, Auth Emulator credential fakes, identity/link collisions, retired signals, API contracts, and migrations.
- [x] **Wiki:** Firebase setup handoff and any emulator/live-smoke limitation.

## Human requirements

- Complete the owner checks in [Firebase email/password setup](../operations/firebase-email-password-setup.md) before live smoke testing. Deterministic Auth Emulator tests do not require production credentials.

## Acceptance and gates

- [x] BDD 1.1–1.5 and the Login portions of 1.11–1.13 pass deterministically with Firebase email/password; no provider-button behavior is required.
- [x] First login by a manually seeded Firebase user exchanges the Firebase ID token exactly once, creates one incomplete ThinkSo profile, issues a session, and routes to Connect Threads.
- [x] Repeated login reuses the active profile; identity collisions and retired signals follow the locked model.
- [x] Access/refresh credentials and plaintext passwords are never logged or exposed to the UI model.
- [x] Firebase Admin validation rejects malformed, expired, wrong-project, or retired identities.
- [x] The Expo Web Login render is compared side by side with its authoritative export at matching phone viewports and material mismatches are repaired.
- [x] The repaired candidate is captured on Android and iOS and compared side by side with the same source designs.

## Activity log

`2026-09-05 | OWNER | AUTHORIZED | 6ee8a4f | Authorized implementation after merging T-020.`

`2026-09-05 | COORDINATOR | DISPATCHED | 6ee8a4f | Created stack/030-firebase-email-password-login from updated main. Implement T-030 without pulling password recovery or general session restoration forward.`

`2026-09-06 | IMPLEMENTER | CANDIDATE_READY | pending coordinator commit | Added Firebase email/password account access, opaque ThinkSo session issuance and secure storage, identity/retirement persistence, generated API contracts, and deterministic emulator coverage.`

`2026-09-06 | UI_VERIFIER | PASS | pending coordinator commit | Native registration completed on ThinkSo-iPhone-17 and ThinkSo_API_36 through Firebase Auth Emulator, FastAPI, and Postgres; each created one profile/session and routed directly to Connect Threads.`

`2026-09-06 | COORDINATOR | VERIFYING | pending coordinator commit | Mobile/unit/backend/integration/container/hygiene/link gates pass. Final generated-contract drift and GitHub Actions evidence follow the candidate commit.`

`2026-09-06 | COORDINATOR | STACK_SUBMITTED | 3ab5dee | Published review-ready PR #5 against main with the required ticket-prefixed title; GitHub Actions started.`

`2026-09-06 | COORDINATOR | CHECKS_PASS | b0dc1c5 | Every GitHub Actions job passed: mobile, backend, Postgres/Firebase integration, generated OpenAPI drift, container build, and repository hygiene.`

`2026-09-06 | OWNER | FINDING | ee0a67f | UI-001: Login designs do not visually match the authoritative exports. Reopened T-030 for the mandatory Expo Web comparison loop and final Android/iOS side-by-side verification.`

`2026-09-06 | IMPLEMENTER | FIXED | pending coordinator commit | Rebuilt Login and Create Account around the authoritative exported compositions, retained the locked email/password and action behavior, and removed idle-screen scrolling on ordinary phone heights.`

`2026-09-06 | UI_VERIFIER | PASS | pending coordinator commit | Expo Web was compared at the source viewport; Android API 36 and iOS 26.5 rendered the repaired Login and Create Account layouts. AutoMobile swipe checks left every element at the same bounds on both idle screens.`

`2026-09-08 | OWNER | FINDING | pending coordinator commit | Requested a smaller centered no-backing-out annotation, word-centered underline marks, a compact legal footer, and an inset red document margin that does not shift content.`

`2026-09-08 | IMPLEMENTER | FIXED | pending coordinator commit | Applied the four visual corrections, checked small/medium/large Expo Web renders, and verified the hot-reloaded Login screen on Android and iOS.`

`2026-09-08 | OWNER | VISUAL_APPROVED | pending coordinator commit | Approved the final Account Access presentation after review on large iOS and true Small Phone Android form factors.`

`2026-09-08 | IMPLEMENTER | FIXED | pending coordinator commit | Added the global non-retryable NOT YET IMPLEMENTED toast for Forgot Password, Terms, and Privacy; focused presenter/UI tests and live Android verification pass.`

`2026-10-01 | OWNER | AUTHORIZED_SPLIT | 91ef9b5 | Kept Login in T-030 and moved in-app Create Account to new dependent ticket T-190; Login QA manually seeds its Firebase Auth Emulator user.`

`2026-10-01 | COORDINATOR | CANDIDATE_SPLIT | pending commit | Removed registration behavior from the T-030 candidate, retained the visible Create Account affordance as a placeholder, and aligned the local Firebase project and Emulator UI for manual Login QA.`

## Observations and decisions

- Email confirmation is deferred from MVP; see [known issues](../product/known-issues.md).
- **LOCKED 2026-10-01:** Create Account is a separate dependent slice, T-190. T-030 uses a manually seeded Auth Emulator account for Login verification.
- **DERIVED:** Firebase revocation uses a five-minute per-user Admin epoch check. This slice persists and tests the required timestamps/policy; T-040 implements authenticated-request enforcement.
- Firebase Auth state is memory-only; ThinkSo's access and rotating refresh credentials are the sole persisted device session. T-040 owns restore, refresh, and local-first logout.
- Forgot Password, Terms, and Privacy remain deferred in this slice, but each responds with the global non-retryable `NOT YET IMPLEMENTED` toast instead of silently doing nothing. T-035 replaces the Forgot Password placeholder with its dialog and Firebase recovery behavior.
- Login remains fixed when its content fits. Compact screens may scroll when needed; Android uses keyboard pan so focusing an input does not remount or dismiss it.

## Handoff

- **Delivered:** native Login, Firebase sign-in, `POST /v1/auth/login`, identity/session tables, secure token storage, and Threads-gate routing. T-190 owns in-app account creation.
- **Candidate / PR:** current branch tip; [PR #5](https://github.com/dmitchelljackson/ThinkSo/pull/5).
- **Evidence:** mobile and API-client tests; Python unit/integration and Firebase emulator contract tests; responsive Expo Web comparison; native Android Small Phone and large iOS Login checks; container, hygiene, documentation-link, generated-contract, and GitHub Actions checks.
- **Limitations:** email verification and password recovery are deferred; T-040 supplies session restoration/rotation and request-time Firebase revocation enforcement; production Firebase smoke testing remains owner-controlled.

UI-001 is resolved and the owner approved the repaired visual candidate.
