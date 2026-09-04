# T-140 — Publish the losing consequence exactly once

## Control

| Field | Value |
|---|---|
| Type / status | `PRODUCT` / `DRAFT` |
| Owner review | `PENDING` |
| Stack position / predecessor | `140` / T-130 |
| Branch / PR | `stack/140-consequence-publication` / — |

## Outcome

The predetermined losing post is published to the losing participant's Threads account exactly once, with authorization-aware pause/resume, reconciliation, bounded retries, and a final Contract receipt or void.

## Sources

- [Consequence Publication BDD 10.1–10.25 except notification integration](../behavior/consequence-publication-bdd.md#101-create-durable-publication-work-with-the-verdict)
- [Publication worker operation](../api/api-specification.md#consequence-publication-worker-not-a-public-http-endpoint)
- [Consequence delivery state](../data/data-model-and-state-machines.md#consequence-delivery-state)
- [Contract POSTING/RESOLVED/VOIDED cases](../behavior/challenge-contract-screen-bdd.md#418-display-a-final-verdict-while-posting)

## Scope and work

- Destination selection, exact-text Threads adapter, work claim/idempotency, recent-post reconciliation, retry schedule/cap, authorization pause/reconnect resume, provider receipt, POSTING → RESOLVED/VOIDED, private attempts, and Contract receipt updates.

### Work breakdown

- [ ] **Mobile:** live pending/receipt/void updates and evidence/Threads-link opening.
- [ ] **Backend:** publication state machine, worker claims/retries/reconciliation/receipts and reconnect resume.
- [ ] **Agent:** N/A; deterministic application code selects and posts the approved consequence.
- [ ] **Tests/CI:** crash/timeout/duplicate/revocation/permanent-failure paths plus bounded live Threads smoke.
- [ ] **Wiki:** provider behavior, retry schedule, reconciliation evidence and limitations.

## Human requirements

- Live Threads test accounts with publishing scope and permission to create test posts.

## Acceptance and gates

- [ ] Cases 10.1–10.4 and 10.6–10.25 pass; case 10.5 push integration is completed in T-160.
- [ ] Ambiguous timeout reconciles before any repost; duplicates are prevented across crashes.
- [ ] Revocation pauses without rerunning judgment and resumes only after reconnect.
- [ ] Exhausted/permanent failure voids delivery without erasing the final verdict.

## Activity log

Coordinator-only append-only entries go here.

## Observations and decisions

Record Meta retry/reconciliation constraints here; do not expose them publicly.

## Final handoff

Delivered behavior, candidate SHA, PR, idempotency tests, live evidence, and limitations go here.
