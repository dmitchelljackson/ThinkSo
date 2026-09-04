# T-150 — Prime notifications and register installations

## Control

| Field | Value |
|---|---|
| Type / status | `PRODUCT` / `DRAFT` |
| Owner review | `PENDING` |
| Stack position / predecessor | `150` / T-140 |
| Branch / PR | `stack/150-push-registration` / — |

## Outcome

After ThinkSo demonstrates value, the app presents the one-time notification primer and safely registers or removes authorized installation tokens without blocking product actions.

## Sources

- [Notifications BDD 9.1–9.12](../behavior/notifications-bdd.md#91-do-not-request-permission-before-demonstrated-value)
- [Push token API](../api/api-specification.md#push-tokens)
- [Push-token data model](../data/data-model-and-state-machines.md#user_push_tokens)
- [Notification primer design language](<../../raw/designs/thinkso-claude-export/CommitmentDialog.dc.html>)

## Scope and work

- Local primer eligibility/dismissal, native permission adapter, Expo token registration/deletion, installation reassignment, multiple-device persistence, invalid-token handling seam, and faked provider tests.

### Work breakdown

- [ ] **Mobile:** primer presenter/dialog, permission effect, installation/token registration lifecycle.
- [ ] **Backend:** push-token ownership/upsert/delete/reassignment and provider adapter seam.
- [ ] **Agent:** N/A.
- [ ] **Tests/CI:** permission states, local one-time gate, token races/reassignment, provider fakes/live Android smoke.
- [ ] **Wiki:** Expo/Firebase setup and platform delivery limitations.

## Human requirements

- Batch B Expo/Firebase Android push configuration and an Android test target for real delivery verification.

## Acceptance and gates

- [ ] Cases 9.1–9.12 pass.
- [ ] Native prompt appears only after explicit primer consent and never before demonstrated value.
- [ ] Primer appears at most once per installation; denial does not block the app.
- [ ] Token reuse cannot leak notifications to the prior profile.

## Activity log

Coordinator-only append-only entries go here.

## Observations and decisions

Live iOS APNs delivery remains deferred with paid Apple enrollment.

## Final handoff

Delivered behavior, candidate SHA, PR, tests, Android evidence, and limitations go here.
