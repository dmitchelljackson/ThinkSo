# T-120 — Accept a Contract exactly once

## Control

| Field | Value |
|---|---|
| Type / status | `PRODUCT` / `DRAFT` |
| Owner review | `PENDING` |
| Stack position / predecessor | `120` / T-110 |
| Branch / PR | `stack/120-contract-acceptance` / — |

## Outcome

An eligible noncreator confirms acceptance on the Contract screen; exactly one racer becomes the challenger and all clients converge on server truth.

## Sources

- [Contract BDD 4.10–4.15](../behavior/challenge-contract-screen-bdd.md#410-confirm-acceptance-before-submitting)
- [Recipient dialog UI](<../../raw/designs/thinkso-claude-export/Dialog Recipient.dc.html>)
- [`POST /contracts/{contract_id}/accept`](../api/api-specification.md#post-contractscontract_idaccept)
- [Notification behavior deferred to T-160](../behavior/notifications-bdd.md#913-notify-the-creator-when-a-contract-is-accepted)

## Scope and work

- Acceptance dialog/loading/error, row-lock or conditional-update race, recipient handle/name capture, self-acceptance prohibition, conflict reconciliation, and Record/Contract cache updates. Acceptance push delivery is deliberately deferred to T-160.

### Work breakdown

- [ ] **Mobile:** acceptance dialog/presenter, conflict/error reconciliation, cache invalidation and navigation.
- [ ] **Backend:** atomic acceptance transition and participant identity capture; expose a stable accepted-domain event seam without configuring push.
- [ ] **Agent:** N/A.
- [ ] **Tests/CI:** concurrent accept/self-accept/API cases and UI loading/error/reconciliation.
- [ ] **Wiki:** race evidence and any provider/test-identity constraints.

## Human requirements

- Two active test profiles/Threads identities for live acceptance. Push credentials are not required.

## Acceptance and gates

- [ ] Contract cases 4.10–4.15 pass; notification cases remain owned by T-160.
- [ ] Concurrent acceptance has exactly one winner and no partial participant state.
- [ ] REJECT remains local navigation and writes no declined state.
- [ ] The acceptance transition exposes the stable event T-160 will consume without coupling this ticket to Expo.

## Activity log

Coordinator-only append-only entries go here.

## Observations and decisions

Invite rejection/late acceptance remains a V2 product case. Acceptance notifications are intentionally delayed to T-160.

## Final handoff

Delivered behavior, candidate SHA, PR, race tests, push evidence, and limitations go here.
