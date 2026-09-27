---
id: FR-093-008
title: "Jobs are leased and fenced per account ownership"
part: FEAT-093-P04
owner: DOM-LOA
delivery: implemented
legacy: [FR-149 (split 6/10)]
relations:
  specified_by: [SDD-093, EVT-002, API-124]
  decided_by: [ADR-045, ADR-049]
---

# FR-093-008 — Jobs are leased and fenced per account ownership

The system SHALL claim a waiting job by compare-and-set with a 300 s lease, re-check on
every transition the account's status, CLOUD transport, server flag and
`transportEpoch` (a DISABLE increments the epoch and fences queued work), expire jobs
older than 30 minutes (`EXECUTION_EXPIRED`), and refuse any settle or send by a claimant
whose lease or version no longer matches (409 `CONVERSATION_JOB_LEASE_CONFLICT`). Jobs
are snapshotted to a runtime cohort (`SERVER` or `CONVERSATION_RUNTIME`) at admission
and claimed only by that cohort.

## Acceptance criteria

- AC-093-008-01 — Given an account disabled while a job is queued, when the worker ticks, then the job is not sent.
- AC-093-008-02 — Given two workers claiming the same job, when both try, then exactly one holds it.

## Implementation

- apps/server/src/modules/line-oa-studio/application/line-conversation-jobs.js; server-line-runtime.js; apps/server/src/app/api/line-oa/worker/route.js; apps/server/scripts/server-line-worker.mjs; apps/server/scripts/worker-cadence.mjs; apps/server/src/modules/line-oa-studio/application/conversation-runtime-core.js

## Verification

- TC-093-005 — Job ledger, fencing, send outcomes and cadence (see [verification.md](../verification.md))
