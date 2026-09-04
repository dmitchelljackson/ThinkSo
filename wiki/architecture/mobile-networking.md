# Mobile networking and session recovery

## Purpose

Define application-wide client networking behavior independently of any React Native screen. Screens consume typed domain outcomes; they do not decide whether a transport failure means the user is signed out.

## Failure classification

The API client must distinguish:

- **Transport failure:** offline device, DNS failure, timeout, dropped connection, or interrupted response.
- **Transient server failure:** HTTP `408`, `429`, or `5xx` where retry is permitted.
- **Authentication challenge:** an authenticated API request returns `401` because the access token is invalid or expired.
- **Terminal refresh rejection:** `/auth/refresh` explicitly returns `401 invalid_refresh_token` because the refresh credential is absent, expired, revoked, retired, replayed outside its grace window, or otherwise invalid.
- **Domain/API failure:** a valid structured `4xx` response such as validation, eligibility, duplicate-message, or contract-state conflict.

Only a terminal refresh rejection changes the local session to signed out. Transport and transient server failures never clear stored credentials.

## Session restoration during a network failure

When an access token requires verification or refresh but the request cannot reach a definitive server response:

1. retain both credentials in SecureStore;
2. retain the local session as unverified rather than signed out;
3. do not route to Login as though authentication ended;
4. expose a recoverable connection failure to the current app shell;
5. use the global filing-error treatment with `CONNECTION ERROR · JUST NOW`;
6. state `We couldn't verify your session. Your account is unchanged.`;
7. offer `TRY AGAIN · 6`; the countdown only dismisses the message and never retries automatically;
8. retry restoration only after explicit user action or a later normal foreground/data request.

If a later refresh receives the terminal `invalid_refresh_token` response, clear credentials and protected cached state and let protected routing show Login.

## Coordinated refresh

- At most one refresh exchange may be in flight per app process.
- Requests needing authentication await the same refresh promise.
- A successful refresh atomically replaces both SecureStore values before queued requests resume.
- A failed transport attempt releases the coordinator without deleting credentials.
- A terminal refresh rejection clears the session exactly once.
- An authenticated request may trigger one refresh and one replay after `401`; a second `401` is terminal for that operation and must not loop.

## Request retry rules

- Safe reads may be retried after successful refresh.
- Mutations are replayed only when their endpoint has an idempotency mechanism or the client knows the server did not receive the request.
- Chat messages use their client-generated UUID for duplicate protection.
- Contract state transitions are not automatically repeated after ambiguous transport failure; rehydrate the canonical contract before offering recovery.
- Respect server retry guidance for `429` and retryable `5xx` responses. Do not create an unbounded retry loop.
- App backgrounding, screen unmounting, and network cancellation do not imply domain cancellation on the backend.

## Ownership

An application-scoped API/session layer owns this behavior. React components receive stable states such as `loading`, `ready`, `recoverableConnectionError`, or `signedOut`; they do not inspect raw token or networking errors to implement session policy independently.
## Local-first logout

Logging out is guaranteed only on the current device. Clear SecureStore credentials, in-memory credentials, protected caches, and authenticated navigation state immediately, then return to Login. Attempt to revoke the current server session on a short best-effort path, but never require a successful response before completing local logout. A failed or interrupted revocation request does not restore local credentials or keep the user inside the authenticated UI. Other device sessions are unaffected.
