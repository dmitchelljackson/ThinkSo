# Codex brief: establish the ThinkSo mobile design foundation

Use this brief when the Expo application skeleton exists and before implementing the first production screens.

## Objective

Create the smallest production-ready React Native design foundation needed to implement Firebase email/password Login, Create Account, and Connect Threads faithfully and responsively. Use the current [Firebase email/password design archive](../../raw/designs/thinkso-login-email-password-2026-09-04.md) as visual evidence, the design-system wiki page as the component boundary, and the BDD files as behavioral authority.

## Required reading

1. `AGENTS.md`
2. `wiki/design/design-system.md`
3. `wiki/product/overview.md`
4. `wiki/architecture/engineering-conventions.md`
5. `wiki/behavior/login-screen-bdd.md`
6. `wiki/behavior/connect-threads-screen-bdd.md`
7. `raw/designs/thinkso-login-email-password-2026-09-04.md`
8. Relevant files inside `raw/designs/thinkso-login-email-password-2026-09-04/`

## Build scope

- semantic colors, typography, spacing, borders/radii, and motion constants needed by the first two screens;
- verified bundled fonts with intentional fallbacks;
- `DocumentScreen`, `FormHeader`, text/heading roles, rules, annotations, and approved scribble assets;
- ordinary action/icon buttons and the acknowledgment control;
- application-scoped `FilingErrorToast` and `LoadingS`;
- an isolated development catalog showing every implemented state;
- tests and representative iOS/Android screenshots.

Do not build Challenge Card, contract sections, commitment dialogs, invitation stickers, account controls, or retirement controls until their vertical slices need them.

## Constraints

- Do not copy the export's simulated iPhone frame or assume a 393 × 852 viewport.
- Do not translate inline CSS mechanically.
- Do not invent a universal component API around one occurrence.
- Do not restore the historical Apple/Google controls; account access is Firebase email/password only.
- Keep the Threads control distinct from ordinary ThinkSo buttons.
- Keep behavior and domain state out of visual primitives.
- Preserve existing user changes and follow repository commands/conventions once present.

## Definition of done

- Login and Connect Threads can be composed without screen-local copies of shared tokens or primitives.
- Every primitive has explicit supported variants and states; unsupported flexibility is omitted.
- The catalog demonstrates enabled, pressed, disabled, loading-adjacent, error-toast, and countdown-action states.
- Layout remains usable on compact and large supported phones on Android and the free iOS Simulator, with safe areas respected and no clipped required copy.
- Automated tests cover interaction/state behavior; visual screenshots are reviewed against the export for hierarchy and character rather than pixel identity.
- Implementation decisions and any deviations discovered while rendering are written back to the design-system wiki page and wiki log.
