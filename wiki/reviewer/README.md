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

After this system is bootstrapped onto `main`, run a complete review from a temporary detached
checkout of the fetched `origin/main`, never from the candidate branch:

```text
python3 <trusted-main-worktree>/wiki/reviewer/review.py <number>
```

Run feedback learning from the same trusted-main boundary after that reviewed pull request merges:

```text
python3 <trusted-main-worktree>/wiki/reviewer/feedback.py <number>
```

For a non-mutating feedback-prompt test before merge, use `--dry-run`. It invokes the feedback agent and validates its proposal but never writes, commits, or pushes anything.

Both entrypoints take the PR number as their only production input. The orchestrator, rather than candidate code, creates and removes the trusted-main worktree. The first merge is a manual bootstrap; later changes to the reviewer are reviewed by the previously trusted main version. The entrypoints validate the local GitHub App configuration before running. The model subprocess receives neither the PEM nor an installation token. The SDK process loads a temporary copy of the Codex session, deletes that file, and removes directory access before starting the model turn. Candidate `AGENTS.md` discovery is disabled, the model shell receives an allowlisted environment without credential locations or tokens, and approvals are denied. A custom Codex permission profile permits reads only from the exact review checkout, any explicitly supplied second checkout, and the minimal system runtime; it denies checkout writes, temporary-directory reads, and shell network access. Native web search remains available separately. The parent rejects output containing any copied authentication value before performing GitHub or Git mutations.

The reviewer posts one normal review with a short summary and inline findings. Previous automated review text is deliberately excluded from model context so each head receives an independent review, while the trusted parent reads prior App-authored inline IDs and supplies the next sequential `CR-###` number. Duplicate-run markers count only when authored by the verified App bot identity. Optional `why` evidence is validated against the injected knowledge and rendered as a permanent rule link.

The feedback parent accepts only complete JSON rule records under `wiki/reviewer/rules/` and validated moves into `wiki/reviewer/retired/`. Every active learned rule retains an ordered origin-comment list; edits preserve that history and append a new source. Retirement preserves the record and requires an authorized owner-comment link and reason. The learner reads existing knowledge from a detached checkout of the exact `origin/main` SHA it proposes to update and inspects the merged implementation through a separate read-only checkout. Before applying a proposal the parent verifies that `origin/main` still matches the SHA inspected by the model. If main changed or the push races, it discards the proposal and runs the agent once more against fresh context; a second race returns a structured error for the coordinator to surface.

## Knowledge files

- [Baseline rules](./baseline.json) — manually maintained review invariants derived from canonical project sources.
- [Regression cases](./regressions.json) — prior review patterns that should be checked again.
- [Exceptions](./exceptions.json) — intentionally waived or narrowly scoped findings.
- `rules/*.json` — active learned rules with append-only comment provenance.
- `retired/*.json` — immutable retired rules with an explicit owner-comment retirement source.

Canonical product BDDs, API specifications, decisions, and architecture remain authoritative. Reviewer knowledge cannot supersede them. Raw pull-request conversation remains evidence; only authorized, durable, non-obvious learning becomes future reviewer context.

## Implementation files

- `review.py` — fetches one PR, launches the reviewer, validates its result, and posts through the App.
- `feedback.py` — gathers post-review evidence, launches the learner, and guards knowledge-only commits.
- `agent_runtime.py` — creates the isolated authenticated Codex SDK runtime.
- `github_review.py` — validates App credentials and implements GitHub reads and review submission.
- `test_*.py` — standard-library tests for host-side validation and safety boundaries.

Run the reviewer tests with:

```text
python3 -m unittest discover -s wiki/reviewer -p 'test_*.py'
```

On macOS with the Codex binary installed, the suite also runs deterministic commands through the production permission profile. Fake canary files verify that the checkout is readable while sibling secrets, fake authentication, fake PEM material, checkout writes, and shell network access are denied. These tests do not invoke a model or consume Codex usage.
