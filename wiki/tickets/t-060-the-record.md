# T-060 — Browse The Record

## Control

| Field | Value |
|---|---|
| Type / status | `PRODUCT` / `DRAFT` |
| Owner review | `PENDING` |
| Stack position / predecessor | `060` / T-050 |
| Branch / PR | `stack/060-the-record` / — |

## Outcome

An active connected user lands on OPEN and browses one server-ordered, unpaginated OPEN/CLOSED Record response with correct empty/loading/error/refresh behavior.

## Sources

- [The Record BDD 3.1–3.20](../behavior/the-record-screen-bdd.md#31-display-the-record-with-open-challenges)
- [Record UI and card sources](../../SCREENS.md#3-main--the-record)
- [`GET /users/{user_id}/record`](../api/api-specification.md#get-usersuser_idrecord)
- [Contract state machine](../data/data-model-and-state-machines.md#contract-state-machine)

## Scope and work

- Authorized Record query/serializer with explicit ordering fields and seeded fixtures.
- Challenge Card variants, tabs, FAB/account navigation, empty/loading/error/retained refresh states, focus refresh, local tab switching and scroll retention.

### Work breakdown

- [ ] **Mobile:** Record repository/data definition/presenter/UI, cards, tabs, refresh/navigation states.
- [ ] **Backend:** authorized unpaginated Record query, canonical serializer, explicit ordering, seeds.
- [ ] **Agent:** N/A.
- [ ] **Tests/CI:** ordering/serialization/API, presenter/component/cache refresh, native screen evidence.
- [ ] **Wiki:** record any serializer/order or responsive-card decision.

## Human requirements

H-001/AutoMobile for native visual and interaction evidence.

## Acceptance and gates

- [ ] Every case 3.1–3.20 passes.
- [ ] One endpoint returns both collections; CLOSED hides when empty and OPEN always wins fresh entry.
- [ ] Client honors server ordering and does not infer lifecycle order.
- [ ] No pagination code or speculative headings are introduced.

## Activity log

Coordinator-only append-only entries go here.

## Observations and decisions

Pagination remains a documented future addition.

## Final handoff

Delivered behavior, candidate SHA, PR, tests, screenshots, and limitations go here.
