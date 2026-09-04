# Judging Agent BDD acceptance criteria

This document is the behavioral source of truth for Section 8, the ThinkSo judging agent. It defines how an accepted Contract becomes a supported final verdict or reaches UNRESOLVED. Worker scheduling, model selection, and test implementation belong to engineering documentation rather than this product BDD.

## Canonical sources

- [Minting Agent BDD](./minting-agent-bdd.md)
- [Challenge Contract Screen BDD](./challenge-contract-screen-bdd.md)
- [API specification](../api/api-specification.md)
- [Data model and state machines](../data/data-model-and-state-machines.md)
- [Product overview](../product/overview.md)
- [Decision register](../decisions/decision-register.md)

## 8. Judging Agent

### 8.1 Do not judge before First Judgment

```gherkin
Given a Contract is ACCEPTED
And its resolution_date has not arrived
When judgment work is scheduled
Then the judging agent does not evaluate the proposition
And the Contract remains ACCEPTED
And the displayed judgment timing remains derived from the immutable Contract
```

### 8.2 Begin judgment when an accepted Contract becomes due

```gherkin
Given a Contract is ACCEPTED
And its resolution_date has arrived
When judgment work safely claims it
Then the Contract transitions to JUDGING
And one private judge attempt begins
And duplicate or overlapping workers cannot create competing active attempts
```

### 8.3 Judge the immutable proposition from the creator's perspective

```gherkin
Given a due Contract enters JUDGING
When the agent evaluates its outcome
Then TRUE means the immutable proposition occurred as defined
And FALSE means it did not occur as defined
And the bound challenger, intended-opponent wording, or preferred consequence does not change that meaning
```

### 8.4 Treat the official resolution terms as controlling

```gherkin
Given the judging agent receives a Contract
When it constructs its judgment context
Then the complete immutable resolution terms are prominently included
And the agent follows their definitions, exclusions, tie rules, evidence sources, hierarchy, and sufficiency requirements
And it does not replace them with a more convenient interpretation
```

### 8.5 Research current evidence rather than relying on memory

```gherkin
Given the proposition concerns an outcome that must be verified after minting
When a judge attempt runs
Then the agent retrieves current evidence from sources permitted by the terms
And material outcome facts are not decided from unsupported model memory
And the private attempt records the sources it actually consulted
```

### 8.6 Use only sources permitted by the official terms

```gherkin
Given the resolution terms name sources, fallback sources, or a qualifying source class
When evidence is gathered
Then the agent uses only evidence allowed by those terms
And it does not silently substitute an unmentioned source to force a verdict
```

### 8.7 Respect source priority and fallback order

```gherkin
Given the resolution terms define a source hierarchy
When multiple permitted sources are available
Then the highest-priority available source controls according to the terms
And a lower-priority source is used only under the fallback conditions the terms allow
And the public explanation identifies the controlling evidence
```

### 8.8 Retry when every permitted source is unavailable

```gherkin
Given no evidence source permitted by the resolution terms is currently available
And resolution_expiration has not arrived
When the judge attempt completes
Then no TRUE or FALSE verdict is persisted
And the Contract remains JUDGING
And another attempt may be scheduled within the existing judgment window
```

### 8.9 Allow one authoritative result when the terms say it is sufficient

```gherkin
Given the proposition resolves from an official score or numerical result
And the resolution terms permit one authoritative source
When that source provides the final result
Then one direct authoritative citation may support the verdict
And the judge does not add unrelated citations merely to reach a universal source count
```

### 8.10 Enforce a contract-specific source quorum

```gherkin
Given the resolution terms require agreement among a stated number or class of qualifying sources
When a judge attempt runs
Then the agent identifies sources that satisfy that definition
And it persists no verdict until the required quorum agrees
And the public explanation cites the sources used to satisfy the quorum
```

### 8.11 Do not collapse unresolved source disagreement into a verdict

```gherkin
Given permitted sources conflict
And the resolution terms do not yet produce a controlling result through hierarchy or quorum
When resolution_expiration has not arrived
Then the Contract remains JUDGING
And the agent retries later rather than choosing the outcome it finds more persuasive
```

### 8.12 Wait for a final result when provisional evidence is insufficient

```gherkin
Given a permitted source reports a projection, partial count, preliminary score, or otherwise nonfinal result
And the terms require a final outcome
When a judge attempt evaluates that evidence
Then it does not persist a verdict
And the Contract remains JUDGING for a later attempt within the window
```

### 8.13 Resolve as soon as the required evidence is available

```gherkin
Given permitted evidence satisfies every definition and sufficiency rule in the official terms
When the judge maps that evidence to the proposition
Then it returns TRUE or FALSE without waiting until resolution_expiration
And the result is based on the terms rather than model confidence alone
```

### 8.14 Produce a concise cited public explanation

```gherkin
Given the evidence supports TRUE or FALSE
When the public verdict is prepared
Then evidence_markdown states the relevant verified facts
And it explains how those facts satisfy the official terms
And it links the controlling source or every source needed for the required quorum
And it omits irrelevant research and internal retry history
```

### 8.15 Persist the verdict before consequence delivery

```gherkin
Given a supported TRUE or FALSE verdict is ready
When the judgment transaction commits
Then the immutable public verdict and durable publication intent are persisted together
And the Contract transitions from JUDGING to POSTING
And the selected consequence is not considered published yet
```

### 8.16 Select the exact losing post deterministically

```gherkin
Given a supported verdict is persisted
When publication work is created
Then the verdict determines which participant lost
And the losing participant's exact pre-approved Threads post is selected
And neither the judging agent nor publishing worker rewrites that text
```

### 8.17 Keep Threads publication outside the judging agent

```gherkin
Given the Contract transitions to POSTING
When judgment finishes
Then the judging agent does not call Threads directly
And a durable publication worker owns delivery, retries, authorization blocking, and the provider receipt
And publication failure never causes the verdict to be recomputed
```

### 8.18 Expose the supported verdict while posting is pending

```gherkin
Given a supported verdict exists and the consequence has not yet been published
When an eligible platform member reads the Contract
Then the Contract is POSTING
And the final TRUE or FALSE result and cited explanation are visible
And the consequence area shows POST PENDING rather than a false success receipt
```

### 8.19 Keep unsuccessful attempts private

```gherkin
Given one or more judge attempts fail, find insufficient evidence, or require retry
When the Contract remains JUDGING
Then attempt count, model output, errors, and retry timing are not serialized in the public Contract
And the client sees the stable product state rather than internal worker mechanics
```

### 8.20 Retry transient judgment failures only within the Contract window

```gherkin
Given a judge attempt fails because of a temporary source, tool, model, or infrastructure problem
And resolution_expiration has not arrived
When recovery is possible
Then the Contract remains JUDGING
And a later attempt may retry idempotently
And no unsupported verdict or consequence work is created
```

### 8.21 Become unresolved when no supported verdict exists by Resolve By

```gherkin
Given the Contract remains JUDGING
And no attempt has produced a terms-compliant supported verdict
When resolution_expiration arrives
Then the Contract transitions to UNRESOLVED
And no TRUE or FALSE verdict is fabricated
And no consequence publication is created
```

### 8.22 Show an unresolved explanation only when one exists

```gherkin
Given a Contract becomes UNRESOLVED
When the last usable judge attempt recorded a safe explanation of why resolution failed
Then that explanation may be shown on the Contract
But when no such explanation exists
Then the Contract shows only its UNRESOLVED label
And the client does not invent explanatory copy
```

### 8.23 Do not confuse UNRESOLVED with other terminal states

```gherkin
Given a Contract did not receive a supported judgment by Resolve By
When its terminal state is assigned
Then it is UNRESOLVED
And it is not labeled EXPIRED, because EXPIRED means no timely acceptance
And it is not labeled VOIDED, because VOIDED results from participant retirement before resolution
```

### 8.24 Void rather than finish when a participant retires during judging

```gherkin
Given a Contract is ACCEPTED or JUDGING
When either participant permanently retires before a verdict is committed
Then the Contract becomes VOIDED
And pending or active judgment work is canceled or made unable to commit
And no verdict or consequence is subsequently published
```

### 8.25 Void a posting Contract when a participant retires

```gherkin
Given a Contract is POSTING with an unpublished verdict
When either participant permanently retires
Then the Contract becomes VOIDED
And pending publication is canceled
And the unpublished verdict remains private operational history rather than public Contract content
```

### 8.26 Continue judging despite external Threads revocation

```gherkin
Given a participant revokes Threads authorization outside ThinkSo without retiring
And an accepted Contract becomes due
When the judging agent can obtain sufficient permitted evidence
Then it may persist the final verdict and transition the Contract to POSTING
And publication pauses as BLOCKED_AUTH until Threads is reconnected
And reconnection resumes publication without rerunning judgment
```

### 8.27 Make supported verdicts final for MVP

```gherkin
Given a supported TRUE or FALSE verdict was committed
When a participant disagrees with it
Then the verdict remains final
And MVP provides no participant appeal, rejudge request, or override
And appeal and formal correction workflows are deferred to V2
```

### 8.28 Prevent duplicate verdict and publication creation

```gherkin
Given workers overlap, retry, restart, or receive the same due Contract more than once
When judgment work commits
Then at most one final verdict is persisted
And at most one durable publication intent is created for that verdict
And repeated execution cannot duplicate the consequence post
```

### 8.29 Keep hidden reasoning and private traces out of the public verdict

```gherkin
Given a judge attempt uses model reasoning, research tools, and internal traces
When public evidence_markdown is generated
Then it contains the concise result, relevant facts, reasoning summary, and citations
And it excludes chain-of-thought, credentials, raw tool traces, and unrelated internal deliberation
```

### 8.30 Record reproducibility metadata for every attempt

```gherkin
Given a judge attempt succeeds, fails, retries, is canceled, or reaches insufficient evidence
When its private record is finalized
Then it records timestamps, outcome, error or retry classification, consulted sources, and agent, prompt, model, and tool versions
And those records support debugging and evaluation
And they are not included in normal public Contract serialization
```

### 8.31 Schedule no more than eight substantive evidence attempts

```gherkin
Given a Contract enters its First Judgment through Resolve By window
When permitted evidence is not yet sufficient for a supported verdict
Then the system schedules no more than eight substantive evidence attempts across that window
And the first attempt runs at First Judgment
And the final attempt runs at Resolve By
And the intervening attempts are distributed across the remaining window
But transport and infrastructure recovery may retry the same attempt without consuming another evidence-attempt slot
And a supported verdict stops every later scheduled attempt
```
