# Login Screen BDD acceptance criteria

This document is the behavioral source of truth for the Account Access/Login screen only.

## UI sources

- Primary screen: [ThinkSo Access Form](<../../raw/designs/thinkso-claude-export/ThinkSo Access Form.dc.html>)
- Alternate/exported composition: [ThinkSo Login](<../../raw/designs/thinkso-claude-export/ThinkSo Login.dc.html>)
- Shared error treatment: [ErrorToast](<../../raw/designs/thinkso-claude-export/ErrorToast.dc.html>)
- Shared activity indicator: [CoolSpinner / loading S](<../../raw/designs/thinkso-claude-export/CoolSpinner.dc.html>)

The exported files are visual evidence, not implementation code. Behavioral decisions in this BDD supersede interactions hardcoded in the export.

## 1. Account Access / Login

### 1.1 Display the Login screen

UI reference: [ThinkSo Access Form](<../../raw/designs/thinkso-claude-export/ThinkSo Access Form.dc.html>)

```gherkin
Given the user has no active ThinkSo session
When the Login screen is displayed
Then the screen shows "THINKSO · ACCOUNT ACCESS"
And it shows "FORM 001"
And a thin rule separates the administrative header from the content
And it shows the ThinkSo wordmark with the approved blue-pen "!?" annotation
And it shows "YOU VS THEM" above the descriptive copy
And "YOU" and "THEM" appear typed into separate contract-style fields
And it shows "Write it down. We’ll call it. Keep the receipts."
And it shows the decorative "no backing out →" annotation and flame
And it shows an enabled platform-approved "Continue with Apple" button
And it shows an enabled platform-approved "Continue with Google" button
And it shows links for "How it works", "Terms", and "Privacy"
And it does not show username, email, password, account-registration, or guest-login controls
```

### 1.2 Begin provider authentication

UI references: [ThinkSo Access Form](<../../raw/designs/thinkso-claude-export/ThinkSo Access Form.dc.html>) · [loading S](<../../raw/designs/thinkso-claude-export/CoolSpinner.dc.html>)

```gherkin
Given the Login screen is displayed
And no authentication attempt is active
When the user taps "Continue with <provider>"
Then exactly one <provider> authentication attempt begins
And both provider buttons enter their disabled visual state
And both provider buttons remain disabled until authentication succeeds, is cancelled, or fails
And the ThinkSo loading S is visible as a separate activity indicator outside the branded provider buttons
And the selected provider button retains its approved branding, logo, and text
And additional taps do not start another authentication attempt

Examples:
  | provider |
  | Apple    |
  | Google   |
```

### 1.3 Create a profile for a new identity

UI reference: [ThinkSo Access Form](<../../raw/designs/thinkso-claude-export/ThinkSo Access Form.dc.html>)

```gherkin
Given the user has no ThinkSo profile associated with their <provider> identity
When <provider> authentication succeeds
Then exactly one incomplete ThinkSo profile is created for that identity
And the user receives an authenticated ThinkSo session
And the app launches Main
And Main determines that Threads has never been connected
And the app redirects directly to Connect Threads
And no authentication-success toast or intermediate success screen is shown

Examples:
  | provider |
  | Apple    |
  | Google   |
```

### 1.4 Restore an active existing profile

UI reference: [ThinkSo Access Form](<../../raw/designs/thinkso-claude-export/ThinkSo Access Form.dc.html>)

```gherkin
Given an active ThinkSo profile is associated with the user's <provider> identity
And that profile previously completed Threads connection
And its Threads connection remains active
When <provider> authentication succeeds
Then no additional ThinkSo profile is created
And the user receives an authenticated ThinkSo session
And the app launches Main
And The Record is displayed
And Connect Threads is not displayed
And no authentication-success toast or intermediate success screen is shown

Examples:
  | provider |
  | Apple    |
  | Google   |
```

### 1.5 Guard Main for a never-connected profile

UI reference: [ThinkSo Access Form](<../../raw/designs/thinkso-claude-export/ThinkSo Access Form.dc.html>)

```gherkin
Given the user has an authenticated active ThinkSo profile
And that profile has never completed Threads connection
When Main launches for any reason
Then The Record is not displayed
And the user is redirected to Connect Threads
```

### 1.6 Cancel provider authentication

UI reference: [ThinkSo Access Form](<../../raw/designs/thinkso-claude-export/ThinkSo Access Form.dc.html>)

```gherkin
Given the user started <provider> authentication from Login
When the user cancels the provider-controlled authentication flow
Then the user remains on Login
And both provider buttons are enabled
And the activity indicator is removed
And no filing-error toast is shown
And no ThinkSo profile or session is created or changed

Examples:
  | provider |
  | Apple    |
  | Google   |
```

### 1.7 Show a recoverable authentication error

UI references: [ThinkSo Access Form](<../../raw/designs/thinkso-claude-export/ThinkSo Access Form.dc.html>) · [ErrorToast](<../../raw/designs/thinkso-claude-export/ErrorToast.dc.html>)

```gherkin
Given the user started <provider> authentication from Login
When the provider flow or ThinkSo login exchange fails for a reason other than user cancellation
Then the user remains on Login
And both provider buttons are enabled
And the activity indicator is removed
And the pink filing-error toast overlays Login without navigating away
And the toast header identifies the <provider> sign-in error and says "JUST NOW"
And the toast states that no ThinkSo profile was created or changed
And the toast presents "TRY AGAIN · 6"

Examples:
  | provider |
  | Apple    |
  | Google   |
```

### 1.8 Retry failed authentication

UI references: [ErrorToast](<../../raw/designs/thinkso-claude-export/ErrorToast.dc.html>) · [loading S](<../../raw/designs/thinkso-claude-export/CoolSpinner.dc.html>)

```gherkin
Given Apple or Google authentication failed
And its filing-error toast is visible
When the user taps the countdown retry action
Then the toast is dismissed
And exactly one new authentication attempt begins for the same provider
And both provider buttons are disabled during that attempt
```

### 1.9 Let an authentication error expire

UI reference: [ErrorToast](<../../raw/designs/thinkso-claude-export/ErrorToast.dc.html>)

```gherkin
Given an authentication filing-error toast is visible
And its action displays a six-second countdown
When the countdown reaches zero without user interaction
Then the toast is dismissed
And authentication is not retried
And the user remains on Login
And the Login screen remains the canonical representation of state
```

### 1.10 Dismiss an authentication error early

UI reference: [ErrorToast](<../../raw/designs/thinkso-claude-export/ErrorToast.dc.html>)

```gherkin
Given an authentication filing-error toast is visible
When the user taps its close control or swipes it upward
Then the toast is dismissed
And no retry is performed
And Login remains unchanged
```

### 1.11 Reject login for a retired profile

UI references: [ThinkSo Access Form](<../../raw/designs/thinkso-claude-export/ThinkSo Access Form.dc.html>) · [ErrorToast](<../../raw/designs/thinkso-claude-export/ErrorToast.dc.html>)

```gherkin
Given a ThinkSo profile was permanently retired
And its tombstone contains at least one previously observed Apple subject, Google subject, verified normalized email, or Threads user ID
When <provider> authentication otherwise succeeds
And the authenticated provider subject or verified normalized email matches any identifier in that tombstone
Then the backend does not create a new ThinkSo profile
And the backend does not create a usable ThinkSo session
And the user remains on Account Access
And both provider buttons return to enabled state
And a non-retryable filing-error toast is shown
And its header is "PROFILE RETIRED · JUST NOW"
And its message is "This ThinkSo profile was permanently retired and cannot be used again."
And its action is the countdown dismissal rather than "TRY AGAIN"

Examples:
  | provider |
  | Apple    |
  | Google   |
```

### 1.12 Display the How It Works placeholder

UI reference: [ThinkSo Access Form](<../../raw/designs/thinkso-claude-export/ThinkSo Access Form.dc.html>)

```gherkin
Given Login is displayed
Then the screen shows the "How it works" placeholder control
When the user taps "How it works"
Then the user remains on Login
And no authentication attempt is started
And no destination, browser, modal, or error toast is opened
```

### 1.13 Display the legal placeholders

UI reference: [ThinkSo Access Form](<../../raw/designs/thinkso-claude-export/ThinkSo Access Form.dc.html>)

```gherkin
Given Login is displayed
Then the screen shows the <link> placeholder control
When the user taps the <link> placeholder
Then the user remains on Login
And no authentication attempt is started
And no destination, browser, modal, or error toast is opened

Examples:
  | link    |
  | Terms   |
  | Privacy |
```

### 1.14 Restore valid stored session credentials

UI reference: [ThinkSo Access Form](<../../raw/designs/thinkso-claude-export/ThinkSo Access Form.dc.html>)

```gherkin
Given the device contains securely stored ThinkSo session credentials for an active profile
When the app launches
And the stored access token is still valid or the backend successfully refreshes it
Then Login is not displayed
And the app launches Main with a valid session
And Main applies the Threads connection guard
```

### 1.15 Refresh a near-expiry or expired access token

UI reference: [ThinkSo Access Form](<../../raw/designs/thinkso-claude-export/ThinkSo Access Form.dc.html>)

```gherkin
Given the user has an active ThinkSo session
And the current access token is expired or has less than one hour remaining
And the stored refresh credential remains valid
When an authenticated operation requires a valid access token
Then the app performs one coordinated session refresh
And queued authenticated operations wait for that refresh
And the refreshed access token is used for those operations
And the user is not sent to Login
```

### 1.16 Return to Login when the session cannot be refreshed

UI reference: [ThinkSo Access Form](<../../raw/designs/thinkso-claude-export/ThinkSo Access Form.dc.html>)

```gherkin
Given the current access token is absent or expired
And the stored refresh credential is absent, revoked, expired, or rejected
When the app restores or refreshes the session
Then all local ThinkSo session credentials are cleared
And protected application state is cleared
And Login is displayed
And both provider buttons are enabled
And no authentication attempt is shown as active
```

### 1.17 Recover an interrupted provider flow

UI references: [ThinkSo Access Form](<../../raw/designs/thinkso-claude-export/ThinkSo Access Form.dc.html>) · [loading S](<../../raw/designs/thinkso-claude-export/CoolSpinner.dc.html>) · [ErrorToast](<../../raw/designs/thinkso-claude-export/ErrorToast.dc.html>)

```gherkin
Given the user started Apple or Google authentication
When the app loses foreground focus or its Login screen is unmounted
Then the authentication operation remains owned by the session domain rather than the screen
When the app becomes active again
Then a definitive provider success continues the normal login flow
And a definitive cancellation returns to unchanged Login
And a definitive failure returns to Login with the filing-error toast
And an indeterminate abandoned attempt returns to Login with both provider buttons enabled
And the loading S is not left visible indefinitely
```

### 1.18 Preserve a protected Contract deep link through Login

UI references: [ThinkSo Access Form](<../../raw/designs/thinkso-claude-export/ThinkSo Access Form.dc.html>) · [ThinkSo Challenge Contract](<../../raw/designs/thinkso-claude-export/ThinkSo Challenge Contract.dc.html>)

```gherkin
Given a person without a valid ThinkSo session opens a Contract deep link
When the application handles the link
Then Login is displayed
And the intended Contract destination is retained locally
And no Contract API request is made
And no Contract content is rendered
When provider authentication succeeds
And the profile has an active Threads connection
Then the intended Contract is opened instead of Main
But when the profile is NEVER_CONNECTED or REAUTH_REQUIRED
Then Connect Threads is displayed and the intended Contract destination remains retained
```
