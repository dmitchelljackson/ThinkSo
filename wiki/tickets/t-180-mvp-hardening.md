# T-180 — Exercise and harden the assembled MVP

## Control

| Field | Value |
|---|---|
| Type / status | `PRODUCT` / `DRAFT` |
| Owner review | `PENDING` |
| Stack position / predecessor | `180` / T-170 |
| Branch / PR | `stack/180-mvp-hardening` / — |

## Outcome

The assembled Android-first MVP survives automated end-to-end, race, reconnect, migration, privacy, safety, and operator-recovery tests without expanding deferred release scope.

## Sources

- [Vertical slice Phase 12](../delivery/vertical-slice-plan.md#phase-12--hardening-and-release)
- [Testing standard](../architecture/engineering-conventions.md#testing-standard)
- [Known issues](../product/known-issues.md)
- [Human readiness/deferred gates](../operations/autonomous-build-readiness.md#later-human-gates--not-required-to-start-or-finish-the-local-android-first-demo)

## Scope and work

- Separate nightly Android E2E suite, complete two-user happy path, material recovery paths, SSE/race torture tests, clean migration rehearsal, secret/privacy audit, minting safety regression corpus, judge budget operator path, and local runbook.
- Deployment, paid Apple capabilities, hosted iOS, production domain, and store submission remain excluded unless separately approved.

### Work breakdown

- [ ] **Mobile:** nightly Android E2E paths, lifecycle/network stress, final responsive/animation review.
- [ ] **Backend:** clean migration/recovery/race/security/observability checks and operator commands.
- [ ] **Agent:** safety/judging regression corpus, spend-pause recovery, reproducibility audit.
- [ ] **Tests/CI:** separate E2E suite and full assembled-system evidence; no replacement for unit gates.
- [ ] **Wiki:** final local runbook, known limitations, optional deployment/Apple prerequisites.

## Human requirements

- Local Android emulator/AutoMobile, disposable provider test identities, and one final interactive review pass.
- Railway/domain/paid Apple remain optional deferred gates, not hidden blockers.

## Acceptance and gates

- [ ] Critical E2E behavior intentionally overlaps unit-tested paths in its separate suite.
- [ ] Clean environment completes migrations and full two-user Contract lifecycle.
- [ ] No unresolved high-severity security/privacy finding remains.
- [ ] Safety boundary and judgment recovery regression suites pass.
- [ ] Operator runbook explains local start, verification, recovery, and optional deployment prerequisites.

## Activity log

Coordinator-only append-only entries go here.

## Observations and decisions

Release/deployment authorization is not implied by this ticket.

## Final handoff

Delivered behavior, candidate SHA, PR, E2E evidence, audit findings, and limitations go here.
