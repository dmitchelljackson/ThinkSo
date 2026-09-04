# T-130 — Judge due Contracts from public evidence

## Control

| Field | Value |
|---|---|
| Type / status | `PRODUCT` / `DRAFT` |
| Owner review | `PENDING` |
| Stack position / predecessor | `130` / T-120 |
| Branch / PR | `stack/130-judging` / — |

## Outcome

Due accepted Contracts are claimed idempotently, researched against their immutable official terms, retried within their window, and finalized as POSTING or UNRESOLVED with a concise reproducible public explanation.

## Sources

- [Judging Agent BDD 8.1–8.31](../behavior/judging-agent-bdd.md#81-do-not-judge-before-first-judgment)
- [Judge internal operation](../api/api-specification.md#judge-command-not-a-public-http-endpoint)
- [Verdicts and attempts](../data/data-model-and-state-machines.md#verdicts-and-judge_attempts)
- [Agent judging safeguards](../architecture/agent-architecture.md#judging-safeguards)

## Scope and work

- Due query/claim, scheduler command, PydanticAI judge, research/terms enforcement, source quorum, eight-attempt schedule, retry classification, verdict/attempt persistence, $1 Contract spend pause seam, POSTING/UNRESOLVED transitions, safe evidence Markdown, and overlap/race tests.

### Work breakdown

- [ ] **Mobile:** connect live POSTING/UNRESOLVED data to existing Contract/Record renderers.
- [ ] **Backend:** scheduling/claims/attempts/verdict transitions, spend pause/resume and persistence.
- [ ] **Agent:** judge prompt, research and typed verdict tool enforcing immutable terms/quorum.
- [ ] **Tests/CI:** due windows, eight-slot schedule, source disagreement, overlap/idempotency, historical live cases.
- [ ] **Wiki:** attempt/version metadata, operator pause procedure, and observed judging failures.

## Human requirements

- OpenRouter key/spend guard for bounded live historical smoke cases; scheduling remains local/manual until deployment.

## Acceptance and gates

- [ ] Every case 8.1–8.31 passes.
- [ ] No judgment begins early, exceeds eight substantive attempts, or resolves contrary to terms/quorum.
- [ ] Duplicate workers create at most one final verdict/publication work item.
- [ ] Budget pause is operator-visible and never mislabeled as evidence-based UNRESOLVED.

## Activity log

Coordinator-only append-only entries go here.

## Observations and decisions

Appeals and user overrides remain V2.

## Final handoff

Delivered behavior, candidate SHA, PR, evidence cases, race/cost tests, and limitations go here.
