# Agent architecture

## Locked runtime

Use PydanticAI as the small agent harness for both the minting and judging agents. It owns model/tool loops, typed tools and results, streaming, and agent-level dependency injection. It does not own ThinkSo persistence, durable scheduling, authorization, SSE delivery, or product state machines.

OpenRouter is the initial model gateway. Configure a fixed model ID for each versioned agent rather than using `openrouter/free` or another random model router. The initial model for both agents is:

```text
z-ai/glm-5.3-flash
```

Minting and judging model IDs are independently configurable so later eval evidence can change one without changing the other. Model selection changes require an explicit agent-version/config change and must be recorded with each attempt. Permit OpenRouter to route and fail over among providers serving the configured model. Do not configure automatic fallback to a different model ID.

## Tool boundary

PydanticAI tools are thin typed adapters to injected application ports. Tool implementations must not reach into a global container.

- Minting may use web research and the validated proposal-persistence operation.
- Judging may use web research and the validated judgment-submission operation.
- The minting system prompt keeps the agent on challenge creation. Contract-directed questions and research are in scope; unrelated general-assistant work is declined and redirected without tool use.
- Deterministic code—not prompt compliance alone—validates dates, state eligibility, proposal shape, permitted consequence type, and judgment output before mutation.
- A model never publishes directly to Threads or sends notifications.

OpenRouter web search is the initial research provider. Keep it behind a `WebResearch` port so citations, failures, cost accounting, and a future provider change remain testable without changing agent prompts or domain code.

## Execution and persistence

Each agent run executes inside a durable backend job. The database is authoritative for chat messages, turns, proposals, attempts, judgments, and cancellation state.

- Rebuild model context from persisted safe messages rather than treating provider conversation state as authoritative.
- Persist user-visible streamed output and broadcast it over SSE.
- Check cancellation between streaming/tool boundaries and suppress late output after a chat is stopped, abandoned, or finalized.
- Store safe messages, tool inputs/results, citations, usage, provider, model, `agent_version`, and `prompt_version`.
- Never persist or expose private chain-of-thought.

## Spend control

The default non-exempt budget is **USD $0.25 per user per UTC calendar day**.

- Gate new user-initiated minting-agent turns using the user's recorded daily spend.
- Initialize each minting run with that user's remaining daily budget and enforce it throughout the PydanticAI loop. After each provider response, add the actual model and server-tool search charges to the run and user ledger; do not dispatch another model step once the remaining budget is exhausted.
- A provider request already in flight—including its bounded server-side searches—may finish, so the total can exceed the daily threshold by that one request. This bounded overage is preferable to estimating and rejecting useful work prematurely.
- Configure OpenRouter web search with `max_uses` and `max_total_results`, and set model output limits, so one provider request cannot perform an unbounded amount of work before cost is reported.
- Stopping a generation does not erase cost already incurred.
- Judging, publication, notifications, retries required to finish an existing Contract, and other system-owned work are never stopped by the user minting budget.
- Keep a durable usage ledger with user, operation/attempt, provider, model, model cost, research cost, total cost, and provider usage identifiers when available.
- Exempt verified owner emails through deployment-secret configuration such as `UNLIMITED_AGENT_EMAILS`. The owner address belongs in deployment configuration and must not be hardcoded into the public repository.
- Use a dedicated production OpenRouter API key with a USD $25 UTC-day application limit and matching provider-enforced daily limit as the final blast-radius control. Owner exemption never bypasses that provider-key limit. For the demo, fund OpenRouter with prepaid credits, refill manually as needed, and leave automatic top-up disabled. These are adjustable operations settings rather than permanent product economics.

If the budget is reached during a turn, end the turn as `BUDGET_EXHAUSTED`, preserve any already-visible partial text as incomplete output, emit the authoritative budget notice, and permit retry of the same persisted user message after reset without duplicating it.

## Judging safeguards

- Schedule at most eight substantive evidence attempts per Contract between First Judgment and Resolve By, inclusive. Infrastructure retries of the same attempt do not consume another evidence slot.
- **MVP improvement:** cap cumulative model and research spend across all judge attempts for one Contract at USD $1.00.
- If that cap is reached, pause automatic judging and create operator-visible review work. Do not misrepresent an internal spend limit as an evidence-based UNRESOLVED outcome.
- Operator review may resume the same Contract with an explicit additional allowance; attempts remain idempotent and the immutable resolution terms still control.

## Testing

- Use PydanticAI test models and injected fake tools for deterministic agent-loop tests.
- Unit-test every tool implementation as ordinary application code.
- Test schema validation, invalid tool arguments, cancellation, duplicate delivery, provider errors, and budget accounting without live inference.
- Maintain small live-model smoke cases for tool compatibility and streaming.
- Build the substantive eval corpus from observed minting and judging failures; do not treat model choice as proven until those evals exist.
