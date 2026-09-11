#!/usr/bin/env python3
"""Shared, read-only Codex SDK runtime for ThinkSo reviewer agents."""

from __future__ import annotations

import json
import os
import shutil
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


def _isolated_codex_home() -> tuple[tempfile.TemporaryDirectory[str], dict[str, str]]:
    source_home = Path(os.environ.get("CODEX_HOME", Path.home() / ".codex"))
    auth = source_home / "auth.json"
    if not auth.is_file():
        raise AgentRuntimeError(
            f"Codex ChatGPT authentication is missing: {auth}; run `codex login` first"
        )
    temporary = tempfile.TemporaryDirectory(prefix="thinkso-codex-")
    target_home = Path(temporary.name)
    target_auth = target_home / "auth.json"
    shutil.copyfile(auth, target_auth)
    target_auth.chmod(0o600)
    return temporary, {
        "CODEX_HOME": str(target_home),
        "HOME": str(target_home),
        "GH_TOKEN": "",
        "GITHUB_TOKEN": "",
        "OPENAI_API_KEY": "",
        "THINKSO_REVIEWER_APP_ID": "",
        "THINKSO_REVIEWER_INSTALLATION_ID": "",
        "THINKSO_REVIEWER_PRIVATE_KEY_PATH": "",
        "THINKSO_REVIEWER_CONFIG_PATH": "",
    }


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

    temporary, codex_env = _isolated_codex_home()
    try:
        config = CodexConfig(
            cwd=str(cwd),
            env=codex_env,
            config_overrides=(
                'web_search="live"',
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
            thread = codex.thread_start(
                approval_mode=ApprovalMode.deny_all,
                cwd=str(cwd),
                developer_instructions=developer_prompt,
                ephemeral=True,
                model=reviewer_model(),
                sandbox=Sandbox.read_only,
                config={"model_reasoning_effort": "high", "web_search": "live"},
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
        temporary.cleanup()

    if not result.final_response:
        raise AgentRuntimeError("Codex reviewer agent returned no final response")
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
