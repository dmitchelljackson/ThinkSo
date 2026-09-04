# T-110 — Confirm, send, and share a Contract

## Control

| Field | Value |
|---|---|
| Type / status | `PRODUCT` / `DRAFT` |
| Owner review | `PENDING` |
| Stack position / predecessor | `110` / T-100 |
| Branch / PR | `stack/110-send-and-share` / — |

## Outcome

The creator selects any retained proposal, confirms it, atomically sends that immutable Contract, and receives the native share sheet before returning to its sent Contract.

## Sources

- [Create BDD 5.19–5.22](../behavior/create-challenge-screen-bdd.md#519-open-the-creator-confirmation-for-the-selected-proposal)
- [Creator dialog UI](<../../raw/designs/thinkso-claude-export/Dialog Creator.dc.html>)
- [`POST /contracts/{contract_id}/send`](../api/api-specification.md#post-contractscontract_idsend)
- [Contract transitions](../data/data-model-and-state-machines.md#contract-state-machine)

## Scope and work

- Creator confirmation/loading/retry, atomic proposal-to-SENT transition, active-turn termination, protected invite URL, native share port/adapter, same-screen sent state, and tests.

### Work breakdown

- [ ] **Mobile:** selected-proposal confirmation, loading/retry, sent UI, native share effect.
- [ ] **Backend:** authorized idempotent send transition and active-turn termination.
- [ ] **Agent:** stop/suppress further minting output after send.
- [ ] **Tests/CI:** selection/race/API, presenter/dialog/share adapter, late-output suppression.
- [ ] **Wiki:** invite-link configuration and share-platform observations.

## Human requirements

None; temporary app-scheme invite links may be used before a production domain exists.

## Acceptance and gates

- [ ] UI cases 5.19–5.22 pass.
- [ ] Selecting an older proposal sends that exact immutable ID.
- [ ] Repeated send is idempotent and cannot fork Contract terms.
- [ ] Share dismissal remains on the SENT Contract; there is no success screen.

## Activity log

Coordinator-only append-only entries go here.

## Observations and decisions

Production universal-link/domain work remains deferred.

## Final handoff

Delivered behavior, candidate SHA, PR, tests, share evidence, and limitations go here.
