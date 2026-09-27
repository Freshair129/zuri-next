---
id: FR-055-001
title: "The phase plan is validated data"
delivery: live
legacy: [FR-099 (split 1/2)]
relations:
  specified_by: [SDD-055, API-165]
---

# FR-055-001 — The phase plan is validated data

The system SHALL load the SoT phase plan (P0–P10) from `contracts/sot-pipeline-plan.v1.json`,
validate it strictly (unique phase ids, dependencies and context edges referencing
known nodes, acyclic dependency order) and fail loudly on any violation; the plan
changes only by editing that file.

## Acceptance criteria

- AC-055-001-01 — Given a plan whose phase depends on an unknown phase, when loaded, then it throws naming the phase.
- AC-055-001-02 — Given a dependency cycle, when ordered, then it throws "dependency cycle".

## Implementation

- apps/server/src/modules/integration/application/sot-plan.js; sot-plan-service.js; apps/server/contracts/sot-pipeline-plan.v1.json; apps/server/src/app/api/platform/sot/plan/route.js; apps/server/src/app/(pm)/platform/sot-pipeline/page.jsx

## Verification

- TC-055-001 — Plan parsing and derived status (see [verification.md](../verification.md))
- TC-055-002 — Decision queue submit/decide/export (see [verification.md](../verification.md))
