---
id: FR-003-007
title: "Milestones and gates"
delivery: live
legacy: [FR-006]
relations:
  specified_by: [API-046, API-045, API-036, API-035]
  derived_from: [BR-051]
---

# FR-003-007 — Milestones and gates

The system SHALL create and update Milestones (`MS…`; weight, status from
`MILESTONE_STATUSES`, target/completed dates) and Gates (`GATE…`; `required` flag, status
from `GATE_STATUSES` OPEN/PASSED/BLOCKED/WAIVED, evidence JSON, target date) under a live
Project, optionally tied to a Workstream of the same Project, and list them globally or per
Project/Workstream/Business for the "Milestones & Gates" views.

## Acceptance criteria

- AC-003-007-01 — Given a Workstream of another Project, then the milestone create is refused.
- AC-003-007-02 — Given a Gate patched to PASSED with evidence, then its evidence JSON is stored and audited.

## Implementation

- apps/server/src/modules/project-manager/application/milestone-gate-service.js; apps/server/src/app/api/milestones/**; apps/server/src/app/api/gates/**; views/universal/MilestonesView.jsx

## Verification

- TC-003-001 — Core model CRUD and invariants (see [verification.md](../verification.md))
- TC-003-007 — Milestone/gate authorization and route seams (see [verification.md](../verification.md))
