---
id: FR-003-006
title: "Work items and the All Work list"
delivery: live
legacy: [FR-005 (split 2/2 — items and All Work)]
relations:
  specified_by: [API-082, API-081]
  derived_from: [BR-005]
---

# FR-003-006 — Work items and the All Work list

The system SHALL create, update and soft-delete WorkItems (`WI…`) under a Workstream, with
optional container (same Workstream), subtype from `ITEM_SUBTYPES`, status from
`WORK_STATUSES` (PLANNED, READY, IN_PROGRESS, REVIEW, BLOCKED, DONE, CANCELLED), `assigneeRef`,
`weight` (default 1), `numericValue`, `probability`, merged `metrics`/`metadata` JSON and dates.
Deleting sets `deletedAt` and status CANCELLED. When a caller supplies an expected version,
a mismatch SHALL be refused (`WORK_VERSION_CONFLICT`). Listing (`GET /api/work`) SHALL
require a Project, Workstream or visible-Business scope for non-operators, exclude deleted
items, and support mode/subtype/status/text filters; the same list backs the global and
project-scoped "All Work" view where status is edited inline.

## Acceptance criteria

- AC-003-006-01 — Given a deleted item, when listed, then it is absent and no progress calculator counts it.
- AC-003-006-02 — Given `expectedVersion` 4 and stored version 5, then the update is refused and nothing changes.
- AC-003-006-03 — Given a non-operator with no visible Business and no project filter, then 403 "A Project or Workstream scope is required".

## Verification

- TC-003-001 — Core model CRUD and invariants (see [verification.md](../verification.md))
- TC-003-004 — Work listing scope (see [verification.md](../verification.md))
