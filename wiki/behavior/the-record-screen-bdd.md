# The Record Screen BDD acceptance criteria

This document is the behavioral source of truth for Main / The Record screen only.

## UI sources

- Primary screen: [ThinkSo The Record](<../../raw/designs/thinkso-claude-export/ThinkSo The Record.dc.html>)
- Loading composition: [The Record - Loading](<../../raw/designs/thinkso-claude-export/The Record - Loading.dc.html>)
- Retained-data error composition: [The Record - Error Toast](<../../raw/designs/thinkso-claude-export/The Record - Error Toast.dc.html>)
- Card variants: [Challenge Card Variants](<../../raw/designs/thinkso-claude-export/Challenge Card Variants.dc.html>)
- Shared card: [ChallengeCard](<../../raw/designs/thinkso-claude-export/ChallengeCard.dc.html>)
- Shared error treatment: [ErrorToast](<../../raw/designs/thinkso-claude-export/ErrorToast.dc.html>)
- Shared activity indicator: [CoolSpinner / loading S](<../../raw/designs/thinkso-claude-export/CoolSpinner.dc.html>)

The exported files are visual evidence, not implementation code. Behavioral decisions in this BDD supersede interactions, mock data, ordering, fixed dimensions, and state handling hardcoded in the export.

## 3. Main / The Record

### 3.1 Display The Record with OPEN challenges

UI references: [ThinkSo The Record](<../../raw/designs/thinkso-claude-export/ThinkSo The Record.dc.html>) · [ChallengeCard](<../../raw/designs/thinkso-claude-export/ChallengeCard.dc.html>)

```gherkin
Given the user has an active ThinkSo session
And the user's Threads connection is CONNECTED
And usable Record data contains one or more OPEN challenges
When Main is displayed
Then the header identifies the screen as "THE RECORD"
And the header shows the Account and Settings button
And the OPEN tab is selected
And the screen shows the count of returned OPEN entries
And OPEN entries appear as one continuous stack without status-group headings
And every entry uses the shared Challenge Card structure
And every card shows its challenge ID, status, title, parties, consequence summary, and state-appropriate footer
And "MAKE A CHALLENGE" is visible as the persistent sticker-style FAB
And the end-of-file treatment follows the final returned card
```

### 3.2 Always enter on OPEN

UI reference: [ThinkSo The Record](<../../raw/designs/thinkso-claude-export/ThinkSo The Record.dc.html>)

```gherkin
Given the user previously selected either OPEN or CLOSED
When the user freshly enters Main
Then OPEN is selected
And the previously selected tab is not restored across fresh entries
And selecting OPEN does not start a tab-specific network request
```

### 3.3 Show CLOSED only when it has records

UI reference: [ThinkSo The Record](<../../raw/designs/thinkso-claude-export/ThinkSo The Record.dc.html>)

```gherkin
Given a complete Record response has been loaded
When the CLOSED collection is empty
Then the CLOSED tab is not shown
But when the CLOSED collection contains at least one challenge
Then the CLOSED tab is shown beside OPEN
And OPEN remains selected on fresh entry
```

### 3.4 Display the universal OPEN empty state

UI reference: [ThinkSo The Record](<../../raw/designs/thinkso-claude-export/ThinkSo The Record.dc.html>)

```gherkin
Given the loaded OPEN collection is empty
When OPEN is selected
Then the crossed-out-document empty illustration is shown
And the heading is "NOTHING OPEN"
And the message is "No challenges need your attention. Go start something."
And the decorative direction toward Make a Challenge is shown
And the Make a Challenge FAB remains visible and enabled
And the screen does not automatically select CLOSED even when CLOSED has records
```

### 3.5 Switch between retained OPEN and CLOSED collections locally

UI reference: [ThinkSo The Record](<../../raw/designs/thinkso-claude-export/ThinkSo The Record.dc.html>)

```gherkin
Given one complete Record response contains both OPEN and CLOSED collections
And CLOSED is available
When the user selects CLOSED
Then the retained CLOSED collection is rendered immediately
And CLOSED becomes visibly selected
And no CLOSED-specific request or loading state begins
When the user selects OPEN again
Then the retained OPEN collection is rendered immediately
And no OPEN-specific request or loading state begins
```

### 3.6 Honor explicit server ordering

UI references: [ThinkSo The Record](<../../raw/designs/thinkso-claude-export/ThinkSo The Record.dc.html>) · [Challenge Card Variants](<../../raw/designs/thinkso-claude-export/Challenge Card Variants.dc.html>)

```gherkin
Given the Record response contains entries with explicit record_order values
When either tab renders its entries
Then entries are displayed by record_order
And the client does not recreate business ordering from state or timestamps
And array placement is not treated as the ordering contract
And a stable refresh may replace every entry and record_order atomically
```

### 3.7 Keep POSTING challenges in OPEN

UI references: [ThinkSo The Record](<../../raw/designs/thinkso-claude-export/ThinkSo The Record.dc.html>) · [ChallengeCard](<../../raw/designs/thinkso-claude-export/ChallengeCard.dc.html>)

```gherkin
Given a challenge has a final verdict but its authorized Threads post has not completed
When the server returns that challenge in state POSTING
Then it appears in OPEN
And its card status is POSTING
And it does not appear in CLOSED until publication succeeds and its state becomes RESOLVED
```

### 3.8 Open any Challenge Card

UI reference: [ChallengeCard](<../../raw/designs/thinkso-claude-export/ChallengeCard.dc.html>)

```gherkin
Given an OPEN or CLOSED Challenge Card is visible
When the user taps anywhere on the card
Then the canonical Challenge Contract for that card opens
And no accept, reject, judgment, or other mutation is performed by the card itself
And an OPEN card opens with its current state-appropriate Contract behavior
And a CLOSED card opens the same Contract screen in its terminal read-only state
```

### 3.9 Preserve local list position when returning from a Contract

UI reference: [ThinkSo The Record](<../../raw/designs/thinkso-claude-export/ThinkSo The Record.dc.html>)

```gherkin
Given the user opened a Contract from a selected Record tab at a nonzero scroll position
When the user navigates back to The Record
Then the previously selected tab is restored for that navigation return
And the prior scroll position is preserved where the current collection permits it
And returning does not force the list to the top
```

### 3.10 Animate a refreshed card move or removal

UI references: [ThinkSo The Record](<../../raw/designs/thinkso-claude-export/ThinkSo The Record.dc.html>) · [ChallengeCard](<../../raw/designs/thinkso-claude-export/ChallengeCard.dc.html>)

```gherkin
Given The Record is visible with retained entries
When refreshed repository data changes an entry's record_order or moves it from OPEN to CLOSED
Then the visible list adopts the new server-provided collections and ordering
And the affected card uses a short restrained list transition
And an OPEN card may move or disappear rather than remaining frozen in its previous position
And no informational toast explains the movement in MVP
```

### 3.11 Show initial loading without removing the creation action

UI references: [The Record - Loading](<../../raw/designs/thinkso-claude-export/The Record - Loading.dc.html>) · [CoolSpinner / loading S](<../../raw/designs/thinkso-claude-export/CoolSpinner.dc.html>)

```gherkin
Given no usable Record data is cached
When the single Record request is in progress
Then the Record header remains visible
And the loading S is visible with the loading treatment
And no stale or invented card is shown
And the Make a Challenge FAB remains visible and enabled
```

### 3.12 Show the initial no-data error state

UI reference: [ThinkSo The Record](<../../raw/designs/thinkso-claude-export/ThinkSo The Record.dc.html>)

```gherkin
Given no usable Record data is cached
When the initial Record request fails
Then the screen shows "THE RECORD WON'T OPEN"
And it explains that the user's filed challenges remain on file
And it shows an enabled "TRY AGAIN" button
And it shows the handwritten "hit it again" treatment
And the Make a Challenge FAB remains visible and enabled
And no individual-card load-error state is fabricated
```

### 3.13 Retry an initial Record failure

UI references: [ThinkSo The Record](<../../raw/designs/thinkso-claude-export/ThinkSo The Record.dc.html>) · [CoolSpinner / loading S](<../../raw/designs/thinkso-claude-export/CoolSpinner.dc.html>)

```gherkin
Given the initial no-data error state is displayed
When the user taps "TRY AGAIN"
Then "TRY AGAIN" becomes disabled until the request completes or fails
And a separate loading S is visible
And the existing error composition remains on screen during the retry
And success replaces the error composition with the complete Record
And repeat failure restores the enabled "TRY AGAIN" button
```

### 3.14 Refresh the complete Record while retaining cards

UI references: [ThinkSo The Record](<../../raw/designs/thinkso-claude-export/ThinkSo The Record.dc.html>) · [CoolSpinner / loading S](<../../raw/designs/thinkso-claude-export/CoolSpinner.dc.html>)

```gherkin
Given usable OPEN and CLOSED Record data is retained
When the user pulls to refresh
Then one request reloads both complete collections
And the retained selected-tab cards remain visible
And a small loading S indicates refresh activity
And success atomically replaces both collections and their record_order values
And the selected tab is preserved when still available
```

### 3.15 Preserve retained data when refresh fails

UI references: [The Record - Error Toast](<../../raw/designs/thinkso-claude-export/The Record - Error Toast.dc.html>) · [ErrorToast](<../../raw/designs/thinkso-claude-export/ErrorToast.dc.html>)

```gherkin
Given usable Record data is retained
When a pull or focus refresh fails
Then both retained collections remain unchanged and usable
And the currently selected tab and visible cards remain on screen
And the global filing-error toast overlays The Record
And retry reloads the complete Record rather than one tab or card
And the full-screen no-data error state is not shown
```

### 3.16 Silently refresh when Main regains focus

UI reference: [ThinkSo The Record](<../../raw/designs/thinkso-claude-export/ThinkSo The Record.dc.html>)

```gherkin
Given usable Record data is retained
When Main regains navigation focus
Then the retained Record is displayed immediately
And stale data is silently refreshed through the repository
And no full-screen loading state replaces usable cards
And refresh success may reorder or remove cards using the restrained list transition
And refresh failure follows the retained-data error behavior
```

### 3.17 Use one unpaginated Record response for MVP

UI reference: [ThinkSo The Record](<../../raw/designs/thinkso-claude-export/ThinkSo The Record.dc.html>)

```gherkin
Given the MVP Record endpoint succeeds
When The Record consumes its response
Then the response supplies both complete OPEN and CLOSED collections
And the client does not request a next page
And the end-of-file treatment truthfully follows the complete returned tab collection
And future pagination behavior is not inferred from this MVP response
```

### 3.18 Open Account and Create Challenge from their screen controls

UI reference: [ThinkSo The Record](<../../raw/designs/thinkso-claude-export/ThinkSo The Record.dc.html>)

```gherkin
Given The Record is displayed
When the user taps the Account and Settings button
Then Account opens
When the user taps the Make a Challenge FAB
Then Create Challenge opens
And neither navigation action mutates the Record
```

### 3.19 Enforce session and Threads gates above The Record

UI reference: [ThinkSo The Record](<../../raw/designs/thinkso-claude-export/ThinkSo The Record.dc.html>)

```gherkin
Given The Record would otherwise be the requested destination
When no valid ThinkSo session exists
Then Login replaces The Record
And no Record API request or content is exposed
But when a valid session exists and Threads is NEVER_CONNECTED or REAUTH_REQUIRED
Then Connect Threads replaces The Record
And no Record API request or content is exposed
```

### 3.20 Render responsively rather than copying the preview frame

UI references: [ThinkSo The Record](<../../raw/designs/thinkso-claude-export/ThinkSo The Record.dc.html>) · [Challenge Card Variants](<../../raw/designs/thinkso-claude-export/Challenge Card Variants.dc.html>)

```gherkin
Given The Record implementation is derived from the Claude Design export
When it renders on any supported phone size or safe-area configuration
Then the header, tabs, counts, cards, terminal treatment, and FAB remain readable and operable
And card height grows with real content without clipping
And native safe-area insets and scrolling are respected
And the 393 × 852 preview frame is not hardcoded as the application viewport
And web-only fixed coordinates and inline pixel values are not treated as behavioral requirements
```
