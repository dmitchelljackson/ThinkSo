# T-040 — Restore sessions and provide local-first sign-out

## Control

| Field | Value |
|---|---|
| Type / status | `PRODUCT` / `DRAFT` |
| Owner review | `PENDING` |
| Stack position / predecessor | `040` / T-030 |
| Branch / PR | `stack/040-session-recovery-and-account` / — |

## Outcome

ThinkSo restores and refreshes sessions across relaunches, protects navigation without flashing Login, and signs out the current device immediately even if server revocation fails.

## Sources

- [Login BDD 1.14–1.18](../behavior/login-screen-bdd.md#114-restore-valid-stored-session-credentials)
- [Account BDD 6.1–6.6](../behavior/account-screen-bdd.md#61-display-the-account-screen)
- [`POST /auth/refresh`, logout, and `/me`](../api/api-specification.md#post-authrefresh)
- [Mobile networking](../architecture/mobile-networking.md)

## Scope and work

- SecureStore access/refresh persistence, application session manager, coordinated refresh/replay, bootstrap routing, protected-link intent retention, Account shell, and local-first logout.
- Backend refresh rotation/grace, session revocation, `/me`, and tests for concurrency/response loss.

### Work breakdown

- [ ] **Mobile:** SecureStore/session manager, bootstrap/protected routing, Account shell, local-first logout.
- [ ] **Backend:** refresh rotation/family/grace, `/me`, session revocation.
- [ ] **Agent:** N/A.
- [ ] **Tests/CI:** refresh races/response loss, restoration, transport failure, logout interruption.
- [ ] **Wiki:** observed platform lifecycle behavior and recovery runbook.

## Human requirements

None beyond T-030 provider setup; deterministic tests use fake credentials.

## Acceptance and gates

- [ ] BDD 1.14–1.18 and 6.1–6.6 pass.
- [ ] Only terminal refresh rejection signs out; transport failures preserve credentials.
- [ ] Concurrent requests share one refresh and never fork the refresh family.
- [ ] Logout returns to Login before best-effort server revocation completes.

## Activity log

Coordinator-only append-only entries go here.

## Observations and decisions

Record platform SecureStore/relaunch evidence here.

## Final handoff

Delivered behavior, candidate SHA, PR, tests, migrations, and limitations go here.
