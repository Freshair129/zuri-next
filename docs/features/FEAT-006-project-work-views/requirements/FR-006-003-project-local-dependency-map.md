---
id: FR-006-003
title: "Project-local Dependency Map"
delivery: live
legacy: [FR-040 (split 2/2 — Dependency Map)]
relations:
  specified_by: [API-052]
  decided_by: [ADR-003]
  derived_from: [NFR-008]
---

# FR-006-003 — Project-local Dependency Map

The system SHALL render, for an opened Project, a directed node-edge graph containing only
Dependency edges whose two endpoints both belong to that Project, together with an
accessible edge-list twin (keyboard-focusable summaries), empty/loading/error states and a
reduced-motion fallback; edges with an endpoint outside the Project SHALL be excluded and
remain visible only in the cross-project register.

## Acceptance criteria

- AC-006-003-01 — Given an edge from an item of Project P to an item of Project Q, then P's map excludes it.
- AC-006-003-02 — Given a keyboard user, then every node and edge is reachable through the list twin.

## Implementation

- apps/server/src/app/(pm)/projects/[projectId]/dependencies/page.jsx; views/DependencyMap.jsx; application/project-dependency-map.js; apps/server/src/app/api/projects/[id]/dependencies/route.js

## Verification

- TC-006-003 — Dependency Map containment and accessibility (see [verification.md](../verification.md))
