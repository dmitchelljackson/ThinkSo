# Reviewer knowledge and local automation

The local reviewer uses the user's existing Codex ChatGPT session for inference and the ThinkSo Local Reviewer GitHub App for identity and repository access. The PEM and App configuration remain outside this repository. `*.pem` and local environment files are ignored globally.

Requirements:

- Python 3.10 or newer;
- `openai-codex==0.154.0`, installable from [requirements.txt](./requirements.txt);
- an authenticated `codex login` session; and
- `~/.config/thinkso-local-reviewer/config.json` pointing to the App ID, installation ID, repository, and private PEM path.

The default config shape is:

```json
{
  "app_id": "<GitHub App ID>",
  "installation_id": "<installation ID>",
  "private_key_path": "/absolute/path/to/private-key.pem",
  "repository": "owner/repository"
}
```

Run a complete review after pushing or updating a pull request:

```text
python3 wiki/reviewer/review.py <number>
```

Run feedback learning after that reviewed pull request merges:

```text
python3 wiki/reviewer/feedback.py <number>
```

For a non-mutating feedback-prompt test before merge, use `--dry-run`. It invokes the feedback agent and validates its proposal but never writes, commits, or pushes anything.

Both entrypoints take the PR number as their only production input. They validate the local GitHub App configuration before running. The model subprocess receives neither the PEM nor an installation token. The SDK process loads a temporary copy of the Codex session, deletes that file, and removes directory access before starting the model turn. Candidate `AGENTS.md` discovery is disabled, the model shell receives an allowlisted environment without credential locations or tokens, the repository sandbox is read-only, and approvals are denied. The parent rejects output containing any copied authentication value before performing GitHub or Git mutations.

The reviewer posts one normal review with a short summary and inline findings. Previous automated review text is deliberately excluded from model context so each head receives an independent review. Optional `why` evidence is validated against the injected knowledge and rendered as a permanent rule link.

The feedback parent accepts only complete Markdown or YAML file proposals under `wiki/reviewer/**`. Before applying a proposal it verifies that `origin/main` still matches the SHA inspected by the model. If main changed or the push races, it discards the proposal and runs the agent once more against fresh context; a second race returns a structured error for the coordinator to surface.

## Knowledge files

- [Rules](./rules.md) — compact implementation and review invariants distilled from accepted feedback.
- [Regression cases](./regressions.yml) — prior review patterns that should be checked again.
- [Exceptions](./exceptions.md) — intentionally waived or narrowly scoped findings.

Canonical product BDDs, API specifications, decisions, and architecture remain authoritative. Reviewer knowledge cannot supersede them. Raw pull-request conversation remains evidence; only authorized, durable, non-obvious learning becomes future reviewer context.

## Implementation files

- `review.py` — fetches one PR, launches the reviewer, validates its result, and posts through the App.
- `feedback.py` — gathers post-review evidence, launches the learner, and guards knowledge-only commits.
- `agent_runtime.py` — creates the isolated authenticated Codex SDK runtime.
- `github_review.py` — validates App credentials and implements GitHub reads and review submission.
- `test_*.py` — standard-library tests for host-side validation and safety boundaries.
