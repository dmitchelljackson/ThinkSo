---
name: thinkso-pr-feedback
description:
  After the ThinkSo orchestrator detects a reviewed pull request merge, dispatch the feedback
  subagent that follows the canonical wiki feedback role and updates only wiki/reviewer/.
---

# ThinkSo PR feedback trigger

After a reviewed pull request is detected as merged, launch one feedback subagent.

- OpenAI/Codex feedback agent: use the current affordable Sol model, never Luna or Astra.
- Anthropic/Claude feedback agent: use the current Opus model, never a cheaper Claude tier or Fable.
- Give the subagent exactly this prompt, changing only the pull request number:
  `Follow wiki/agents/review-feedback.md for PR #<number>.`

The orchestrator must not reinterpret the feedback. The wiki role owns authorization, context
discovery, learning classification, path limits, validation, and the GitHub App commit.
