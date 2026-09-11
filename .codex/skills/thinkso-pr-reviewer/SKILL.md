---
name: thinkso-pr-reviewer
description:
  After the ThinkSo orchestrator pushes or updates a pull request, run the local independent
  reviewer agent and post its structured result through the GitHub App.
---

# ThinkSo PR reviewer trigger

Load this skill from the trusted base checkout before candidate work begins. After a pull request
is pushed or updated, fetch `origin/main`, create a temporary detached worktree at that exact
revision, and run:

```text
python3 <trusted-main-worktree>/wiki/reviewer/review.py <number>
```

Always remove the temporary worktree after the command exits. Never execute the reviewer host,
its imports, prompt, or policy from the candidate checkout. The trusted script launches an
ephemeral Sol/high Codex agent with the invariant prompt from `origin/main`, a separate read-only
candidate checkout, denied approvals, live web search, and a strict result schema. The Python
parent alone reads GitHub credentials and posts the review.

Run it once for each pushed head SHA. Do not duplicate a review or reinterpret its structured
result. Surface any returned `user_message` to the owner. The first merge that installs this
system on `main` is an explicitly manual bootstrap; after that, the previously merged host reviews
future reviewer changes.
