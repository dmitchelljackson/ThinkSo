---
name: thinkso-pr-reviewer
description:
  After the ThinkSo orchestrator pushes or updates a pull request, run the local independent
  reviewer agent and post its structured result through the GitHub App.
---

# ThinkSo PR reviewer trigger

After a pull request is pushed or updated, run:

```text
python3 wiki/reviewer/review.py <number>
```

The script launches an ephemeral Sol/high Codex agent with the invariant prompt in
`wiki/agents/code-reviewer.md`, a read-only checkout, denied approvals, live web search, and a
strict result schema. The Python parent alone reads GitHub credentials and posts the review.

Run it once for each pushed head SHA. Do not duplicate a review or reinterpret its structured
result. Surface any returned `user_message` to the owner.
