---
id: FR-005-003
title: "Weighted roll-up"
delivery: live
legacy: [FR-011]
relations:
  specified_by: [API-049, API-048]
---

# FR-005-003 — Weighted roll-up

The system SHALL roll a Project up as Σ(workstream% × progressWeight) / Σ progressWeight
over live Workstreams, and a set of Projects (Business or installation portfolio) as
Σ(project% × project total weight) / Σ project total weight; with no rows or zero total
weight it SHALL return 0 with a warning. The portfolio roll-up over all Businesses SHALL be
readable only by an installation operator.

## Acceptance criteria

- AC-005-003-01 — Given Workstreams 50 % (weight 1) and 100 % (weight 3), then Project = 87.5 %.
- AC-005-003-02 — Given a non-operator, when `GET /api/progress/portfolio`, then 403.

## Implementation

- apps/server/src/modules/project-manager/progress/rollup.js; apps/server/src/modules/project-manager/application/progress-service.js; apps/server/src/app/api/progress/project/[id]/route.js; apps/server/src/app/api/progress/portfolio/route.js

## Verification

- TC-005-003 — Roll-up (see [verification.md](../verification.md))
- TC-005-004 — Progress read authorization and card agreement (see [verification.md](../verification.md))
