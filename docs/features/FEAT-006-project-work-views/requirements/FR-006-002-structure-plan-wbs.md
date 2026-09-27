---
id: FR-006-002
title: "Structure Plan (WBS)"
delivery: live
legacy: [FR-040 (split 1/2 — Structure Plan)]
relations:
  specified_by: [API-068]
  decided_by: [ADR-003]
---

# FR-006-002 — Structure Plan (WBS)

The system SHALL render, for an opened Project, a labelled root and its Workstream →
WorkContainer → WorkItem hierarchy from the Project tree read, with loading, empty and
error states.

## Acceptance criteria

- AC-006-002-01 — Given a Project with 2 Workstreams and nested containers, then the tree shows both branches with container children and their items.

## Implementation

- apps/server/src/app/(pm)/projects/[projectId]/structure/page.jsx; views/WbsCanvas.jsx

## Verification

- TC-006-002 — Structure Plan (see [verification.md](../verification.md))
