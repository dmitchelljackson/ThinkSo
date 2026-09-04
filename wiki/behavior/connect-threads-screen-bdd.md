# Connect Threads Screen BDD acceptance criteria

This document is the behavioral source of truth for the Connect Threads screen and its blocking authorization gate only.

## UI sources

- Primary screen: [ThinkSo Connect Threads](<../../raw/designs/thinkso-claude-export/ThinkSo Connect Threads.dc.html>)
- Shared error treatment: [ErrorToast](<../../raw/designs/thinkso-claude-export/ErrorToast.dc.html>)
- Shared activity indicator: [CoolSpinner / loading S](<../../raw/designs/thinkso-claude-export/CoolSpinner.dc.html>)
- Flow context: [ThinkSo Flow](<../../raw/designs/thinkso-claude-export/ThinkSo Flow.dc.html>)

The exported files are visual evidence, not implementation code. Behavioral decisions in this BDD supersede interactions hardcoded in the export.

## 2. Connect Threads

### 2.1 Display the Connect Threads screen

UI reference: [ThinkSo Connect Threads](<../../raw/designs/thinkso-claude-export/ThinkSo Connect Threads.dc.html>)

```gherkin
Given the user has an authenticated active ThinkSo profile
And its Threads connection state is NEVER_CONNECTED or REAUTH_REQUIRED
When Connect Threads is displayed
Then the screen shows "THINKSO · ACCOUNT SETUP"
And it shows the profile's ThinkSo reference identifier
And it shows "FORM 002"
And it shows the heading "Connect Threads" with the approved blue-pen underline
And it shows "CLAUSE 1"
And it shows "Why we need this"
And it explains "ThinkSo challenges have consequences. When you accept a challenge, you may agree to let ThinkSo publish a pre-approved message to your Threads account when the challenge is resolved."
And it shows a bordered "GUARANTEE" clause
And the guarantee says "ThinkSo will never write or post something you didn’t agree to as part of a challenge."
And it shows an unchecked acknowledgment control
And the acknowledgment says "I understand that accepting a ThinkSo challenge can authorize ThinkSo to publish the agreed consequence to my Threads account."
And it shows the decorative "read this part" annotation
And it shows a disabled "Connect Threads" button with the Threads mark
And it says "Required to continue. You can revoke access in Settings at any time."
And it does not show Back, Skip, Sign Out, Main navigation, history, or another bypass control
```

### 2.2 Keep the acknowledgment local and transient

UI reference: [ThinkSo Connect Threads](<../../raw/designs/thinkso-claude-export/ThinkSo Connect Threads.dc.html>)

```gherkin
Given Connect Threads is entered as a new screen visit
Then the acknowledgment begins unchecked
And no acknowledgment is read from or written to the backend
And the acknowledgment is not persisted across a new screen visit or application relaunch
And the disabled Connect Threads button does not begin authorization when tapped
```

### 2.3 Enable connection after acknowledgment

UI reference: [ThinkSo Connect Threads](<../../raw/designs/thinkso-claude-export/ThinkSo Connect Threads.dc.html>)

```gherkin
Given Connect Threads is displayed
And the acknowledgment is unchecked
When the user checks the acknowledgment
Then the handwritten checkmark is shown
And Connect Threads enters its enabled black-button state
When the user unchecks the acknowledgment before starting authorization
Then the checkmark is removed
And Connect Threads returns to its disabled state
```

### 2.4 Begin Threads authorization

UI references: [ThinkSo Connect Threads](<../../raw/designs/thinkso-claude-export/ThinkSo Connect Threads.dc.html>) · [loading S](<../../raw/designs/thinkso-claude-export/CoolSpinner.dc.html>)

```gherkin
Given the acknowledgment is checked
And no Threads authorization attempt is active
When the user taps "Connect Threads"
Then exactly one authorization attempt begins
And the acknowledgment control is disabled
And the Connect Threads button is disabled
And both controls remain disabled until authorization succeeds, is cancelled, or fails
And the ThinkSo loading S is shown as a separate activity indicator
And additional taps do not start another authorization attempt
And the backend creates a single-use expiring OAuth state bound to the current ThinkSo user
And Meta's authorization interface is opened
```

### 2.5 Complete an initial Threads connection

UI reference: [ThinkSo Connect Threads](<../../raw/designs/thinkso-claude-export/ThinkSo Connect Threads.dc.html>)

```gherkin
Given the profile's Threads state is NEVER_CONNECTED
And a Threads authorization attempt is active
When Meta returns a valid authorization code and every required permission
And the backend validates the state, token, Threads identity, threads_basic scope, and threads_content_publish scope
And that Threads identity is not claimed by another profile and is not tombstoned
Then the backend stores the usable long-lived credential securely
And the connection state becomes CONNECTED
And onboarding becomes complete
And the app routes directly to Main
And The Record is displayed
And no connection-success toast or intermediate success screen is shown
```

### 2.6 Complete Threads reauthorization

UI reference: [ThinkSo Connect Threads](<../../raw/designs/thinkso-claude-export/ThinkSo Connect Threads.dc.html>)

```gherkin
Given the active profile's Threads state is REAUTH_REQUIRED
And Connect Threads is displayed with the same content and controls as initial connection
When Threads authorization succeeds with the same Threads identity and every required permission
Then the existing social connection is updated
And the connection state becomes CONNECTED
And the existing ThinkSo profile is restored to product access
And no replacement profile is created
And the app routes directly to Main
And no reauthorization-success toast or intermediate screen is shown
```

### 2.7 Cancel Threads authorization

UI references: [ThinkSo Connect Threads](<../../raw/designs/thinkso-claude-export/ThinkSo Connect Threads.dc.html>) · [loading S](<../../raw/designs/thinkso-claude-export/CoolSpinner.dc.html>)

```gherkin
Given a Threads authorization attempt is active
When the user explicitly cancels Meta's authorization flow
Then the user remains on Connect Threads
And the ThinkSo loading S is removed
And the acknowledgment remains checked
And the acknowledgment and Connect Threads button are enabled
And no filing-error toast is shown
And no Threads connection or profile state is changed
```

### 2.8 Recover an indeterminate authorization return

UI references: [ThinkSo Connect Threads](<../../raw/designs/thinkso-claude-export/ThinkSo Connect Threads.dc.html>) · [loading S](<../../raw/designs/thinkso-claude-export/CoolSpinner.dc.html>)

```gherkin
Given a Threads authorization attempt was active
When Connect Threads regains focus without an explicit success or error
And the backend still reports NEVER_CONNECTED or REAUTH_REQUIRED
Then the return is treated as cancellation
And the ThinkSo loading S is removed
And the acknowledgment remains checked
And the acknowledgment and Connect Threads button are enabled
And no filing-error toast is shown
```

### 2.9 Recover a successful authorization whose mobile return was missed

UI reference: [ThinkSo Connect Threads](<../../raw/designs/thinkso-claude-export/ThinkSo Connect Threads.dc.html>)

```gherkin
Given Meta authorization completed successfully on the backend
And the app was closed, suspended, or did not receive the return link
When Connect Threads next regains focus or the application next bootstraps
And the backend reports CONNECTED
Then the app routes directly to Main
And it does not start another authorization attempt
And it does not show a filing-error or success toast
```

### 2.10 Show a recoverable Threads connection error

UI references: [ThinkSo Connect Threads](<../../raw/designs/thinkso-claude-export/ThinkSo Connect Threads.dc.html>) · [ErrorToast](<../../raw/designs/thinkso-claude-export/ErrorToast.dc.html>)

```gherkin
Given a Threads authorization attempt is active
When the provider flow or ThinkSo exchange fails for a reason other than cancellation, missing required permission, or an already-claimed Threads identity
Then the user remains on Connect Threads
And the ThinkSo loading S is removed
And the acknowledgment remains checked
And the acknowledgment and Connect Threads button are enabled
And the pink filing-error toast overlays the screen without navigating away
And its header is "THREADS ERROR · JUST NOW"
And its message is "We couldn't connect your Threads account. Nothing changed."
And its action is "TRY AGAIN · 6"
And the Threads connection and profile remain unchanged
```

### 2.11 Retry a recoverable Threads connection error

UI references: [ErrorToast](<../../raw/designs/thinkso-claude-export/ErrorToast.dc.html>) · [loading S](<../../raw/designs/thinkso-claude-export/CoolSpinner.dc.html>)

```gherkin
Given a retryable Threads filing-error toast is visible
When the user taps "TRY AGAIN" before the countdown expires
Then the toast is dismissed
And exactly one new Threads authorization attempt begins
And the attempt uses a fresh single-use OAuth state
And the acknowledgment and Connect Threads button are disabled
And the ThinkSo loading S is visible
```

### 2.12 Reject a partial permission grant

UI references: [ThinkSo Connect Threads](<../../raw/designs/thinkso-claude-export/ThinkSo Connect Threads.dc.html>) · [ErrorToast](<../../raw/designs/thinkso-claude-export/ErrorToast.dc.html>)

```gherkin
Given a Threads authorization attempt is active
When Meta authenticates the user but does not grant threads_basic or threads_content_publish
Then the attempt does not count as a Threads connection
And the backend does not mark the profile CONNECTED
And the user remains on Connect Threads
And the ThinkSo loading S is removed
And the acknowledgment remains checked
And the acknowledgment and Connect Threads button are enabled
And the pink filing-error toast header is "THREADS ERROR · JUST NOW"
And its message is "ThinkSo needs permission to publish the consequences you agree to. Nothing changed."
And its action is "TRY AGAIN · 6"
And retry begins a complete new Meta authorization flow with fresh OAuth state
```

### 2.13 Reject a Threads account claimed by another active profile

UI references: [ThinkSo Connect Threads](<../../raw/designs/thinkso-claude-export/ThinkSo Connect Threads.dc.html>) · [ErrorToast](<../../raw/designs/thinkso-claude-export/ErrorToast.dc.html>)

```gherkin
Given a Threads authorization attempt is active
When the backend verifies a Threads user ID already linked to another active ThinkSo profile
Then the attempted connection fails
And duplicate Threads ownership is not created
And neither profile is transferred, merged, retired, or otherwise changed
And the user remains on Connect Threads
And the ThinkSo loading S is removed
And the pink filing-error toast header is "THREADS ACCOUNT CLAIMED · JUST NOW"
And its message is "This Threads account is already connected to another ThinkSo profile."
And its action is "LOG OUT · 6"
And no retry action is offered in that toast
```

### 2.14 Log out from the claimed-account toast

UI reference: [ErrorToast](<../../raw/designs/thinkso-claude-export/ErrorToast.dc.html>)

```gherkin
Given the Threads account claimed toast is visible
When the user taps "LOG OUT" before the countdown expires
Then the current ThinkSo session credentials are revoked or cleared
And protected application state is cleared
And Account Access is displayed
And neither ThinkSo profile nor the claimed Threads connection is changed
```

### 2.15 Let the claimed-account toast expire or be dismissed

UI reference: [ErrorToast](<../../raw/designs/thinkso-claude-export/ErrorToast.dc.html>)

```gherkin
Given the Threads account claimed toast is visible
When its countdown reaches zero, its close control is tapped, or it is swiped upward
Then the toast is dismissed
And the user is not logged out
And the user remains on Connect Threads
And no authorization attempt begins
And neither profile is changed
```

### 2.16 Expire or dismiss a retryable Threads error

UI reference: [ErrorToast](<../../raw/designs/thinkso-claude-export/ErrorToast.dc.html>)

```gherkin
Given a retryable Threads filing-error toast is visible
When its countdown reaches zero, its close control is tapped, or it is swiped upward
Then the toast is dismissed
And authorization is not retried
And the user remains on Connect Threads
And the acknowledgment remains checked
And Connect Threads remains enabled
```

### 2.17 Enforce the blocking navigation gate

UI reference: [ThinkSo Connect Threads](<../../raw/designs/thinkso-claude-export/ThinkSo Connect Threads.dc.html>)

```gherkin
Given the active profile's Threads state is NEVER_CONNECTED or REAUTH_REQUIRED
When the user attempts to navigate within the authenticated product
Then Main, in-app history, minting, accepting, declining, and every other consequential authenticated product action remain unavailable
And Connect Threads remains the authenticated destination
And no Back, Skip, or ordinary Sign Out control is shown on the screen
And Android system Back may background or exit the application but does not reveal Account Access or Main
And reopening the app returns to Connect Threads unless the backend now reports CONNECTED
```

### 2.18 Route revoked profiles to the same screen

UI reference: [ThinkSo Connect Threads](<../../raw/designs/thinkso-claude-export/ThinkSo Connect Threads.dc.html>)

```gherkin
Given the profile previously had a CONNECTED Threads state
When bootstrap or a protected endpoint reports threads_reauthorization_required
Then the application replaces the protected route with Connect Threads
And the same Form 002 content and controls are used without a special revoked variant
And Connect Threads is enabled only after the local acknowledgment is checked
And successful authorization follows the existing-profile reauthorization behavior
And successful reauthorization resumes any durable consequence-publication jobs blocked on this Threads authorization
And resuming publication does not rerun a completed judgment
```

### 2.19 Preserve connection state during transient verification failure

UI reference: [ThinkSo Connect Threads](<../../raw/designs/thinkso-claude-export/ThinkSo Connect Threads.dc.html>)

```gherkin
Given the backend currently records the profile as CONNECTED
When a scheduled or live Threads verification encounters a timeout, rate limit, Meta outage, or other transient failure
Then the backend does not change the connection to REAUTH_REQUIRED solely because of that failure
And the app is not routed to Connect Threads solely because of that failure
And the verification failure is recorded for retry
```

### 2.20 Render responsively rather than copying the preview frame

UI references: [ThinkSo Connect Threads](<../../raw/designs/thinkso-claude-export/ThinkSo Connect Threads.dc.html>) · [ThinkSo Flow](<../../raw/designs/thinkso-claude-export/ThinkSo Flow.dc.html>)

```gherkin
Given the Connect Threads implementation is derived from the Claude Design export
When the screen is rendered on any supported phone size or safe-area configuration
Then all required copy and controls remain readable and operable without clipping or overlap
And the layout respects native safe-area insets
And the 393 × 852 preview frame is not hardcoded as the application viewport
And web-only fixed coordinates and inline pixel values are not treated as behavioral requirements
```

### 2.21 Resume a protected Contract deep link after Threads connection

UI references: [ThinkSo Connect Threads](<../../raw/designs/thinkso-claude-export/ThinkSo Connect Threads.dc.html>) · [ThinkSo Challenge Contract](<../../raw/designs/thinkso-claude-export/ThinkSo Challenge Contract.dc.html>)

```gherkin
Given an authenticated user reached Connect Threads while a Contract deep-link destination was retained
And no Contract data has been requested or rendered
When initial Threads connection or reauthorization succeeds
Then the retained Contract is opened instead of Main
And the retained destination is consumed
And no connection-success toast or intermediate success screen is shown
```
