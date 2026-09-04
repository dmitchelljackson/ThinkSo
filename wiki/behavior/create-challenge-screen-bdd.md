# Create Challenge Screen BDD acceptance criteria

This document is the behavioral source of truth for Section 5, the Create Challenge screen and its minting-chat UI. Detailed minting-agent reasoning, judging-source verification, and proposal-tool behavior will also receive their own agent BDD; this screen document covers how those capabilities appear and behave in the client.

## UI sources

- Primary screen: [ThinkSo Create Challenge](<../../raw/designs/thinkso-claude-export/ThinkSo Create Challenge.dc.html>)
- Creator send confirmation: [Dialog Creator](<../../raw/designs/thinkso-claude-export/Dialog Creator.dc.html>)
- Shared dialog structure: [CommitmentDialog](<../../raw/designs/thinkso-claude-export/CommitmentDialog.dc.html>)
- Shared error treatment: [ErrorToast](<../../raw/designs/thinkso-claude-export/ErrorToast.dc.html>)
- Shared activity indicator: [CoolSpinner / loading S](<../../raw/designs/thinkso-claude-export/CoolSpinner.dc.html>)

The exports are visual evidence, not implementation code. This BDD supersedes hardcoded mock data, fixed dimensions, attachment controls, and incomplete interaction states in the export. Production layout must be responsive and must not assume the exported iPhone frame dimensions.

## 5. Create Challenge

### 5.1 Show the Create Challenge screen structure

UI reference: [ThinkSo Create Challenge](<../../raw/designs/thinkso-claude-export/ThinkSo Create Challenge.dc.html>)

```gherkin
Given an authenticated, Threads-connected user opens Create Challenge
When the screen shell renders
Then the sticky header shows Back, THINKSO, and NEW CHALLENGE
And the scrollable conversation occupies the body
And the sticky text composer occupies the bottom safe area
And the exported attachment button is absent for MVP
```

### 5.2 Start a new chat for every creation flow

UI reference: [ThinkSo Create Challenge](<../../raw/designs/thinkso-claude-export/ThinkSo Create Challenge.dc.html>)

```gherkin
Given the user taps MAKE A CHALLENGE
When Create Challenge opens
Then a new persisted minting chat is created
And no abandoned, sent, or unfinished prior chat is resumed
```

### 5.3 Show initial chat creation loading

UI references: [ThinkSo Create Challenge](<../../raw/designs/thinkso-claude-export/ThinkSo Create Challenge.dc.html>) · [loading S](<../../raw/designs/thinkso-claude-export/CoolSpinner.dc.html>)

```gherkin
Given a new minting chat is being created
When no authoritative chat state exists yet
Then the Create Challenge shell and Back control remain visible
And a centered loading S is shown
And the composer is disabled
And no mock transcript or proposal is rendered
```

### 5.4 Recover from initial chat creation failure

UI references: [ThinkSo Create Challenge](<../../raw/designs/thinkso-claude-export/ThinkSo Create Challenge.dc.html>) · [ErrorToast](<../../raw/designs/thinkso-claude-export/ErrorToast.dc.html>) · [loading S](<../../raw/designs/thinkso-claude-export/CoolSpinner.dc.html>)

```gherkin
Given initial chat creation fails
When the failure is shown
Then the shell and Back control remain visible
And the composer remains disabled
And the global retry toast is shown
When retry is tapped
Then its action is disabled and the loading S is visible
And success creates exactly one chat with exactly one greeting
```

### 5.5 Persist and display the minting-agent greeting

UI reference: [ThinkSo Create Challenge](<../../raw/designs/thinkso-claude-export/ThinkSo Create Challenge.dc.html>)

```gherkin
Given new chat creation succeeds
When authoritative chat state renders
Then its first assistant message is "Okay, let's hear it. What are you so sure about?"
And that greeting is persisted rather than synthesized only by the client
And the composer becomes enabled
```

### 5.6 Keep empty submissions unavailable

UI reference: [ThinkSo Create Challenge](<../../raw/designs/thinkso-claude-export/ThinkSo Create Challenge.dc.html>)

```gherkin
Given no agent turn is active and the stream is connected
When the composer is empty or contains only whitespace
Then the submit arrow is disabled
But when meaningful text exists
Then the submit arrow is enabled
```

### 5.7 Support multiline composition

UI reference: [ThinkSo Create Challenge](<../../raw/designs/thinkso-claude-export/ThinkSo Create Challenge.dc.html>)

```gherkin
Given the composer is enabled
When the user enters multiline text
Then Return inserts a newline and does not submit
And the composer expands through five visible lines
And additional text scrolls inside the capped composer
And only the arrow submits
```

### 5.8 Submit a user message once

UI reference: [ThinkSo Create Challenge](<../../raw/designs/thinkso-claude-export/ThinkSo Create Challenge.dc.html>)

```gherkin
Given the composer contains a draft and no turn is active
When the user taps the submit arrow
Then one optimistic user message appears with a client-generated ID
And the exact draft clears only after that message is accepted
And one minting-agent turn begins
And duplicate acknowledgements recover by rehydrating state rather than duplicating the message
```

### 5.9 Restore a draft after message submission failure

UI references: [ThinkSo Create Challenge](<../../raw/designs/thinkso-claude-export/ThinkSo Create Challenge.dc.html>) · [ErrorToast](<../../raw/designs/thinkso-claude-export/ErrorToast.dc.html>)

```gherkin
Given a user message is shown optimistically
When its submission fails before persistence
Then the optimistic message is removed or visibly reconciled as failed
And its exact text is restored to the composer
And the global retry toast is shown
And retry cannot create a duplicate user message
```

### 5.10 Replace Submit with Stop during an active turn

UI reference: [ThinkSo Create Challenge](<../../raw/designs/thinkso-claude-export/ThinkSo Create Challenge.dc.html>)

```gherkin
Given a minting-agent turn is active
When the composer renders
Then its normal submit action is replaced by a red Stop action
And another message cannot be submitted or queued
And only one active turn exists for the chat
```

### 5.11 Preserve typing while the agent responds

UI reference: [ThinkSo Create Challenge](<../../raw/designs/thinkso-claude-export/ThinkSo Create Challenge.dc.html>)

```gherkin
Given Stop is displayed during an active turn
When the user types a new draft
Then the composer remains editable
And the draft remains independent of the running turn
And tapping Stop does not clear that draft
```

### 5.12 Stop an active minting turn

UI reference: [ThinkSo Create Challenge](<../../raw/designs/thinkso-claude-export/ThinkSo Create Challenge.dc.html>)

```gherkin
Given assistant text is streaming
When the user taps Stop
Then cancellation is requested for that turn
And already visible assistant text remains as a persisted message marked STOPPED
And late output cannot alter user-visible chat state after cancellation
And authoritative cancellation restores Submit without clearing the draft
```

### 5.13 Retry only a failed agent turn

UI references: [ThinkSo Create Challenge](<../../raw/designs/thinkso-claude-export/ThinkSo Create Challenge.dc.html>) · [ErrorToast](<../../raw/designs/thinkso-claude-export/ErrorToast.dc.html>)

```gherkin
Given a user message was persisted but its minting-agent turn failed
When the global toast offers retry
Then the persisted user message remains in the transcript
When retry is tapped
Then only the failed agent turn is retried
And the user message is not submitted or displayed a second time
```

### 5.14 Stream safe assistant and tool activity

UI references: [ThinkSo Create Challenge](<../../raw/designs/thinkso-claude-export/ThinkSo Create Challenge.dc.html>) · [loading S](<../../raw/designs/thinkso-claude-export/CoolSpinner.dc.html>)

```gherkin
Given a minting-agent turn is running
When text and tool events arrive
Then assistant text appears incrementally with the exported streaming treatment
And safe activity such as SEARCHING THE WEB is shown with restrained loading-S motion
And hidden reasoning or chain-of-thought is never displayed
```

### 5.15 Follow streaming only near the bottom

UI reference: [ThinkSo Create Challenge](<../../raw/designs/thinkso-claude-export/ThinkSo Create Challenge.dc.html>)

```gherkin
Given the user is already near the bottom of the conversation
When new content streams in
Then the conversation follows the newest content
But given the user scrolls upward
When more content arrives
Then their chosen position is preserved
And MVP shows no new-content badge or jump-to-latest control
```

### 5.16 Show a persisted proposal inline

UI reference: [ThinkSo Create Challenge](<../../raw/designs/thinkso-claude-export/ThinkSo Create Challenge.dc.html>)

```gherkin
Given the minting agent has enough verified information
When a proposal is committed
Then a canonical immutable PROPOSED Contract is persisted before its event is emitted
And its inline card shows status, ID, title, creator, intended opponent, consequences, resolution terms, a snapshot-relative ACCEPT IN label, First Judgment, and Resolve By
And the acceptance label uses the largest full remaining unit or ACCEPT NOW below one minute
And it does not count down between authoritative state updates
And First Judgment and Resolve By show exact device-local date, clock time, and timezone rather than date-only or relative values
And either shows seconds when its stored instant is not aligned to a whole minute
And each outcome's consequence is exact pre-approved Threads post text
And no profile change or other manual consequence is shown
And CREATE + SEND is available on the proposal
```

### 5.17 Preserve proposal revisions separately

UI reference: [ThinkSo Create Challenge](<../../raw/designs/thinkso-claude-export/ThinkSo Create Challenge.dc.html>)

```gherkin
Given the conversation produces a revised proposal
When the revision appears
Then it is a new immutable PROPOSED Contract
And older proposals remain visible and selectable
And no prior proposal row is overwritten
```

### 5.18 Permit proposal actions during an active turn

UI reference: [ThinkSo Create Challenge](<../../raw/designs/thinkso-claude-export/ThinkSo Create Challenge.dc.html>)

```gherkin
Given the minting agent is actively streaming
And at least one proposal already exists
When the user reviews that proposal
Then its card remains readable and selectable
And CREATE + SEND remains enabled
And opening its send flow does not first require stopping the turn
```

### 5.19 Open the creator confirmation for the selected proposal

UI references: [ThinkSo Create Challenge](<../../raw/designs/thinkso-claude-export/ThinkSo Create Challenge.dc.html>) · [Dialog Creator](<../../raw/designs/thinkso-claude-export/Dialog Creator.dc.html>)

```gherkin
Given the user taps CREATE + SEND on a proposal
When the confirmation opens
Then it shows PUT IT ON RECORD? and the FINAL treatment
And it warns that the Contract cannot be changed or taken back
And it says "Anyone on ThinkSo with the link can view it. The first person to accept is locked in."
And it offers SEND IT and a return action
And the proposal remains unchanged while the dialog is open
```

### 5.20 Show send-confirmation loading

UI references: [Dialog Creator](<../../raw/designs/thinkso-claude-export/Dialog Creator.dc.html>) · [loading S](<../../raw/designs/thinkso-claude-export/CoolSpinner.dc.html>)

```gherkin
Given the creator confirmed SEND IT
When the send mutation is in progress
Then both confirmation actions are disabled
And a separate loading S is visible
And duplicate send requests cannot be started
```

### 5.21 Complete a successful send

UI references: [Dialog Creator](<../../raw/designs/thinkso-claude-export/Dialog Creator.dc.html>) · [ThinkSo Create Challenge](<../../raw/designs/thinkso-claude-export/ThinkSo Create Challenge.dc.html>)

```gherkin
Given a selected proposal is still PROPOSED
When SEND IT succeeds
Then the Contract transitions to SENT and the minting chat transitions to SENT
And any concurrently active minting turn is canceled
And late output cannot surface or modify the sent Contract
And the native share sheet opens with the protected invite URL
And dismissing the share sheet returns to the canonical sent Contract
```

### 5.22 Recover from send failure without reconfirming

UI references: [Dialog Creator](<../../raw/designs/thinkso-claude-export/Dialog Creator.dc.html>) · [ErrorToast](<../../raw/designs/thinkso-claude-export/ErrorToast.dc.html>)

```gherkin
Given the creator already confirmed SEND IT
When the send mutation fails
Then the confirmation closes
And the selected Contract remains PROPOSED
And the global retry toast is shown
When retry is tapped
Then the already-confirmed send is repeated without reopening the confirmation
```

### 5.23 Preserve the screen during a stream disconnection

UI references: [ThinkSo Create Challenge](<../../raw/designs/thinkso-claude-export/ThinkSo Create Challenge.dc.html>) · [loading S](<../../raw/designs/thinkso-claude-export/CoolSpinner.dc.html>)

```gherkin
Given the chat SSE connection is lost
When the screen remains open
Then the transcript and proposal cards remain readable
And proposals remain selectable
And the composer remains editable with its draft intact
And its action becomes non-submitting RECONNECTING... with the loading S
And a server-side active turn is not canceled merely by disconnection
```

### 5.24 Offer manual connection retry after automatic retries fail

UI reference: [ThinkSo Create Challenge](<../../raw/designs/thinkso-claude-export/ThinkSo Create Challenge.dc.html>)

```gherkin
Given automatic SSE reconnection attempts are exhausted
When the disconnected composer renders
Then RECONNECTING... becomes a tappable RETRY CONNECTION action
And reading, proposal selection, and draft editing remain available
When RETRY CONNECTION is tapped
Then another connection attempt begins without submitting the draft
```

### 5.25 Reconcile authoritative state after reconnection

UI reference: [ThinkSo Create Challenge](<../../raw/designs/thinkso-claude-export/ThinkSo Create Challenge.dc.html>)

```gherkin
Given the chat reconnects after an interruption or app foregrounding
When the next chat_state event arrives
Then its complete persisted transcript, proposals, and active turn replace speculative local stream state
And Stop is restored if a turn remains active
And Submit is restored if no turn is active
And locally typed unsent draft text remains intact
```

### 5.26 Leave a pristine creation flow immediately

UI reference: [ThinkSo Create Challenge](<../../raw/designs/thinkso-claude-export/ThinkSo Create Challenge.dc.html>)

```gherkin
Given no user message has been submitted
And the composer is empty
When the user taps Back or otherwise leaves
Then Create Challenge closes without a confirmation
```

### 5.27 Confirm leaving a non-pristine creation flow

UI references: [ThinkSo Create Challenge](<../../raw/designs/thinkso-claude-export/ThinkSo Create Challenge.dc.html>) · [CommitmentDialog](<../../raw/designs/thinkso-claude-export/CommitmentDialog.dc.html>)

```gherkin
Given at least one user message was submitted or the composer contains unsent text
When the user attempts to leave
Then a dialog headed THROW THIS OUT? appears
And it says "Leave now and this challenge draft is gone for good. You won't be able to come back to this conversation."
And it offers KEEP WORKING and red DISCARD
And it includes the annotation "commitment issues already?"
```

### 5.28 Keep working after the discard warning

UI reference: [CommitmentDialog](<../../raw/designs/thinkso-claude-export/CommitmentDialog.dc.html>)

```gherkin
Given the THROW THIS OUT? dialog is open
When the user chooses KEEP WORKING
Then the dialog closes
And the conversation, proposals, composer draft, and active-turn state remain unchanged
```

### 5.29 Abandon a discarded creation flow

UI references: [CommitmentDialog](<../../raw/designs/thinkso-claude-export/CommitmentDialog.dc.html>) · [ThinkSo Create Challenge](<../../raw/designs/thinkso-claude-export/ThinkSo Create Challenge.dc.html>)

```gherkin
Given the THROW THIS OUT? dialog is open
When the user chooses DISCARD
Then the chat is marked ABANDONED and Create Challenge closes
And it can never be resumed or recovered by the user
And any active turn is canceled where possible
And late output or proposals cannot reanimate or surface in the abandoned flow
But private retained records may remain for disclosed evaluation, training, and operational history
```

### 5.30 Gate the creation flow behind active platform access

UI reference: [ThinkSo Create Challenge](<../../raw/designs/thinkso-claude-export/ThinkSo Create Challenge.dc.html>)

```gherkin
Given the session becomes invalid or Threads becomes REAUTH_REQUIRED
When protected creation API access is attempted
Then no new message, proposal, or send mutation is allowed
And the app routes through Login or Connect Threads according to the failed gate
And reconnecting Threads may resume access without retiring the ThinkSo account
```

### 5.31 Keep all retained creation data private after abandonment

UI reference: [ThinkSo Create Challenge](<../../raw/designs/thinkso-claude-export/ThinkSo Create Challenge.dc.html>)

```gherkin
Given an abandoned chat and its messages, turns, or unsent proposals remain in internal storage
When the same user starts another creation flow
Then none of those retained records are exposed as history or resumable drafts
And actual model-training use is prohibited until Terms, Privacy, retention, and access policies disclose and govern it
```

### 5.32 Show daily minting-budget exhaustion in the conversation

UI references: [ThinkSo Create Challenge](<../../raw/designs/thinkso-claude-export/ThinkSo Create Challenge.dc.html>) · [ErrorToast](<../../raw/designs/thinkso-claude-export/ErrorToast.dc.html>)

```gherkin
Given a non-exempt user has exhausted the current UTC day's minting budget
When the user attempts to submit another message
Then that draft is not persisted or sent to the minting agent
And the exact draft remains editable in the composer
And an authoritative budget-exhausted event adds a non-agent notice to the conversation
And the notice says "You've used today's challenge budget. Try again tomorrow."
And the global non-retryable DAILY LIMIT toast shows the same explanation
And further submission remains disabled until the reset time supplied by the server
But the transcript and proposal cards remain readable and selectable
And the user may still send an already-persisted proposal
```

### 5.33 Apply normal discard behavior after budget exhaustion

UI references: [ThinkSo Create Challenge](<../../raw/designs/thinkso-claude-export/ThinkSo Create Challenge.dc.html>) · [CommitmentDialog](<../../raw/designs/thinkso-claude-export/CommitmentDialog.dc.html>)

```gherkin
Given budget exhaustion left unsent text in the composer
When the user attempts to leave Create Challenge
Then the normal THROW THIS OUT? dialog is shown
And choosing KEEP WORKING preserves the draft
And choosing DISCARD abandons the chat and permanently removes the draft and conversation from user access
And no special recovery path is created for a budget-blocked draft
```

### 5.34 Stop a running turn when its daily budget is reached

UI reference: [ThinkSo Create Challenge](<../../raw/designs/thinkso-claude-export/ThinkSo Create Challenge.dc.html>)

```gherkin
Given a non-exempt user's minting turn is running
When completed model and search steps consume the remainder of that UTC day's budget
Then no further model step or research call is started
And any assistant text already shown remains visibly marked as incomplete
And the turn ends as BUDGET_EXHAUSTED
And the authoritative daily-limit notice appears in the conversation
And submission remains disabled until the server-supplied reset time
And after reset the failed turn can be retried from its persisted user message without duplication
```
