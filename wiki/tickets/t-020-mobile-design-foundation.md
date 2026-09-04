# T-020 — Establish the mobile visual foundation

## Control

| Field | Value |
|---|---|
| Type / status | `ENABLING` / `IMPLEMENTING` |
| Owner review | `APPROVED 2026-09-04` |
| Stack position / predecessor | `020` / T-010 |
| Branch / PR | `stack/020-mobile-design-foundation` / — |

## Outcome

Login and Threads can be built from tested responsive ThinkSo primitives instead of copied web-preview CSS.

## Sources

- [Design-system implementation brief](../delivery/design-system-implementation-brief.md)
- [Design system](../design/design-system.md)
- [Login UI sources](../../SCREENS.md#1-account-access--login)
- [Threads UI source](../../SCREENS.md#2-connect-threads)

## Scope and work

- Fonts/licenses, semantic tokens, `DocumentScreen`, text/rule/header primitives, Firebase account-form boundary, `ActionButton`, `FilingErrorToast`, `LoadingS`, and dialog shell only as required by the first two screens.
- Isolated component catalog/previews and interaction tests for all supported states.
- Responsive phone composition, bounded tablet column, safe areas, keyboard behavior, and portrait decision based on evidence.

### Work breakdown

- [ ] **Mobile:** tokens, fonts, primitives, catalog, responsive behavior, application toast/loading hosts.
- [ ] **Backend:** N/A.
- [ ] **Agent:** N/A.
- [ ] **Tests/CI:** component states/interactions, font/license checks, native screenshots.
- [ ] **Wiki:** promote evidence-backed tokens and record intentional source deviations.

## Human requirements

- H-001/AutoMobile is required for final compact-iOS and representative-Android visual evidence.

## Acceptance and gates

- [ ] No production dependency on Claude export runtime, HTML, CSS, or fake device frame.
- [ ] Shared toast/loading behavior is testable at application scope.
- [ ] Login/Create Account can use Firebase email/password controls without forcing account-form behavior into visual primitives.
- [ ] Font licensing and committed assets are safe for a public repository.

## Activity log

`2026-09-04 | COORDINATOR | DISPATCHED | f5f7e1ec30d0c51800691bcc8f3572ca83672a0f | Created stack/020-mobile-design-foundation from the verified T-010 tip. Implement the shared native visual primitives and catalog without pulling Firebase behavior forward from T-030.`

## Observations and decisions

Record token/layout adjustments supported by native screenshots here.

## Final handoff

Delivered primitives, candidate SHA, PR, screenshots, tests, and limitations go here.
