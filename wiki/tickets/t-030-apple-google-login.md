# T-030 — Authenticate with Apple or Google and issue ThinkSo sessions

## Control

| Field | Value |
|---|---|
| Type / status | `PRODUCT` / `DRAFT` |
| Owner review | `PENDING` |
| Stack position / predecessor | `030` / T-020 |
| Branch / PR | `stack/030-apple-google-login` / — |

## Outcome

A new or returning user can use the same Login flow with Apple or Google and receive a persisted ThinkSo profile/session; retired identities are denied.

## Sources

- [Login BDD 1.1–1.13](../behavior/login-screen-bdd.md#11-display-the-login-screen)
- [Login UI](<../../raw/designs/thinkso-claude-export/ThinkSo Access Form.dc.html>)
- [`POST /auth/login`](../api/api-specification.md#post-authlogin)
- [Users, identities, and sessions](../data/data-model-and-state-machines.md#users)

## Scope and work

- Login presenter/UI, Apple and Google provider adapters, loading/disabled/cancel/error/toast behavior, placeholders, backend credential verification for both providers, identity matching, profile creation/restoration, retirement rejection, session issuance, migrations, and tests.
- Apple is implemented and configured in the same slice as Google. Only live Apple credentials, entitlement/signing, and end-to-end provider verification remain deferred until paid Apple Developer enrollment.

### Work breakdown

- [ ] **Mobile:** Login presenter/UI, Apple/Google provider effects, loading/error/toast behavior, session receipt.
- [ ] **Backend:** Apple/Google credential verification, profile/identity/session persistence, retirement detection, shared login endpoint.
- [ ] **Agent:** N/A.
- [ ] **Tests/CI:** presenter/component cases for both providers, Apple/Google verifier fakes, identity/link collisions, API contracts and migrations.
- [ ] **Wiki:** exact provider config and any Apple-verification limitation.

## Human requirements

- Batch B Google OAuth activation and interactive test login after the agent supplies exact client identifiers. Paid Apple enrollment is not required to implement or fake-test the Apple path; it blocks only live Apple verification.

## Acceptance and gates

- [ ] BDD 1.1–1.13 passes deterministically for Apple and Google; the live provider smoke gate runs for Google only until H-002.
- [ ] Repeated login reuses the active profile; identity collisions and retired signals follow the locked model.
- [ ] Access/refresh credentials are never logged or exposed to the UI model.
- [ ] Provider adapters and identity matching are unit/integration tested without live Google.

## Activity log

Coordinator-only append-only entries go here.

## Observations and decisions

- Apple implementation ships with Google; only live Apple verification is deferred.

## Final handoff

Delivered behavior, candidate SHA, PR, tests, migrations, provider evidence, and limitations go here.
