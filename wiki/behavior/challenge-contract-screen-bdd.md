# Challenge Contract Screen BDD acceptance criteria

This document is the behavioral source of truth for the canonical Challenge Contract screen and its lifecycle variants. Proposal selection and the creator's send confirmation belong to the Create Challenge BDD.

## UI sources

- Primary lifecycle screen: [ThinkSo Challenge Contract](<../../raw/designs/thinkso-claude-export/ThinkSo Challenge Contract.dc.html>)
- Invite composition: [Contract Invite](<../../raw/designs/thinkso-claude-export/Contract Invite.dc.html>)
- Resolved composition: [Contract Resolved](<../../raw/designs/thinkso-claude-export/Contract Resolved.dc.html>)
- Recipient acceptance composition: [Dialog Recipient](<../../raw/designs/thinkso-claude-export/Dialog Recipient.dc.html>)
- Shared dialog: [CommitmentDialog](<../../raw/designs/thinkso-claude-export/CommitmentDialog.dc.html>)
- Shared error treatment: [ErrorToast](<../../raw/designs/thinkso-claude-export/ErrorToast.dc.html>)
- Shared activity indicator: [CoolSpinner / loading S](<../../raw/designs/thinkso-claude-export/CoolSpinner.dc.html>)

The exports are visual evidence, not implementation code. This BDD supersedes hardcoded mock data, actions, fixed dimensions, and missing variants in the export.

## 4. Challenge Contract

### 4.1 Gate Contract access behind platform membership

UI references: [ThinkSo Challenge Contract](<../../raw/designs/thinkso-claude-export/ThinkSo Challenge Contract.dc.html>) · [Contract Invite](<../../raw/designs/thinkso-claude-export/Contract Invite.dc.html>)

```gherkin
Given a person opens a Contract link
When no valid ThinkSo session exists
Then Login replaces the Contract
And the intended destination is retained locally
And no Contract API request is made or content rendered
But when a session exists and Threads is NEVER_CONNECTED or REAUTH_REQUIRED
Then Connect Threads replaces the Contract and retains its destination
When both gates later succeed
Then the intended Contract opens instead of Main
```

### 4.2 Permit every active platform member to read a Contract

UI reference: [ThinkSo Challenge Contract](<../../raw/designs/thinkso-claude-export/ThinkSo Challenge Contract.dc.html>)

```gherkin
Given the viewer has an active session and CONNECTED Threads account
When the viewer opens a valid Contract link
Then the Contract may be read even when the viewer is neither participant nor intended opponent
And participant identity controls available actions rather than read access
```

### 4.3 Show the initial Contract loading shell

UI references: [ThinkSo Challenge Contract](<../../raw/designs/thinkso-claude-export/ThinkSo Challenge Contract.dc.html>) · [loading S](<../../raw/designs/thinkso-claude-export/CoolSpinner.dc.html>)

```gherkin
Given both platform gates passed and no usable Contract is cached
When its request is in progress
Then the sticky Contract shell is visible with a centered loading S
And no mock terms or lifecycle actions are rendered
```

### 4.4 Show an initial Contract read failure

UI references: [ThinkSo Challenge Contract](<../../raw/designs/thinkso-claude-export/ThinkSo Challenge Contract.dc.html>) · [ErrorToast](<../../raw/designs/thinkso-claude-export/ErrorToast.dc.html>) · [loading S](<../../raw/designs/thinkso-claude-export/CoolSpinner.dc.html>)

```gherkin
Given no usable Contract is cached
When the initial request fails
Then the Contract shell remains visible under the global retry toast
And no dedicated full-screen Contract error is required
When retry begins
Then its action is disabled and the loading S is visible until success or failure
```

### 4.5 Preserve a cached Contract when refresh fails

UI references: [ThinkSo Challenge Contract](<../../raw/designs/thinkso-claude-export/ThinkSo Challenge Contract.dc.html>) · [ErrorToast](<../../raw/designs/thinkso-claude-export/ErrorToast.dc.html>)

```gherkin
Given a usable Contract is rendered
When a focus or foreground refresh fails
Then the cached Contract remains visible and usable according to its retained state
And the global filing-error toast overlays it
And no blank or full-screen error replaces it
```

### 4.6 Display the shared canonical Contract structure

UI reference: [ThinkSo Challenge Contract](<../../raw/designs/thinkso-claude-export/ThinkSo Challenge Contract.dc.html>)

```gherkin
Given a canonical Contract loaded
When any lifecycle state renders
Then the header provides Back to The Record
And challenge ID, status, title, parties, both consequences, complete resolution terms, and important dates are shown
And the creator's descriptive Contract name and Threads handle are both shown
And an accepted Contract also shows the bound challenger's Threads handle alongside the immutable intended-opponent name
And a SENT Contract cannot show a challenger handle before anyone has accepted
And First Judgment and Resolve By show exact device-local date, clock time, and timezone
And either shows seconds when its stored instant is not aligned to a whole minute
And lifecycle sections are added without a second Contract screen or summary model
```

### 4.7 Show a sent Contract to its creator without controls

UI references: [Contract Invite](<../../raw/designs/thinkso-claude-export/Contract Invite.dc.html>) · [ThinkSo Challenge Contract](<../../raw/designs/thinkso-claude-export/ThinkSo Challenge Contract.dc.html>)

```gherkin
Given a SENT Contract is awaiting acceptance
And its creator is viewing it
When it renders
Then the immutable Contract and awaiting-acceptance status are shown
And ACCEPT, REJECT, share-again, and other creator mutation controls are absent
```

### 4.8 Show invite controls to an eligible noncreator

UI reference: [Contract Invite](<../../raw/designs/thinkso-claude-export/Contract Invite.dc.html>)

```gherkin
Given a SENT Contract is unexpired and unaccepted
And its viewer is not the creator
When it renders
Then green ACCEPT and outlined REJECT controls are shown
And the immutable intended-opponent wording does not change to this viewer's identity
And the fixed acceptance deadline is shown as a snapshot-relative ACCEPT IN label using the largest full remaining day, hour, or minute unit
And a positive duration below one minute is shown as ACCEPT NOW
And the label does not count down between authoritative Contract loads or refreshes
```

### 4.9 Close locally when REJECT is tapped

UI reference: [Contract Invite](<../../raw/designs/thinkso-claude-export/Contract Invite.dc.html>)

```gherkin
Given an eligible viewer sees REJECT
When REJECT is tapped
Then the Contract closes without a dialog, API request, state change, or notification
And it remains SENT for another eligible member
And navigation returns to the prior destination when one exists
And a cold deep link with no prior in-app destination returns to The Record
```

### 4.10 Confirm acceptance before submitting

UI references: [Dialog Recipient](<../../raw/designs/thinkso-claude-export/Dialog Recipient.dc.html>) · [CommitmentDialog](<../../raw/designs/thinkso-claude-export/CommitmentDialog.dc.html>)

```gherkin
Given an eligible viewer taps ACCEPT
Then the "YOU SURE?" commitment dialog overlays the Contract
And it says the Contract is accepted exactly as written
And it explains the authorized Threads consequence and says "No backing out after this."
And the "last chance, coward" annotation remains
And its actions are NEVER MIND and ACCEPT
When NEVER MIND is tapped
Then the dialog closes without changing the Contract
```

### 4.11 Disable both dialog actions during acceptance

UI references: [Dialog Recipient](<../../raw/designs/thinkso-claude-export/Dialog Recipient.dc.html>) · [loading S](<../../raw/designs/thinkso-claude-export/CoolSpinner.dc.html>)

```gherkin
Given the acceptance dialog is visible
When its ACCEPT action is tapped
Then exactly one request begins
And ACCEPT and NEVER MIND remain disabled until completion or failure
And a separate loading S is visible
```

### 4.12 Show a generic acceptance failure

UI references: [Dialog Recipient](<../../raw/designs/thinkso-claude-export/Dialog Recipient.dc.html>) · [ErrorToast](<../../raw/designs/thinkso-claude-export/ErrorToast.dc.html>)

```gherkin
Given acceptance is in progress
When it fails without accepting the Contract
Then the dialog closes
And the unchanged Contract remains underneath
And the global filing-error toast appears
And no specialized expiration error composition is required
```

### 4.13 Accept successfully on the same screen

UI references: [Dialog Recipient](<../../raw/designs/thinkso-claude-export/Dialog Recipient.dc.html>) · [ThinkSo Challenge Contract](<../../raw/designs/thinkso-claude-export/ThinkSo Challenge Contract.dc.html>)

```gherkin
Given a noncreator confirms acceptance of a valid SENT Contract
When the server atomically accepts that viewer first
Then the canonical ACCEPTED response replaces the displayed Contract
And the dialog closes and the same screen becomes ACTIVE
And no success screen or toast appears
And the authenticated challenger is displayed separately from immutable intended-opponent text when they differ
And both the creator's and authenticated challenger's Threads handles are visible
```

### 4.14 Recover when another user accepted first

UI references: [ThinkSo Challenge Contract](<../../raw/designs/thinkso-claude-export/ThinkSo Challenge Contract.dc.html>) · [ErrorToast](<../../raw/designs/thinkso-claude-export/ErrorToast.dc.html>)

```gherkin
Given another member wins an acceptance race
When this viewer receives the state conflict
Then their dialog closes and the Contract refreshes
And the actual challenger is shown
And a non-retryable toast says the challenge was already accepted
And this viewer is not bound
```

### 4.15 Forbid creator self-acceptance

UI reference: [Contract Invite](<../../raw/designs/thinkso-claude-export/Contract Invite.dc.html>)

```gherkin
Given the authenticated caller created the SENT Contract
Then ACCEPT is not rendered
When a nonconforming client calls the acceptance endpoint anyway
Then the server rejects self-acceptance and leaves the Contract SENT
```

### 4.16 Display an ACCEPTED Contract as active and immutable

UI reference: [ThinkSo Challenge Contract](<../../raw/designs/thinkso-claude-export/ThinkSo Challenge Contract.dc.html>)

```gherkin
Given a Contract is ACCEPTED
When it renders
Then its UI status is ACTIVE
And the bound challenger's Threads handle and creator's Threads handle are shown
And exact device-local First Judgment and Resolve By date/time/timezone values are shown without a running countdown
And no invitation controls are shown
And the lock note forbids edits, cancellation, and withdrawal
```

### 4.17 Display JUDGING without internal mechanics

UI reference: [ThinkSo Challenge Contract](<../../raw/designs/thinkso-claude-export/ThinkSo Challenge Contract.dc.html>)

```gherkin
Given a Contract is JUDGING
When it renders
Then the JUDGING status and judgment-in-progress treatment are shown
And no mutation controls are shown
And attempt counts, prompts, traces, retry timing, and chain-of-thought remain private
And no verdict is claimed before persistence
```

### 4.18 Display a final verdict while POSTING

UI references: [ThinkSo Challenge Contract](<../../raw/designs/thinkso-claude-export/ThinkSo Challenge Contract.dc.html>) · [Contract Resolved](<../../raw/designs/thinkso-claude-export/Contract Resolved.dc.html>)

```gherkin
Given a final verdict is persisted but its authorized Threads post is incomplete
When the POSTING Contract renders
Then the status, final judgment, explanation, and evidence are visible
And the consequence receipt area says "POST PENDING"
And it explains that judgment is filed while delivery continues
And provider error type, retry count, revoked authorization, and operator state remain private
```

### 4.19 Display the final RESOLVED receipt

UI references: [Contract Resolved](<../../raw/designs/thinkso-claude-export/Contract Resolved.dc.html>) · [ThinkSo Challenge Contract](<../../raw/designs/thinkso-claude-export/ThinkSo Challenge Contract.dc.html>)

```gherkin
Given judgment and authorized Threads publication succeeded
When the RESOLVED Contract renders
Then who was right or wrong, the explanation, evidence, exact published consequence, and available timestamp are shown
And VIEW THE POST ON THREADS opens the persisted provider link
And no mutation controls are shown
```

### 4.20 Display EXPIRED and VOIDED as labeled terminal Contracts

UI reference: [ThinkSo Challenge Contract](<../../raw/designs/thinkso-claude-export/ThinkSo Challenge Contract.dc.html>)

```gherkin
Given a Contract is EXPIRED or VOIDED
When it renders
Then its immutable structure and terminal label remain readable
And no judgment, evidence, receipt, action controls, or fabricated explanation appears
```

### 4.21 Show an UNRESOLVED explanation only when available

UI reference: [ThinkSo Challenge Contract](<../../raw/designs/thinkso-claude-export/ThinkSo Challenge Contract.dc.html>)

```gherkin
Given a Contract became UNRESOLVED without a supported verdict
When a final judge supplied a user-safe explanation
Then that explanation is shown
But when no explanation exists
Then no empty block or invented substitute is rendered
And no evidence or consequence receipt appears
```

### 4.22 Void every nonterminal Contract on participant retirement

UI reference: [ThinkSo Challenge Contract](<../../raw/designs/thinkso-claude-export/ThinkSo Challenge Contract.dc.html>)

```gherkin
Given either participant retires while a Contract is PROPOSED, SENT, ACCEPTED, JUDGING, or POSTING
When retirement completes
Then it becomes VOIDED
And pending judgment/publication stops and no consequence posts afterward
And any unpublished verdict remains private operational history
And only the VOIDED terminal treatment is platform-visible
```

### 4.23 Refresh only on defined triggers

UI reference: [ThinkSo Challenge Contract](<../../raw/designs/thinkso-claude-export/ThinkSo Challenge Contract.dc.html>)

```gherkin
Given a Contract is visible
When its viewer's mutation succeeds
Then the canonical response updates it
When navigation focus, app foregrounding, or a fresh push/deep-link open occurs
Then it silently refetches
But while it simply remains open
Then MVP performs no polling and uses no Contract-specific live stream
```

### 4.24 Animate refreshed state changes modestly

UI reference: [ThinkSo Challenge Contract](<../../raw/designs/thinkso-claude-export/ThinkSo Challenge Contract.dc.html>)

```gherkin
Given refreshed data changes status or visible sections
When the update renders
Then affected content uses brief restrained fades and layout transitions
And the whole document does not perform a dramatic animation
```

### 4.25 Navigate back predictably

UI reference: [ThinkSo Challenge Contract](<../../raw/designs/thinkso-claude-export/ThinkSo Challenge Contract.dc.html>)

```gherkin
Given the viewer taps Back after opening from The Record
Then the prior Record tab and scroll position are restored
But when the Contract was cold-opened without prior in-app history
Then Back opens The Record
```

### 4.26 Open evidence and receipt links normally

UI reference: [Contract Resolved](<../../raw/designs/thinkso-claude-export/Contract Resolved.dc.html>)

```gherkin
Given a Contract shows an evidence or Threads receipt link
When the viewer taps it
Then the persisted target opens using standard external-link behavior
And the Contract is not mutated
```

### 4.27 Render every variant responsively

UI references: [ThinkSo Challenge Contract](<../../raw/designs/thinkso-claude-export/ThinkSo Challenge Contract.dc.html>) · [Contract Invite](<../../raw/designs/thinkso-claude-export/Contract Invite.dc.html>) · [Contract Resolved](<../../raw/designs/thinkso-claude-export/Contract Resolved.dc.html>)

```gherkin
Given the implementation is derived from the Claude export
When any variant renders on a supported phone and safe-area configuration
Then long titles, names, terms, consequences, explanations, and evidence remain readable
And headers, dialogs, bottom controls, scrolling, and safe-area insets remain operable
And the 393 × 852 preview frame and web-only fixed coordinates are not implementation requirements
```

### 4.28 Display publication-failure voiding with the standard terminal treatment

UI reference: [ThinkSo Challenge Contract](<../../raw/designs/thinkso-claude-export/ThinkSo Challenge Contract.dc.html>)

```gherkin
Given a supported verdict entered POSTING
And consequence publication was permanently rejected or could not be safely completed within its eight-attempt, 24-hour window
When the Contract becomes VOIDED
Then POST PENDING, the unpublished verdict, evidence, and action controls disappear
And the same labeled VOIDED terminal treatment is shown
And no provider diagnostic or fabricated explanation is added
```
