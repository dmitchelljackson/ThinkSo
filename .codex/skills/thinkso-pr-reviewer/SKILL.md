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

The script checks PR authorship before fetching files or loading the candidate into model context.
Pull requests authored by Mitchell proceed normally. For any other author it returns
`EXTERNAL_PR_APPROVAL_REQUIRED` with the exact head SHA. Surface that error and stop.

Never set `--allow-external-head` on your own. Only after Mitchell explicitly says that he has
inspected and approves that exact PR head may you rerun:

```text
python3 wiki/reviewer/review.py <number> --allow-external-head <exact-sha>
```

Approval expires when the PR head changes. The script launches an ephemeral Sol/high Codex agent
in a separate read-only candidate checkout with denied approvals, live web search, and a strict
result schema. The Python parent alone reads GitHub credentials and posts the review.

Run it once for each pushed head SHA. Do not duplicate a review or reinterpret its structured
result. Surface any returned `user_message` to the owner.
