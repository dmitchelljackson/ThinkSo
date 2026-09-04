# OpenRouter key and budget guard setup

Implementation-oriented owner guide for H-007 and the live-agent portions of T-100/T-130/T-180. It covers a dedicated inference key, prepaid funding, the matching USD $25 UTC-day blast-radius limit, and evidence that both application and provider controls work.

## Locked target and current boundary

ThinkSo's locked agent configuration is:

- fixed model ID `z-ai/glm-5.3-flash` for each initial agent version;
- provider routing/failover only among providers serving that model; no automatic fallback to another model ID;
- application-side non-exempt minting budget of USD $0.25 per user per UTC day;
- a separate judging spend cap of USD $1.00 per Contract;
- a dedicated production OpenRouter key with a matching USD $25 daily provider-side limit;
- prepaid credits, manual refill, and automatic top-up disabled.

As of 2026-09-04, the implementation has no secret destination or live integration worksheet. The owner can prepare the OpenRouter account and billing guard now. The key should be created and placed only after the agent supplies the exact ignored/deployment secret destination.

OpenRouter's current API reference supports an API-key `limit` in USD and `limit_reset` values including `daily`; resets occur at midnight UTC. OpenRouter's workspace-budget feature is documented as Enterprise-only, so a workspace budget must not be treated as available on the demo account without an observed entitlement. The dedicated key limit is the required provider guard. See [Create a new API key](https://openrouter.ai/docs/api/api-reference/api-keys/create-a-new-api-key) and [Workspace budgets](https://openrouter.ai/docs/guides/features/workspaces/workspace-budgets).

## Sequence

### 1. Owner work now (Batch A)

1. Confirm access to the OpenRouter account that will own ThinkSo's spend. Keep account credentials and any management key private.
2. Add only the prepaid credit intended for the demo. Do not enable automatic top-up. Use the current account billing/credits controls; labels and plan options can change, so record what was actually observed.
3. Do not reuse a personal/general-purpose inference key. Decide on a dedicated key name such as `ThinkSo production` (the exact display name is non-secret).
4. Do not spend live credits on broad exploratory prompts. Agent tests use fakes by default and bounded smoke cases only after the guard is verified.

### 2. Agent work before key placement

After the backend configuration exists, the agent must prepare:

- the exact ignored local/deployment secret destination and environment-variable name for the inference key (do not invent a name in this guide);
- application configuration for `z-ai/glm-5.3-flash`, provider routing, output/token bounds, and bounded web-search usage;
- the application-side USD $0.25 per-user UTC-day ledger/gate and the USD $1.00 per-Contract judging cap;
- a redacted verification command that proves the key is usable without echoing it;
- a live smoke budget and an explicit stop condition before any test that could publish or incur material spend.

The agent must not place a key in mobile code, an `EXPO_PUBLIC_*` variable, source control, logs, or a chat message. It owns application-side limits and tests; the owner owns account billing and provider-side controls.

### 3. Owner work after the worksheet (Batch B)

1. Create a dedicated standard OpenRouter inference key in the current key-management UI. If using the management API instead, note that OpenRouter documents management keys as administrative-only; they are not completion/inference credentials.
2. Set the key's spending limit to **25 USD** with a **daily** reset if that control is available for the selected account/key. Do not choose monthly or lifetime in place of the required daily guard. OpenRouter documents daily resets at midnight UTC.
3. If the account exposes an organization/workspace budget, configure it only after confirming the plan and role allow it. It is an additional defense, not a reason to skip the dedicated key limit. Keep limits ordered as required by OpenRouter if multiple intervals are configured.
4. Enter the key directly into the agent-supplied ignored local file, deployment secret manager, or CI secret store. Do not paste it into chat, the wiki, a ticket, a URL, a shell command, or a screenshot. Confirm only `configured`.
5. Record the non-secret key label/hash suffix (if the UI exposes one), configured limit/reset, current credit posture, and automatic-top-up state.

### 4. Agent verification after owner activation

The agent should verify in this order:

1. Startup validation reports the secret as present without printing its value.
2. A single bounded request succeeds using exactly `z-ai/glm-5.3-flash`; logs record model/provider/usage identifiers and cost, not the key.
3. Application-side accounting stops another user-initiated step at USD $0.25 remaining budget and emits the canonical `BUDGET_EXHAUSTED` behavior. System-owned judging/publication work remains governed by its separate limits.
4. A controlled provider-limit test uses a disposable/dedicated test key or a safe, explicitly approved method; do not burn the production allowance merely to prove rejection. Evidence must show that a request after the daily key limit is rejected while preserving safe application state.
5. The agent confirms no model fallback to a different model ID, no unbounded server search/output, and no secret leakage in redacted logs, traces, exceptions, screenshots, or CI output.
6. If a key may have leaked, stop use and ask the owner to revoke/rotate it in OpenRouter, then replace it only in the designated store.

## Secret, billing, and routing rules

- An OpenRouter inference key and management key are secrets. Never store either in the repository or wiki. The plaintext inference key is shown only at creation and cannot be retrieved later according to OpenRouter's API reference.
- The owner must not share OpenRouter account passwords, two-factor codes, management keys, or raw inference keys.
- The application limit and provider key limit are independent. An owner exemption in `UNLIMITED_AGENT_EMAILS` never bypasses the provider's $25 key limit.
- Do not use `openrouter/free`, a random router, or model fallback to another model. Provider failover is allowed only for the configured model ID.
- Do not treat a dashboard screenshot of a budget as evidence that the application ledger works; retain separate app-test evidence and provider-limit evidence.
- Any OpenRouter attribution headers are optional product telemetry and must not contain secrets. If used, follow [OpenRouter app attribution](https://openrouter.ai/docs/app-attribution).

## Acceptance evidence

The handoff is complete only when:

- prepaid credit is present, automatic top-up is disabled, and the owner records the observed billing state;
- a dedicated ThinkSo inference key exists with a USD $25 daily key limit (or a documented provider/account limitation is escalated before live use);
- the key is configured in the agent-supplied secret destination and has never appeared in source/chat/logs;
- a bounded live request succeeds with the fixed model and its redacted usage/cost evidence;
- application-side minting and judging spend caps pass deterministic tests, and provider-side rejection is separately evidenced or explicitly marked as pending a safe test;
- the worksheet identifies the key label/hash suffix, limit/reset, workspace/account context, and next rotation owner.

## Handoff worksheet

```text
status: NOT_STARTED | READY_FOR_AGENT | WAITING_FOR_OWNER | BLOCKED | VERIFIED
owner_openrouter_account: <safe account label or redacted email>
workspace_or_account_context: <non-secret name/ID, if applicable>
key_label: <non-secret display label>
key_hash_suffix: <last 4-8 characters only, if exposed>
inference_key_destination: <agent-supplied ignored path or secret name>
inference_key_status: NOT_REQUESTED | CONFIGURED | ROTATE_REQUIRED | REVOKED
provider_key_limit_usd: 25
provider_key_limit_reset: daily (midnight UTC)
prepaid_credit_status: <CONFIRMED | LOW | NOT_CONFIRMED>
automatic_top_up: DISABLED | ENABLED (BLOCKED) | NOT_VISIBLE
workspace_budget_status: <NOT_USED | CONFIGURED | NOT_AVAILABLE_ON_PLAN | OWNER_REVIEW_REQUIRED>
application_minting_budget: 0.25 USD per user per UTC day
application_judging_budget: 1.00 USD per Contract
fixed_model_id: z-ai/glm-5.3-flash
provider_fallback_policy: same-model providers only
evidence: <redacted command output, dashboard URL, test run path>
next_agent_action: <one concrete action>
rotation_owner_and_date: <safe owner label and review date>
last_verified_utc: <ISO-8601 timestamp>
```

## Official references

- [OpenRouter quickstart](https://openrouter.ai/docs/quickstart)
- [OpenRouter API keys: create a new key](https://openrouter.ai/docs/api/api-reference/api-keys/create-a-new-api-key)
- [OpenRouter management API keys](https://openrouter.ai/docs/guides/overview/auth/management-api-keys)
- [OpenRouter workspace budgets](https://openrouter.ai/docs/guides/features/workspaces/workspace-budgets)
- [OpenRouter workspaces](https://openrouter.ai/docs/guides/features/workspaces/overview)
- [OpenRouter model fallbacks](https://openrouter.ai/docs/guides/routing/model-fallbacks)
- [OpenRouter provider selection](https://openrouter.ai/docs/guides/routing/provider-selection)
- [OpenRouter app attribution](https://openrouter.ai/docs/app-attribution)
