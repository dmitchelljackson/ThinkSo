# Known issues and post-MVP limitations

## Judgment appeals are not implemented

**Status:** Deferred to V2.

A supported TRUE or FALSE verdict is final in MVP. Participants cannot appeal, request rejudging, or override it. A future version may add evidence submission, appeal windows, correction authority, audit history, and consequence-publication handling for disputed or corrected verdicts.

## Minting chat attachments are not implemented

**Status:** Deferred beyond MVP.

The Create Challenge composer accepts text only. Hide the attachment control shown in the design export and do not implement dormant upload behavior. Images or files may be reconsidered after a concrete minting or evidence-submission use case and its storage, privacy, moderation, and retention rules are defined.

## Solo and self-accepted challenges are not implemented

**Status:** Deferred to V2.

MVP hides acceptance controls from the creator and rejects creator self-acceptance server-side. The exported solo-card treatment remains visual exploration only. V2 may intentionally support solo/self challenges with appropriately defined parties, consequences, acceptance semantics, and Contract copy.

## Shared Contracts have no anonymous preview

**Status:** Deliberate MVP simplification; internet-public read-only access may be reconsidered in V2.

Contract, Record, profile, invite, and receipt data require an active ThinkSo session plus connected Threads account. Any member who passes those platform gates may view a shared Contract; participant identity restricts actions, not reading. A cold shared link preserves its destination through Login and Connect Threads. MVP does not render Contract content or request protected Contract data before those gates complete.

## POSTING does not expose delivery diagnostics

**Status:** Deliberate MVP simplification; detailed consequence-delivery UI is post-MVP.

A `POSTING` Contract shows its final judgment and a generic `POST PENDING` treatment until the Threads receipt is available. It does not publicly distinguish a temporary Meta failure, scheduled retry, ambiguous-result reconciliation, or revoked authorization. Authentication gating handles required reconnection for the affected user, while detailed diagnostics remain private operational data. Permanent rejection or failure to establish safe completion within the bounded delivery window changes the Contract to the generic VOIDED treatment. A future version may provide richer participant-facing delivery progress and recovery information.

## True rejection is not implemented

**Status:** Deliberate MVP simplification; targeted rejection and a DECLINED state are deferred to V2.

Because MVP shared links are not bound to a specific recipient, allowing any link-holder to kill a challenge would be unsafe. The invite retains its visually designed `REJECT` button, but tapping it only closes the Contract locally. It performs no API request, state transition, or notification. V2 may add recipient-bound invitations, true rejection, DECLINED history, and the previously discussed burn-away transition.

## Record changes have no explanatory notification

**Status:** Deliberate MVP simplification; richer change communication is post-MVP.

While The Record is visible, repository updates may cause a challenge card to move within OPEN or disappear from OPEN when it becomes CLOSED. The list uses a short animated transition so the change is visible, but MVP does not show an informational toast or other explanation. A future version may add clearer change communication if real usage shows that movement alone is confusing.

## Threads account already linked to another active profile

**Status:** Known MVP limitation; account transfer and recovery are post-MVP.

One Threads identity can belong to only one ThinkSo profile. If a user authorizes a Threads account that is already linked to another active ThinkSo profile, the connection attempt fails. The backend must not transfer the Threads connection, merge profiles, retire either profile, or change either profile's identifiers automatically. The user remains on Connect Threads and sees this filing-error toast:

```text
THREADS ACCOUNT CLAIMED · JUST NOW

This Threads account is already connected to another ThinkSo profile.

LOG OUT · 6
```

Tapping `LOG OUT` signs out the current ThinkSo session and returns to Account Access. If the six-second countdown reaches zero, the toast dismisses without logging out.

This can affect a legitimate user who accidentally creates a second ThinkSo profile—for example, by using another login provider that the MVP cannot confidently link to the first profile. Resolving that situation requires an explicit account-recovery/transfer design that proves control of the relevant login identities and Threads account. That flow is intentionally deferred until after MVP; connecting a different Threads account is not presented as the recovery mechanism.
# Post-MVP Create Challenge improvements

- Consider a new-content indicator or `JUMP TO LATEST` control when streaming continues while the user is reading earlier conversation content. MVP preserves the user's scroll position without showing either control.
