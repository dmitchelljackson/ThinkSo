# Minting Agent BDD acceptance criteria

This document is the behavioral source of truth for Section 7, the ThinkSo minting agent. It specifies the agent's observable product behavior and proposal contract. Transport and screen behavior remain in the Create Challenge Screen BDD. Unit tests, integration tests, and eval corpora verify these criteria but do not receive a separate BDD.

## Canonical sources

- [Create Challenge Screen BDD](./create-challenge-screen-bdd.md)
- [API specification](../api/api-specification.md)
- [Data model and state machines](../data/data-model-and-state-machines.md)
- [Product overview](../product/overview.md)
- [Decision register](../decisions/decision-register.md)
- Visual context: [ThinkSo Create Challenge](<../../raw/designs/thinkso-claude-export/ThinkSo Create Challenge.dc.html>)

The visual export contains illustrative mock content. This BDD supersedes its unsupported manual consequences, hardcoded dates, and simulated agent behavior.

## 7. Minting Agent

### 7.1 Begin every chat with the canonical persisted greeting

```gherkin
Given a new minting chat is created
When its first authoritative state is persisted
Then the first assistant message is "Okay, let's hear it. What are you so sure about?"
And that message is part of the stored transcript and later model context
And it is not regenerated independently by the client
```

### 7.2 Use ThinkSo's persisted transcript as canonical context

```gherkin
Given the user continues an active minting chat
When a new agent turn starts
Then its context is rebuilt from ThinkSo's persisted visible messages
And earlier messages are not silently rewritten
And incomplete provider protocol artifacts are not treated as conversation messages
```

### 7.3 Ask only for information required to mint a valid challenge

```gherkin
Given the user's request is incomplete or ambiguous
When the missing information changes the claim, parties, consequences, timing, or judgment terms
Then the agent asks a focused clarification before proposing
But when the required information can be established reliably through research or existing context
Then the agent proceeds without asking the user to supply facts it can verify itself
```

### 7.4 Make the outcome objectively binary

```gherkin
Given the user proposes a subjective, vague, or multi-interpretable claim
When the agent develops resolution terms
Then it clarifies or narrows the claim into an objectively judgeable TRUE or FALSE proposition
And the terms define what counts, what does not count, and how ties or edge conditions resolve when relevant
And the proposal is not persisted while material ambiguity remains
```

### 7.5 Mint descriptive participant names separately from identity

```gherkin
Given the authenticated creator has a default account display name
And the creator names an intended opponent
When the proposal is minted
Then the creator name defaults to the account display name
And the creator may ask the agent to change that proposal-specific name without changing the account profile
And both the creator and intended-opponent names are stored as immutable descriptive Contract text
And the agent does not claim that only that person may accept
And the proposal remains compatible with the first eligible link-holder becoming the bound challenger
```

### 7.6 Require exact post consequences for both possible losers

```gherkin
Given the agent is ready to mint a proposal
When it constructs the consequence terms
Then it includes one exact pre-approved Threads post for the creator-loses outcome
And one exact pre-approved Threads post for the challenger-loses outcome
And the verdict can deterministically select the losing participant and exact post
And neither post requires later LLM rewriting
```

### 7.7 Exclude unsupported manual consequences

```gherkin
Given the user requests a profile change, payment, purchase, offline dare, physical act, or another consequence ThinkSo cannot execute
When the agent responds
Then it does not persist that action as an MVP consequence
And it explains that ThinkSo consequences are exact Threads posts
And it helps convert the idea into acceptable post text when possible
```

### 7.8 Allow edgy but permissible trash talk

```gherkin
Given proposed post text contains profanity, ordinary non-protected name-calling, harsh self-deprecation, edgy rivalry jokes, or consensual embarrassment
When context, target, severity, and repetition remain within the product boundary
Then the agent may preserve that tone
And it does not sanitize text merely because it is impolite or offensive
```

### 7.9 Refuse consequences that cross the product boundary

```gherkin
Given proposed post text attacks a protected class, targets someone for harassment, contains a credible threat, exposes private information, impersonates or deceives, requires illegal conduct, or creates genuine danger
When the agent evaluates it
Then no proposal containing that consequence is persisted
And the agent briefly identifies the problem
And it may help produce a permissible alternative without repeating unnecessary harmful detail
```

### 7.10 Research whenever verified context is insufficient

```gherkin
Given the agent cannot establish future judgeability and credible evidence sources from already verified context
When it develops the resolution terms
Then it uses web research
And it verifies that the event, measurement, organization, or result source is real or plausibly observable
And it does not rely on unsupported model memory for a material judgment fact
```

### 7.11 Avoid ceremonial duplicate research

```gherkin
Given the required fact and source hierarchy are already established by current verified context
When the agent continues refining the proposal
Then it may reuse that verified context
And it does not repeat searches solely to satisfy a fixed tool-call count
```

### 7.12 Establish sources for future events without inventing future URLs

```gherkin
Given the challenge concerns a future event whose final result page does not yet exist
When the agent verifies its judgment path
Then it establishes that the event is real and the result will plausibly be observable
And it names a credible source or source hierarchy in the resolution terms
And it does not fabricate a future result URL
```

### 7.13 Put the source hierarchy inside the official terms

```gherkin
Given the agent mints a proposal
When the immutable resolution contract is written
Then its prose states the intended evidence sources or fallback hierarchy clearly
And it states the evidence-sufficiency rule appropriate to the claim
And that rule may allow one authoritative official result or require agreement among a defined number or class of qualifying sources
And no parallel structured judgment-source field is required
And those terms are sufficient to be placed prominently into the later judging prompt
```

### 7.14 Refuse an unjudgeable evidence path

```gherkin
Given research and clarification cannot establish credible objective evidence within the judgment window
When the agent reaches that conclusion
Then it does not call the proposal tool
And it explains what claim, evidence path, or timing must change
And it does not invent sources or imply that ThinkSo can judge the current request
```

### 7.15 Supply an exact acceptance expiration

```gherkin
Given the agent constructs a proposal
When it chooses acceptance_expiration
Then it supplies an exact timezone-qualified instant
And it chooses the last fair commitment point before outcome-revealing information is expected
And it may choose a short window for microbet-style events
And it does not use a fixed seven-day acceptance fallback
```

### 7.16 Supply an event-aware first judgment time

```gherkin
Given the underlying event or measurement has a known completion or result period
When the agent chooses resolution_date
Then it begins judgment immediately after the result should reasonably become available
And it does not add arbitrary publication delay merely for convenience
And acceptance_expiration is strictly earlier than resolution_date
```

### 7.17 Provide a reasonable evidence-verification window

```gherkin
Given the agent chooses resolution_expiration
When the proposal is validated
Then the interval from resolution_date through resolution_expiration is at least 48 hours
And seven days is the normal prompt-guided verification window
And the agent may extend it when the evidence source or event warrants more time
```

### 7.18 Use the proposal tool without hidden date fallbacks

```gherkin
Given the agent calls the proposal tool
When acceptance_expiration, resolution_date, or resolution_expiration is missing or invalid
Then the tool rejects the call
And application code does not silently fill a fallback date
And the agent repairs the values from verified context or asks the user when a material choice is required
```

### 7.19 Submit the complete proposal contract

```gherkin
Given the claim is objectively judgeable and all required choices are known
When the proposal tool is called
Then it supplies title, creator display text, intended-opponent text, official resolution terms, exact acceptance expiration, first judgment, resolve-by time, and both exact post consequences
And the terms include the evidence-source hierarchy
And server validation remains authoritative
```

### 7.20 Persist before presenting a proposal

```gherkin
Given a proposal tool call passes validation
When the proposal is created
Then a new immutable Contract row is committed in PROPOSED
And only after commit may proposal_created expose the canonical Contract
And transient assistant prose is never mistaken for a persisted proposal
```

### 7.21 Create revisions as new proposals

```gherkin
Given an earlier proposal exists and the user requests a change
When the agent produces the revision
Then it calls the proposal tool again
And a new immutable PROPOSED Contract is stored
And the earlier proposal remains unchanged and selectable
```

### 7.22 Never mutate or send a proposal implicitly

```gherkin
Given the agent has persisted a proposal
When it continues the conversation
Then it cannot edit that proposal in place
And it cannot transition it to SENT
And only the creator's explicit confirmed SEND IT mutation sends the selected proposal
```

### 7.23 Respect one active turn per chat

```gherkin
Given a minting-agent turn is already ACCEPTED or RUNNING
When another user-message command attempts to start a turn
Then no second turn is started or queued
And the command receives the active-turn conflict defined by the API
```

### 7.24 Preserve a user-stopped partial response safely

```gherkin
Given the user stops a turn after assistant text became visible
When the turn reaches CANCELLED
Then the visible text is persisted as a STOPPED assistant message
And later model context includes that text plus an interruption marker
And dangling provider tool-call protocol items are excluded from later inference context
```

### 7.25 Distinguish disconnection from cancellation

```gherkin
Given every client listener disconnects while a turn is active
When the backend continues processing
Then the turn is not canceled merely because no listener remains
And completed messages and proposals are persisted
And a later connection reconstructs them through authoritative chat_state
```

### 7.26 Retry a failed turn without duplicating its user message

```gherkin
Given a user message was persisted and its associated agent turn reached FAILED
When that turn is retried
Then a new agent attempt uses the existing triggering message
And no second user message is created
And attempt lineage identifies the retry
```

### 7.27 End active work when the chat is abandoned

```gherkin
Given the user discards the creation flow during an active turn
When the chat becomes ABANDONED
Then provider cancellation is requested where possible
And late messages, tool results, or proposals remain private operational history only
And they cannot reactivate the chat or become user-visible
```

### 7.28 End active work when a proposal is sent

```gherkin
Given the user sends an existing proposal while another minting turn is active
When the send transaction succeeds
Then the chat becomes SENT
And the active turn is canceled
And late output cannot surface or alter the immutable sent Contract
```

### 7.29 Expose safe activity without hidden reasoning

```gherkin
Given the agent invokes research or proposal tools
When live activity is emitted to the client
Then events use safe labels such as SEARCHING THE WEB
And user-visible assistant text may summarize conclusions and sources
And chain-of-thought, hidden reasoning, credentials, and raw provider traces are never exposed
```

### 7.30 Record reproducibility and evaluation metadata

```gherkin
Given an agent turn or proposal attempt completes, fails, or is canceled
When its private operational record is finalized
Then it records the agent, prompt, model, and tool versions used
And it retains enough trace and outcome metadata for debugging and evaluation
And private traces are not included in the public Contract serialization
```

### 7.31 Refuse a new turn after the daily minting budget is exhausted

```gherkin
Given a non-exempt user has exhausted the current UTC day's minting budget
When another message attempts to start a minting-agent turn
Then no user message or agent turn is persisted
And no model or research provider is called
And the response and chat event identify the exact next reset time
And the budget notice is presentation metadata rather than minting-agent output or later model context
But existing system-owned work and sending an already-persisted proposal remain allowed
```

### 7.32 Enforce the remaining daily budget during a turn

```gherkin
Given a non-exempt user starts a minting turn with some daily budget remaining
When each model response and its server-side research complete
Then their actual charges are added to the turn and user's UTC-day usage
And another model step is started only while budget remains
When the completed step exhausts the remaining budget
Then the turn ends BUDGET_EXHAUSTED instead of continuing its loop
And any visible partial output is preserved as incomplete rather than presented as a finished answer
And no proposal is persisted unless it already passed validation and committed before exhaustion
And the in-flight request is the only permitted source of bounded overage
```

### 7.33 Stay focused on creating a challenge

```gherkin
Given the user asks for research, explanation, comparison, calculation, or clarification that reasonably helps form, verify, time, or revise a Contract
When the minting agent responds
Then it may answer or research that request as part of the creation flow
But given the user asks for unrelated general-assistant work such as completing schoolwork with no reasonable connection to a Contract
When the minting agent responds
Then it declines the unrelated task briefly
And it redirects the conversation toward creating or revising a challenge
And it does not invoke research or proposal tools solely for the unrelated task
```
