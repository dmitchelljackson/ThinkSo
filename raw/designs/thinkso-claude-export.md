# Source: ThinkSo Claude Design export

- Type: exported Claude Design artifact
- Original archive supplied locally as `ThinkSo login screen.zip`
- Imported: 2026-08-31
- Preserved contents: [`./thinkso-claude-export/`](./thinkso-claude-export/)
- Related shared artifact: https://claude.ai/code/artifact/9a9486b1-3613-47fd-84e1-9a638129b636

The extracted directory is an immutable raw source. It contains the individual `.dc.html` screen/component designs, the complete product-flow composition, support runtime, device-frame component, screenshots, and uploaded image assets.

## Interpretation warning

The export targets a 393 × 852 portrait preview. Its files mix potentially useful responsive ideas (`clamp`, flex layout, container-relative units) with preview-only device wrappers, fixed dimensions, absolute positioning, inline pixel values, and web-specific behavior. The product owner has not audited this source for responsive correctness.

Treat the export as evidence for visual hierarchy, copy, controls, states, and aesthetic intent. Do not treat its literal CSS values, device-frame dimensions, DOM structure, or JavaScript as an implementation specification. React Native implementation must use native safe-area behavior and responsive layout, and must be tested on the supported device-size range before its sizing decisions become canonical.
