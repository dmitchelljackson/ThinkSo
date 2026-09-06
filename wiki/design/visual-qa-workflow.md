# Mobile visual QA workflow

## Locked rule

Every ticket that creates or materially changes mobile UI uses two visual-review stages. Browser rendering is the fast implementation loop; native Android and iOS rendering is the final verification gate. Neither stage replaces the other.

## Stage 1 — browser iteration

The implementer must:

1. Render the authoritative exported design and the Expo Web implementation at the same representative phone viewport.
2. Compare them side by side while iterating. Use an overlay or image diff when spacing, alignment, sizing, or typography is difficult to judge by eye.
3. Check composition, hierarchy, typography, colors, spacing, controls, and every ticket-owned visible state.
4. Repeat until material visual differences are resolved or recorded as an intentional responsive/platform adaptation.
5. Return comparison evidence and any remaining deviations to the coordinator.

The repository should provide a repeatable Playwright-based comparison command rather than relying on manually arranged browser windows. Generated comparison artifacts are temporary verification evidence unless a ticket explicitly requires committed documentation.

Expo Web is an iteration surface, not proof of native correctness. It does not reliably expose native font metrics, safe-area behavior, keyboards, system dialogs, platform controls, or other Android/iOS differences.

## Stage 2 — native verification

After the candidate SHA is frozen, the UI verifier must:

1. Capture the authoritative design at the comparison viewport and capture the running candidate on Android and iOS at representative phone sizes.
2. Review each native capture beside the design, using overlays where useful.
3. Verify both visual fidelity and the linked BDD behavior, including loading, disabled, error, keyboard, safe-area, navigation, and responsive states owned by the ticket.
4. Report screenshots, viewport/device details, material mismatches, intentional adaptations, and untested cases to the coordinator.

Android and iOS verification is required for portable UI whenever the local capability exists. A platform may be skipped only when the ticket marks the capability unavailable or explicitly out of scope and records why.

## Source and responsiveness discipline

Exported Claude/HTML designs are visual evidence, not production layout code. Do not copy preview device frames or fixed coordinates into React Native. Match the design's visual intent at the comparison viewport while preserving safe areas, usable controls, content flow, and reasonable behavior on other phone sizes.

If the source and locked BDD conflict, the BDD controls behavior and the difference must be recorded. If the desired visual treatment is ambiguous, do not silently improvise a materially different composition; report it to the coordinator for owner review.

## Coordinator gate

A UI candidate cannot become `STACKED` until:

- browser comparison evidence was produced during implementation;
- Android and iOS side-by-side verification passed, or each documented exception was accepted;
- every material mismatch has a stable UI finding, a verified fix, or an owner-approved deviation; and
- the pull request contains concise final screenshots/comparison evidence when UI is relevant.

The coordinator includes this page in every UI implementer and UI-verifier dispatch packet.
