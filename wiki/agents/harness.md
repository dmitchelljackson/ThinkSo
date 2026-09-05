# Stacked-PR agent harness

## Goal

Build ThinkSo as a deep, reviewable stack of small full-stack pull requests. Human review may wait until the stack is complete, but every layer passes automated and agent verification before another implementation layer begins.

## Roles

- [Coordinator](./coordinator.md) — owns the stack, ticket state, dispatch, gates, and restacking.
- [Implementer](./implementer.md) — owns one small full-stack ticket and its pull request.
- [Code reviewer](./code-reviewer.md) — independently reviews one immutable candidate diff.
- [UI verifier](./ui-verifier.md) — exercises one immutable candidate build through AutoMobile.

These files are durable role prompts. A dispatched task also receives its ticket path, base branch, target branch, expected PR base, and candidate SHA where applicable.

## Ticket communication

The Markdown ticket is the durable Jira-like conversation for every role. The coordinator is its sole writer so concurrent verification cannot create conflicting edits. Implementers, reviewers, and UI verifiers send structured reports to the coordinator; the coordinator appends them to the activity log, updates gates/status, and forwards the newly recorded ticket state when another role must respond.

Every finding receives a stable ID such as `CR-001` or `UI-001`. Fix and verification reports cite those IDs. Agents may communicate transient execution details directly, but a decision, blocker, candidate, finding, fix, gate result, or human request is not authoritative until the coordinator records it in the ticket.

Only the product owner may change locked acceptance behavior. The coordinator may clarify ticket wording from canonical sources but must not let a worker silently edit acceptance criteria to make a failing implementation pass.

## Execution topology

```text
main
└── stack/000-foundation
    └── stack/010-login
        └── stack/020-threads
            └── stack/030-record
```

The coordinator owns one shared stack checkout and all Git operations. The official `github/gh-stack` extension owns local stack metadata and GitHub's native stack relationship. The write path is sequential: only one implementer subagent edits that checkout at a time. The implementer returns an uncommitted candidate; the coordinator inspects it, records the ticket update, commits it, and freezes the candidate SHA. CI, code review, and AutoMobile verification may then run concurrently against that fixed candidate. The coordinator does not edit the checkout while those read-only roles are inspecting it. The next implementer starts only after all required gates pass.

PR titles use `[T-NNN] Simple title`. PR bodies stay human-scannable: ticket, what changed, how to test, screenshots when relevant, and brief notes.

Initialize the first layer non-interactively with `gh stack init --base main <branch>` and add each verified successor with `gh stack add <branch>`. `gh stack submit --auto` pushes the branches, creates or updates draft pull requests, assigns each PR its immediate predecessor, and links the native GitHub stack. After a layer passes every gate, the coordinator marks that PR ready for review. The user may review layers independently and remains the only merge authority.

When an earlier layer changes, the coordinator checks out that layer through `gh stack checkout <branch-or-pr>`, repairs and verifies it, runs `gh stack rebase --upstack`, then `gh stack push`. After merges it runs `gh stack sync --prune`. It uses `gh stack view --json` to verify structure and lets the extension perform guarded rewritten pushes; it does not reproduce stack retargeting or cascading rebase logic by hand. Every affected descendant receives a new candidate SHA and stale gates are rerun.

## Candidate lifecycle

`READY → IMPLEMENTING → VERIFYING → STACKED`

Exceptional transitions:

- `VERIFYING → CHANGES_REQUESTED → IMPLEMENTING`
- any active state → `BLOCKED_HUMAN`
- any active state → `BLOCKED_TECHNICAL` only after the role has exhausted its documented recovery path
- `STACKED → RESTACKING → VERIFYING` when an ancestor changes
- `STACKED → MERGED` only through a user-authorized native stack or partial-stack merge

The coordinator may continue building after `STACKED`; it never interprets automated gates as authorization to merge.

## Model policy

- The coordinator uses its configured primary model.
- Spawn every implementer, code reviewer, and UI verifier with `gpt-5.6-luna` by default.
- Use high reasoning for implementers and code reviewers; use medium reasoning for UI verification unless a difficult diagnosis warrants high.
- Luna is a cost policy, not a quality waiver. After two failed repair cycles with the same underlying blocker, or when a worker identifies ambiguity requiring materially stronger judgment, the coordinator may rerun that bounded role with `gpt-5.6-terra` and records why in the ticket history.
- Do not escalate merely because a task is long. Narrow or repair the ticket first when scope is the problem.

## Gate contract

A candidate becomes `STACKED` only when:

- all ticket acceptance criteria are implemented;
- required unit/integration/API-contract tests pass;
- formatting, linting, typing, generated-client drift, and relevant container checks pass;
- independent code review has no unresolved blocking findings;
- required AutoMobile scenarios pass with recorded evidence, or the ticket explicitly has no native UI surface;
- the ticket and affected wiki pages describe the implementation and any deviations;
- no secret or unsuitable private material appears in the diff.

## Human stops

`STOP: HUMAN REQUIRED` is reserved for credentials, account/provider setup, privileged GUI/system work, product decisions that materially change behavior, destructive/external actions lacking prior authorization, or a genuine provider constraint. The coordinator completes all safe preparatory work, records the exact request and evidence, and pauses only the affected dependency chain.

Ordinary implementation judgment, test failures, lint problems, merge conflicts, and recoverable provider fakes are agent work rather than human stops.

## Harness scope

Begin with one coordinator checkout, sequential implementation subagents, parallel read-only verification subagents, role prompts, GitHub CLI 2.90.0 or later, the official `github/gh-stack` extension, repository scripts, and GitHub Actions. GitHub's stack feature and extension are in public preview, so the coordinator verifies commands against `gh stack <command> --help` and records any upstream behavior change. Do not build manual stack automation or a custom Codex SDK orchestrator until this coordinator loop has produced evidence that the native workflow is insufficient.
