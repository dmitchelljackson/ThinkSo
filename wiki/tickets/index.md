# Ticket tracker

Tickets are ordered small full-stack features that form the deep pull-request stack. See the [agent harness](../agents/harness.md) for dispatch, verification, communication, and restacking rules.

## Status vocabulary

- `DRAFT` — incomplete or awaiting product clarification.
- `READY` — dependencies and required human inputs are satisfied.
- `IMPLEMENTING` — the sole write-active implementer owns it.
- `VERIFYING` — candidate is frozen while CI, review, and UI gates run.
- `CHANGES_REQUESTED` — one or more persisted findings require repair.
- `BLOCKED_HUMAN` — exact unresolved human action is recorded.
- `BLOCKED_TECHNICAL` — documented recovery path is exhausted.
- `STACKED` — all gates pass and its PR is a stable stack layer.
- `RESTACKING` — an ancestor change invalidated its base or evidence.
- `MERGED` — the user merged it through an authorized native full-stack or partial-stack merge.

## Ordered stack

The coordinator maintains this table as tickets are created and advanced.

| Position | Ticket | Type | Status | Depends on | PR |
|---:|---|---|---|---|---|
| 000 | [T-000 Repository governance and deterministic tooling](./t-000-repository-governance.md) | Enabling | `DRAFT` | `main` | — |
| 010 | [T-010 Boot the mobile/API/database skeleton](./t-010-executable-skeleton.md) | Enabling | `VERIFYING` | T-000 | — |
| 020 | [T-020 Establish the mobile visual foundation](./t-020-mobile-design-foundation.md) | Enabling | `DRAFT` | T-010 | — |
| 030 | [T-030 Authenticate with Firebase email/password and issue ThinkSo sessions](./t-030-firebase-email-password-login.md) | Product | `DRAFT` | T-020 | — |
| 035 | [T-035 Recover a Firebase password](./t-035-password-recovery.md) | Product | `DRAFT` | T-030 | — |
| 040 | [T-040 Restore sessions and provide local-first sign-out](./t-040-session-recovery-and-account.md) | Product | `DRAFT` | T-035 | — |
| 050 | [T-050 Require and maintain a Threads connection](./t-050-threads-connection.md) | Product | `DRAFT` | T-040 | — |
| 060 | [T-060 Browse The Record](./t-060-the-record.md) | Product | `DRAFT` | T-050 | — |
| 070 | [T-070 Read protected Contract lifecycle views](./t-070-contract-read.md) | Product | `DRAFT` | T-060 | — |
| 080 | [T-080 Start, retain, and discard a creation chat](./t-080-creation-chat-lifecycle.md) | Product | `DRAFT` | T-070 | — |
| 090 | [T-090 Stream, stop, retry, and budget minting turns](./t-090-minting-turn-transport.md) | Product | `DRAFT` | T-080 | — |
| 100 | [T-100 Mint researched immutable proposals](./t-100-minting-agent-proposals.md) | Product | `DRAFT` | T-090 | — |
| 110 | [T-110 Confirm, send, and share a Contract](./t-110-send-and-share.md) | Product | `DRAFT` | T-100 | — |
| 120 | [T-120 Accept a Contract exactly once](./t-120-contract-acceptance.md) | Product | `DRAFT` | T-110 | — |
| 130 | [T-130 Judge due Contracts from public evidence](./t-130-judging.md) | Product | `DRAFT` | T-120 | — |
| 140 | [T-140 Publish the losing consequence exactly once](./t-140-consequence-publication.md) | Product | `DRAFT` | T-130 | — |
| 150 | [T-150 Prime notifications and register installations](./t-150-push-registration.md) | Product | `DRAFT` | T-140 | — |
| 160 | [T-160 Deliver acceptance and judgment notifications](./t-160-transactional-notifications.md) | Product | `DRAFT` | T-150 | — |
| 170 | [T-170 Permanently retire an account](./t-170-permanent-retirement.md) | Product | `DRAFT` | T-160 | — |
| 180 | [T-180 Exercise and harden the assembled MVP](./t-180-mvp-hardening.md) | Product | `DRAFT` | T-170 | — |

## Rules

- Each normal ticket produces one small observable full-stack feature and normally one PR targeting the preceding native stack branch. The coordinator creates and maintains that relationship through `gh stack`; ticket authors do not hand-roll PR retargeting.
- Enabling tickets are explicitly labeled and cannot claim user-facing behavior is complete.
- The coordinator alone edits ticket status, gate state, and activity logs.
- Other roles submit structured reports; the coordinator persists material communication before dispatching follow-up work.
- Ticket activity is append-only. Correct a prior entry with a newer entry rather than rewriting history.
- A ticket cannot become `STACKED` while any required gate is missing, stale, failed, or waived without an explicit product-owner decision.

New tickets start from [the template](./ticket-template.md).

All initial tickets remain `DRAFT` until the owner reviews their boundaries and the [foundation configuration](../delivery/foundation-configuration-review.md). Approval does not imply permission to merge or deploy.

## BDD coverage map

This map prevents a later ticketing pass from silently dropping behavior. Some display cases are fixture-tested when their screen lands and integrated with live state by a later lifecycle ticket.

| BDD section | Primary ticket ownership |
|---|---|
| 1 Login | T-030 cases 1.1–1.7 and 1.12–1.13; T-035 cases 1.8–1.11; T-040 cases 1.14–1.16 |
| 2 Connect Threads | T-050 cases 2.1–2.21 |
| 3 The Record | T-060 cases 3.1–3.20 |
| 4 Challenge Contract | T-070 read/display cases 4.1–4.9 and 4.16–4.28; T-120 acceptance 4.10–4.15; T-130/T-140/T-170 integrate judging, publication, and retirement states |
| 5 Create Challenge | T-080 cases 5.1–5.7 and 5.26–5.31; T-090 cases 5.8–5.15, 5.23–5.25, and 5.32–5.34; T-100 cases 5.16–5.18; T-110 cases 5.19–5.22 |
| 6 Account | T-040 cases 6.1–6.6; T-170 cases 6.7–6.20 |
| 7 Minting agent | T-100 cases 7.1–7.33, using T-090 transport/budget infrastructure |
| 8 Judging agent | T-130 cases 8.1–8.31 |
| 9 Notifications | T-150 primer/registration 9.1–9.12; T-160 acceptance/judgment/delivery 9.13–9.25; T-040/T-170 integrate sign-out and retirement cleanup |
| 10 Consequence publication | T-140 cases 10.1–10.4 and 10.6–10.25; T-160 integrates notification case 10.5; T-170 integrates retirement cancellation |

## API and persistence coverage map

| Surface | Ticket ownership |
|---|---|
| Authentication, identities, sessions, `/me` | T-030 Firebase login/issuance; T-035 post-reset session invalidation; T-040 refresh/logout/session reads; T-170 retirement invalidation |
| Threads integration and authorization gate | T-050 connection/maintenance; T-140 publication pause/resume; T-170 disconnect cleanup |
| Push tokens and delivery | T-150 registration; T-160 acceptance/judgment events and delivery; T-170 cleanup |
| Record and Contract reads | T-060 Record; T-070 Contract; later lifecycle tickets supply real state transitions |
| Chats, messages, turns, SSE, usage | T-080 chat lifecycle; T-090 turns/SSE/budget; T-100 agent/proposals |
| Contract send and accept mutations | T-110 send; T-120 accept |
| Judge and publication internal operations | T-130 judging; T-140 Threads publication |
| Informational `/how-it-works` | Deferred dummy UI for MVP; no implementation ticket until the product content is defined |
| Core database model and migrations | Introduced incrementally by the owning ticket; T-180 verifies a clean assembled migration path |
