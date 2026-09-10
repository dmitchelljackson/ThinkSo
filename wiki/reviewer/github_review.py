#!/usr/bin/env python3
"""Guarded GitHub App interface for ThinkSo pull-request reviews."""

from __future__ import annotations

import argparse
import base64
import json
import os
import re
import shutil
import stat
import subprocess
import sys
import time
from pathlib import Path
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

API_BASE = "https://api.github.com"
API_VERSION = "2022-11-28"
DECISIONS = {
    "approve": "APPROVE",
    "request-changes": "REQUEST_CHANGES",
    "comment": "COMMENT",
}
SEVERITIES = {"P0", "P1", "P2", "P3"}


class ReviewerError(Exception):
    """A concise, actionable reviewer CLI error."""


def encode(value: bytes) -> str:
    return base64.urlsafe_b64encode(value).rstrip(b"=").decode("ascii")


def config_path() -> Path:
    configured = os.environ.get("THINKSO_REVIEWER_CONFIG_PATH")
    if configured:
        return Path(configured).expanduser()
    return Path.home() / ".config/thinkso-local-reviewer/config.json"


def load_config() -> dict[str, Any]:
    path = config_path()
    try:
        config = json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError as error:
        raise ReviewerError(f"Reviewer config is not installed: {path}") from error
    except json.JSONDecodeError as error:
        raise ReviewerError(f"Reviewer config is invalid JSON: {path}: {error}") from error

    required = ("app_id", "installation_id", "private_key_path", "repository")
    for key in required:
        if not config.get(key):
            raise ReviewerError(f"Reviewer config is missing {key}: {path}")
    if not str(config["app_id"]).isdigit():
        raise ReviewerError("Reviewer app_id must be numeric")
    if not str(config["installation_id"]).isdigit():
        raise ReviewerError("Reviewer installation_id must be numeric")
    if not re.fullmatch(r"[^/]+/[^/]+", str(config["repository"])):
        raise ReviewerError("Reviewer repository must use owner/name format")

    key_path = Path(str(config["private_key_path"])).expanduser()
    try:
        key_status = key_path.stat()
    except FileNotFoundError as error:
        raise ReviewerError(f"GitHub App PEM is not installed: {key_path}") from error
    if not stat.S_ISREG(key_status.st_mode):
        raise ReviewerError(f"GitHub App PEM is not a file: {key_path}")
    if stat.S_IMODE(key_status.st_mode) & 0o077:
        raise ReviewerError("GitHub App PEM must not be accessible by group or others")
    openssl = shutil.which("openssl")
    if not openssl:
        raise ReviewerError("OpenSSL is required but was not found on PATH")
    checked = subprocess.run(
        [openssl, "pkey", "-in", str(key_path), "-noout", "-check"],
        capture_output=True,
        text=True,
        check=False,
    )
    if checked.returncode:
        raise ReviewerError(f"GitHub App PEM is invalid: {key_path}")

    config["private_key_path"] = str(key_path)
    config["openssl"] = openssl
    return config


def app_jwt(config: dict[str, Any]) -> str:
    now = int(time.time())
    header = encode(json.dumps({"alg": "RS256", "typ": "JWT"}, separators=(",", ":")).encode())
    payload = encode(
        json.dumps(
            {"iat": now - 60, "exp": now + 540, "iss": str(config["app_id"])},
            separators=(",", ":"),
        ).encode()
    )
    unsigned = f"{header}.{payload}".encode("ascii")
    signed = subprocess.run(
        [config["openssl"], "dgst", "-sha256", "-sign", config["private_key_path"]],
        input=unsigned,
        capture_output=True,
        check=False,
    )
    if signed.returncode:
        raise ReviewerError("Unable to sign GitHub App JWT with the configured PEM")
    return f"{unsigned.decode('ascii')}.{encode(signed.stdout)}"


def github(
    api_path: str,
    *,
    token: str,
    method: str = "GET",
    body: dict[str, Any] | None = None,
) -> Any:
    data = json.dumps(body).encode() if body is not None else None
    request = Request(
        f"{API_BASE}{api_path}",
        method=method,
        data=data,
        headers={
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": API_VERSION,
            "Authorization": f"Bearer {token}",
            **({"Content-Type": "application/json"} if body is not None else {}),
        },
    )
    try:
        with urlopen(request, timeout=30) as response:
            content = response.read().decode("utf-8")
    except HTTPError as error:
        detail = error.read().decode("utf-8", errors="replace")
        try:
            message = json.loads(detail).get("message", detail)
        except json.JSONDecodeError:
            message = detail
        raise ReviewerError(f"GitHub {error.code}: {message}") from error
    except URLError as error:
        raise ReviewerError(f"Cannot reach GitHub: {error.reason}") from error
    return json.loads(content) if content else None


def authenticate(config: dict[str, Any]) -> tuple[str, dict[str, Any]]:
    jwt = app_jwt(config)
    installation = github(f"/app/installations/{config['installation_id']}", token=jwt)
    if str(installation.get("app_id")) != str(config["app_id"]):
        raise ReviewerError("Configured installation does not belong to the configured GitHub App")
    if installation.get("permissions", {}).get("pull_requests") != "write":
        raise ReviewerError("GitHub App installation is missing Pull requests: write permission")
    repository_name = str(config["repository"]).split("/", 1)[1]
    token_result = github(
        f"/app/installations/{config['installation_id']}/access_tokens",
        token=jwt,
        method="POST",
        body={"repositories": [repository_name]},
    )
    token = token_result["token"]
    github(f"/repos/{config['repository']}", token=token)
    return token, installation


def all_pages(api_path: str, token: str) -> list[dict[str, Any]]:
    values: list[dict[str, Any]] = []
    page = 1
    while True:
        separator = "&" if "?" in api_path else "?"
        batch = github(f"{api_path}{separator}per_page=100&page={page}", token=token)
        values.extend(batch)
        if len(batch) < 100:
            return values
        page += 1


def pull_context(config: dict[str, Any], token: str, pr: int) -> tuple[Any, Any, Any]:
    repository = config["repository"]
    pull = github(f"/repos/{repository}/pulls/{pr}", token=token)
    files = all_pages(f"/repos/{repository}/pulls/{pr}/files", token)
    reviews = all_pages(f"/repos/{repository}/pulls/{pr}/reviews", token)
    return pull, files, reviews


def parse_inline_comment(value: str) -> dict[str, Any]:
    parts = value.split("|", 5)
    if len(parts) != 6:
        raise ReviewerError("Invalid --comment; expected ID|SEVERITY|PATH|LINE|SIDE|BODY")
    finding_id, severity, file_path, line_value, side, body = parts
    severity = severity.upper()
    side = side.upper()
    if not re.fullmatch(r"CR-\d{3}", finding_id):
        raise ReviewerError(f"Invalid finding ID: {finding_id}")
    if severity not in SEVERITIES:
        raise ReviewerError(f"Invalid severity for {finding_id}: {severity}")
    if not file_path or file_path.startswith("/") or ".." in Path(file_path).parts:
        raise ReviewerError(f"Invalid repository-relative path for {finding_id}: {file_path}")
    try:
        line = int(line_value)
    except ValueError as error:
        raise ReviewerError(f"Invalid line for {finding_id}: {line_value}") from error
    if line < 1:
        raise ReviewerError(f"Invalid line for {finding_id}: {line_value}")
    if side not in {"LEFT", "RIGHT"}:
        raise ReviewerError(f"Invalid side for {finding_id}: {side}")
    body = body.strip()
    if not 1 <= len(body) <= 1500:
        raise ReviewerError(f"Body for {finding_id} must contain 1-1500 characters")
    return {
        "id": finding_id,
        "severity": severity,
        "path": file_path,
        "line": line,
        "side": side,
        "body": body,
    }


def validate_summary(summary: str) -> str:
    summary = summary.strip()
    if not 1 <= len(summary) <= 300:
        raise ReviewerError("Summary must contain 1-300 characters")
    if "\n" in summary or "\r" in summary:
        raise ReviewerError("Summary must be one short paragraph with no line breaks")
    return summary


def commentable_lines(patch: str | None) -> set[tuple[str, int]]:
    result: set[tuple[str, int]] = set()
    if not patch:
        return result
    old_line = 0
    new_line = 0
    for text in patch.splitlines():
        hunk = re.match(r"^@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@", text)
        if hunk:
            old_line, new_line = int(hunk.group(1)), int(hunk.group(2))
        elif text.startswith("+") and not text.startswith("+++"):
            result.add(("RIGHT", new_line))
            new_line += 1
        elif text.startswith("-") and not text.startswith("---"):
            result.add(("LEFT", old_line))
            old_line += 1
        elif text.startswith(" "):
            result.add(("LEFT", old_line))
            result.add(("RIGHT", new_line))
            old_line += 1
            new_line += 1
    return result


def command_doctor(_: argparse.Namespace) -> None:
    config = load_config()
    _, installation = authenticate(config)
    print(
        json.dumps(
            {
                "ok": True,
                "repository": config["repository"],
                "app_id": str(config["app_id"]),
                "installation_id": str(config["installation_id"]),
                "permissions": installation["permissions"],
            }
        )
    )


def command_pr(arguments: argparse.Namespace) -> None:
    config = load_config()
    token, _ = authenticate(config)
    pull, files, _ = pull_context(config, token, arguments.pr)
    print(
        json.dumps(
            {
                "number": pull["number"],
                "state": pull["state"],
                "head": pull["head"]["sha"],
                "head_ref": pull["head"]["ref"],
                "base": pull["base"]["sha"],
                "base_ref": pull["base"]["ref"],
                "files": [
                    {
                        "filename": file["filename"],
                        "status": file["status"],
                        "patch": file.get("patch"),
                    }
                    for file in files
                ],
            }
        )
    )


def command_submit(arguments: argparse.Namespace) -> None:
    summary = validate_summary(arguments.summary)
    comments = [parse_inline_comment(value) for value in arguments.comment]
    ids = [comment["id"] for comment in comments]
    if len(ids) != len(set(ids)):
        raise ReviewerError("Finding IDs must be unique within one review")
    event = DECISIONS[arguments.decision]
    blocking = [comment for comment in comments if comment["severity"] in {"P0", "P1"}]
    if event == "REQUEST_CHANGES" and not comments:
        raise ReviewerError("request-changes requires at least one inline --comment")
    if event != "REQUEST_CHANGES" and blocking:
        raise ReviewerError("P0/P1 findings require decision request-changes")

    config = load_config()
    token, _ = authenticate(config)
    pull, files, reviews = pull_context(config, token, arguments.pr)
    if pull["state"] != "open":
        raise ReviewerError(f"PR #{arguments.pr} is not open")
    if pull["head"]["sha"] != arguments.commit:
        raise ReviewerError(
            f"Stale review: PR head is {pull['head']['sha']}, not {arguments.commit}"
        )
    marker = f"<!-- thinkso-reviewer:run pr={arguments.pr} head={arguments.commit} -->"
    if any(marker in (review.get("body") or "") for review in reviews):
        raise ReviewerError(
            f"A reviewer run already exists for PR #{arguments.pr} at {arguments.commit}"
        )

    changed_files = {file["filename"]: commentable_lines(file.get("patch")) for file in files}
    for comment in comments:
        if comment["path"] not in changed_files:
            raise ReviewerError(
                f"{comment['id']} targets a file outside the PR diff: {comment['path']}"
            )
        location = (comment["side"], comment["line"])
        if location not in changed_files[comment["path"]]:
            raise ReviewerError(
                f"{comment['id']} targets a non-commentable diff line: "
                f"{comment['path']}:{comment['line']}:{comment['side']}"
            )

    result = github(
        f"/repos/{config['repository']}/pulls/{arguments.pr}/reviews",
        token=token,
        method="POST",
        body={
            "commit_id": arguments.commit,
            "event": event,
            "body": f"{marker}\n\n{summary}",
            "comments": [
                {
                    "path": comment["path"],
                    "line": comment["line"],
                    "side": comment["side"],
                    "body": f"**{comment['id']} · {comment['severity']}**\n\n{comment['body']}",
                }
                for comment in comments
            ],
        },
    )
    print(
        json.dumps(
            {
                "id": result["id"],
                "state": result["state"],
                "html_url": result["html_url"],
                "inline_comments": len(comments),
            }
        )
    )


def parser() -> argparse.ArgumentParser:
    root = argparse.ArgumentParser(
        description="Validate and submit structured ThinkSo reviews as the GitHub App."
    )
    commands = root.add_subparsers(dest="command", required=True)
    doctor = commands.add_parser(
        "doctor", help="Validate local PEM, App installation, and permissions."
    )
    doctor.set_defaults(function=command_doctor)
    pull = commands.add_parser("pr", help="Read current PR metadata and patches.")
    pull.add_argument("--pr", type=int, required=True)
    pull.set_defaults(function=command_pr)
    submit = commands.add_parser(
        "submit", help="Submit one summary with structured inline comments."
    )
    submit.add_argument("--pr", type=int, required=True)
    submit.add_argument("--commit", required=True)
    submit.add_argument("--decision", choices=DECISIONS, required=True)
    submit.add_argument("--summary", required=True)
    submit.add_argument(
        "--comment",
        action="append",
        default=[],
        metavar="ID|SEVERITY|PATH|LINE|SIDE|BODY",
        help="Repeat for each inline finding.",
    )
    submit.set_defaults(function=command_submit)
    return root


def main() -> int:
    try:
        arguments = parser().parse_args()
        arguments.function(arguments)
        return 0
    except ReviewerError as error:
        print(f"reviewer: {error}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
