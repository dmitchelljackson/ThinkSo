# Account Screen BDD acceptance criteria

This document is the behavioral source of truth for Section 6, Account, ordinary device sign-out, and permanent ThinkSo profile retirement.

## UI sources

- Primary screen and embedded warnings: [ThinkSo Account](<../../raw/designs/thinkso-claude-export/ThinkSo Account.dc.html>)
- First retirement warning composition: [Account Warning 1](<../../raw/designs/thinkso-claude-export/Account Warning 1.dc.html>)
- Final retirement warning composition: [Account Warning 2](<../../raw/designs/thinkso-claude-export/Account Warning 2.dc.html>)
- Shared error treatment: [ErrorToast](<../../raw/designs/thinkso-claude-export/ErrorToast.dc.html>)
- Shared activity indicator: [CoolSpinner / loading S](<../../raw/designs/thinkso-claude-export/CoolSpinner.dc.html>)

The exports are visual evidence, not implementation code. This BDD supersedes their fixed preview dimensions and any locally simulated completion that does not wait for the server.

## 6. Account

### 6.1 Display the Account screen

UI reference: [ThinkSo Account](<../../raw/designs/thinkso-claude-export/ThinkSo Account.dc.html>)

```gherkin
Given the user has an active session and connected Threads account
When Account renders
Then the header shows Back to The Record, THINKSO · ACCOUNT, and FORM 003
And the Threads section shows the connected username and CONNECTED status
And DISCONNECT THREADS is labeled RETIRES PROFILE
And SIGN OUT is labeled YOU CAN COME BACK
And Terms of Service, Privacy Policy, and the installed app version are shown
```

### 6.2 Keep the Account screen intentionally sparse

UI reference: [ThinkSo Account](<../../raw/designs/thinkso-claude-export/ThinkSo Account.dc.html>)

```gherkin
Given Account is visible
When its controls are inspected
Then it does not offer profile editing, avatar editing, notification preferences, themes, social settings, or filler controls
And the connected Threads identity is informational rather than editable
```

### 6.3 Return to The Record

UI reference: [ThinkSo Account](<../../raw/designs/thinkso-claude-export/ThinkSo Account.dc.html>)

```gherkin
Given Account is visible and no modal is open
When the user taps Back
Then Account closes and The Record is shown
And no account mutation occurs
```

### 6.4 Keep Legal rows as placeholder UI for MVP

UI reference: [ThinkSo Account](<../../raw/designs/thinkso-claude-export/ThinkSo Account.dc.html>)

```gherkin
Given the MVP Account screen is visible
When the user taps Terms of Service or Privacy Policy
Then the user remains on Account
And no destination, browser, modal, API request, or error toast is opened
```

### 6.5 Sign out the current device immediately

UI reference: [ThinkSo Account](<../../raw/designs/thinkso-claude-export/ThinkSo Account.dc.html>)

```gherkin
Given the user taps SIGN OUT
When local logout begins
Then no confirmation dialog is shown
And this device's SecureStore credentials, in-memory credentials, protected caches, and authenticated navigation state are cleared
And Login replaces the authenticated application immediately
And sessions on the user's other devices remain active
```

### 6.6 Never block local sign-out on server revocation

UI references: [ThinkSo Account](<../../raw/designs/thinkso-claude-export/ThinkSo Account.dc.html>) · [ErrorToast](<../../raw/designs/thinkso-claude-export/ErrorToast.dc.html>)

```gherkin
Given current-device server-session revocation is attempted during SIGN OUT
When that request succeeds, fails, is interrupted, or cannot start offline
Then local logout still completes
And the user is not returned to authenticated UI
And local credentials are never restored because revocation was unconfirmed
And no blocking error toast is required after Login replaces Account
```

### 6.7 Open the first retirement warning

UI references: [ThinkSo Account](<../../raw/designs/thinkso-claude-export/ThinkSo Account.dc.html>) · [Account Warning 1](<../../raw/designs/thinkso-claude-export/Account Warning 1.dc.html>)

```gherkin
Given Account is visible
When the user taps DISCONNECT THREADS
Then a modal headed DISCONNECT THREADS? opens
And it shows WARNING and THINKSO · NOTICE
And it says "Don't be a sore loser."
And it explains sign-out and voiding of unresolved challenges
And it offers DISCONNECT and NEVER MIND
And it includes "we will remember this"
```

### 6.8 Cancel from the first warning

UI reference: [Account Warning 1](<../../raw/designs/thinkso-claude-export/Account Warning 1.dc.html>)

```gherkin
Given the first retirement warning is open
When the user taps NEVER MIND
Then the modal closes
And the profile, Threads connection, sessions, and challenges remain unchanged
```

### 6.9 Advance to the final retirement warning

UI references: [Account Warning 1](<../../raw/designs/thinkso-claude-export/Account Warning 1.dc.html>) · [Account Warning 2](<../../raw/designs/thinkso-claude-export/Account Warning 2.dc.html>)

```gherkin
Given the first retirement warning is open
When the user taps DISCONNECT
Then no retirement request is made yet
And the final warning replaces the first warning
```

### 6.10 Display the permanent-retirement consequences

UI reference: [Account Warning 2](<../../raw/designs/thinkso-claude-export/Account Warning 2.dc.html>)

```gherkin
Given the final warning is open
When it renders
Then it shows THINKSO · FINAL NOTICE, PERMANENT, and ARE YOU REALLY, REALLY SURE?
And it emphasizes THIS IS PERMANENT
And it states that the profile will be permanently retired
And it states that the user cannot sign in or participate with this profile again
And it states that unresolved challenges will be voided
And it states that existing challenge history remains public
And it offers GO BACK and HOLD TO RETIRE
```

### 6.11 Cancel from the final warning

UI reference: [Account Warning 2](<../../raw/designs/thinkso-claude-export/Account Warning 2.dc.html>)

```gherkin
Given the final warning is open and retirement is not in progress
When the user taps GO BACK
Then the retirement flow closes
And the profile, Threads connection, sessions, and challenges remain unchanged
```

### 6.12 Require a continuous five-second retirement hold

UI reference: [Account Warning 2](<../../raw/designs/thinkso-claude-export/Account Warning 2.dc.html>)

```gherkin
Given the final warning is open
When the user continuously holds HOLD TO RETIRE
Then the red progress fill advances across the button
And the label shows KEEP HOLDING with the remaining whole-second countdown
And no retirement request begins before five seconds completes
```

### 6.13 Reset an incomplete retirement hold

UI reference: [Account Warning 2](<../../raw/designs/thinkso-claude-export/Account Warning 2.dc.html>)

```gherkin
Given the five-second retirement hold has not completed
When the user releases, drags or navigates away, or the gesture is canceled
Then progress resets to zero
And HOLD TO RETIRE is restored
And no retirement request is made
```

### 6.14 Submit retirement after the completed hold

UI references: [Account Warning 2](<../../raw/designs/thinkso-claude-export/Account Warning 2.dc.html>) · [loading S](<../../raw/designs/thinkso-claude-export/CoolSpinner.dc.html>)

```gherkin
Given the final retirement hold reaches five seconds
When the retirement request begins
Then the final warning remains visible
And GO BACK and the retirement action are disabled
And a loading S is visible
And only one retirement request can be in flight
```

### 6.15 Recover from retirement failure

UI references: [Account Warning 2](<../../raw/designs/thinkso-claude-export/Account Warning 2.dc.html>) · [ErrorToast](<../../raw/designs/thinkso-claude-export/ErrorToast.dc.html>)

```gherkin
Given an authoritative retirement request fails or cannot be confirmed
When the failure is handled
Then the client does not claim that retirement succeeded
And the current session and profile remain locally intact
And the final warning remains available
And HOLD TO RETIRE is restored at zero progress
And the global retry toast is shown
When the toast's TRY AGAIN is tapped
Then the already-confirmed retirement request is repeated without another hold
But if the user closes the retirement flow, any future attempt requires both warnings and a new five-second hold
```

### 6.16 Complete permanent profile retirement atomically

UI reference: [Account Warning 2](<../../raw/designs/thinkso-claude-export/Account Warning 2.dc.html>)

```gherkin
Given the retirement request succeeds
When its server transaction commits
Then the profile is permanently retired
And all of that user's sessions and push tokens are invalidated
And the Threads connection is revoked or queued for auditable revocation
And every unresolved participating Contract is VOIDED
And pending judgment and publication work for those Contracts is canceled
And existing historical Contracts remain public
```

### 6.17 Exit authenticated UI after successful retirement

UI reference: [ThinkSo Account](<../../raw/designs/thinkso-claude-export/ThinkSo Account.dc.html>)

```gherkin
Given permanent retirement succeeds
When the client receives success
Then all local credentials and protected caches are cleared
And Login replaces the authenticated application
And Account and protected history can no longer be opened by that session
```

### 6.18 Prevent retired identity reuse

UI reference: [ThinkSo Account](<../../raw/designs/thinkso-claude-export/ThinkSo Account.dc.html>)

```gherkin
Given a profile was permanently retired
When a later login or Threads connection matches any preserved Apple subject, Google subject, verified normalized email, or Threads user ID
Then the server treats it as the same retired person
And it does not create or reactivate a usable ThinkSo profile
```

### 6.19 Distinguish external revocation from voluntary retirement

UI reference: [ThinkSo Account](<../../raw/designs/thinkso-claude-export/ThinkSo Account.dc.html>)

```gherkin
Given Meta reports that Threads access was revoked outside ThinkSo
When the app detects the invalid connection
Then the ThinkSo profile is not retired
And unresolved Contracts are not voided merely because of that revocation
And protected app access routes to the standard Connect Threads gate
And successful reconnection restores access and resumes authorization-blocked publication work
```

### 6.20 Allow retirement during any unresolved lifecycle state

UI reference: [Account Warning 2](<../../raw/designs/thinkso-claude-export/Account Warning 2.dc.html>)

```gherkin
Given the user participates in PROPOSED, SENT, ACCEPTED, JUDGING, or POSTING Contracts
When permanent retirement succeeds
Then retirement is not rejected because work is active
And each unresolved Contract becomes VOIDED
And no unpublished verdict or pending consequence is later published for those voided Contracts
```
