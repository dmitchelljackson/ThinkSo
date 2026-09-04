# T-080 — Start, retain, and discard a creation chat

## Control

| Field | Value |
|---|---|
| Type / status | `PRODUCT` / `DRAFT` |
| Owner review | `PENDING` |
| Stack position / predecessor | `080` / T-070 |
| Branch / PR | `stack/080-creation-chat-lifecycle` / — |

## Outcome

Each creation entry starts a private persisted chat with the canonical greeting, multiline draft behavior, and correct pristine/non-pristine discard flow.

## Sources

- [Create BDD lifecycle cases](../behavior/create-challenge-screen-bdd.md#51-show-the-create-challenge-screen-structure)
- [Create UI](<../../raw/designs/thinkso-claude-export/ThinkSo Create Challenge.dc.html>)
- [`POST /chats` and chat snapshot](../api/api-specification.md#creation-chat)
- [Chat persistence/state](../data/data-model-and-state-machines.md#chats-chat_messages-agent_turns)

## Scope and work

- Chat/message tables, create and snapshot operations, canonical persisted greeting, Create presenter/UI structure, multiline/empty input behavior, pristine exit, discard dialog, abandon operation, and private retention.
- Agent turns/streaming are excluded to T-090.

### Work breakdown

- [ ] **Mobile:** Create structure/presenter, drafts, keyboard behavior, loading/error/discard navigation.
- [ ] **Backend:** chat/message persistence, create/snapshot/abandon operations, canonical greeting.
- [ ] **Agent:** N/A; greeting is persisted product content, not a model run.
- [ ] **Tests/CI:** privacy/ownership/API, presenter/draft/dialog/relaunch, migrations and native evidence.
- [ ] **Wiki:** chat retention/privacy observations and exact greeting ownership.

## Human requirements

H-001/AutoMobile for keyboard, draft, dialog, and navigation verification.

## Acceptance and gates

- [ ] BDD 5.1–5.7 and 5.26–5.31 pass.
- [ ] New entry never resurrects an old chat; abandoned data remains inaccessible to users.
- [ ] Exit dialog appears only after a sent message or nonempty draft.
- [ ] Greeting and transcript are backend-authoritative and survive relaunch.

## Activity log

Coordinator-only append-only entries go here.

## Observations and decisions

Retained abandoned chats are private training/eval candidates, subject to later privacy policy.

## Final handoff

Delivered behavior, candidate SHA, PR, tests, screenshots, and limitations go here.
