# T-070 — Read protected Contract lifecycle views

## Control

| Field | Value |
|---|---|
| Type / status | `PRODUCT` / `DRAFT` |
| Owner review | `PENDING` |
| Stack position / predecessor | `070` / T-060 |
| Branch / PR | `stack/070-contract-read` / — |

## Outcome

Any active connected platform member can open a protected Contract and see the canonical structure and correct lifecycle variant, while unauthenticated deep links resume after platform gates.

## Sources

- [Contract BDD read/display cases](../behavior/challenge-contract-screen-bdd.md#41-gate-contract-access-behind-platform-membership)
- [Contract UI sources](../../SCREENS.md#4-challenge-contract)
- [`GET /contracts/{contract_id}`](../api/api-specification.md#get-contractscontract_id)
- [Canonical Contract schema](../api/api-specification.md#contract)

## Scope and work

- Authorized Contract read, canonical DTO/domain/UI mapping, cached refresh, protected deep-link intent, back/link behavior, responsive shared contract composition, and fixture-rendered SENT/ACCEPTED/JUDGING/POSTING/RESOLVED/EXPIRED/UNRESOLVED/VOIDED states.
- Recipient acceptance mutation is excluded to T-120; later tickets connect real judgment/publication state changes to these already-tested renderers.

### Work breakdown

- [ ] **Mobile:** Contract repository/data definition/presenter/UI, all fixture variants, links/navigation/refresh.
- [ ] **Backend:** authorized canonical Contract read and participant/public references.
- [ ] **Agent:** N/A.
- [ ] **Tests/CI:** serializer/API authorization, DTO/domain/UI mappings, variants, deep-link gates, native evidence.
- [ ] **Wiki:** lifecycle rendering decisions and fixture integration notes.

## Human requirements

H-001/AutoMobile for native variants and transition-animation evidence.

## Acceptance and gates

- [ ] BDD 4.1–4.9 and 4.16–4.28 pass for reads/rendering/navigation.
- [ ] Contract content is hidden until Login and Threads gates succeed, but any active member may read afterward.
- [ ] EXPIRED/VOIDED are labels; UNRESOLVED shows explanation only when supplied.
- [ ] Defined refreshes animate modestly; no polling is invented.

## Activity log

Coordinator-only append-only entries go here.

## Observations and decisions

Record fixture-to-real-state integration findings here.

## Final handoff

Delivered behavior, candidate SHA, PR, API tests, screenshots, and limitations go here.
