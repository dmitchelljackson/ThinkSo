# Product overview

## Product in one sentence

ThinkSo turns a casual claim or challenge into an immutable contract, lets another authenticated Threads-connected person accept it, later judges the result from public evidence, and executes the pre-approved social consequence.

The product loop is:

> Write it down → put it on the record → sign it → wait → judgment → receipt.

## MVP principles

- **LOCKED — narrow product:** no feed, discovery, friends list, stats dashboard, search, or notification center.
- **LOCKED — canonical artifact:** the Challenge Contract is the durable object. Invite, active, judging, posting, resolved, expired, voided, and unresolved are states of the same screen and record.
- **LOCKED — authenticated MVP:** contract, Record, profile, invite, and receipt data require a valid ThinkSo session and connected Threads account. Shared links preserve their destination through Login and Connect Threads before displaying content. Unauthenticated read-only previews are post-MVP.
- **LOCKED — explicit commitment:** sending and accepting use sober confirmation dialogs. There is no withdrawal, editing, or deletion after commitment.
- **LOCKED — agreed consequences only:** ThinkSo never writes or posts something a user did not approve as part of the challenge.
- **LOCKED — posts only for MVP:** every consequence is exact pre-approved Threads post text published to the losing participant's connected account. The minting agent must not propose profile changes, offline dares, payments, purchases, physical acts, or other manual consequences that ThinkSo cannot execute.
- **LOCKED — Threads required for MVP identity:** a connected Threads identity is required to participate. Disconnecting permanently retires that ThinkSo profile.
- **LOCKED — AI is bounded:** the creation agent drafts contracts; the judge follows the stored resolution contract. Deterministic rules belong in code.

## Users and roles

- **Creator:** starts the creation chat, chooses a persisted proposal, and sends it.
- **Challenger:** the authenticated, Threads-connected person who first accepts a sent challenge reached through its shared link. The first valid acceptance wins.
- **Authenticated viewer:** may view a shared contract after completing Login and the Threads gate; viewing alone does not bind them.
- **Judge agent:** researches a due accepted contract and records a verdict or a terminal/nonterminal inability to resolve.

The creator may name an intended opponent for display, but the source material says “anyone with the link” and “first person to accept” is locked in. Do not turn the display name into access control unless the product owner changes this.

## Visual language

The visual system is **official institutional/legal document × middle-school notebook vandalism**:

- warm off-white background;
- extremely dark navy/black official ink;
- strong editorial/serif headings and monospaced administrative text;
- thin rules, numbered/form-like labels, document IDs;
- restrained blue-ballpoint scribbles and occasional red correction/destructive accents;
- about 80% disciplined legal/editorial design and 20% juvenile annotation.

Avoid glossy cards, gradients, excessive rounded rectangles, generic iOS/Material styling, wood tables, realistic paper sheets, curled corners, wax seals, or other heavy skeuomorphism. Decorative doodles must never carry required information.

## Navigation inventory

Primary destinations:

1. Login / Intro
2. Connect Threads
3. Main (user-facing title: **THE RECORD**)
4. Create Challenge
5. Challenge Contract
6. Account
7. How It Works

Judgment is not a separate destination; links may open the Challenge Contract scrolled to its Judgment section.

## Explicitly deferred

- automated prompt optimization (APO/GEPA);
- a generalized eval platform before the first working creation agent;
- additional social destinations such as X, Bluesky, Instagram, and TikTok (architecture should not make them impossible);
- tailored conflict humor for repeat/late acceptance;
- social/feed features, user discovery, and profile editing.
