# Consequence Publication BDD acceptance criteria

This document is the behavioral source of truth for Section 10, deterministic Threads consequence publication after judgment. It defines user-visible guarantees and durable delivery behavior. Exact queue technology, backoff intervals, and provider-specific idempotency mechanisms belong to engineering documentation.

## Canonical sources

- [Judging Agent BDD](./judging-agent-bdd.md)
- [Notifications BDD](./notifications-bdd.md)
- [Challenge Contract Screen BDD](./challenge-contract-screen-bdd.md)
- [API specification](../api/api-specification.md)
- [Data model and state machines](../data/data-model-and-state-machines.md)
- [Threads authorization lifecycle](../architecture/threads-authorization.md)
- [Decision register](../decisions/decision-register.md)

## 10. Consequence Publication

### 10.1 Create durable publication work with the verdict

```gherkin
Given the judging agent has a supported TRUE or FALSE verdict
When the judgment transaction commits
Then the immutable verdict and one durable publication intent are persisted together
And the Contract transitions from JUDGING to POSTING
And delivery does not depend on the judging process remaining alive after commit
```

### 10.2 Select the losing participant deterministically

```gherkin
Given a Contract contains one exact post consequence for each possible losing side
When TRUE or FALSE is committed
Then the immutable proposition and verdict identify the loser
And publication targets only that losing participant's connected Threads account
And the winner's consequence is not selected
```

### 10.3 Publish the exact pre-approved text

```gherkin
Given the losing consequence is selected
When the publication worker prepares the Threads request
Then it uses the exact post_text approved in the accepted Contract
And it does not ask an LLM to revise, embellish, shorten, or regenerate the text
And no profile change or other manual action is attempted
```

### 10.4 Keep the Contract in POSTING until a receipt exists

```gherkin
Given a final verdict is committed
And no successful Threads receipt is persisted
When the canonical Contract is read
Then its state is POSTING
And its verdict and cited explanation are visible
And its consequence area shows POST PENDING
And it is not represented as RESOLVED
```

### 10.5 Notify participants when POSTING begins

```gherkin
Given the verdict and durable publication intent commit
When the Contract enters POSTING
Then both participants receive the result-notification event
And the message is exactly "Your judgment is in!"
And the notification does not disclose TRUE or FALSE
And notification delivery is independent of consequence delivery
```

### 10.6 Claim publication work safely

```gherkin
Given a PENDING publication job is due
When workers compete to process it
Then at most one worker owns the active claim
And the job becomes IN_PROGRESS
And overlapping execution cannot intentionally create multiple Threads posts
```

### 10.7 Persist a successful provider receipt

```gherkin
Given Threads accepts the exact consequence post
When its provider response is handled
Then the provider post identifier and canonical external post URL are persisted
And the destination becomes POSTED
And the Contract transitions from POSTING to RESOLVED
```

### 10.8 Show the final public receipt

```gherkin
Given consequence publication succeeded
When the RESOLVED Contract is read
Then it shows the final verdict, cited explanation, exact published consequence, publication timestamp when available, and clickable Threads post URL
And POST PENDING is absent
```

### 10.9 Do not send another result push at RESOLVED

```gherkin
Given both participants were notified when the Contract entered POSTING
When successful publication moves it to RESOLVED
Then no second result notification is created
And users see the receipt on their next Contract load or refresh
```

### 10.10 Retry a temporary provider failure

```gherkin
Given publication fails with a retryable temporary Threads or transport error
When the failure is classified
Then the Contract remains POSTING
And the job enters RETRY_WAIT before becoming PENDING when due
And the verdict is not recomputed
And the exact post text does not change
```

### 10.11 Limit temporary retries to the locked budget

```gherkin
Given a publication job continues receiving temporary failures
When retries are scheduled
Then it receives no more than eight attempts across 24 hours
And retry timing uses bounded backoff
And no unbounded automatic retry loop is created
```

### 10.12 Void after the temporary retry budget is exhausted

```gherkin
Given all eight temporary publication attempts fail within the 24-hour budget
When the final attempt is classified
Then the Contract becomes VOIDED
And no further consequence post is attempted
And the unpublished verdict and provider diagnostics remain private operational history
And the client shows only the normal VOIDED terminal treatment
```

### 10.13 Do not blindly retry invalid authorization

```gherkin
Given Threads rejects publication because the destination authorization is invalid or revoked
When the failure is classified
Then the job immediately becomes BLOCKED_AUTH
And the losing participant's social connection becomes REAUTH_REQUIRED
And no blind provider retry is scheduled
And the Contract remains POSTING
```

### 10.14 Gate the affected user through Connect Threads

```gherkin
Given the losing participant's publication job is BLOCKED_AUTH
When that user next launches or attempts protected app or API access
Then the standard Connect Threads screen replaces protected content
And the profile is not retired merely because Meta access was revoked
And another platform member may still see the POSTING Contract after passing their own gates
```

### 10.15 Resume blocked publication after reconnection

```gherkin
Given a publication job is BLOCKED_AUTH
When the losing participant successfully reconnects Threads with required scopes
Then the social connection becomes CONNECTED
And the blocked job becomes PENDING immediately
And delivery resumes using the same verdict and exact post text
And the judging agent is not rerun
```

### 10.16 Require only the destination participant's authorization

```gherkin
Given the losing participant remains CONNECTED
And the winning participant independently has REAUTH_REQUIRED
When consequence publication runs
Then the winner's disconnected authorization does not block posting to the loser
And only the destination account's valid authorization is required for that post
```

### 10.17 Keep provider retry details private

```gherkin
Given a publication job is PENDING, IN_PROGRESS, RETRY_WAIT, or BLOCKED_AUTH
When the canonical Contract is serialized
Then those internal job states, attempt counts, errors, and retry timestamps are omitted
And the public state remains POSTING with POST PENDING until a receipt exists or the Contract is voided
```

### 10.18 Make delivery idempotent across process failure

```gherkin
Given a worker crashes or restarts before recording completion
When the same durable publication intent is processed again
Then it uses the same stable delivery identity
And it first reconciles any provider result available to it
And it does not intentionally create a second Threads post
```

### 10.19 Treat an ambiguous provider timeout as unresolved delivery

```gherkin
Given a Threads request may have succeeded but its response was lost
When the worker handles the ambiguous attempt
Then it checks the losing participant's recent Threads posts for the exact approved post before publishing again
And if the post is found it stores the recovered receipt and resolves the Contract
And if successful reconciliation proves the post absent it may retry publication
And if reconciliation cannot establish success or absence it does not blindly publish again
And the Contract remains POSTING only within the existing eight-attempt, 24-hour delivery window
And unresolved delivery at the end of that window makes the Contract VOIDED
```

### 10.20 Handle permanent nonauthorization rejection without futile retries

```gherkin
Given Threads permanently rejects the exact pre-approved post for a reason other than reconnectable authorization
When the failure is classified as nonretryable
Then the Contract becomes VOIDED without consuming futile temporary retries
And the system does not rewrite the approved post to force publication
And no further consequence post is attempted
```

### 10.21 Void pending publication when a participant retires

```gherkin
Given a Contract is POSTING
And its Threads post has not been successfully persisted
When either participant permanently retires
Then the Contract becomes VOIDED
And pending, retrying, reconciling, or blocked publication work is canceled
And no consequence post is attempted afterward
And the unpublished verdict is removed from public Contract content
```

### 10.22 Preserve a completed post if retirement happens later

```gherkin
Given consequence publication already succeeded and the Contract is RESOLVED
When a participant later retires
Then the terminal Contract and public receipt remain historical record
And ThinkSo does not attempt to delete or rewrite the existing Threads post as part of retirement
```

### 10.23 Isolate notification failure from publication

```gherkin
Given the POSTING result notification fails for one or both participants
When consequence publication is otherwise eligible
Then publication continues
And successful Threads delivery may still transition the Contract to RESOLVED
And notification retry cannot duplicate the Threads post
```

### 10.24 Isolate publication failure from the final verdict

```gherkin
Given a supported verdict is visible in POSTING
When consequence delivery temporarily fails or blocks on authorization
Then the TRUE or FALSE judgment remains final
And it is not changed, appealed, or recomputed because delivery failed
But retirement, permanent publication rejection, or exhaustion of the 24-hour publication window may void the Contract before a receipt exists
```

### 10.25 Record every delivery attempt privately

```gherkin
Given a publication attempt succeeds, temporarily fails, blocks on authorization, is reconciled, or exhausts delivery
When its private operational record is finalized
Then it records timestamps, destination, provider outcome, retry classification, and stable delivery identity
And sensitive provider credentials are never written into public or diagnostic content
And the attempt record is not included in canonical Contract serialization
```
