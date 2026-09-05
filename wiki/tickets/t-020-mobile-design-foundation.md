# T-020 — Establish the mobile visual foundation

## Control

| Field | Value |
|---|---|
| Type / status | `ENABLING` / `IN_REVIEW` |
| Owner review | `CHANGES REQUESTED 2026-09-05 — approve after theme/atom review` |
| Stack position / predecessor | `020` / T-010 |
| Branch / PR | `stack/020-mobile-design-foundation` / [#4](https://github.com/dmitchelljackson/ThinkSo/pull/4) |

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

- [x] **Mobile:** tokens, fonts, primitives, catalog, responsive behavior, application toast/loading hosts.
- [x] **Backend:** N/A.
- [x] **Agent:** N/A.
- [x] **Tests/CI:** component states/interactions, font/license checks, native screenshots.
- [x] **Wiki:** promote evidence-backed tokens and record intentional source deviations.

## Human requirements

- H-001/AutoMobile is required for final compact-iOS and representative-Android visual evidence.

## Acceptance and gates

- [x] No production dependency on Claude export runtime, HTML, CSS, or fake device frame.
- [x] Shared toast/loading behavior is testable at application scope.
- [x] Login/Create Account can use Firebase email/password controls without forcing account-form behavior into visual primitives.
- [x] Font licensing and committed assets are safe for a public repository.
- [x] Complete text roles, spacing/radius/size/motion scales, and layout atoms are centralized and typed.
- [x] Light and dark semantic palettes share one typed contract; production follows system appearance.

## Activity log

`2026-09-04 | COORDINATOR | DISPATCHED | f5f7e1ec30d0c51800691bcc8f3572ca83672a0f | Created stack/020-mobile-design-foundation from the verified T-010 tip. Implement the shared native visual primitives and catalog without pulling Firebase behavior forward from T-030.`

`2026-09-05 | IMPLEMENTER | CANDIDATE_READY | pending coordinator commit | Added native tokens, bundled fonts, responsive document/form/action/dialog primitives, global feedback hosts, the animated Loading S, the distinct Threads control, the app-owned drawing inventory, and the /catalog review route.`

`2026-09-05 | UI_VERIFIER | PASS | pending coordinator commit | The owner reviewed the catalog on the configured iOS and Android simulators and approved the visual foundation, Loading S motion, restrained pressed colors, illustration consolidation, neutral send-it drawing, official Threads treatment, and native loading spinner.`

`2026-09-05 | COORDINATOR | CHECKS_PASS | 57187f7a25f50c528f22962d4bceb928bcfc2cf6 | Root format/lint/type/unit checks, repository hygiene and Gitleaks, Markdown links, OpenAPI drift, diff checks, and native owner review pass.`

`2026-09-05 | COORDINATOR | STACK_SUBMITTED | 57187f7a25f50c528f22962d4bceb928bcfc2cf6 | Published review-ready PR #4 against main with the required ticket-prefixed title; GitHub Actions started.`

`2026-09-05 | OWNER | CHANGES_REQUESTED | 57187f7a25f50c528f22962d4bceb928bcfc2cf6 | Required complete text styles, semantic light/dark themes, and shared spacing/layout atoms before PR approval.`

`2026-09-05 | IMPLEMENTER | FIXED | pending coordinator commit | Added typed light/dark themes with system selection, complete ThinkSoText roles and semantic tones, shared spacing/radius/size/motion tokens, Stack/Inline/Spacer atoms, theme-aware primitives and health surface, catalog theme controls, and palette contract tests.`

## Observations and decisions

- The catalog intentionally includes the current 36 app-owned drawings at the owner's request. This is an approved scope addition to review reusable visual assets together; no later-screen behavior or product composites moved into T-020.
- Ordinary buttons remain stationary and use restrained tonal pressed feedback.
- The Loading S preserves sequential drawing and erasure but does not rotate.
- The Threads control uses Meta's official standalone icon with the required clear space. Its busy state uses a native spinner matching the disabled label instead of the ThinkSo Loading S.
- `DocumentScreen` uses safe-area padding, scrollable content, keyboard avoidance, and a centered 720-point maximum-width phone composition for larger displays.
- The application follows the OS light/dark preference. The catalog can force light, dark, or system mode so both palettes can be reviewed without changing device settings.
- Text variants own complete family/size/line-height/tracking/case styles. Screens select semantic variants and tones rather than rebuilding typography.
- Android native review found the first dark palette coherent across document surfaces, ordinary/provider/destructive controls, disabled/loading states, fields, status bar, and filing-error toast. Exact palette tuning remains owner-reviewable without changing component contracts.

## Final handoff

- **Delivered:** responsive native visual primitives, global toast/loading hosts, bundled fonts, Threads-branded authorization control, app drawing inventory, and `/catalog` review route.
- **Candidate / PR:** reviewed code candidate `57187f7a25f50c528f22962d4bceb928bcfc2cf6`; [PR #4](https://github.com/dmitchelljackson/ThinkSo/pull/4).
- **Evidence:** 29 mobile tests; typecheck/lint/format; Android `ThinkSo_API_36` light/dark native catalog review; earlier compact iOS `ThinkSo-iPhone-17` foundation review. Final owner approval remains pending for the new theme/atom pass.
- **Limitations:** Login and Connect Threads behavior remains in T-030 and T-050. Rotation may be locked later if a production screen proves unusable in landscape.
