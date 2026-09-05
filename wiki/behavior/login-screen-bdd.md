# Login Screen BDD acceptance criteria

This document is the behavioral source of truth for Firebase email/password account access, registration, and recovery. Email verification is explicitly deferred from MVP; the [Firebase email/password design archive](../../raw/designs/thinkso-login-email-password-2026-09-04.md) is the current visual evidence and [known issues](../product/known-issues.md) records the deferred verification work.

## UI sources

- Primary Login composition: [ThinkSo Access Form](<../../raw/designs/thinkso-login-email-password-2026-09-04/ThinkSo Access Form.dc.html>)
- Create Account composition: [ThinkSo Register](<../../raw/designs/thinkso-login-email-password-2026-09-04/ThinkSo Register.dc.html>)
- Forgot Password entry affordance: [ThinkSo Access Form](<../../raw/designs/thinkso-login-email-password-2026-09-04/ThinkSo Access Form.dc.html>)
- Shared error treatment: [ErrorToast](<../../raw/designs/thinkso-login-email-password-2026-09-04/ErrorToast.dc.html>)
- Shared activity indicator: [CoolSpinner / loading S](<../../raw/designs/thinkso-login-email-password-2026-09-04/CoolSpinner.dc.html>)

The Access Form and Register exports preserve the approved visual language. The Register export contains a raw `Name for the record` field, but locked product behavior excludes it: public identity comes from the connected Threads identity, so signup has no display-name field. The archive has no standalone forgot-password dialog; the normal account-access dialog entered from Forgot Password is specified below. The historical provider-button composition remains visual evidence only; do not restore Apple/Google behavior or infer fixed dimensions.

## 1. Account Access / Login

### 1.1 Display Login mode

UI reference: [ThinkSo Access Form](<../../raw/designs/thinkso-login-email-password-2026-09-04/ThinkSo Access Form.dc.html>) for Login composition.

```gherkin
Given the user has no active ThinkSo session
When Login is displayed
Then the existing ThinkSo account-access header, wordmark, annotations, descriptive copy, and footer placeholders remain represented in the Access Form design
And Login mode shows an email field
And it shows a password field whose value is obscured by default
And it shows a show-or-hide password control
And it shows a primary Log In action
And it shows a Create Account action
And it shows a Forgot Password action
And it shows the How It Works, Terms, and Privacy placeholders
And it does not show Apple, Google, phone, username, guest-login, or multi-factor controls
```

### 1.2 Validate Login input locally

UI reference: [ThinkSo Access Form](<../../raw/designs/thinkso-login-email-password-2026-09-04/ThinkSo Access Form.dc.html>).

```gherkin
Given Login mode is displayed
When email or password is empty or the email is not syntactically valid
Then Log In does not submit to Firebase
And the invalid field is identified in the form
And no filing-error toast is used for local validation
```

### 1.3 Submit Login

UI references: [ThinkSo Access Form](<../../raw/designs/thinkso-login-email-password-2026-09-04/ThinkSo Access Form.dc.html>) · [loading S](<../../raw/designs/thinkso-login-email-password-2026-09-04/CoolSpinner.dc.html>)

```gherkin
Given Login contains locally valid email and password values
And no account-access operation is active
When the user taps Log In
Then exactly one Firebase email/password authentication attempt begins
And every Login form action is disabled until it succeeds or fails
And the ThinkSo loading S is shown separately from the action
And the password remains obscured unless the user explicitly chose to show it
And additional taps do not start another attempt
```

### 1.4 Restore an active profile after Login

UI reference: [ThinkSo Access Form](<../../raw/designs/thinkso-login-email-password-2026-09-04/ThinkSo Access Form.dc.html>).

```gherkin
Given Firebase authenticates an email identity
And an active ThinkSo profile is linked to that Firebase UID
When the app exchanges the Firebase ID token with the backend
Then no additional ThinkSo profile is created
And a ThinkSo session is issued
And the app routes to the retained Contract destination when one exists and all gates pass
And otherwise Main applies the Threads connection gate
And no login-success toast or intermediate success screen is shown
```

### 1.5 Reject invalid credentials without disclosing account existence

UI reference: [ThinkSo Access Form](<../../raw/designs/thinkso-login-email-password-2026-09-04/ThinkSo Access Form.dc.html>).

```gherkin
Given a Login attempt is active
When Firebase rejects the email/password combination
Then the user remains on Login
And every Login form action is enabled
And the loading S is removed
And the response does not reveal whether the email is registered
And the form displays one generic invalid-credentials error
And the password is not logged or persisted by ThinkSo
```

### 1.6 Enter Create Account mode

UI references: [ThinkSo Access Form](<../../raw/designs/thinkso-login-email-password-2026-09-04/ThinkSo Access Form.dc.html>) and [ThinkSo Register](<../../raw/designs/thinkso-login-email-password-2026-09-04/ThinkSo Register.dc.html>); omit the raw `Name for the record` field because public identity comes from Threads.

```gherkin
Given Login mode is displayed
When the user chooses Create Account
Then the screen enters Create Account mode without opening a social provider
And it shows email and password fields
And it shows a show-or-hide password control
And it shows a primary Create Account action
And it provides a way back to Login mode
And it does not require username, display name, phone number, password confirmation, or multi-factor enrollment
```

### 1.7 Validate and create a Firebase account

UI references: [ThinkSo Register](<../../raw/designs/thinkso-login-email-password-2026-09-04/ThinkSo Register.dc.html>) · [loading S](<../../raw/designs/thinkso-login-email-password-2026-09-04/CoolSpinner.dc.html>); omit the raw `Name for the record` field because public identity comes from Threads.

```gherkin
Given Create Account mode contains a syntactically valid email and a password accepted by the configured Firebase password policy
When the user taps Create Account
Then exactly one Firebase account-creation request begins
And every account-access form action is disabled during the request
And the separate loading S is shown
And ThinkSo never receives or stores the plaintext password
When Firebase creates the identity
Then the client exchanges its Firebase ID token with the backend exactly once
And exactly one incomplete ThinkSo profile is created when none exists
And a ThinkSo session is issued
And Main routes directly to Connect Threads for the never-connected profile
And no verification step or display-name field is shown
```

### 1.8 Display the Forgot Password dialog

UI reference: [ThinkSo Access Form](<../../raw/designs/thinkso-login-email-password-2026-09-04/ThinkSo Access Form.dc.html>) as the entry affordance; the normal Forgot Password dialog has no standalone raw export. The following dialog composition is DERIVED from the locked behavior and the Access Form visual language.

```gherkin
Given Login mode is displayed
When the user chooses Forgot Password
Then a normal ThinkSo account-access dialog is shown without leaving Login
And it shows a recovery heading and concise body explaining that a reset link will be sent
And it shows an email field
And when Login contains a syntactically valid email, the dialog prefills that email
And it shows a primary `SEND RESET LINK` action
And it shows a Cancel or close action
And it does not show a provider button, display-name field, or password field
```

### 1.9 Request a password reset

UI reference: [ThinkSo Access Form](<../../raw/designs/thinkso-login-email-password-2026-09-04/ThinkSo Access Form.dc.html>) as the entry affordance; the normal Forgot Password dialog has no standalone raw export.

```gherkin
Given the user chooses Forgot Password
When a syntactically valid email is submitted
Then the app calls Firebase sendPasswordResetEmail once
And both dialog actions are disabled until the request succeeds or fails
And the separate ThinkSo loading S is shown
And it displays the same Check Your Email confirmation whether or not an account exists
And no ThinkSo password-reset token or plaintext password passes through the backend
And the user can return to Login
```

### 1.10 Complete a password reset

UI reference: Firebase-hosted action page for MVP; custom branded handler is later. The archive has no standalone reset-page export.

```gherkin
Given the user received a valid Firebase password-reset email
When the user opens its one-time link
Then Firebase's hosted action page accepts and validates the new password
And Firebase invalidates the identity's existing refresh tokens
And the user returns to ThinkSo Login rather than being silently logged in
And expired or consumed links can restart Forgot Password
```

### 1.11 Show a recoverable account-access failure

UI references: [ThinkSo Access Form](<../../raw/designs/thinkso-login-email-password-2026-09-04/ThinkSo Access Form.dc.html>) or [ThinkSo Register](<../../raw/designs/thinkso-login-email-password-2026-09-04/ThinkSo Register.dc.html>) · [ErrorToast](<../../raw/designs/thinkso-login-email-password-2026-09-04/ErrorToast.dc.html>)

```gherkin
Given an account creation, reset request, or ThinkSo token exchange is active
When it fails for a recoverable reason that is not local validation or invalid credentials
Then the user remains in the current account-access mode
And all applicable controls are enabled
And the loading S is removed
And the global pink filing-error toast is shown
And its action is TRY AGAIN with the standard six-second countdown
And retry repeats only the failed operation
And countdown expiry dismisses without retry
```

### 1.12 Reject login for a retired profile

UI references: [ThinkSo Access Form](<../../raw/designs/thinkso-login-email-password-2026-09-04/ThinkSo Access Form.dc.html>) · [ErrorToast](<../../raw/designs/thinkso-login-email-password-2026-09-04/ErrorToast.dc.html>)

```gherkin
Given a ThinkSo profile was permanently retired
And its tombstone contains a previously observed Firebase UID, normalized Firebase email, or Threads user ID
When a Firebase identity matches any identifier in that tombstone
Then the backend creates neither a new ThinkSo profile nor a usable session
And the user remains on Login
And a non-retryable PROFILE RETIRED filing-error toast is shown
And its message states that the profile was permanently retired and cannot be used again
And its action is countdown dismissal rather than retry
```

### 1.13 Keep informational controls as placeholders

UI reference: [ThinkSo Access Form](<../../raw/designs/thinkso-login-email-password-2026-09-04/ThinkSo Access Form.dc.html>) or [ThinkSo Register](<../../raw/designs/thinkso-login-email-password-2026-09-04/ThinkSo Register.dc.html>); informational controls remain shared placeholders.

```gherkin
Given an account-access mode is displayed
When the user taps How It Works, Terms, or Privacy
Then the user remains in the same mode
And no destination, browser, modal, account operation, or error toast is opened
```

### 1.14 Restore and refresh stored ThinkSo session credentials

UI reference: [ThinkSo Access Form](<../../raw/designs/thinkso-login-email-password-2026-09-04/ThinkSo Access Form.dc.html>).

```gherkin
Given the device contains securely stored ThinkSo session credentials for an active profile
When the app launches
And the access token is valid or the backend successfully rotates the stored refresh credential
Then Login is not displayed
And Main applies the Threads connection guard
And concurrent authenticated operations share one coordinated refresh
```

### 1.15 Return to Login when the ThinkSo session cannot be refreshed

UI reference: [ThinkSo Access Form](<../../raw/designs/thinkso-login-email-password-2026-09-04/ThinkSo Access Form.dc.html>).

```gherkin
Given the ThinkSo access token is absent or expired
And its refresh credential is absent, revoked, expired, or rejected
When session restoration or refresh runs
Then local ThinkSo and Firebase credentials are cleared
And protected application state is cleared
And Login mode is displayed with no operation left loading
```

### 1.16 Preserve a protected Contract deep link through account access

UI references: [ThinkSo Access Form](<../../raw/designs/thinkso-login-email-password-2026-09-04/ThinkSo Access Form.dc.html>) · [ThinkSo Challenge Contract](<../../raw/designs/thinkso-login-email-password-2026-09-04/ThinkSo Challenge Contract.dc.html>)

```gherkin
Given a person without a valid ThinkSo session opens a Contract deep link
When the application handles the link
Then Login is displayed and the intended Contract destination is retained locally
And no Contract API request is made and no Contract content is rendered
When Firebase authentication and ThinkSo session exchange succeed
And the profile has an active Threads connection
Then the intended Contract is opened instead of Main
But when the profile is NEVER_CONNECTED or REAUTH_REQUIRED
Then Connect Threads is displayed and the intended Contract destination remains retained
```
