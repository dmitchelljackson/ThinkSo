---
name: thinkso-pr-feedback
description:
  After the ThinkSo orchestrator detects a reviewed pull request merge, run the local feedback
  learner and permit its guarded host to update only reviewer knowledge.
---

# ThinkSo PR feedback trigger

After a reviewed pull request is detected as merged, run:

```text
python3 wiki/reviewer/feedback.py <number>
```

The script launches an ephemeral Sol/high Codex agent with the invariant prompt in
`wiki/agents/review-feedback.md`, a read-only merged checkout, denied approvals, live web search,
and a strict result schema. The Python parent validates and applies only Markdown or YAML files
under `wiki/reviewer/**`, then commits and pushes through the GitHub App. If `origin/main` changes,
it discards the proposal and reruns the agent once against fresh context.

Run it once after a reviewed PR merges. Do not reinterpret the result. Surface any returned
`user_message` to the owner.
