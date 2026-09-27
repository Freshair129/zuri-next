---
id: FR-093-007
title: "Abandoned admissions are reconciled from stored evidence"
part: FEAT-093-P03
owner: DOM-LOA
delivery: implemented
legacy: [FR-149 (split 5/10)]
relations:
  specified_by: [SDD-093, EVT-002]
---

# FR-093-007 — Abandoned admissions are reconciled from stored evidence

The system SHALL, on each worker tick, re-admit up to 5 evidence rows left in
`ADMITTING` for more than 60 s through the same admission function; such an event
carries no reply token, so its answer is delivered by Push when the account allows
delayed Push and otherwise ends `FAILED` (`REPLY_EXPIRED_PUSH_DISABLED`) visibly.

## Acceptance criteria

- AC-093-007-01 — Given a reconciled event on an account with delayed Push disabled, when its answer is ready, then the job ends `FAILED` rather than silently dropped.

## Implementation

- apps/server/src/modules/line-oa-studio/application/line-conversation-jobs.js; line-admission-reconciler.js

## Verification

- TC-093-004 — Reconciler (see [verification.md](../verification.md))
