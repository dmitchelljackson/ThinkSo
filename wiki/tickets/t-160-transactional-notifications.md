# T-160 — Deliver acceptance and judgment notifications

## Control

| Field | Value |
|---|---|
| Type / status | `PRODUCT` / `DRAFT` |
| Owner review | `PENDING` |
| Stack position / predecessor | `160` / T-150 |
| Branch / PR | `stack/160-transactional-notifications` / — |

## Outcome

The creator receives the accepted notification, and both participants receive exactly one judgment push when a verdict enters POSTING or the defined unresolved notification when no verdict is supportable.

## Sources

- [Notifications BDD 9.13–9.25](../behavior/notifications-bdd.md#913-notify-the-creator-when-a-contract-is-accepted)
- [Consequence BDD posting notification](../behavior/consequence-publication-bdd.md#105-notify-participants-when-posting-begins)
- [Contract POSTING/UNRESOLVED UI](../behavior/challenge-contract-screen-bdd.md#418-display-a-final-verdict-while-posting)

## Scope and work

- Transactional handlers for ACCEPTED, POSTING, and UNRESOLVED domain events; exact copy/recipients, deduplication, protected destinations, nonblocking delivery, invalid-token cleanup, and faked/Android tests.

### Work breakdown

- [ ] **Mobile:** notification-open routing through gates; no new result screen.
- [ ] **Backend:** ACCEPTED/POSTING/UNRESOLVED event handlers, outbox, dedupe and invalid-token cleanup.
- [ ] **Agent:** N/A; agent verdict never sends pushes directly.
- [ ] **Tests/CI:** acceptance/judgment exact copy, recipient, deduplication, nonblocking tests and live Android delivery.
- [ ] **Wiki:** delivery observations and operator diagnostics.

## Human requirements

- Android push configuration/test installations for live delivery; iOS live delivery remains deferred.

## Acceptance and gates

- [ ] Cases 9.13–9.25 and consequence case 10.5 pass.
- [ ] RESOLVED does not send a duplicate result push.
- [ ] Notification failure never rolls back or changes the judgment.
- [ ] Payload reveals no private Contract data before authenticated fetch.

## Activity log

Coordinator-only append-only entries go here.

## Observations and decisions

Record provider delivery behavior and invalid-token evidence here.

## Final handoff

Delivered behavior, candidate SHA, PR, tests, Android evidence, and limitations go here.
