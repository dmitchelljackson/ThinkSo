# ThinkSo screens, BDD, and UI sources

This is the root directory for finding screen behavior specifications and their exported visual sources. Behavioral decisions in the BDD/wiki supersede interactions hardcoded in the Claude export; exported files are visual evidence rather than production implementation code.

## Completed screen BDDs

### 1. Account Access / Login

- [BDD acceptance criteria](./wiki/behavior/login-screen-bdd.md)
- [Primary UI — ThinkSo Access Form](<./raw/designs/thinkso-claude-export/ThinkSo Access Form.dc.html>)
- [Alternate UI composition — ThinkSo Login](<./raw/designs/thinkso-claude-export/ThinkSo Login.dc.html>)
- [Shared ErrorToast](<./raw/designs/thinkso-claude-export/ErrorToast.dc.html>)
- [Shared loading S](<./raw/designs/thinkso-claude-export/CoolSpinner.dc.html>)

### 2. Connect Threads

- [BDD acceptance criteria](./wiki/behavior/connect-threads-screen-bdd.md)
- [Primary UI — ThinkSo Connect Threads](<./raw/designs/thinkso-claude-export/ThinkSo Connect Threads.dc.html>)
- [Shared ErrorToast](<./raw/designs/thinkso-claude-export/ErrorToast.dc.html>)
- [Shared loading S](<./raw/designs/thinkso-claude-export/CoolSpinner.dc.html>)

### 3. Main / The Record

- [BDD acceptance criteria](./wiki/behavior/the-record-screen-bdd.md)
- [Primary UI — ThinkSo The Record](<./raw/designs/thinkso-claude-export/ThinkSo The Record.dc.html>)
- [Loading composition](<./raw/designs/thinkso-claude-export/The Record - Loading.dc.html>)
- [Error-toast composition](<./raw/designs/thinkso-claude-export/The Record - Error Toast.dc.html>)
- [Challenge Card variants](<./raw/designs/thinkso-claude-export/Challenge Card Variants.dc.html>)
- [ChallengeCard component](<./raw/designs/thinkso-claude-export/ChallengeCard.dc.html>)

### 4. Challenge Contract

- [BDD acceptance criteria](./wiki/behavior/challenge-contract-screen-bdd.md)
- [Primary UI — ThinkSo Challenge Contract](<./raw/designs/thinkso-claude-export/ThinkSo Challenge Contract.dc.html>)
- [Invite composition](<./raw/designs/thinkso-claude-export/Contract Invite.dc.html>)
- [Resolved composition](<./raw/designs/thinkso-claude-export/Contract Resolved.dc.html>)
- [Recipient confirmation](<./raw/designs/thinkso-claude-export/Dialog Recipient.dc.html>)
- [Shared CommitmentDialog](<./raw/designs/thinkso-claude-export/CommitmentDialog.dc.html>)

### 5. Create Challenge

- [BDD acceptance criteria](./wiki/behavior/create-challenge-screen-bdd.md)
- [Primary UI — ThinkSo Create Challenge](<./raw/designs/thinkso-claude-export/ThinkSo Create Challenge.dc.html>)
- [Creator confirmation](<./raw/designs/thinkso-claude-export/Dialog Creator.dc.html>)
- [Shared CommitmentDialog](<./raw/designs/thinkso-claude-export/CommitmentDialog.dc.html>)
- [Shared ErrorToast](<./raw/designs/thinkso-claude-export/ErrorToast.dc.html>)
- [Shared loading S](<./raw/designs/thinkso-claude-export/CoolSpinner.dc.html>)

### 6. Account and Retirement

- [BDD acceptance criteria](./wiki/behavior/account-screen-bdd.md)
- [Primary UI — ThinkSo Account](<./raw/designs/thinkso-claude-export/ThinkSo Account.dc.html>)
- [First retirement warning](<./raw/designs/thinkso-claude-export/Account Warning 1.dc.html>)
- [Final retirement warning](<./raw/designs/thinkso-claude-export/Account Warning 2.dc.html>)
- [Shared ErrorToast](<./raw/designs/thinkso-claude-export/ErrorToast.dc.html>)
- [Shared loading S](<./raw/designs/thinkso-claude-export/CoolSpinner.dc.html>)

## Shared visual sources

- [ErrorToast](<./raw/designs/thinkso-claude-export/ErrorToast.dc.html>)
- [CoolSpinner / loading S](<./raw/designs/thinkso-claude-export/CoolSpinner.dc.html>)
- [NoBackingOut annotation](<./raw/designs/thinkso-claude-export/NoBackingOut.dc.html>)
- [iOS preview frame](<./raw/designs/thinkso-claude-export/ios-frame.jsx>) — preview evidence only; never ship or hardcode its dimensions.

## Whole-flow sources

- [ThinkSo Flow](<./raw/designs/thinkso-claude-export/ThinkSo Flow.dc.html>)
- [Export manifest and interpretation warning](./raw/designs/thinkso-claude-export.md)
- [Shared Claude artifact pointer](./raw/designs/claude-product-flow.md)

## Canonical supporting docs

- [Screen inventory and behavior](./wiki/design/screens-and-behavior.md)
- [Design system](./wiki/design/design-system.md)
- [API specification](./wiki/api/api-specification.md)
- [Decision register](./wiki/decisions/decision-register.md)
