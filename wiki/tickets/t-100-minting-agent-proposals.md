# T-100 — Mint researched immutable proposals

## Control

| Field | Value |
|---|---|
| Type / status | `PRODUCT` / `DRAFT` |
| Owner review | `PENDING` |
| Stack position / predecessor | `100` / T-090 |
| Branch / PR | `stack/100-minting-agent-proposals` / — |

## Outcome

The minting agent turns a conversation into one or more persisted, objectively judgeable, safely worded Contract proposals with explicit timing, sources, terms, participants, handles, and exact losing posts.

## Sources

- [Minting Agent BDD 7.1–7.33](../behavior/minting-agent-bdd.md#71-begin-every-chat-with-the-canonical-persisted-greeting)
- [Create proposal UI cases 5.16–5.18](../behavior/create-challenge-screen-bdd.md#516-show-a-persisted-proposal-inline)
- [Agent architecture](../architecture/agent-architecture.md)
- [Canonical Contract schema](../api/api-specification.md#contract)

## Scope and work

- PydanticAI minting agent, versioned prompt, OpenRouter fixed-model adapter, web-research port, typed proposal tool, deterministic schema/timing/safety validation, proposal persistence, inline UI, revisions as new IDs, safe traces, and regression fixtures.

### Work breakdown

- [ ] **Mobile:** proposal domain/UI models, inline cards/actions, revision selection while turns run.
- [ ] **Backend:** proposal validation/persistence, immutable IDs, safe trace/version/cost records.
- [ ] **Agent:** prompt, PydanticAI runner, web research, typed proposal tool, refusal/focus behavior.
- [ ] **Tests/CI:** fake-model/tool/schema/date/safety tests plus bounded live regression cases.
- [ ] **Wiki:** prompt/tool versions, observed failures, eval corpus links, and cost evidence.

## Human requirements

- Batch B OpenRouter key placement and spend guard for live smoke tests. Owner exemption is deployment configuration and never hardcoded.

## Acceptance and gates

- [ ] Every Minting Agent case 7.1–7.33 and UI cases 5.16–5.18 pass.
- [ ] Tool calls fail invalid accept/judgment windows; no hidden timing fallback exists.
- [ ] Official resolution terms control future judging and include evidence hierarchy/quorum.
- [ ] Safety allows ordinary profanity/name-calling while refusing the documented crossed-line cases.
- [ ] Deterministic fake-model tests pass; bounded live cases record model/prompt/provider/cost metadata.

## Activity log

Coordinator-only append-only entries go here.

## Observations and decisions

Actual failures become small permanent regression cases; APO remains deferred.

## Final handoff

Delivered behavior, candidate SHA, PR, eval evidence, cost evidence, and limitations go here.
