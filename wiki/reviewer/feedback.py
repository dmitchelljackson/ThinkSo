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
from github_review import (
    ReviewerError,
    authenticate,
    feedback_context,
    load_config,
    reviewer_app_user,
)

ROOT = Path(__file__).resolve().parents[2]
OWNER_ID = 6991658
ACTIVE_RULE_PREFIX = "wiki/reviewer/rules/"
RETIRED_RULE_PREFIX = "wiki/reviewer/retired/"
RULE_KINDS = {"invariant", "regression", "exception", "calibration"}

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
                    "operation": {"type": "string", "enum": ["write", "delete"]},
                    "path": {
                        "type": "string",
                        "pattern": "^wiki/reviewer/(rules|retired)/[a-z0-9-]+\\.json$",
                    },
                    "content": {"type": ["string", "null"]},
                },
                "required": ["operation", "path", "content"],
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


def feedback_origin_urls(
    context: dict[str, Any], app_user_id: int
) -> tuple[set[str], set[str]]:
    allowed: set[str] = set()
    owner: set[str] = set()
    for collection in ("review_comments", "issue_comments"):
        for comment in context[collection]:
            url = comment.get("html_url")
            if not isinstance(url, str):
                continue
            actor_id = comment.get("user", {}).get("id")
            if actor_id in {OWNER_ID, app_user_id}:
                allowed.add(url)
            if actor_id == OWNER_ID:
                owner.add(url)
            if any(
                reaction.get("user", {}).get("id") == OWNER_ID
                for reaction in comment.get("reactions", [])
            ):
                allowed.add(url)
                owner.add(url)
    return allowed, owner


def parse_rule_record(path: str, content: str) -> dict[str, Any]:
    try:
        record = json.loads(content)
    except json.JSONDecodeError as error:
        raise ReviewerError(
            f"Reviewer rule is invalid JSON: {path}: {error}"
        ) from error
    if not isinstance(record, dict):
        raise ReviewerError(f"Reviewer rule must be a JSON object: {path}")
    required = {
        "schema_version",
        "id",
        "status",
        "kind",
        "scope",
        "rule",
        "rationale",
        "origin",
        "retired_by",
    }
    if set(record) != required:
        raise ReviewerError(f"Reviewer rule has invalid fields: {path}")
    rule_id = Path(path).stem
    if record["schema_version"] != 1 or record["id"] != rule_id:
        raise ReviewerError(f"Reviewer rule identity does not match its path: {path}")
    if record["kind"] not in RULE_KINDS:
        raise ReviewerError(f"Reviewer rule has invalid kind: {path}")
    for field in ("scope", "rule", "rationale"):
        if not isinstance(record[field], str) or not record[field].strip():
            raise ReviewerError(f"Reviewer rule has empty {field}: {path}")
    origins = record["origin"]
    if not isinstance(origins, list) or not origins:
        raise ReviewerError(f"Reviewer rule requires origin links: {path}")
    for index, origin in enumerate(origins):
        if not isinstance(origin, dict) or set(origin) != {"url", "effect", "note"}:
            raise ReviewerError(f"Reviewer rule has invalid origin entry: {path}")
        expected_effect = "created" if index == 0 else "edited"
        if origin["effect"] != expected_effect:
            raise ReviewerError(
                f"Reviewer rule origin {index + 1} must be {expected_effect}: {path}"
            )
        if (
            not isinstance(origin["url"], str)
            or not isinstance(origin["note"], str)
            or not origin["note"].strip()
        ):
            raise ReviewerError(f"Reviewer rule has invalid origin values: {path}")
    return record


def validate_rule_changes(
    changes: list[dict[str, Any]],
    existing_knowledge: dict[str, str],
    allowed_origin_urls: set[str],
    owner_origin_urls: set[str],
) -> None:
    deletes = {change["path"] for change in changes if change["operation"] == "delete"}
    writes = {
        change["path"]: change for change in changes if change["operation"] == "write"
    }
    for change in changes:
        path = change["path"]
        content = change["content"]
        if change["operation"] == "delete":
            if content is not None or not path.startswith(ACTIVE_RULE_PREFIX):
                raise ReviewerError(
                    f"Only active reviewer rules may be deleted: {path}"
                )
            retired_path = f"{RETIRED_RULE_PREFIX}{Path(path).name}"
            if retired_path not in writes:
                raise ReviewerError(f"Retiring {path} requires {retired_path}")
            continue
        if not isinstance(content, str):
            raise ReviewerError(f"Reviewer rule write requires string content: {path}")
        record = parse_rule_record(path, content)
        origins = record["origin"]
        origin_urls = [origin["url"] for origin in origins]
        if len(origin_urls) != len(set(origin_urls)):
            raise ReviewerError(f"Reviewer rule repeats an origin link: {path}")
        previous_content = existing_knowledge.get(path)
        if path.startswith(ACTIVE_RULE_PREFIX):
            if record["status"] != "active" or record["retired_by"] is not None:
                raise ReviewerError(f"Active reviewer rule has invalid status: {path}")
            if previous_content is not None:
                previous = parse_rule_record(path, previous_content)
                if origins[: len(previous["origin"])] != previous["origin"]:
                    raise ReviewerError(
                        f"Reviewer rule origin history was rewritten: {path}"
                    )
                if len(origins) == len(previous["origin"]):
                    raise ReviewerError(
                        f"Reviewer rule edit must append an origin: {path}"
                    )
                new_origins = origins[len(previous["origin"]) :]
                if any(
                    origin["url"] not in allowed_origin_urls for origin in new_origins
                ):
                    raise ReviewerError(
                        f"Reviewer rule edit cites an unknown origin link: {path}"
                    )
            elif any(url not in allowed_origin_urls for url in origin_urls):
                raise ReviewerError(
                    f"Reviewer rule cites an unknown origin link: {path}"
                )
        else:
            active_path = f"{ACTIVE_RULE_PREFIX}{Path(path).name}"
            if record["status"] != "retired" or active_path not in deletes:
                raise ReviewerError(f"Retired rule must move an active rule: {path}")
            if path in existing_knowledge:
                raise ReviewerError(f"Retired reviewer records are immutable: {path}")
            if active_path not in existing_knowledge:
                raise ReviewerError(f"Retirement source does not exist: {active_path}")
            active = parse_rule_record(active_path, existing_knowledge[active_path])
            preserved_fields = (
                "schema_version",
                "id",
                "kind",
                "scope",
                "rule",
                "rationale",
                "origin",
            )
            if any(record[field] != active[field] for field in preserved_fields):
                raise ReviewerError(f"Retirement must preserve the active rule: {path}")
            retired_by = record["retired_by"]
            if (
                not isinstance(retired_by, dict)
                or set(retired_by) != {"url", "reason"}
                or not isinstance(retired_by["url"], str)
                or retired_by["url"] not in owner_origin_urls
                or not isinstance(retired_by["reason"], str)
                or not retired_by["reason"].strip()
            ):
                raise ReviewerError(
                    f"Retirement requires an owner comment and reason: {path}"
                )


def validate_result(
    result: dict[str, Any],
    base_sha: str,
    *,
    existing_knowledge: dict[str, str] | None = None,
    allowed_origin_urls: set[str] | None = None,
    owner_origin_urls: set[str] | None = None,
) -> list[dict[str, Any]]:
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
        operation = change.get("operation")
        path = change.get("path")
        content = change.get("content")
        if operation not in {"write", "delete"} or not isinstance(path, str):
            raise ReviewerError("Feedback changes require an operation and string path")
        if operation == "write" and not isinstance(content, str):
            raise ReviewerError("Feedback writes require string content")
        if operation == "delete" and content is not None:
            raise ReviewerError("Feedback deletes require null content")
        candidate = (ROOT / path).resolve()
        knowledge_root = (ROOT / "wiki/reviewer").resolve()
        if (
            knowledge_root not in candidate.parents
            or candidate.suffix != ".json"
            or not path.startswith((ACTIVE_RULE_PREFIX, RETIRED_RULE_PREFIX))
        ):
            raise ReviewerError(f"Feedback path is outside reviewer knowledge: {path}")
        if path in seen:
            raise ReviewerError(f"Feedback path is duplicated: {path}")
        seen.add(path)
    if existing_knowledge is not None:
        validate_rule_changes(
            changes,
            existing_knowledge,
            allowed_origin_urls or set(),
            owner_origin_urls or set(),
        )
    return changes


def analyze(
    pr: int, *, allow_open: bool = False
) -> tuple[dict[str, Any], str, dict[str, Any], set[str], set[str]]:
    config = load_config()
    token, installation = authenticate(config)
    app_user = reviewer_app_user(config, token, installation)
    context = feedback_context(config, token, pr)
    allowed_origins, owner_origins = feedback_origin_urls(context, app_user["id"])
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
        evaluated_checkout = Path(temporary) / "evaluated"
        main_checkout = Path(temporary) / "main"
        git("worktree", "add", "--detach", str(evaluated_checkout), evaluated_sha)
        try:
            git("worktree", "add", "--detach", str(main_checkout), base_sha)
            prompt = (ROOT / "wiki/agents/review-feedback.md").read_text(
                encoding="utf-8"
            )
            existing_knowledge = load_reviewer_knowledge(main_checkout)
            external = {
                "analysis_only": allow_open and not pull.get("merged"),
                "authorized_owner": {"id": OWNER_ID, "login": "dmitchelljackson"},
                "base_main_sha": base_sha,
                "evaluated_commit": evaluated_sha,
                "evaluated_checkout_path": str(evaluated_checkout),
                "complete_final_diff": final_diff,
                "pull_request_context": context,
                "allowed_origin_urls": sorted(allowed_origins),
                "owner_origin_urls": sorted(owner_origins),
                "reviewer_knowledge": existing_knowledge,
            }
            result = run_structured_agent(
                cwd=main_checkout,
                developer_prompt=prompt,
                external_context=external,
                output_schema=FEEDBACK_SCHEMA,
                additional_read_roots=(evaluated_checkout,),
            )
            validate_result(
                result,
                base_sha,
                existing_knowledge=existing_knowledge,
                allowed_origin_urls=allowed_origins,
                owner_origin_urls=owner_origins,
            )
        finally:
            if main_checkout.exists():
                git("worktree", "remove", "--force", str(main_checkout))
            git("worktree", "remove", "--force", str(evaluated_checkout))
    return result, base_sha, config, allowed_origins, owner_origins


def apply_and_push(
    pr: int,
    result: dict[str, Any],
    base_sha: str,
    config: dict[str, Any],
    token: str,
    allowed_origin_urls: set[str],
    owner_origin_urls: set[str],
) -> str | None:
    if not result["changes"]:
        return None
    with tempfile.TemporaryDirectory(prefix="thinkso-feedback-apply-") as temporary:
        checkout = Path(temporary) / "checkout"
        git("worktree", "add", "--detach", str(checkout), base_sha)
        try:
            changes = validate_result(
                result,
                base_sha,
                existing_knowledge=load_reviewer_knowledge(checkout),
                allowed_origin_urls=allowed_origin_urls,
                owner_origin_urls=owner_origin_urls,
            )
            for change in changes:
                target = checkout / change["path"]
                if change["operation"] == "delete":
                    target.unlink()
                else:
                    target.parent.mkdir(parents=True, exist_ok=True)
                    target.write_text(
                        json.dumps(
                            json.loads(change["content"]),
                            ensure_ascii=False,
                            indent=2,
                        )
                        + "\n",
                        encoding="utf-8",
                    )
            changed = git("status", "--porcelain=v1", cwd=checkout)
            paths = [line[3:] for line in changed.splitlines() if line]
            if any(not path.startswith("wiki/reviewer/") for path in paths):
                raise ReviewerError(
                    "Feedback attempted to change a path outside wiki/reviewer"
                )
            if not paths:
                return None
            git(
                "add",
                "-A",
                "--",
                "wiki/reviewer/rules",
                "wiki/reviewer/retired",
                cwd=checkout,
            )
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
        result, base_sha, _, _, _ = analyze(pr, allow_open=True)
        return {
            "status": "dry-run",
            "attempts": 1,
            "base_main_sha": base_sha,
            "proposal": result,
        }

    for attempt in (1, 2):
        result, base_sha, config, allowed_origins, owner_origins = analyze(pr)
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
            commit = apply_and_push(
                pr,
                result,
                base_sha,
                config,
                token,
                allowed_origins,
                owner_origins,
            )
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
