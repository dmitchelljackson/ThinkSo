# Reviewer knowledge

This directory is the only repository area the automated post-merge feedback agent may modify.

The local entrypoint is `scripts/reviewer/orchestrator.mjs`. The coordinator invokes `review` after pushing a PR and `feedback` after detecting a merge. Actual App IDs, installation IDs, and private-key paths belong in a local environment file; `.env.reviewer.example` contains the shape only.

`github_review.py` is the reviewer's only GitHub write interface. It validates the local PEM and App installation with `doctor`, exposes current PR metadata and patches with `pr`, and submits one atomic review with `submit`. Submission accepts one short summary plus repeatable, structured inline findings.

```text
python3 wiki/reviewer/github_review.py doctor
python3 wiki/reviewer/github_review.py submit --pr 6 --commit <sha> \
  --decision request-changes --summary "Two blocking reliability issues remain." \
  --comment 'CR-001|P1|scripts/example.py|42|RIGHT|Explain the issue and correction here.'
```

The reviewer loads these files as versioned, owner-approved knowledge. They are not a replacement for canonical product behavior: the BDDs, API specification, decisions, and architecture pages remain authoritative. When these files conflict with canonical wiki content, the reviewer reports the contradiction instead of inventing a resolution.

## Files

- [Rules](./rules.md) — compact implementation and review invariants distilled from accepted feedback.
- [Regression cases](./regressions.yml) — prior review patterns that should be checked again.
- [Exceptions](./exceptions.md) — intentionally waived or narrowly scoped findings.
- `github_review.py` — guarded GitHub App review CLI.
- `test_github_review.py` — standard-library tests for its structured input and diff mapping.

## Feedback policy

Feedback is accepted only from the configured product owner through the GitHub App workflow. The feedback agent may update only this directory and must verify its changed-path boundary before committing. Raw PR conversation remains evidence; only an owner-approved distilled rule, exception, or regression case becomes future reviewer context.
