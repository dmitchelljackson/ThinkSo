# T-000 — Repository governance and deterministic tooling

## Control

| Field | Value |
|---|---|
| Type / status | `ENABLING` / `DRAFT` |
| Owner review | `PENDING` |
| Stack position / predecessor | `000` / `main` |
| Branch / PR | `stack/000-repository-governance` / — |

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

- [ ] **Mobile:** workspace/check command shells only; no product UI.
- [ ] **Backend:** uv/container/check command shells only; no product routes.
- [ ] **Agent:** coordinator/native-stack configuration and durable role links.
- [ ] **Tests/CI:** workflow syntax, secret scan, format/lint/type/test placeholders, public-tree audit.
- [ ] **Wiki:** record final pins, license, governance, and repeatable setup.

## Human requirements

- `STOP: HUMAN REQUIRED` for Xcode license acceptance before Git/Homebrew work.
- Owner approval of the remaining foundation configuration. The source status is locked as all-rights-reserved/source-available.
- GitHub authentication is already active; never expose its token.

## Acceptance and gates

- [ ] Fresh-checkout setup and every root command are documented and deterministic.
- [ ] Real secrets, `.DS_Store`, caches, generated junk, and local artifacts cannot enter the public tree accidentally.
- [ ] GitHub CLI is 2.90.0+ and `gh stack --help` succeeds.
- [ ] CI configuration is syntax-valid and uses standard public runners.
- [ ] Public-content audit passes before the first local push.

## Activity log

`2026-09-03 | COORDINATOR | CREATED | Remote repository exists empty at https://github.com/dmitchelljackson/ThinkSo; local push awaits tooling and owner review.`

`2026-09-04 | COORDINATOR | PUBLISHED | Initialized main and published audited root commit ebb4f587d862 to the public repository. Gitleaks reported no findings; Finder metadata and local secret/config patterns are ignored. T-000 remains DRAFT because executable tooling, CI, gh-stack upgrade, and owner review are still outstanding.`

## Observations and decisions

- Record implementation discoveries here; promote reusable facts to architecture pages.
- **LOCKED:** no software license is granted; `COPYRIGHT.md` reserves all rights and outside contributions are not accepted initially. Possible later GPL relicensing is not a present commitment.

## Final handoff

Delivered behavior, candidate SHA, PR, command evidence, and limitations go here.
