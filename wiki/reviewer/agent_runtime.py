#!/usr/bin/env python3
"""Shared, read-only Codex SDK runtime for ThinkSo reviewer agents."""

from __future__ import annotations

import json
import os
import tempfile
from pathlib import Path
from typing import Any


class AgentRuntimeError(Exception):
    """An actionable Codex runtime failure."""


def reviewer_model() -> str:
    model = os.environ.get("THINKSO_REVIEWER_MODEL", "gpt-5.6-sol")
    lowered = model.lower()
    if "sol" not in lowered or any(
        name in lowered for name in ("luna", "astra", "fable")
    ):
        raise AgentRuntimeError(
            f"Reviewer agents require a Sol model, received {model}"
        )
    return model


def _string_values(value: Any) -> set[str]:
    if isinstance(value, str):
        return {value} if len(value) >= 24 else set()
    if isinstance(value, dict):
        return set().union(*(_string_values(item) for item in value.values()), set())
    if isinstance(value, list):
        return set().union(*(_string_values(item) for item in value), set())
    return set()


def assert_no_secret_output(output: str, secrets: set[str]) -> None:
    if any(secret in output for secret in secrets):
        raise AgentRuntimeError(
            "Codex reviewer output contained authentication material"
        )


def _isolated_codex_home() -> tuple[
    tempfile.TemporaryDirectory[str], dict[str, str], Path, set[str]
]:
    source_home = Path(os.environ.get("CODEX_HOME", Path.home() / ".codex"))
    auth = source_home / "auth.json"
    if not auth.is_file():
        raise AgentRuntimeError(
            f"Codex ChatGPT authentication is missing: {auth}; run `codex login` first"
        )
    temporary = tempfile.TemporaryDirectory(prefix="thinkso-codex-")
    target_home = Path(temporary.name)
    target_auth = target_home / "auth.json"
    auth_bytes = auth.read_bytes()
    try:
        secrets = _string_values(json.loads(auth_bytes))
    except json.JSONDecodeError as error:
        temporary.cleanup()
        raise AgentRuntimeError(
            f"Codex authentication is invalid JSON: {auth}"
        ) from error
    target_auth.write_bytes(auth_bytes)
    target_auth.chmod(0o600)
    return temporary, {"CODEX_HOME": str(target_home)}, target_auth, secrets


def run_structured_agent(
    *,
    cwd: Path,
    developer_prompt: str,
    external_context: dict[str, Any],
    output_schema: dict[str, Any],
) -> dict[str, Any]:
    try:
        from openai_codex import (
            ApprovalMode,
            Codex,
            CodexConfig,
            ExternalMessage,
            Sandbox,
        )
        from openai_codex.types import ReasoningEffort
    except ImportError as error:
        raise AgentRuntimeError(
            "openai-codex is not installed; run "
            "`python3 -m pip install --user openai-codex==0.154.0`"
        ) from error

    temporary, codex_env, target_auth, secrets = _isolated_codex_home()
    credential_home = Path(temporary.name)
    credential_home_locked = False
    try:
        config = CodexConfig(
            cwd=str(cwd),
            env=codex_env,
            config_overrides=(
                'web_search="live"',
                "project_doc_max_bytes=0",
                "features.skill_search=false",
                "features.skip_host_skill_discovery=true",
            ),
        )
        with Codex(config=config) as codex:
            account = codex.account()
            if account.account is None:
                raise AgentRuntimeError(
                    "Codex has no authenticated account; run `codex login`"
                )
            target_auth.unlink()
            credential_home.chmod(0o500)
            credential_home_locked = True
            shell_path = os.environ.get("PATH", "/usr/bin:/bin")
            thread = codex.thread_start(
                approval_mode=ApprovalMode.deny_all,
                cwd=str(cwd),
                developer_instructions=developer_prompt,
                ephemeral=True,
                model=reviewer_model(),
                sandbox=Sandbox.read_only,
                config={
                    "model_reasoning_effort": "high",
                    "web_search": "live",
                    "project_doc_max_bytes": 0,
                    "shell_environment_policy": {
                        "inherit": "none",
                        "set": {"PATH": shell_path, "LANG": "C.UTF-8"},
                    },
                },
            )
            result = thread.run(
                ExternalMessage(
                    tool_name="review_context",
                    namespace="thinkso",
                    content=json.dumps(external_context, ensure_ascii=False),
                ),
                effort=ReasoningEffort.high,
                output_schema=output_schema,
                sandbox=Sandbox.read_only,
                source="thinkso_reviewer",
            )
    except AgentRuntimeError:
        raise
    except Exception as error:
        raise AgentRuntimeError(f"Codex reviewer agent failed: {error}") from error
    finally:
        if credential_home_locked:
            credential_home.chmod(0o700)
        temporary.cleanup()

    if not result.final_response:
        raise AgentRuntimeError("Codex reviewer agent returned no final response")
    assert_no_secret_output(result.final_response, secrets)
    try:
        value = json.loads(result.final_response)
    except json.JSONDecodeError as error:
        raise AgentRuntimeError("Codex reviewer agent returned invalid JSON") from error
    if not isinstance(value, dict):
        raise AgentRuntimeError("Codex reviewer agent result must be a JSON object")
    return value


def load_reviewer_knowledge(root: Path) -> dict[str, str]:
    knowledge_root = root / "wiki" / "reviewer"
    allowed = {".md", ".yml", ".yaml"}
    return {
        path.relative_to(root).as_posix(): path.read_text(encoding="utf-8")
        for path in sorted(knowledge_root.iterdir())
        if path.is_file() and path.suffix in allowed
    }
