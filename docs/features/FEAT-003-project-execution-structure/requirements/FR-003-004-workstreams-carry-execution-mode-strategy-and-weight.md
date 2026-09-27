---
id: FR-003-004
title: "Workstreams carry execution mode, strategy and weight"
delivery: live
legacy: [FR-004]
relations:
  specified_by: [API-085, API-084]
  derived_from: [BR-049]
---

# FR-003-004 — Workstreams carry execution mode, strategy and weight

The system SHALL create, update and archive Workstreams under a live Project, each with a
code (`WST…`), one `executionMode` of the seven canonical modes (SOFTWARE_SPRINT,
DATA_MIGRATION, B2B_SALES, B2C_CAMPAIGN, PRODUCT_LAUNCH, OPERATIONS, BUSINESS_EXPANSION), a
`progressStrategy` defaulting to the mode's strategy (TASK_WEIGHT, RECORD_VALIDATION,
WEIGHTED_PIPELINE, KPI_ATTAINMENT, MILESTONE_READINESS, SLA_SCORE, EXPANSION_READINESS
respectively), a `progressWeight` (default 1), a status from `WORKSTREAM_STATUSES` and a
free `viewConfig`. Archive is soft (`deletedAt`, ARCHIVED).

## Acceptance criteria

- AC-003-004-01 — Given mode DATA_MIGRATION and no strategy, then `progressStrategy = RECORD_VALIDATION`.
- AC-003-004-02 — Given an execution mode outside the seven, then 400.

## Implementation

- project-service.js (workstreams); apps/server/src/app/api/workstreams/route.js; apps/server/src/app/api/workstreams/[id]/route.js; apps/server/src/lib/validation/enums.js

## Verification

- TC-003-001 — Core model CRUD and invariants (see [verification.md](../verification.md))
