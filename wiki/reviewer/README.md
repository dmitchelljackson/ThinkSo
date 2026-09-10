# Reviewer knowledge

This directory is the only repository area the automated post-merge feedback agent may modify.

The local entrypoint is `scripts/reviewer/orchestrator.mjs`. The coordinator invokes `review` after pushing a PR and `feedback` after detecting a merge. Actual App IDs, installation IDs, and private-key paths belong in a local environment file; `.env.reviewer.example` contains the shape only.

The reviewer loads these files as versioned, owner-approved knowledge. They are not a replacement for canonical product behavior: the BDDs, API specification, decisions, and architecture pages remain authoritative. When these files conflict with canonical wiki content, the reviewer reports the contradiction instead of inventing a resolution.

## Files

- [Rules](./rules.md) — compact implementation and review invariants distilled from accepted feedback.
- [Regression cases](./regressions.yml) — prior review patterns that should be checked again.
- [Exceptions](./exceptions.md) — intentionally waived or narrowly scoped findings.

## Feedback policy

Feedback is accepted only from the configured product owner through the GitHub App workflow. The feedback agent may update only this directory and must verify its changed-path boundary before committing. Raw PR conversation remains evidence; only an owner-approved distilled rule, exception, or regression case becomes future reviewer context.
