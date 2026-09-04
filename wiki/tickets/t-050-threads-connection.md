# T-050 — Require and maintain a Threads connection

## Control

| Field | Value |
|---|---|
| Type / status | `PRODUCT` / `DRAFT` |
| Owner review | `PENDING` |
| Stack position / predecessor | `050` / T-040 |
| Branch / PR | `stack/050-threads-connection` / — |

## Outcome

Authenticated users cannot enter protected ThinkSo features until one usable Threads identity is connected, and revoked access returns them to the same recoverable gate.

## Sources

- [Connect Threads BDD 2.1–2.21](../behavior/connect-threads-screen-bdd.md#21-display-the-connect-threads-screen)
- [Threads UI](<../../raw/designs/thinkso-claude-export/ThinkSo Connect Threads.dc.html>)
- [Social integration API](../api/api-specification.md#social-integration)
- [Threads authorization lifecycle](../architecture/threads-authorization.md)

## Scope and work

- Local acknowledgment, provider OAuth start/callback, server exchange/encryption, all-or-nothing scope validation, claimed-account failure, reauthorization, interrupted-return reconciliation, global gate, six-hour checks, proactive refresh, and Account connection display.

### Work breakdown

- [ ] **Mobile:** Connect presenter/UI, OAuth effect, bootstrap gate, deep-link restoration, Account status.
- [ ] **Backend:** OAuth exchange/encryption, ownership constraints, verification/refresh jobs, gate status.
- [ ] **Agent:** N/A.
- [ ] **Tests/CI:** state/callback/provider fakes, scope/claim/revocation cases, one live smoke flow.
- [ ] **Wiki:** exact Meta setup and observed token/provider constraints.

## Human requirements

- Batch B Meta developer app, exact callback/scope approval, secret placement, and interactive Threads test authorization.

## Acceptance and gates

- [ ] Every case 2.1–2.21 passes, including deep-link resumption and transient verification behavior.
- [ ] One Threads identity belongs to at most one active profile.
- [ ] Revocation gates access but never retires the profile.
- [ ] OAuth state, token encryption, refresh, and scheduled verification have deterministic tests plus one live smoke test.

## Activity log

Coordinator-only append-only entries go here.

## Observations and decisions

Account transfer remains post-MVP; record provider constraints without inventing recovery behavior.

## Final handoff

Delivered behavior, candidate SHA, PR, tests, migrations, provider evidence, and limitations go here.
