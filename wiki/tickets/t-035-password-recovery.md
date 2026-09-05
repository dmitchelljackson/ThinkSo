# T-035 — Recover a Firebase password

## Control

| Field | Value |
|---|---|
| Type / status | `PRODUCT` / `DRAFT` |
| Owner review | `PENDING` |
| Stack position / predecessor | `035` / T-030 |
| Branch / PR | `stack/035-password-recovery` / — |

## Outcome

A user who cannot remember a password can request Firebase recovery from ThinkSo, complete the hosted reset action, and return to Login without account-enumeration leaks or stale ThinkSo access.

## Sources

- [Login BDD 1.8–1.10](../behavior/login-screen-bdd.md#18-display-the-forgot-password-dialog)
- [Login UI — ThinkSo Access Form](<../../raw/designs/thinkso-login-email-password-2026-09-04/ThinkSo Access Form.dc.html>) — entry affordance; no standalone forgot-password dialog was exported, so the product uses a normal account-access dialog.
- [Firebase email/password setup](../operations/firebase-email-password-setup.md)
- [Mobile networking and session recovery](../architecture/mobile-networking.md)

## Scope and work

- Add the normal Forgot Password dialog to the account-access flow, with local email validation, one Firebase `sendPasswordResetEmail` request, neutral Check Your Email confirmation for known and unknown addresses, return-to-Login action, loading/disabled state, and recoverable retry behavior.
- Use Firebase's hosted action page for the MVP new-password form. Do not add a ThinkSo password-reset endpoint, token, or plaintext password handling.
- Reconcile Firebase refresh-token revocation with ThinkSo session-family invalidation before claiming the recovery slice complete; stale ThinkSo sessions must not remain usable after reset.

### Work breakdown

- [ ] **Mobile:** Forgot Password dialog, Firebase reset effect, validation/loading/error/neutral-confirmation states, and return-to-Login routing.
- [ ] **Backend:** validate post-reset Firebase session behavior and invalidate corresponding ThinkSo sessions when the reset revokes Firebase refresh tokens.
- [ ] **Agent:** N/A.
- [ ] **Tests/CI:** emulator reset requests for known/unknown emails, duplicate-submit prevention, expired/consumed link recovery, session invalidation, and no-secret logging checks.
- [ ] **Wiki:** record hosted-action and Firebase revocation evidence.

## Human requirements

None for deterministic emulator tests. A controlled live reset smoke test requires the owner checks in [Firebase email/password setup](../operations/firebase-email-password-setup.md).

## Acceptance and gates

- [ ] BDD 1.8–1.10 passes, including neutral confirmation and generic recoverable failure treatment.
- [ ] The dialog calls Firebase exactly once per submitted request and never sends reset tokens or passwords through ThinkSo.
- [ ] Known and unknown addresses produce indistinguishable user-facing confirmation.
- [ ] Valid hosted reset links update Firebase and return the user to Login; expired/consumed links can restart Forgot Password.
- [ ] Firebase reset revocation cannot leave an accepted stale ThinkSo session usable.

## Activity log

Coordinator-only append-only entries go here.

## Observations and decisions

- No dedicated forgot-password export was present in the 2026-09-04 design archive; normal dialog behavior is canonical in the Login BDD.

## Final handoff

Delivered behavior, candidate SHA, PR, tests, migrations, and limitations go here.
