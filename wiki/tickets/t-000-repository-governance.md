# T-000 — Repository governance and deterministic tooling

## Control

| Field | Value |
|---|---|
| Type / status | `ENABLING` / `STACKED` |
| Owner review | `APPROVED 2026-09-04` |
| Stack position / predecessor | `000` / `main` |
| Branch / PR | `stack/000-repository-governance` / [#1](https://github.com/dmitchelljackson/ThinkSo/pull/1) |

## Outcome

A clean public checkout has deterministic workspace commands, formatting, lint/type/test entrypoints, secret hygiene, and GitHub Actions without claiming product behavior.

## Sources

- [Foundation configuration review](../delivery/foundation-configuration-review.md)
- [Repository organization](../architecture/repository-organization.md)
- [CI and quality gates](../architecture/ci-and-quality.md)
- [Agent harness](../agents/harness.md)

## Scope and work

- Root pnpm workspace, Node/Python pins, `justfile`, EditorConfig, ignore rules, safe environment templates, locked copyright/contribution notices, and contributor-facing commands.
- GitHub Actions job shells for hygiene, mobile, backend, integration, OpenAPI drift, and container build.
- Upgrade/install/verify `gh` native stack tooling and connect the existing empty public repository.
- No Expo/FastAPI application code beyond placeholders required to prove root commands are wired.

### Work breakdown

- [x] **Mobile:** workspace/check command shells only; no product UI.
- [x] **Backend:** uv/container/check command shells only; no product routes.
- [x] **Agent:** coordinator/native-stack configuration and durable role links.
- [x] **Tests/CI:** workflow syntax, secret scan, format/lint/type/test placeholders, public-tree audit.
- [x] **Wiki:** record final pins, license, governance, and repeatable setup.

## Human requirements

- `STOP: HUMAN REQUIRED` for Xcode license acceptance before Git/Homebrew work.
- Owner approval of the remaining foundation configuration. The source status is locked as all-rights-reserved/source-available.
- GitHub authentication is already active; never expose its token.

## Acceptance and gates

- [x] Fresh-checkout setup and every root command are documented and deterministic.
- [x] Real secrets, `.DS_Store`, caches, generated junk, and local artifacts cannot enter the public tree accidentally.
- [x] GitHub CLI is 2.90.0+ and `gh stack --help` succeeds.
- [x] CI configuration is syntax-valid and uses standard public runners.
- [x] Public-content audit passes before each push.

## Activity log

`2026-09-03 | COORDINATOR | CREATED | Remote repository exists empty at https://github.com/dmitchelljackson/ThinkSo; local push awaits tooling and owner review.`

`2026-09-04 | COORDINATOR | PUBLISHED | Initialized main and published audited root commit ebb4f587d862 to the public repository. Gitleaks reported no findings; Finder metadata and local secret/config patterns are ignored. T-000 remains DRAFT because executable tooling, CI, gh-stack upgrade, and owner review are still outstanding.`

`2026-09-04 | COORDINATOR | STARTED | Owner approved the foundation configuration. Created native stack branch stack/000-repository-governance; verified gh 2.100.0, gh-stack 0.1.1, pnpm 11.19.0, uv 0.9.21, just 1.58.0, Docker 29.1.3, and Gitleaks 8.30.1.`

`2026-09-04 | IMPLEMENTER | CANDIDATE_READY | 8b1cc1eec1e0a4bfbf3ffed46ed9a509abc4dd68 adds deterministic workspace pins and commands, honest scaffold-aware gates, CI job shells, pinned container images, secret/path hygiene, and owner setup guides.`

`2026-09-04 | CODE_REVIEW | FINDING | CR-001: canonical H-009 prerequisite text still described the pre-publication CLI/repository state even though the readiness page recorded completion.`

`2026-09-04 | COORDINATOR | FIXED | CR-001: synchronized H-009 with the live repository, gh 2.100.0, and gh-stack 0.1.1; clarified that AutoMobile installation and ordinary virtual-device setup are agent-owned.`

`2026-09-04 | CODE_REVIEW | VERIFIED | a92f7ba63f4a4ad7856d797fc3684680ff85fbe7 closes CR-001; independent review reports no remaining blocker.`

`2026-09-04 | COORDINATOR | STACKED | Opened review-ready PR #1 against main. All six GitHub Actions jobs passed for both the push and pull-request runs; the owner remains the sole merge authority.`

## Observations and decisions

- Record implementation discoveries here; promote reusable facts to architecture pages.
- **LOCKED:** no software license is granted; `COPYRIGHT.md` reserves all rights and outside contributions are not accepted initially. Possible later GPL relicensing is not a present commitment.

## Final handoff

- **Delivered:** deterministic pnpm/uv workspace foundations, root command menu, formatting/lint/type/test shells, public-tree hygiene, container/Compose baseline, native-stack setup, provider owner guides, and six diagnosable GitHub Actions jobs.
- **Reviewed code candidate:** `8b1cc1eec1e0a4bfbf3ffed46ed9a509abc4dd68`; the subsequent ticket-only documentation repair closes CR-001.
- **Pull request:** [#1 — T-000: Establish repository governance and deterministic tooling](https://github.com/dmitchelljackson/ThinkSo/pull/1).
- **Evidence:** pnpm frozen install, Prettier, ESLint, Ruff, mypy, Markdown links (74 files), OpenAPI fail-closed scaffold check, Actionlint, Gitleaks, Compose validation, and pinned API container build all pass.
- **Intentional limitation:** mobile/backend unit and integration suites and canonical OpenAPI generation report explicit setup skips until T-010 replaces the placeholders atomically.
