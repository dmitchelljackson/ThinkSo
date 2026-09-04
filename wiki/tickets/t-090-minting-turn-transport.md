# T-090 — Stream, stop, retry, and budget minting turns

## Control

| Field | Value |
|---|---|
| Type / status | `PRODUCT` / `DRAFT` |
| Owner review | `PENDING` |
| Stack position / predecessor | `090` / T-080 |
| Branch / PR | `stack/090-minting-turn-transport` / — |

## Outcome

A user can submit exactly one active minting turn, watch safe streamed activity, keep typing, stop/retry, reconnect without duplication, and receive the authoritative daily-budget outcome.

## Sources

- [Create BDD turn/connection/budget cases](../behavior/create-challenge-screen-bdd.md#58-submit-a-user-message-once)
- [Creation chat API](../api/api-specification.md#creation-chat)
- [Chat turn state](../data/data-model-and-state-machines.md#chat-turn-state)
- [Agent spend control](../architecture/agent-architecture.md#spend-control)

## Scope and work

- Message UUID idempotency, one-active-turn claim, durable job shell, SSE snapshot/live protocol, persisted safe output/activity, cancellation, retry, background completion, reconnect/reconciliation, usage ledger, and per-user UTC-day budget enforcement.
- Use a deterministic fake agent in this ticket; research/proposal intelligence belongs to T-100.

### Work breakdown

- [ ] **Mobile:** message/stream presenter, Stop/Submit, draft preservation, activity, scroll and reconnect UI.
- [ ] **Backend:** turn/message/job/SSE/cancel/retry/idempotency/usage operations and storage.
- [ ] **Agent:** deterministic fake runner behind the final execution port.
- [ ] **Tests/CI:** SSE protocol/reconnect, duplicate message/turn races, cancellation and budget accounting.
- [ ] **Wiki:** versioned event protocol, recovery behavior, and measured limits.

## Human requirements

No live OpenRouter key is required for deterministic completion; H-001 is required for final native streaming/scroll verification.

## Acceptance and gates

- [ ] BDD 5.8–5.15, 5.23–5.25, and 5.32–5.34 pass.
- [ ] Disconnect never cancels backend work; stop is explicit and late output is suppressed.
- [ ] Submit becomes Stop during work; drafts clear only after accepted submission.
- [ ] Daily remainder is enforced between provider steps and duplicate usage cannot be charged twice.

## Activity log

Coordinator-only append-only entries go here.

## Observations and decisions

Record SSE event/version changes and failure-recovery evidence here.

## Final handoff

Delivered behavior, candidate SHA, PR, protocol/tests, cost evidence, and limitations go here.
