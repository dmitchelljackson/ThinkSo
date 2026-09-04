# Notifications BDD acceptance criteria

This document is the behavioral source of truth for Section 9, notification permission priming, push registration, transactional notification events, copy, recipients, and navigation. Provider delivery mechanics and test implementation belong to engineering documentation.

## Canonical sources

- [Screens and behavior](../design/screens-and-behavior.md#shared-notification-permission-primer)
- [API specification](../api/api-specification.md#push-tokens)
- [Challenge Contract Screen BDD](./challenge-contract-screen-bdd.md)
- [Create Challenge Screen BDD](./create-challenge-screen-bdd.md)
- [Connect Threads Screen BDD](./connect-threads-screen-bdd.md)
- Shared dialog visual language: [CommitmentDialog](<../../raw/designs/thinkso-claude-export/CommitmentDialog.dc.html>)

The notification primer is newly specified product UI rather than an existing exported composition. It should reuse the established paper, typography, stamp, button, and handwritten-annotation system without inheriting fixed preview dimensions.

## 9. Notifications

### 9.1 Do not request permission before demonstrated value

```gherkin
Given the user has not yet successfully sent or accepted a Contract on this installation
When they log in, connect Threads, browse The Record, read a Contract, or begin minting
Then the notification primer is not shown
And the native operating-system notification prompt is not invoked
```

### 9.2 Prime after the first successful Contract send

```gherkin
Given notification permission is undetermined on this installation
And the primer has never been shown
When the user successfully sends their first Contract
Then the send remains complete regardless of notification choice
And the native share sheet is allowed to finish first
And the notification primer appears over the resulting sent Contract after returning from sharing
```

### 9.3 Prime after the first successful Contract acceptance

```gherkin
Given notification permission is undetermined on this installation
And the primer has never been shown
And no earlier send triggered it
When the user successfully accepts a Contract
Then acceptance remains complete regardless of notification choice
And the notification primer appears over the accepted Contract
```

### 9.4 Show the canonical notification primer

```gherkin
Given the notification primer is eligible to appear
When it renders
Then it uses the compact ThinkSo paper-notice dialog treatment
And it shows THINKSO · NOTICE and the OPTIONAL stamp
And its heading is GET THE RECEIPTS
And its body is "ThinkSo will let you know when a challenge is accepted and when a judgment is ready. That's it."
And its actions are blue TURN ON NOTIFICATIONS and outlined NOT NOW
And the handwritten note "you'll want this" points toward the primary action
```

### 9.5 Invoke the native prompt only after explicit primer consent

```gherkin
Given the notification primer is visible
When the user taps TURN ON NOTIFICATIONS
Then the primer closes
And the native operating-system notification permission prompt is invoked
And the completed Contract action remains unchanged
```

### 9.6 Dismiss without invoking the native prompt

```gherkin
Given the notification primer is visible
When the user taps NOT NOW
Then the primer closes
And the native permission prompt is not invoked
And the installation records that the primer was shown
And no core product behavior is restricted
```

### 9.7 Show the primer at most once per installation

```gherkin
Given the notification primer was previously shown on this installation
When the user later sends or accepts another Contract
Then the primer is not shown again
And ThinkSo does not nag the user with a repeated native prompt
```

### 9.8 Skip the primer for a determined permission state

```gherkin
Given operating-system notification permission is already granted or permanently denied
When a qualifying send or acceptance succeeds
Then the notification primer is not shown
And ThinkSo does not invoke the native prompt redundantly
```

### 9.9 Register an authorized device token

```gherkin
Given the operating system grants notification permission
When ThinkSo obtains a valid push token
Then it upserts that globally unique token for the authenticated user and platform
And repeated registration does not create duplicate token rows
And failure to register the token does not undo the Contract action that prompted permission
```

### 9.10 Continue normally when permission is denied

```gherkin
Given the operating system denies notification permission
When the native prompt closes
Then no push token is registered
And the user may still send, accept, read, judge, and receive published consequences normally
And no notification-preferences screen is added for MVP
```

### 9.11 Support multiple active devices per user

```gherkin
Given one user has valid push tokens on multiple devices
When a transactional notification targets that user
Then the notification is attempted for every active token
And one device's delivery result does not suppress delivery to another device
```

### 9.12 Reassign a reused installation token safely

```gherkin
Given a globally unique device token was previously associated with another signed-in user
When a different authenticated user registers that token on the same installation
Then the token is reassigned to the current user rather than duplicated
And future notifications are not intentionally addressed to the prior user through that token
```

### 9.13 Notify the creator when a Contract is accepted

```gherkin
Given a SENT Contract is atomically accepted
When the acceptance transaction commits
Then one notification event targets the creator
And it does not target the newly bound challenger for their own action
And its user-facing message is exactly "Your challenge was accepted!"
And its destination is the canonical accepted Contract
```

### 9.14 Do not notify for local rejection

```gherkin
Given a viewer taps REJECT on a SENT Contract
When the Contract closes locally
Then no API mutation occurs
And no notification event is created
```

### 9.15 Notify both participants when judgment enters POSTING

```gherkin
Given a supported TRUE or FALSE verdict and durable publication intent commit successfully
When the Contract transitions from JUDGING to POSTING
Then one result-notification event targets the creator
And one targets the bound challenger
And the user-facing message is exactly "Your judgment is in!"
And TRUE or FALSE is not revealed in the notification copy
And the destination is the canonical POSTING Contract
```

### 9.16 Do not send a duplicate result notification at RESOLVED

```gherkin
Given both participants were notified when the verdict entered POSTING
When Threads publication succeeds and the Contract transitions to RESOLVED
Then no second result-notification event is created
And the existing Contract destination now shows the final Threads receipt when refreshed
```

### 9.17 Notify both participants when judgment becomes unresolved

```gherkin
Given no supported verdict exists when resolution_expiration arrives
When the Contract transitions from JUDGING to UNRESOLVED
Then one notification event targets each participant
And its user-facing message is exactly "We couldn't resolve your challenge."
And the destination is the canonical UNRESOLVED Contract
```

### 9.18 Keep non-user-facing operational events silent

```gherkin
Given a Contract is sent, a SENT Contract expires, an accepted Contract becomes VOIDED, a judging or posting attempt retries, POSTING later becomes RESOLVED, a viewer rejects locally, or the Record reorders
When that operational event occurs
Then MVP does not create a push notification for that event
```

### 9.19 Open a notification destination through platform gates

```gherkin
Given the user taps a ThinkSo notification
When a valid session and CONNECTED Threads authorization exist
Then the canonical target Contract opens
And it refreshes authoritative state rather than trusting notification payload state
But when Login or Connect Threads is required
Then the Contract destination is retained through those gates and opens afterward
```

### 9.20 Protect Contract data in notification payloads

```gherkin
Given a transactional push is delivered to a locked device
When its visible content is displayed
Then it contains only the approved generic event copy
And result copy does not expose TRUE, FALSE, evidence, consequences, participant names, or private operational details
And Contract data is fetched only after protected navigation gates pass
```

### 9.21 Make notification delivery nonblocking

```gherkin
Given a notification event cannot be delivered immediately because Expo or a device token fails
When the underlying acceptance, verdict, or unresolved transition has committed
Then the Contract transition remains successful
And notification failure cannot roll back or duplicate the domain event
And delivery failure is recorded for operational handling
```

### 9.22 Delete permanently invalid push tokens

```gherkin
Given the push provider reports a token as permanently invalid
When its receipt is processed
Then that token is deleted
And later notification events do not continue targeting it
And the user's other active tokens remain registered
```

### 9.23 Treat current-device sign-out as local-first

```gherkin
Given the user signs out on one device
When local logout completes
Then protected notification destinations on that device route to Login
And push-token deletion and server-session revocation are attempted best-effort
And failure of either remote request does not block local logout
And generic notification copy does not expose Contract details if a stale push arrives
```

### 9.24 Stop targeting a permanently retired profile

```gherkin
Given profile retirement commits successfully
When its transaction completes
Then all push-token rows for that user are removed
And later notification events do not target the retired profile
And historical public Contracts remain unaffected
```

### 9.25 Deduplicate each transactional notification event

```gherkin
Given a domain transaction, worker, or delivery command retries
When it processes the same acceptance, POSTING verdict, or UNRESOLVED transition again
Then it does not create a second logical notification event for the same recipient
And provider retry may redeliver only according to the implementation's durable delivery policy
And domain retries never intentionally generate duplicate user notifications
```
