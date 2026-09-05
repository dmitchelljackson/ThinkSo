# Screens and behavior

## 1. Login / Account Access

Purpose: establish a ThinkSo session through Firebase email/password authentication.

Required content:

- `THINKSO · ACCOUNT ACCESS` / `FORM 001` administrative header;
- ThinkSo wordmark with the juvenile `!?` layer;
- recurring `YOU VS THEM` motif, with YOU/THEM looking typed into contract fields;
- tagline: **Write it down. We’ll call it. Keep the receipts.**
- email and password fields with password obscured by default and an explicit show/hide control;
- primary Log In, Create Account, and Forgot Password actions;
- the [ThinkSo Access Form](<../../raw/designs/thinkso-login-email-password-2026-09-04/ThinkSo Access Form.dc.html>) and separate [ThinkSo Register](<../../raw/designs/thinkso-login-email-password-2026-09-04/ThinkSo Register.dc.html>) exports as current visual evidence;
- How It Works, Terms, and Privacy links.

The Register export contains a `Name for the record` field, but this is a raw-source mismatch. The locked product uses the connected Threads identity for public identity, so the Create Account UI does not show or require signup display name. No standalone forgot-password dialog was exported; use a normal account-access dialog from the Access Form affordance, with behavior defined by the Login BDD.

Behavior:

- successful Firebase email/password authentication creates or restores the ThinkSo user and session without requiring email verification in MVP;
- Create Account exchanges the Firebase token immediately and routes a new profile to Connect Threads; email ownership confirmation is a documented post-MVP issue. Forgot Password uses Firebase's neutral reset-email flow and returns the user to Login after the hosted reset action;
- a user without a completed Threads connection proceeds to Connect Threads;
- a ready user proceeds to Main;
- a permanently retired identity must not create a fresh usable profile. Login remains on the Login screen and shows the non-retryable `PROFILE RETIRED · JUST NOW` global toast defined by Login BDD 1.11.

## 2. Connect Threads

Purpose: explain and obtain the social authorization required for challenge consequences.

Required copy/behavior:

- explain that accepting a challenge can authorize publication of a pre-approved consequence;
- prominently state that ThinkSo never writes or posts something not agreed to in the challenge;
- acknowledgment checkbox: user understands the authorization;
- Connect Threads button is disabled until checked;
- successful OAuth marks onboarding complete and routes to Main.

## 3. Main / THE RECORD

Purpose: answer “what are my challenges?” and “how do I start one?”

- The only possible tabs are **OPEN** and **CLOSED**. **OPEN** is always shown; **CLOSED** is shown only when the user has at least one closed challenge.
- Every fresh entry defaults to **OPEN**; the previously selected tab is not restored.
- If OPEN is empty and CLOSED has records, Main still displays the OPEN empty state first and leaves CLOSED available for the user to select.
- OPEN is server-defined and includes sent/awaiting acceptance, accepted/active, and judging/retrying.
- CLOSED is server-defined and includes resolved, expired, voided, and terminal unresolved.
- OPEN is server-ordered in three priority buckets: awaiting-acceptance challenges newest-sent first, currently judging/retrying challenges earliest-due first, then accepted/upcoming challenges earliest-judgment first. The API supplies explicit `record_order`; the client does not recreate this ordering policy.
- For MVP, those OPEN buckets are not separated by list headings. Cards remain one continuous stack and communicate their state through each card's status label. Group headings may be reconsidered later.
- CLOSED is ordered by its terminal-state timestamp descending, so the most recently resolved, expired, voided, or terminally unresolved challenge appears first. Creation time does not determine CLOSED order.
- Each entry uses the canonical reusable Challenge Card and opens the canonical Challenge Contract.
- A sticker-like `+ MAKE A CHALLENGE` FAB opens Create Challenge.
- The Make a Challenge FAB remains visible and enabled in OPEN, CLOSED, list, empty, loading, and recoverable list-error states. Only a higher-level session or Threads authorization gate removes access to it.
- OPEN has one sparse empty state regardless of CLOSED history: `NOTHING OPEN` and `No challenges need your attention. Go start something.` It retains the crossed-out-document illustration and decorative direction toward the Make a Challenge FAB.
- One MVP Record request returns both complete OPEN and CLOSED collections. Selecting either tab is local and never initiates a tab-specific request or loading state.
- MVP does not paginate. `THAT’S THE WHOLE RECORD` / end-of-file treatment follows the returned collection; pagination is deferred until real dataset size or performance requires it.
- Pull-to-refresh reloads the entire Record atomically. Existing cards remain visible with a small loading S while refreshing. Failure preserves both retained collections and shows the global retry toast; the full-screen error state is reserved for having no usable Record data.
- For MVP, when Main regains navigation focus, it shows the retained Record immediately and silently refreshes stale data through the repository. Initial full-screen loading is used only when no usable Record exists; a focus-refresh failure preserves both collections and shows the retry toast. This policy may change after real usage.
- Initial Record failure uses the exported `THE RECORD WON’T OPEN` state with its explanatory copy, `TRY AGAIN`, handwritten `hit it again`, and persistent Make a Challenge FAB. Tapping retry disables the button and shows the separate loading S while retaining the error composition; success replaces it with the Record, and repeat failure restores the enabled button.
- The entire challenge card is a navigation target; cards do not expose contract actions. Every OPEN card opens the canonical Challenge Contract, where state-appropriate actions are available after the full contract can be read. Every CLOSED card opens that same screen in its resolved or otherwise terminal read-only state.
- Returning from a Challenge Contract preserves the selected Record tab and scroll position. Repository updates are applied live: a card may reorder within OPEN or disappear into CLOSED, using a short animated list transition. MVP does not show an informational toast for this movement.

### Challenge Card

One tappable surface; no internal buttons. It supports status, challenge ID, proposition/title, creator/opponent, solo/head-to-head presentation, resolution date, consequence summary, and state-specific timing/result. A SENT challenge presents its exact acceptance deadline as a snapshot-relative label such as `ACCEPT IN 2 DAYS`, `ACCEPT IN 1 HOUR`, `ACCEPT IN 5 MINUTES`, or `ACCEPT NOW`, supporting both long-running challenges and short-fuse microbet-style events without a busy countdown. Card variants share one structure. Doodles are optional decoration only.

## 5. Create Challenge

Purpose: converse with the creation agent and choose an immutable proposed contract.

Behavior:

- hide the exported attachment control for MVP; the composer accepts text only and no upload API is implemented;
- every tap of Make a Challenge starts a new persisted minting chat; never resume a previous unfinished chat as the new flow;
- chat creation persists and displays the minting-agent greeting `Okay, let's hear it. What are you so sure about?` as the first assistant message and includes it in later model context;
- while the new chat and greeting are being created, show the Create Challenge shell with a centered loading S and keep the composer disabled; render the greeting and enable composition only after creation succeeds;
- if initial chat creation fails, retain the shell and Back control, keep the composer disabled, and show the global retry toast; retry must create exactly one chat and one greeting without duplication;
- any attempt to leave Create Challenge opens a discard-or-continue confirmation when at least one message was submitted or the composer contains any unsent text;
- leaving immediately without confirmation is allowed only when no messages were submitted and the composer is empty;
- the confirmation is headed `THROW THIS OUT?`, explains that the draft and conversation cannot be recovered, uses `KEEP WORKING` and red `DISCARD` actions, and includes the annotation `commitment issues already?`;
- confirming discard marks the chat ABANDONED and removes it permanently from user-facing access; the retained private record is not a recoverable draft;
- if discard occurs during an agent turn, cancel the turn where possible and never surface late output or proposals from that abandoned flow;
- first `chat_state` event contains the full authoritative log, proposals, and active turn; no MVP pagination;
- user messages render optimistically and POST with a client-generated UUID;
- only one active minting-agent turn may run per chat; while it runs, the normal submit control becomes a red Stop control and no second message can be submitted or queued;
- tapping Stop requests cancellation of that turn; after cancellation is confirmed, the normal submit control returns and a new message may be sent;
- keep already streamed assistant text in the conversation with a small `STOPPED` marker, and include that partial visible response in later minting-agent context;
- the text field remains editable while Stop is shown; its draft is independent of the active turn and Stop never clears it;
- the composer grows with multiline input through five visible lines, then remains capped and scrolls its contents internally;
- the mobile keyboard Return action inserts a newline; only the composer arrow submits the message;
- clear the field only after that exact draft is successfully submitted as a user message, so the user may type, stop the agent, and then submit without retyping;
- if submission fails, remove or mark failed the optimistic message, restore the exact submitted text to the composer, and show the global retry toast without duplicating the message;
- if the user message was persisted but its minting-agent turn fails, keep the user message in the transcript and make the global toast retry only that failed turn; never resubmit or duplicate the user message;
- losing the stream does not cancel the turn; reconnect and replace local state with the next `chat_state`;
- while SSE is disconnected, keep the transcript, proposal cards, proposal selection, and editable composer available, but replace the composer action with a non-submitting `RECONNECTING...` treatment using the loading S;
- after automatic reconnection attempts are exhausted, replace `RECONNECTING...` with a tappable `RETRY CONNECTION` action; the transcript, proposal cards, proposal selection, and composer draft remain available while disconnected;
- after reconnect, the authoritative `chat_state` restores Stop when a turn remains active or normal Submit when no turn is active; text typed during disconnection remains intact;
- show streamed text and restrained tool activity such as `SEARCHING THE WEB...`; do not expose chain-of-thought;
- automatically follow new streamed content only while the user is already near the bottom of the conversation; once the user scrolls upward, preserve their chosen scroll position and do not pull them back down;
- MVP shows no new-content badge or jump-to-latest control while the user is scrolled upward;
- before persisting any proposal, the minting agent must verify that the claim can later be judged and state the intended evidence sources or source hierarchy in the resolution terms;
- web research is used whenever those sources cannot be established from already verified context; do not perform duplicate searches merely to satisfy a fixed tool-call count;
- future-event proposals do not require a final-result URL that cannot exist yet; they must establish that the event is real and plausibly observable and name a credible source class/hierarchy such as the official organizer followed by reputable reporting;
- if no credible future evidence path can make the claim objectively judgeable, the minting agent does not persist a proposal and explains what the user must clarify or change;
- the minting agent explicitly supplies an exact acceptance-expiration timestamp, First Judgment, and Resolve By; no hidden code fallback fills missing dates;
- First Judgment normally begins when the event/result period ends, while Resolve By defaults in prompt guidance to seven days later and may be extended; code enforces a minimum 48-hour judging window;
- Accept By must precede First Judgment and should reflect the last fair commitment point, such as before an event or announcement begins; there is no fixed seven-day acceptance rule;
- proposal and sent-contract UI renders the fixed acceptance timestamp as a snapshot-relative `ACCEPT IN ...` label rather than a calendar-only `ACCEPT BY` date;
- choose the largest full remaining unit and floor it: 2.5 days is `ACCEPT IN 2 DAYS`, 1.2 hours is `ACCEPT IN 1 HOUR`, and five minutes is `ACCEPT IN 5 MINUTES`; any positive duration below one minute is `ACCEPT NOW`;
- proposal and Contract UI render First Judgment and Resolve By as exact device-local date, clock time, and timezone, not date-only or relative values; include seconds when a stored boundary is not minute-aligned;
- compute the label when authoritative data is loaded or refreshed and do not run a local countdown timer solely to update it;
- when the agent has enough information, it persists a new immutable `PROPOSED` contract before emitting it;
- every MVP proposal contains only exact pre-approved Threads post text for the losing participant in each outcome; profile changes and every other manual or externally performed consequence shown in mock content are noncanonical and must not be minted;
- revisions create new proposals. Older proposals remain visible and selectable;
- an active minting-agent turn does not disable proposal selection or `CREATE + SEND`; the turn may continue streaming while the user reviews or begins sending an existing proposal;
- selecting `CREATE + SEND` opens the creator confirmation. It does not edit the proposal.

Creator confirmation:

- heading `PUT IT ON RECORD?` and `FINAL` treatment;
- explains it cannot be changed or taken back and says: `Anyone on ThinkSo with the link can view it. The first person to accept is locked in.`;
- successful `SEND IT` transitions `PROPOSED → SENT`, dismisses the modal, opens the native share sheet with the protected invite URL, then returns to the same canonical contract;
- if a minting-agent turn is still active when `SEND IT` succeeds, cancel that turn, finalize the minting chat, and never surface late output from it; the sent proposal remains the immutable result;
- while send is in progress, both creator-confirmation actions are disabled and the loading S is visible;
- send failure closes the confirmation, leaves the selected proposal PROPOSED, and shows the global retry toast; toast retry repeats the already-confirmed send without asking for confirmation again;
- no custom success or share screen.

## 4. Challenge Contract

One screen renders every lifecycle state from the canonical `Contract` response.

Shared sections include challenge ID/status, proposition/title, parties, resolution contract, important dates, consequences, and—when present—judgment/verdict evidence in Markdown with clickable source links.

Initial loading renders the Contract screen shell with the centered loading S. If the first read fails and no cached Contract exists, keep the shell and overlay the global retry toast. If a refresh fails while cached Contract data exists, retain the complete Contract and overlay the same toast. Retrying disables the toast action and shows the established loading S until success or another failure; no dedicated full-screen Contract error design is required for MVP.

The Contract does not poll and has no dedicated live-update stream in MVP. It refreshes after the viewer's own mutation, when the screen regains navigation focus, when the app returns to the foreground, or when freshly opened from a push/deep link. When refreshed data changes status or visible sections, use a restrained short fade and layout transition so the update is legible without animating the entire document dramatically.

An acceptance push says exactly `Your challenge was accepted!`, notifies the creator, and opens this canonical Contract. A supported verdict entering POSTING sends one result push to both participants and opens the Contract with its verdict and POST PENDING treatment when delivery is incomplete; RESOLVED sends no duplicate push. UNRESOLVED says exactly `We couldn't resolve your challenge.`, notifies both participants, and opens its terminal Contract.

The result notification says exactly `Your judgment is in!` and does not reveal TRUE or FALSE on the lock screen.

### SENT / Invite

- requires a valid ThinkSo session and connected Threads profile before any Contract data or UI is shown;
- a cold invite/deep link is retained through Login and Connect Threads, then opens this Contract rather than Main;
- shows `ACCEPT` and `REJECT` invitation actions when the authenticated viewer is eligible; the creator sees neither after sending;
- `ACCEPT` opens the recipient confirmation; success atomically binds the authenticated challenger and changes the same screen to ACCEPTED;
- `REJECT` closes the Contract locally and performs no API request, state transition, or notification;
- an acceptance conflict shows a simple toast such as `This challenge has already been accepted.`
- the creator's descriptive name and Threads handle are visible; before acceptance, no challenger handle is fabricated;
- the immutable intended-opponent name remains visible even when a different link-holder accepts; the actual authenticated challenger is identified separately rather than replacing the original wording.

### ACCEPTED / Active

- immutable;
- invitation controls disappear;
- the creator's Threads handle remains visible, and the authenticated challenger's Threads handle appears alongside the originally displayed opponent name;
- exact device-local First Judgment and Resolve By date/time/timezone values are visible without a running countdown.

### JUDGING

- shows an official `UNDER REVIEW` treatment;
- retries or unavailable information are represented cleanly without exposing internal retry mechanics.

### POSTING

- the final verdict, judgment explanation, and evidence are visible;
- the consequence receipt area says `POST PENDING` and explains that judgment is filed while the authorized Threads post is still being delivered;
- provider failure type, retry count, and whether authorization was revoked are not exposed on the public Contract;
- no user mutation controls are shown;
- the post receipt/link replaces the pending treatment when publication succeeds and the Contract becomes RESOLVED.

### RESOLVED / Receipt

- prominent TRUE or FALSE;
- winner/loser is derived from the stored contract and result;
- shows resolution time, consequence/post status, and the judge’s evidence/reasoning Markdown;
- this is the shareable/screenshot-worthy receipt.

### Other terminal variants

EXPIRED, VOIDED, and UNRESOLVED reuse this screen. They do not get standalone destinations.

## 6. Account

Intentionally sparse:

- connected Threads identity and status;
- destructive Disconnect Threads action;
- ordinary Sign Out;
- Terms, Privacy, and app version.

Do not add profile editing, avatar editing, notification preferences, themes, social settings, or filler controls.

Sign Out applies only to the current device. It immediately clears that device's local credentials and returns to Login without confirmation. Revoking the corresponding server session is best-effort: network failure must never block, delay, or reverse local logout, and other device sessions remain active.

Disconnect flow uses two confirmations:

1. personality-bearing warning headed `DISCONNECT THREADS?`, including `Don't be a sore loser.` and explaining sign-out/voiding;
2. serious final warning headed `ARE YOU REALLY, REALLY SURE?`, clearly stating permanence, profile retirement, inability to participate again, voiding of unresolved challenges, and preservation of public history.

Only completing the final five-second `HOLD TO RETIRE` gesture performs the operation. The button fills and counts down while held; releasing, leaving, or canceling before completion resets it. Disconnect is always permitted, even while judging.

After the hold completes, keep the final warning visible, disable both actions, and show the loading S until the retirement request succeeds or fails. Success clears all local authenticated state and routes to Login. Failure does not pretend the profile was retired: keep the session and final warning available, restore the hold action, and show the global retry toast. The toast's TRY AGAIN repeats the already-confirmed retirement request; if the user closes the retirement flow instead, a future attempt requires both warnings and a new hold.

## Shared notification permission primer

After the first successful Contract send or acceptance on a device, whichever occurs first, present a compact paper-notice dialog over the resulting Contract before invoking the native notification prompt. Never gate or reverse the completed Contract action.

- eyebrow: `THINKSO · NOTICE`;
- stamp: `OPTIONAL`;
- heading: `GET THE RECEIPTS`;
- body: `ThinkSo will let you know when a challenge is accepted and when a judgment is ready. That's it.`;
- primary blue action: `TURN ON NOTIFICATIONS`;
- secondary outlined action: `NOT NOW`;
- handwritten note pointing toward the primary action: `you'll want this`.

`TURN ON NOTIFICATIONS` invokes the native operating-system permission prompt. `NOT NOW` dismisses without invoking it. Show this primer at most once per installation and never show it when permission is already granted or permanently denied. Permission refusal never impairs sending, accepting, reading, judging, or any other core behavior.

## Login informational placeholders

How It Works, Terms, and Privacy are visible dummy controls for MVP. Tapping them does not navigate, open a modal or browser, or initiate a request. Real informational and legal destinations are deferred until their content exists.
