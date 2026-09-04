# Threads authorization lifecycle

## Connection states

Every active ThinkSo profile has one of these server-owned Threads states:

- `NEVER_CONNECTED`: onboarding has never completed.
- `CONNECTED`: the backend holds a currently usable long-lived Threads user access token with the required scopes.
- `REAUTH_REQUIRED`: a previously connected profile has lost usable Threads authorization and must reconnect.

External revocation never retires the ThinkSo profile. Only the explicit in-app Disconnect Threads flow permanently retires it.

## Initial authorization

Threads uses the OAuth 2.0 Authorization Code flow:

1. the authenticated mobile app asks the backend to start authorization;
2. the backend creates a single-use, expiring state value bound to the ThinkSo user and returns the Meta authorization URL;
3. Meta redirects to the backend callback with `code` and `state`;
4. the backend verifies and consumes `state`;
5. the backend exchanges the code using the server-held Threads app secret;
6. the backend exchanges the short-lived token for a long-lived token;
7. the backend calls Threads `/me` and verifies the returned Threads identity and required `threads_basic` and `threads_content_publish` scopes;
8. the backend encrypts and stores the long-lived token and its exact expiry;
9. only after all steps succeed does the connection become `CONNECTED` and the client enter Main.

The app secret and Threads user token never reside on the mobile client.

The server connection state is authoritative if the mobile return is interrupted. Whenever Connect Threads regains focus and during the next application bootstrap, the client checks the backend status. If the backend already completed authorization and reports `CONNECTED`, the app routes directly to Main without a toast or another authorization attempt, even if the original deep link was missed.

If Connect Threads regains focus and the backend still reports the prior unconnected state, with no explicit provider error, treat the indeterminate return as cancellation. Stop loading, keep the local acknowledgment checked, re-enable Connect Threads, and show no toast.

Authorization is all-or-nothing for product access. If the user withholds either required scope, the attempt does not create a usable connection and does not change the profile to `CONNECTED`. The user remains behind the Connect Threads gate and may retry the complete authorization flow. Any partial or unusable credential obtained during the failed attempt must not be treated as an active social connection.

If the verified Threads user ID is already linked to another active ThinkSo profile, the attempt fails without changing either profile. MVP does not automatically transfer the connection, merge accounts, or allow duplicate ownership. The user remains behind the gate and receives an already-claimed toast with a logout action rather than retry. Logging out ends only the current ThinkSo session. Account recovery and transfer are a documented post-MVP limitation.

## Authorization maintenance

- A scheduled verification task checks every `CONNECTED` profile against Threads at least once every six hours.
- A daily maintenance task refreshes still-valid long-lived tokens that are within 30 days of expiry.
- Store `last_verified_at`, `expires_at`, granted scopes, and the most recent refresh/error metadata.
- A definitive Threads invalid-token, revoked-permission, missing-scope, or identity-mismatch response changes the connection to `REAUTH_REQUIRED`.
- A timeout, rate limit, Meta outage, or other transient failure does not change `CONNECTED` to `REAUTH_REQUIRED`; record the failure and retry later.
- Before a consequential action, the backend enforces `CONNECTED`. It may require a live `/me` verification when `last_verified_at` is older than 15 minutes.

## Product gate

`NEVER_CONNECTED` and `REAUTH_REQUIRED` are blocking states. The application displays Connect Threads instead of Main until authorization succeeds.

While `REAUTH_REQUIRED`, the user cannot enter Main, view history or shared Contracts, mint contracts, accept challenges, or perform any other product action. MVP has no unauthenticated profile, Contract, Record, or receipt access.

Successful reauthorization updates the existing social connection and restores the existing ThinkSo profile. It never creates a replacement profile.

## Client propagation

The splash/bootstrap response contains `threads_connection_status` and `threads_last_verified_at` from the ThinkSo database; it does not synchronously call Meta.

Any protected endpoint that discovers stale authorization returns the canonical `403 threads_reauthorization_required` error after persisting `REAUTH_REQUIRED`. The application-scoped session/navigation layer handles that code globally and replaces the current protected route with Connect Threads.
