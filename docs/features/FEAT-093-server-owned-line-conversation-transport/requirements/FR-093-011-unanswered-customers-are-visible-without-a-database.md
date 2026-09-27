---
id: FR-093-011
title: "Unanswered customers are visible without a database query"
part: FEAT-093-P04
owner: DOM-LOA
delivery: implemented
legacy: [FR-149 (split 9/10)]
relations:
  specified_by: [SDD-093, API-127, API-126, API-128]
---

# FR-093-011 — Unanswered customers are visible without a database query

The system SHALL count terminal `FAILED` jobs by `errorCode` for the selected Business
on the Studio conversation surface (`GET /api/line-oa/jobs/failures`), let a publisher
acknowledge an `UNKNOWN` job (`POST /api/line-oa/jobs/{id}/acknowledge-unknown`) and
read a job's trace, with every read scoped to Business visibility plus the `line-oa`
domain.

## Acceptance criteria

- AC-093-011-01 — Given two jobs failed with `REPLY_EXPIRED_PUSH_DISABLED`, when the failure summary is read, then that code shows a count of 2.

## Implementation

- apps/server/src/modules/line-oa-studio/application/line-job-failures.js; apps/server/src/app/api/line-oa/jobs/**; apps/server/src/modules/line-oa-studio/ui/LineStudioJobFailures.jsx

## Verification

- TC-093-006 — Failure visibility (see [verification.md](../verification.md))
