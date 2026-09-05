# Meta developer and Threads API setup

Implementation-oriented owner guide for H-006, T-050, and the Threads publication portions of T-140. It covers the Meta app, Threads OAuth credentials, test authorization, and the server-only secret handoff.

## Current boundary

As of 2026-09-04, the dedicated Meta app exists with the Threads use case, its Threads App ID and secret are configured in the ignored backend environment, and the designated Threads tester invitation is accepted. A persistent ngrok development domain is authenticated and running, and ignored local configuration contains the exact HTTPS URL ending in `/integrations/threads/callback`. Registering that URL in Meta and completing end-to-end authorization remain pending.

Meta's official Threads collection says to create a Meta app with the Threads use case, authorize app users, and request a Threads user access token. It documents the authorization-code exchange, long-lived-token exchange, refresh flow, and `threads_basic`/`threads_content_publish` permissions. Use the official collection and current Meta documentation as the contract; dashboard labels and navigation are not stable enough to reproduce from memory.

Official entry points: [Meta for Developers](https://developers.facebook.com/), [Threads API documentation](https://developers.facebook.com/docs/threads/), [Threads getting started](https://developers.facebook.com/docs/threads/get-started/), [Threads access tokens and permissions](https://developers.facebook.com/docs/threads/get-started/get-access-tokens-and-permissions/), and Meta's [official Threads Postman collection](https://www.postman.com/meta/threads/documentation/dht3nzz/threads-api).

## Sequence

### 1. Owner work now (Batch A)

1. Confirm access to the Facebook/Meta account that will own ThinkSo's developer app. Keep password, two-factor codes, recovery methods, and any business-verification material private.
2. Complete Meta developer registration, platform agreements, and any identity/business prompts shown for that account.
3. Prepare a dedicated Threads test account that the owner controls. Do not authorize a production or unrelated account before the agent gives the exact app/callback worksheet.
4. Do not create an app or register a callback from guessed values. A mismatch between the eventual HTTPS callback and the registered callback invalidates the authorization-code exchange.

### 2. Agent work before app activation

Before live T-050 verification, the agent must produce:

- the exact HTTPS callback URI for the configured persistent local ngrok tunnel, staging service, or deployment (one character must not be changed when copied into Meta);
- the exact authorization start URL shape and requested scope list; for ThinkSo's current product, the minimum expected scopes are `threads_basic` and `threads_content_publish`;
- the exact backend secret destination for the Threads app secret and encrypted user-token key/material;
- the expected non-secret app identifiers and a named test account;
- a smoke-test plan that stops before publishing unless the owner explicitly confirms the approved test account and exact text.

The agent owns generating a cryptographically random OAuth `state`, storing/consuming it server-side, and implementing the callback/exchange. The mobile app must never receive the app secret or long-lived Threads user token. See [Threads authorization lifecycle](../architecture/threads-authorization.md).

### 3. Owner work after the worksheet (Batch B)

Use the current Meta dashboard and linked documentation. If labels differ from this guide, follow the current official page and record the actual setting name in the worksheet; do not silently substitute a different product.

1. Create a dedicated Meta app and select the Threads use case described by Meta's current getting-started guide.
2. In the Threads product/authentication settings, register exactly the HTTPS callback URI supplied by the agent. Do not add a trailing slash, query string, alternate host, or local HTTP variant unless the agent explicitly supplies it and Meta's current documentation allows it.
3. Enable/request only the scopes the agent supplies. For the current MVP, the required pair is `threads_basic` and `threads_content_publish`; do not mark a connection usable if either is absent. Optional scopes for replies/insights are not part of this handoff unless a later ticket requests them.
4. Add the named Threads test account through the current test-user/role mechanism if the dashboard requires it, and complete any invitation acceptance in the Threads account. Record only a safe handle/ID.
5. If Meta requires app review, business verification, publication, or production access before non-role users can grant a permission, the owner completes that interactive process and records its state. A local test with an app role is not evidence that production access is approved.
6. Locate the Threads-specific App ID and app secret in the current app settings. Meta's official collection distinguishes the Threads App ID/secret used by Threads endpoints; do not substitute an unrelated Meta product's credentials.
7. Put the app secret directly into the agent-supplied backend secret manager/ignored local file. Never paste it into chat, the wiki, tickets, source, a URL, or a screenshot. Confirm only `configured`.

### 4. Agent verification after owner activation

The agent should verify with redacted logs and a designated test account:

1. Authorization starts with the exact registered callback and a one-time state value.
2. Meta redirects to the callback with a code/state (or an explicit provider error); the server verifies and consumes state.
3. The server exchanges the code at the documented Threads token endpoint using the Threads App ID/secret, then exchanges the short-lived token for a long-lived token and records its expiry.
4. `/me` (or the current documented profile endpoint) returns the expected Threads identity and both required scopes.
5. The encrypted token is stored server-side and `CONNECTED` is entered only after all checks pass. Withheld scope, callback mismatch, duplicate identity, or interrupted return follows the locked behavior in T-050.
6. A controlled test publication uses the exact pre-approved test text only if the owner authorized it; record provider post ID/link without recording the token.
7. A simulated invalid/revoked token moves the profile to `REAUTH_REQUIRED` without retiring the ThinkSo profile.

The official collection documents these relevant operations: code exchange at `POST https://graph.threads.net/oauth/access_token`, long-lived exchange at `GET https://graph.threads.net/access_token`, refresh at the documented refresh endpoint, and publishing through a media container followed by `threads_publish`. The implementation agent must re-check current endpoint details before coding because Meta evolves API versions and parameters.

## Secret and privacy rules

- The Threads app secret, short-lived/long-lived user access tokens, OAuth codes, and token-encryption keys are secrets. They belong only in the backend secret store and encrypted database path defined by the implementation.
- Never put secrets in mobile configuration, query strings copied into logs, provider screenshots, shell history, Postman environments committed to disk, or public tickets.
- Never ask the owner for passwords, two-factor codes, recovery data, or raw token values. A handoff says `configured`, not the value.
- Treat test-account handles and app IDs as non-secret but still avoid publishing personal account information unnecessarily.
- If a secret may have leaked, stop live testing, revoke/rotate it through Meta, replace it in the designated store, and record the incident without copying the old value.

## Acceptance evidence

The owner handoff is complete only when:

- the dedicated Meta app exists under the intended owner and the Threads use case is visible;
- the exact agent-generated callback is registered and recorded;
- the worksheet records the Threads App ID, granted/requested scopes, test-account handle, app-review state, and secret destination (not the secret);
- the backend can complete one controlled authorization-code flow and validate the expected Threads identity/scopes;
- the agent records one safe publication or an explicit reason publication remains blocked;
- revocation/invalid-token handling and the `REAUTH_REQUIRED` gate have deterministic evidence or a documented test limitation.

## Handoff worksheet

```text
status: NOT_STARTED | READY_FOR_AGENT | WAITING_FOR_OWNER | BLOCKED | VERIFIED
owner_meta_account: <safe account label or redacted email>
meta_app_name: <agent/owner-selected canonical name>
meta_app_id: <non-secret Meta app ID>
threads_app_id: <non-secret Threads App ID; confirm distinct from Meta app ID if shown>
threads_app_secret_destination: <agent-supplied backend secret path/name>
threads_app_secret_status: NOT_REQUESTED | CONFIGURED | ROTATE_REQUIRED
threads_callback_uri: configured in ignored `THREADS_OAUTH_REDIRECT_URI`; persistent ngrok origin plus `/integrations/threads/callback`
threads_scopes_requested: <exact list>
threads_scopes_granted: <exact list from provider evidence>
test_account: configured in ignored `THREADS_TEST_HANDLE`; value not committed
test_account_role_status: ACCEPTED
app_review_or_production_status: <NOT_STARTED | TESTING_ONLY | SUBMITTED | APPROVED | BLOCKED | NOT_REQUIRED>
provider_api_version: <agent-observed version or UNVERSIONED>
evidence: <redacted provider URL, command output, screenshot path, and post ID/link if safe>
next_agent_action: <one concrete action>
last_verified_utc: <ISO-8601 timestamp>
```

## Official references

- [Meta for Developers](https://developers.facebook.com/)
- [Threads API overview](https://developers.facebook.com/docs/threads/)
- [Threads getting started](https://developers.facebook.com/docs/threads/get-started/)
- [Threads access tokens and permissions](https://developers.facebook.com/docs/threads/get-started/get-access-tokens-and-permissions/)
- [Threads API authorization reference](https://developers.facebook.com/docs/threads/get-started/authorization/)
- [Meta's official Threads Postman collection](https://www.postman.com/meta/threads/documentation/dht3nzz/threads-api)
- [Meta's official Threads authorization requests](https://www.postman.com/meta/threads/folder/34203612-e0373e84-de6b-46f1-b90d-3fea76ba6782)
