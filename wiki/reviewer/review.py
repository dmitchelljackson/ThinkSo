#!/usr/bin/env python3
"""Run the ThinkSo reviewer and post its structured review through the GitHub App."""

from __future__ import annotations

import argparse
import json
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
from github_review import (
    ReviewerError,
    authenticate,
    has_authenticated_marker,
    load_config,
    next_finding_number,
    pull_context,
    reviewer_app_user,
    submit_review,
)

ROOT = Path(__file__).resolve().parents[2]

REVIEW_SCHEMA: dict[str, Any] = {
    "type": "object",
    "properties": {
        "schema_version": {"type": "integer", "const": 1},
        "decision": {"type": "string", "enum": ["approve", "request-changes"]},
        "reviewed_head": {"type": "string", "pattern": "^[0-9a-f]{40}$"},
        "summary": {"type": "string", "minLength": 1, "maxLength": 300},
        "comments": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "id": {"type": "string", "pattern": "^CR-[0-9]{3}$"},
                    "severity": {"type": "string", "enum": ["P0", "P1", "P2", "P3"]},
                    "path": {"type": "string", "minLength": 1},
                    "line": {"type": "integer", "minimum": 1},
                    "side": {"type": "string", "enum": ["LEFT", "RIGHT"]},
                    "title": {"type": "string", "minLength": 1, "maxLength": 100},
                    "body": {"type": "string", "minLength": 1, "maxLength": 1500},
                    "why": {
                        "anyOf": [
                            {
                                "type": "object",
                                "properties": {
                                    "path": {"type": "string", "minLength": 1},
                                    "text": {"type": "string", "minLength": 1},
                                },
                                "required": ["path", "text"],
                                "additionalProperties": False,
                            },
                            {"type": "null"},
                        ]
                    },
                },
                "required": [
                    "id",
                    "severity",
                    "path",
                    "line",
                    "side",
                    "title",
                    "body",
                    "why",
                ],
                "additionalProperties": False,
            },
        },
    },
    "required": ["schema_version", "decision", "reviewed_head", "summary", "comments"],
    "additionalProperties": False,
}


def git(*arguments: str, cwd: Path = ROOT) -> str:
    result = subprocess.run(
        ["git", *arguments], cwd=cwd, text=True, capture_output=True, check=False
    )
    if result.returncode:
        raise ReviewerError(result.stderr.strip() or f"git {arguments[0]} failed")
    return result.stdout.strip()


def run_review(pr: int) -> dict[str, Any]:
    config = load_config()
    token, installation = authenticate(config)
    app_user = reviewer_app_user(config, token, installation)
    pull, files, reviews, review_comments = pull_context(config, token, pr)
    if pull["state"] != "open":
        raise ReviewerError(f"PR #{pr} is not open")
    head = pull["head"]["sha"]
    marker = f"<!-- thinkso-reviewer:run pr={pr} head={head} -->"
    if has_authenticated_marker(reviews, marker, app_user["id"]):
        raise ReviewerError(f"A reviewer run already exists for PR #{pr} at {head}")
    finding_id_start = next_finding_number(review_comments, app_user["id"])

    git("fetch", "origin", f"pull/{pr}/head")
    git("fetch", "origin", pull["base"]["ref"])
    full_diff = git(
        "diff",
        "--no-ext-diff",
        "--find-renames",
        "--unified=80",
        f"{pull['base']['sha']}...{head}",
    )
    knowledge = load_reviewer_knowledge(ROOT)
    with tempfile.TemporaryDirectory(prefix="thinkso-review-") as temporary:
        checkout = Path(temporary) / "checkout"
        git("worktree", "add", "--detach", str(checkout), head)
        try:
            prompt = (ROOT / "wiki/agents/code-reviewer.md").read_text(encoding="utf-8")
            context = {
                "pull_request": {
                    "number": pull["number"],
                    "title": pull["title"],
                    "body": pull.get("body") or "",
                    "head_sha": head,
                    "head_ref": pull["head"]["ref"],
                    "base_sha": pull["base"]["sha"],
                    "base_ref": pull["base"]["ref"],
                },
                "files": [
                    {
                        "filename": file["filename"],
                        "status": file["status"],
                        "additions": file["additions"],
                        "deletions": file["deletions"],
                        "patch": file.get("patch"),
                    }
                    for file in files
                ],
                "complete_diff": full_diff,
                "finding_id_start": finding_id_start,
                "reviewer_knowledge": knowledge,
            }
            result = run_structured_agent(
                cwd=checkout,
                developer_prompt=prompt,
                external_context=context,
                output_schema=REVIEW_SCHEMA,
            )
        finally:
            git("worktree", "remove", "--force", str(checkout))

    posted = submit_review(
        config,
        token,
        pr,
        result,
        files,
        app_user["id"],
        finding_id_start,
        knowledge,
    )
    return {
        "status": "reviewed",
        "pr": pr,
        "head": head,
        "decision": result["decision"],
        "comments": len(result["comments"]),
        "review": posted,
    }


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Review one ThinkSo pull request as the App."
    )
    parser.add_argument("pr", type=int)
    arguments = parser.parse_args()
    try:
        print(json.dumps(run_review(arguments.pr), ensure_ascii=False))
        return 0
    except (ReviewerError, AgentRuntimeError) as error:
        print(
            json.dumps(
                {
                    "status": "error",
                    "code": type(error).__name__.upper(),
                    "message": str(error),
                    "surface_to_user": True,
                    "user_message": str(error),
                }
            ),
            file=sys.stderr,
        )
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
