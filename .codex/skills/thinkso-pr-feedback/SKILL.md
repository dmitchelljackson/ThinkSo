---
name: thinkso-pr-feedback
description:
  After the ThinkSo orchestrator detects a reviewed pull request merge, run the local feedback
  learner and permit its guarded host to update only reviewer knowledge.
---

# ThinkSo PR feedback trigger

Load this skill from the trusted base checkout before candidate work begins. After a reviewed pull
request is detected as merged, fetch `origin/main`, create a temporary detached worktree at that
exact revision, and run:

```text
python3 <trusted-main-worktree>/wiki/reviewer/feedback.py <number>
```

Always remove the temporary worktree after the command exits. Never execute the feedback host,
its imports, prompt, or policy from a candidate or just-merged non-main checkout. The trusted
script launches an ephemeral Sol/high Codex agent with the invariant prompt from `origin/main`, a
read-only merged checkout, denied approvals, live web search, and a strict result schema. The
Python parent validates and applies only Markdown or YAML files under `wiki/reviewer/**`, then
commits and pushes through the GitHub App. If `origin/main` changes, it discards the proposal and
reruns the agent once against fresh context.

Run it once after a reviewed PR merges. Do not reinterpret the result. Surface any returned
`user_message` to the owner.
