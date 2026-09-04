# T-170 — Permanently retire an account

## Control

| Field | Value |
|---|---|
| Type / status | `PRODUCT` / `DRAFT` |
| Owner review | `PENDING` |
| Stack position / predecessor | `170` / T-160 |
| Branch / PR | `stack/170-permanent-retirement` / — |

## Outcome

After two warnings and a continuous five-second hold, a user permanently retires: access ends locally, unresolved Contracts void, pending publication cancels, identifiers are tombstoned, and historical terminal records remain readable to active members.

## Sources

- [Account BDD 6.7–6.20](../behavior/account-screen-bdd.md#67-open-the-first-retirement-warning)
- [Account warning UI sources](../../SCREENS.md#6-account-and-retirement)
- [Retirement transaction](../data/data-model-and-state-machines.md#retirement-transaction)
- [Threads disconnect API](../api/api-specification.md#delete-integrationsthreads)

## Scope and work

- Warning dialogs/hold control/failure recovery, atomic retirement transaction, all session/push invalidation, unresolved Contract voiding, publication cancellation, layered identity tombstones, provider-revocation outbox/retry, protected-route exit, and history preservation.

### Work breakdown

- [ ] **Mobile:** both warnings, continuous hold, failure recovery, immediate local teardown/routing.
- [ ] **Backend:** atomic retirement/tombstones/voiding/session/push cleanup and provider-revocation outbox.
- [ ] **Agent:** cancel/suppress active minting or judging work affected by retirement.
- [ ] **Tests/CI:** transaction rollback, lifecycle-state matrix, identity reuse, cleanup retry and destructive live flow.
- [ ] **Wiki:** destructive-test identity, provider cleanup observations and recovery notes.

## Human requirements

- A disposable live test profile for destructive end-to-end verification; the coordinator must reconfirm the exact test identity before retiring it.

## Acceptance and gates

- [ ] Cases 6.7–6.20 and related Contract/publication/notification retirement cases pass.
- [ ] Incomplete hold resets; transient submission failure leaves the active profile usable.
- [ ] Retirement is atomic in Postgres and local credential clearing does not wait for provider cleanup.
- [ ] Any tombstoned Apple/Google/email/Threads signal blocks future reuse.

## Activity log

Coordinator-only append-only entries go here.

## Observations and decisions

Live retirement testing is destructive and requires an explicitly disposable account.

## Final handoff

Delivered behavior, candidate SHA, PR, transaction/race tests, live evidence, and limitations go here.
