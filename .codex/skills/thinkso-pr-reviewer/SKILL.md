---
name: thinkso-pr-reviewer
description:
  After the ThinkSo orchestrator pushes or updates a pull request, dispatch the independent reviewer
  subagent that follows the canonical wiki reviewer role and posts through the GitHub App.
---

# ThinkSo PR reviewer trigger

After a pull request is pushed or updated, launch one independent review subagent.

- OpenAI/Codex reviewer: use the current affordable Sol model, never Luna or Astra.
- Anthropic/Claude reviewer: use the current Opus model, never a cheaper Claude tier or Fable.
- Give the subagent exactly this prompt, changing only the pull request number:
  `Follow wiki/agents/code-reviewer.md for PR #<number>.`

The orchestrator must not duplicate the review. The wiki role owns context discovery, review
behavior, safety limits, output, and GitHub App posting.
