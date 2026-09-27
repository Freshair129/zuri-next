---
id: FR-003-008
title: "Typed dependencies with self/cycle refusal and blocked evaluation"
delivery: live
legacy: [FR-007]
relations:
  specified_by: [API-020, API-021]
  decided_by: [ADR-003]
---

# FR-003-008 — Typed dependencies with self/cycle refusal and blocked evaluation

The system SHALL create Dependency edges between two endpoints of type PROJECT, WORKSTREAM,
MILESTONE, GATE, WORK_CONTAINER or WORK_ITEM with a `dependencyType` from `DEPENDENCY_TYPES`
(BLOCKS, REQUIRES, RELATES_TO, START_AFTER, FINISH_BEFORE, plus lineage SUPERSEDES and
DERIVES_FROM); SHALL refuse a self-edge, a missing endpoint and any edge that would close a
directed cycle over all existing edges; SHALL delete edges; and SHALL evaluate an entity as
blocked when it is the target of a BLOCKS edge, or the source of a REQUIRES edge, whose other
end is not DONE/PASSED/WAIVED/COMPLETED. The cross-project register lists edges with both
endpoints resolved (deleted endpoints shown as "(deleted)").

## Acceptance criteria

- AC-003-008-01 — Given A→B, when B→A is proposed, then 400 "Dependency would create a cycle".
- AC-003-008-02 — Given WorkItem X is target of BLOCKS from an IN_PROGRESS item, then `evaluateBlocked(X)` returns blocked with that blocker.
- AC-003-008-03 — Given endpoints in two Businesses where only one is owned, then the create is refused as not found.

## Implementation

- apps/server/src/modules/project-manager/application/dependency-service.js; apps/server/src/app/api/dependencies/**; apps/server/src/app/(pm)/dependencies/page.jsx

## Verification

- TC-003-005 — Dependencies (see [verification.md](../verification.md))
