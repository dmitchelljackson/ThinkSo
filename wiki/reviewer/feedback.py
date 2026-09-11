#!/usr/bin/env python3
"""Learn durable reviewer knowledge from a merged ThinkSo pull request."""

from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys
import tempfile
from pathlib import Path
from typing import Any

from agent_runtime import (
    AgentRuntimeError,
    load_reviewer_knowledge,
    run_structured_agent,
)
from github_review import ReviewerError, authenticate, feedback_context, load_config

ROOT = Path(__file__).resolve().parents[2]
OWNER_ID = 6991658

FEEDBACK_SCHEMA: dict[str, Any] = {
    "type": "object",
    "properties": {
        "schema_version": {"type": "integer", "const": 1},
        "status": {"type": "string", "enum": ["learned", "no-change"]},
        "base_main_sha": {"type": "string", "pattern": "^[0-9a-f]{40}$"},
        "reason": {"type": "string", "minLength": 1, "maxLength": 1000},
        "changes": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "path": {
                        "type": "string",
                        "pattern": "^wiki/reviewer/.+\\.(md|yml|yaml)$",
                    },
                    "content": {"type": "string"},
                },
                "required": ["path", "content"],
                "additionalProperties": False,
            },
        },
    },
    "required": ["schema_version", "status", "base_main_sha", "reason", "changes"],
    "additionalProperties": False,
}


def git(*arguments: str, cwd: Path = ROOT, env: dict[str, str] | None = None) -> str:
    result = subprocess.run(
        ["git", *arguments],
        cwd=cwd,
        env=env,
        text=True,
        capture_output=True,
        check=False,
    )
    if result.returncode:
        raise ReviewerError(result.stderr.strip() or f"git {arguments[0]} failed")
    return result.stdout.strip()


def current_main() -> str:
    git("fetch", "origin", "main")
    return git("rev-parse", "origin/main")


def validate_result(result: dict[str, Any], base_sha: str) -> list[dict[str, str]]:
    if result.get("base_main_sha") != base_sha:
        raise ReviewerError("Feedback result was generated against the wrong main SHA")
    changes = result.get("changes")
    if not isinstance(changes, list):
        raise ReviewerError("Feedback result changes must be a list")
    if result.get("status") == "no-change" and changes:
        raise ReviewerError("no-change feedback must not contain file changes")
    if result.get("status") == "learned" and not changes:
        raise ReviewerError("learned feedback must contain at least one file change")
    seen: set[str] = set()
    for change in changes:
        path = change.get("path")
        content = change.get("content")
        if not isinstance(path, str) or not isinstance(content, str):
            raise ReviewerError("Feedback changes require string path and content")
        candidate = (ROOT / path).resolve()
        knowledge_root = (ROOT / "wiki/reviewer").resolve()
        if knowledge_root not in candidate.parents or candidate.suffix not in {
            ".md",
            ".yml",
            ".yaml",
        }:
            raise ReviewerError(f"Feedback path is outside reviewer knowledge: {path}")
        if path in seen:
            raise ReviewerError(f"Feedback path is duplicated: {path}")
        seen.add(path)
    return changes


def analyze(
    pr: int, *, allow_open: bool = False
) -> tuple[dict[str, Any], str, dict[str, Any]]:
    config = load_config()
    token, _ = authenticate(config)
    context = feedback_context(config, token, pr)
    pull = context["pull"]
    if not pull.get("merged") and not allow_open:
        raise ReviewerError(f"PR #{pr} has not merged")
    base_sha = current_main()
    evaluated_sha = (
        pull.get("merge_commit_sha") if pull.get("merged") else pull["head"]["sha"]
    )
    if not evaluated_sha:
        raise ReviewerError(f"PR #{pr} has no commit to evaluate")
    git("fetch", "origin")
    if not pull.get("merged"):
        git("fetch", "origin", f"pull/{pr}/head")
    git("fetch", "origin", pull["base"]["ref"])
    final_diff = git(
        "diff",
        "--no-ext-diff",
        "--find-renames",
        "--unified=80",
        f"{pull['base']['sha']}...{evaluated_sha}",
    )
    with tempfile.TemporaryDirectory(prefix="thinkso-feedback-") as temporary:
        checkout = Path(temporary) / "checkout"
        git("worktree", "add", "--detach", str(checkout), evaluated_sha)
        try:
            prompt = (ROOT / "wiki/agents/review-feedback.md").read_text(
                encoding="utf-8"
            )
            external = {
                "analysis_only": allow_open and not pull.get("merged"),
                "authorized_owner": {"id": OWNER_ID, "login": "dmitchelljackson"},
                "base_main_sha": base_sha,
                "evaluated_commit": evaluated_sha,
                "complete_final_diff": final_diff,
                "pull_request_context": context,
                "reviewer_knowledge": load_reviewer_knowledge(ROOT),
            }
            result = run_structured_agent(
                cwd=checkout,
                developer_prompt=prompt,
                external_context=external,
                output_schema=FEEDBACK_SCHEMA,
            )
        finally:
            git("worktree", "remove", "--force", str(checkout))
    validate_result(result, base_sha)
    return result, base_sha, config


def apply_and_push(
    pr: int, result: dict[str, Any], base_sha: str, config: dict[str, Any], token: str
) -> str | None:
    changes = validate_result(result, base_sha)
    if not changes:
        return None
    with tempfile.TemporaryDirectory(prefix="thinkso-feedback-apply-") as temporary:
        checkout = Path(temporary) / "checkout"
        git("worktree", "add", "--detach", str(checkout), base_sha)
        try:
            for change in changes:
                target = checkout / change["path"]
                target.parent.mkdir(parents=True, exist_ok=True)
                target.write_text(change["content"], encoding="utf-8")
            changed = git("status", "--porcelain=v1", cwd=checkout)
            paths = [line[3:] for line in changed.splitlines() if line]
            if any(not path.startswith("wiki/reviewer/") for path in paths):
                raise ReviewerError(
                    "Feedback attempted to change a path outside wiki/reviewer"
                )
            if not paths:
                return None
            git("add", "--", "wiki/reviewer", cwd=checkout)
            identity = {
                **os.environ,
                "GIT_AUTHOR_NAME": "thinkso-local-reviewer[bot]",
                "GIT_AUTHOR_EMAIL": "4877331+thinkso-local-reviewer[bot]@users.noreply.github.com",
                "GIT_COMMITTER_NAME": "thinkso-local-reviewer[bot]",
                "GIT_COMMITTER_EMAIL": "4877331+thinkso-local-reviewer[bot]@users.noreply.github.com",
            }
            git(
                "commit",
                "-m",
                f"docs(reviewer): learn from merged PR #{pr}",
                cwd=checkout,
                env=identity,
            )
            commit = git("rev-parse", "HEAD", cwd=checkout)
            askpass = Path(temporary) / "askpass.sh"
            askpass.write_text(
                '#!/bin/sh\nprintf "%s\\n" "$THINKSO_REVIEWER_GIT_TOKEN"\n'
            )
            askpass.chmod(0o700)
            push_env = {
                **os.environ,
                "GIT_ASKPASS": str(askpass),
                "GIT_TERMINAL_PROMPT": "0",
                "THINKSO_REVIEWER_GIT_TOKEN": token,
            }
            remote = f"https://x-access-token@github.com/{config['repository']}.git"
            git("push", remote, "HEAD:main", cwd=checkout, env=push_env)
            return commit
        finally:
            git("worktree", "remove", "--force", str(checkout))


def run_feedback(pr: int, *, dry_run: bool = False) -> dict[str, Any]:
    if dry_run:
        result, base_sha, _ = analyze(pr, allow_open=True)
        return {
            "status": "dry-run",
            "attempts": 1,
            "base_main_sha": base_sha,
            "proposal": result,
        }

    for attempt in (1, 2):
        result, base_sha, config = analyze(pr)
        latest = current_main()
        if latest != base_sha:
            if attempt == 1:
                continue
            raise ReviewerError(
                "MAIN_CHANGED_TWICE: origin/main changed during both attempts"
            )
        if result["status"] == "no-change":
            return {
                "status": "no-change",
                "attempts": attempt,
                "reason": result["reason"],
            }
        token, _ = authenticate(config)
        try:
            commit = apply_and_push(pr, result, base_sha, config, token)
        except ReviewerError as error:
            if attempt == 1 and (
                "non-fast-forward" in str(error) or "fetch first" in str(error)
            ):
                continue
            raise
        return {
            "status": "learned" if commit else "no-change",
            "attempts": attempt,
            "commit": commit,
            "changed_files": [change["path"] for change in result["changes"]],
        }
    raise ReviewerError("MAIN_CHANGED_TWICE: origin/main changed during both attempts")


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Learn from one ThinkSo pull request review."
    )
    parser.add_argument("pr", type=int)
    parser.add_argument(
        "--dry-run", action="store_true", help="Run analysis without applying changes."
    )
    arguments = parser.parse_args()
    try:
        print(
            json.dumps(
                run_feedback(arguments.pr, dry_run=arguments.dry_run),
                ensure_ascii=False,
            )
        )
        return 0
    except (ReviewerError, AgentRuntimeError) as error:
        message = str(error)
        code = (
            "MAIN_CHANGED_TWICE"
            if message.startswith("MAIN_CHANGED_TWICE")
            else type(error).__name__.upper()
        )
        print(
            json.dumps(
                {
                    "status": "error",
                    "code": code,
                    "attempts": 2 if code == "MAIN_CHANGED_TWICE" else 1,
                    "message": message,
                    "surface_to_user": True,
                    "user_message": message,
                }
            ),
            file=sys.stderr,
        )
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
