---
id: FR-011-002
title: "Decisions by an eligible, different reviewer"
delivery: implemented
legacy: [FR-272 (split 2/3 — decision)]
relations:
  specified_by: [API-023, API-022]
  depends_on: [FR-024-003]
---

# FR-011-002 — Decisions by an eligible, different reviewer

The system SHALL let a reviewer approve or reject a PENDING request for the Project run it is
scoped to, re-resolving at decision time that the reviewer is not the requester (409
`REVIEWER_CONFLICT`) and currently holds the eligible capability in the approval's Business (403
`REVIEWER_NOT_ELIGIBLE`), and that the request has not expired (409 `APPROVAL_EXPIRED`, state
EXPIRED). The transition SHALL be compare-and-set on state and digest; a concurrent identical
decision SHALL return idempotently, a conflicting one SHALL get 409 `APPROVAL_ALREADY_DECIDED`.
Approvals SHALL be listable per Project run by readers of that Project.

## Acceptance criteria

- AC-011-002-01 — Given the requester tries to approve, then 409 `REVIEWER_CONFLICT`.
- AC-011-002-02 — Given two simultaneous APPROVE calls, then one transition happens and the other returns `idempotent: true`.

## Implementation

- apps/server/src/app/api/projects/[id]/execution-runs/[executionRunId]/approvals/route.js; …/approvals/[approvalRequestId]/decision/route.js

## Verification

- TC-011-002 — Routes documented (see [verification.md](../verification.md))
