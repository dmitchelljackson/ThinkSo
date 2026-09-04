# T-NNN — Short full-stack outcome

## Control

| Field | Value |
|---|---|
| Type | `PRODUCT` or `ENABLING` |
| Status | `DRAFT` |
| Owner review | `PENDING`, `APPROVED`, or `CHANGES_REQUESTED` |
| Stack position | `NNN` |
| Native stack number | — |
| Predecessor ticket | `T-NNN` or `main` |
| Base branch/SHA | — |
| Branch | `stack/NNN-short-name` |
| Candidate SHA | — |
| Pull request | — |
| Coordinator | — |

## Outcome

One observable sentence describing what becomes true when this merges.

## Scope

### Included

- Explicit behavior delivered by this ticket.

### Excluded

- Nearby behavior intentionally owned by another ticket or deferred decision.

## Authoritative sources

### BDD cases

- `Section N, case N.N` — replace this line with a direct link to the canonical BDD heading.

### Design and screen evidence

- Link exact screen/component export used as visual evidence.

### API, data, and architecture

- Link exact relevant API/data/architecture sections.

## Dependencies

- Prior ticket or technical prerequisite.

## Human requirements

Write `None` or add one block per prerequisite:

### STOP: HUMAN REQUIRED — H-NNN short action

- **Needed by:** exact step that cannot continue.
- **Agent prework completed:** safe preparatory work already done.
- **Human action:** one concrete action or decision.
- **Do not provide:** passwords, two-factor codes, recovery data, or raw secrets in chat/wiki.
- **Unblock evidence:** non-secret confirmation or identifier the coordinator needs.

## Acceptance criteria

- [ ] Concrete ticket-level result mapped to the linked BDD.
- [ ] Material failure/recovery behavior works.
- [ ] Server state remains authoritative where required.
- [ ] Affected wiki/API/data documentation matches implementation.

Only the product owner may change locked acceptance behavior. Workers may propose a clarification in activity but cannot weaken this section to pass a gate.

## Full-stack work

### Mobile

- [ ] UI/presenter/data/adapters or `N/A — reason`.

### Backend and data

- [ ] HTTP/application/domain/persistence/jobs/migrations or `N/A — reason`.

### Agent runtime

- [ ] Prompt/tools/model behavior/evals or `N/A — reason`.

### Tests

- [ ] Unit tests written with implementation.
- [ ] Required API/integration/race tests.

### Documentation and operations

- [ ] Canonical wiki pages and configuration/runbooks updated.

## Verification gates

| Gate | State | Candidate | Evidence |
|---|---|---|---|
| Local required checks | `NOT_STARTED` | — | — |
| GitHub Actions | `NOT_STARTED` | — | — |
| Independent code review | `NOT_STARTED` | — | — |
| AutoMobile UI verification | `NOT_STARTED` or `N/A` | — | — |
| Documentation/public-content audit | `NOT_STARTED` | — | — |

Allowed gate states are `NOT_STARTED`, `RUNNING`, `PASS`, `FAIL`, `STALE`, and `N/A`. Any candidate code change makes prior affected evidence `STALE`.

## Dispatch packet

- **Role prompt:** —
- **Allowed write scope:** —
- **Base/branch/candidate:** —
- **Required commands:** —
- **Required scenarios/evidence:** —
- **Satisfied human prerequisites:** —

The coordinator refreshes this block before each dispatch. Workers reread the canonical ticket rather than relying on old chat context. The coordinator owns all Git/GitHub mutation and ticket writes; implementers return uncommitted changes, while reviewers and UI verifiers remain read-only.

## Activity log

Coordinator-only, append-only format:

```text
YYYY-MM-DD HH:MMZ | ROLE | EVENT | candidate SHA or — | Message with CR-NNN/UI-NNN references
```

Suggested events: `DISPATCHED`, `CANDIDATE_READY`, `STACK_SUBMITTED`, `CHECKS_PASS`, `FINDING`, `FIXED`, `VERIFIED`, `BLOCKED_HUMAN`, `UNBLOCKED`, `RESTACKED`, `STACK_SYNCED`, `STACKED`, `MERGED`.

## Observations

Durable ticket-specific facts discovered during implementation. The coordinator promotes broadly reusable facts into canonical architecture/product pages.

## Ticket decisions

Decisions that affect this ticket without silently changing locked product behavior. Include date, decision owner, and rationale.

## Final handoff

- **Delivered behavior:** —
- **PR and final candidate:** —
- **Tests/evidence:** —
- **Migrations/operations:** —
- **Known limitations linked elsewhere:** —
