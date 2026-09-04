# Reference: LLM Wiki pattern

- Author: Andrej Karpathy
- URL: https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f
- Role: structural inspiration for the ThinkSo internal wiki.

Adopted ideas:

- separate immutable raw sources from agent-maintained synthesis;
- maintain a content-oriented index;
- maintain an append-only chronological log;
- define wiki schema and workflows in `AGENTS.md`;
- integrate new decisions across existing pages rather than accumulating disconnected summaries.

The ThinkSo structure is intentionally project-specific rather than a verbatim copy of the reference.
