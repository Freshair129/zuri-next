---
id: FR-055-002
title: "Phase status is derived, never typed"
delivery: live
legacy: [FR-099 (split 2/2)]
relations:
  specified_by: [SDD-055, API-165]
  depends_on: [FR-060-003]
---

# FR-055-002 — Phase status is derived, never typed

The system SHALL compute each phase's status by a pure function: `blocked` when it has
pending decisions or any newest run of its pipeline definitions FAILED; `running` when
any newest run is QUEUED/RUNNING; `done` when every definition has a newest run and all
SUCCEEDED; else `planned`. The board (`GET /api/platform/sot/plan?businessId=`) is
read-only and scoped to a Business the viewer sees (404 otherwise).

## Acceptance criteria

- AC-055-002-01 — Given one pending PHASE_GATE decision on P3, when the board is read, then P3 is `blocked` regardless of run status.
- AC-055-002-02 — Given a phase with no pipeline definitions, when read, then it is `planned`.

## Implementation

- apps/server/src/modules/integration/application/sot-plan.js; sot-plan-service.js; apps/server/contracts/sot-pipeline-plan.v1.json; apps/server/src/app/api/platform/sot/plan/route.js; apps/server/src/app/(pm)/platform/sot-pipeline/page.jsx

## Verification

- TC-055-001 — Plan parsing and derived status (see [verification.md](../verification.md))
