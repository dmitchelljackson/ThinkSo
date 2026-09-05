# ThinkSo design system

This page is the canonical implementation guide for shared mobile visual foundations. The Claude Design export is evidence; this page determines what should become reusable React Native code.

## Status language

- **LOCKED:** the product owner has approved the visual direction or behavior.
- **DERIVED:** a reusable engineering abstraction inferred from repeated designs. Validate it against real screens before broadening it.
- **OPEN:** implementation detail that must not be guessed into a permanent standard.

## Design principles

- **LOCKED:** official institutional/legal document × middle-school notebook vandalism.
- **LOCKED:** roughly 80% disciplined editorial/document design and 20% juvenile annotation.
- **LOCKED:** decoration never carries required information.
- **LOCKED:** native/provider controls retain required branding and platform behavior.
- **DERIVED:** build shared foundations from repeated semantics, not by copying the export's HTML/CSS or making every similar-looking element one universal component.
- **DERIVED:** screen layouts remain responsive compositions; the 393 × 852 preview is not a target viewport constant.

## Foundation tokens

The names below are **DERIVED**. The color values and font families repeat throughout the export, but final token naming, exact opacity ramps, installed font files, and platform rendering must be validated in the app.

### Color roles

| Role | Export evidence | Intended use |
|---|---:|---|
| canvas | `#e6e3db` | outer/warm environmental background where visible |
| paper | `#f4f2ec` | primary screen surface |
| raised-paper | `#fdfcf8` | cards, dialogs, contract panels |
| checkbox-paper | `#fffdf7` | small paper controls |
| ink | `#14171f` | primary text, rules, dark actions |
| blue-ink | `#2438c9` | pen marks, links, active accents |
| blue-ink-dark | `#1b2a8f` | pressed/darker blue accent |
| red-ink | `#b0442f` | warnings, destructive actions, consequence accents |
| red-ink-dark | `#8f3423` | destructive held/pressed state |
| filing-error | `#f4ccd4` | global error-toast paper |
| approval-green | `#2f9e52` | affirmative invitation sticker only |

Do not scatter opacity-adjusted hex/RGBA literals through screens. Define a small semantic text/rule opacity scale alongside these roles once native rendering is evaluated.

### Type roles

| Role | Family evidence | Use |
|---|---|---|
| editorial | Spectral | primary headings, contract titles, emphatic legal copy |
| administrative | Courier Prime | labels, body copy, metadata, buttons, form language |
| annotation | Gloria Hallelujah | sparse handwritten notes only |
| provider-native | platform/provider requirement | Threads authorization and other external-provider controls where required |

Font files, supported weights, fallback behavior, and licenses must be verified during implementation. Do not allow a missing weight to silently synthesize a visibly wrong face. Support native text scaling without letting essential controls clip.

### Spacing, shape, and motion

- **DERIVED:** create a small spacing scale based on repeated 4/8-ish increments rather than preserving every exported pixel value.
- **DERIVED:** thin square document rules and near-square cards are the default; rounded shapes are reserved for provider-native controls, sticker-like actions, or specifically approved elements.
- **LOCKED:** the loading S and filing-error toast are recurring global patterns.
- **LOCKED:** state refreshes use brief, restrained fades and layout transitions; do not animate whole documents dramatically. Exact durations remain open. Respect reduced-motion settings when production accessibility work begins.
- **OPEN:** exact spacing scale, type ramp, radii, shadows, animation durations, and breakpoints.

## Shared components to extract

### Foundation primitives

1. **`DocumentScreen` — DERIVED**

   Safe-area-aware paper surface, optional margin rule, responsive horizontal gutters, scrolling behavior, and screen background. It must not contain a fake device frame.

2. **`FormHeader` — DERIVED**

   Administrative eyebrow, record/reference ID, form number, and separating rule. Allow content slots; do not hardcode `TS-000421`.

3. **`EditorialHeading` and `ClauseHeading` — DERIVED**

   Spectral screen/title treatment and the small administrative-label-plus-editorial-heading pattern.

4. **`Rule`, `StatusLabel`, and `Stamp` — DERIVED**

   Repeated document separators, compact state labels, and rotated warning/final/permanent treatments. Keep semantic variants finite.

5. **`HandwrittenAnnotation` and approved scribble assets — DERIVED**

   Gloria Hallelujah annotation wrapper plus reusable underline/arrow marks. Required meaning must remain in ordinary text.

### Interaction primitives

6. **`ActionButton` — DERIVED**

   Ordinary ThinkSo primary, secondary/outline, and destructive actions with enabled, pressed, disabled, and loading-adjacent behavior. It does not replace provider-branded buttons or the large invitation stickers.

7. **`IconButton` — DERIVED**

   Back, close, profile, attach, and send affordances with consistent hit targets while allowing distinct icons.

8. **`AcknowledgmentControl` — DERIVED**

   Full-row tappable checkbox, handwritten check, explanatory label, enabled/disabled state.

9. **`FilingErrorToast` — LOCKED shared behavior**

   Global pink toast with header, timestamp, message, close/swipe dismissal, optional countdown action, and no automatic action when the countdown expires. It must support `TRY AGAIN`, `DISMISS`, and `LOG OUT` semantics without screen-specific forks.

10. **`LoadingS` — LOCKED shared behavior**

    ThinkSo activity indicator used outside provider-branded buttons and for restrained agent/research activity where specified.

11. **`NoticeDialog` / `CommitmentDialog` shell — DERIVED**

    Document-style modal surface with administrative header, optional stamp/annotation/art, body, and action row. Commitment and retirement variants keep their own copy and behavior.

### Product composites

12. **`AppTopBar` — DERIVED**

    Sticky/native-equivalent top navigation with back/profile action, ThinkSo title, and contextual label.

13. **`ChallengeCard` — LOCKED reusable concept**

    One tappable canonical card structure with state variants; no internal actions.

14. **`ContractPartyRow`, `ConsequenceBlock`, and `ContractSection` — DERIVED**

    Repeated contract composition pieces shared by proposal and canonical contract views. Do not create a second contract data model to serve them.

15. **`SettingsRow` — DERIVED**

    Account/legal row with label, optional value/status, and disclosure treatment.

## Components that must remain distinct

- Account-access email/password fields use the shared native form primitives. Historical Apple/Google buttons in older exports are not implemented.
- The Threads connect control follows Threads branding and has its own disabled state.
- **LOCKED:** the Threads connect control uses the official Threads icon with at least one-quarter-icon-width clear space, preserves its shape, and pairs it with the action label rather than modifying the official lockup. Its busy state uses a neutral native spinner—not the ThinkSo Loading S—so the two brands are not mixed inside one control.
- Green `ACCEPT` and outlined `REJECT` invitation stickers are product-specific action surfaces, not ordinary `ActionButton` variants.
- The press-and-hold retirement control is behaviorally distinct from a normal destructive button.
- Doodles with different meanings should be assets/compositions, not variants of an over-generalized doodle component.
- Screen-specific composition and copy stay in screens; primitives must not become product-state containers.

## Responsive and native requirements

- Use React Native flex layout, safe-area insets, content-driven height, and scrolling where content can grow.
- Do not hardcode the preview's 393 × 852 viewport, simulated notch/device shell, web `position: sticky`, or web container-query math.
- Validate smallest and largest supported phones, increased text size, long/error copy, and keyboard presence on Android and the free iOS Simulator. Account for both platforms' font metrics; paid Apple capabilities are not required for design-system verification.
- Avoid width/height constants unless they represent an intentional touch target, icon geometry, or approved bounded control—not a copied screenshot coordinate.
- **LOCKED:** tablets reuse the phone composition inside a centered maximum-width content column. Do not create tablet-specific navigation, information architecture, or screen variants for MVP.
- **LOCKED:** portrait usability is required. Rotation is optional for MVP: keep it enabled when the ordinary responsive composition remains usable, but lock the app to portrait if landscape would require a special layout or materially delay the slice.

## Extraction order

1. Load and verify fonts and semantic tokens.
2. Build `DocumentScreen`, text roles, rules, and `FormHeader`.
3. Build interaction primitives and all required states.
4. Build `FilingErrorToast` and `LoadingS` at application scope.
5. Implement Login and Connect Threads against their BDD documents.
6. Extract a primitive only after the second real use confirms its API.
7. Add product composites when their vertical slice arrives; do not build every export component upfront.

## Verification contract

Each shared component requires:

- a small isolated preview/catalog containing every supported state;
- interaction tests for enabled, disabled, loading, press, dismissal, and countdown behavior where applicable;
- screenshots on at least one compact iOS phone and one representative Android phone;
- screen-level tests proving Login and Connect Threads satisfy their BDD criteria;
- no production dependency on the Claude export runtime or web CSS.

## T-020 implementation evidence

The first native foundation lives under [`apps/mobile/src/design-system`](../../apps/mobile/src/design-system/). It uses semantic tokens from `tokens.ts`, `DocumentScreen` with safe-area insets and a centered `maxWidth` column, and finite document, interaction, loading, toast, and dialog primitives. The development catalog is available at the Expo Router `/catalog` route and intentionally contains no Firebase or Threads behavior.

Typography is bundled through the pinned `@expo-google-fonts/spectral`, `@expo-google-fonts/courier-prime`, and `@expo-google-fonts/gloria-hallelujah` packages. These wrappers are MIT licensed and their font files are SIL Open Font License 1.1; each role has a system fallback in native styles. No raw export HTML, CSS, device frame, or runtime is imported. Exact spacing and responsive breakpoints remain intentionally derived from content and the bounded 720-point column rather than the 393 × 852 preview.

The native loading mark preserves the source's fourteen hand-drawn strokes, sequential draw, hold, reverse erase, and blank reset. **LOCKED deviation (owner review, 2026-09-04):** it does not perform the source concept's 180-degree rotation; the non-rotating motion was preferred in native review.

**LOCKED native interaction (owner review, 2026-09-04):** ordinary action buttons remain stationary when pressed. Feedback is a restrained tonal change only: black gains a slight blue cast, secondary paper gains a faint blue-gray fill and border, and destructive red darkens slightly. Pressing must not translate or scale the control.

The `/catalog` drawing section renders the animated Loading S and 36 named, app-owned illustrations and hand-drawn marks extracted from the current screen sources. Near-identical screen-specific underline paths are normalized to shared single, double, and red underline primitives. Standard navigation glyphs and provider-owned Apple, Google, and Threads logos are deliberately excluded from the illustration inventory. The send-it pencil/fire drawing uses neutral ink so it cannot be mistaken for a destructive action.

The distinct Threads connect control follows [Meta's current official Threads brand guidance](https://www.meta.com/brand/resources/instagram/threads/): use the supplied icon without alteration, retain minimum clear space equal to one quarter of its width, and preserve the official lockup's relationship when the lockup itself is used. ThinkSo uses the standalone icon beside its separate `Connect Threads` action label, with sufficient clear space. A native spinner matching the disabled label replaces the icon while authorization is busy.
