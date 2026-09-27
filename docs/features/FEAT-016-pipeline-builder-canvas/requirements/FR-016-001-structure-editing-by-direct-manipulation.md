---
id: FR-016-001
title: "Structure editing by direct manipulation"
delivery: declared
legacy: [FR-082]
relations:
  decided_by: [ADR-010]
  derived_from: [BR-054, NFR-008]
---

# FR-016-001 — Structure editing by direct manipulation

The system SHALL make the Project Structure Plan editable in place: a `+` affordance on a node
adds a child of the type the hierarchy allows at that level, and a node can be reparented by drag;
an invalid drop target SHALL be refused during the drag (not after). Layout SHALL stay derived and
no node position SHALL be persisted. Every drag SHALL ship with a single-pointer equivalent
(`Move to…`). Each change SHALL go through the PlanEnvelope pipeline (dry run → optimistic pending
node as preview → commit or revert with the reason shown at the node).

## Acceptance criteria

- AC-016-001-01 — Given a WorkItem dragged onto another WorkItem, then the drop is visibly refused before release.
- AC-016-001-02 — Given a keyboard user, then `Move to…` reparents the same node with the same result.

## Implementation

- none — declared only (read-only precursors: apps/server/src/modules/project-manager/views/WbsCanvas.jsx, views/DependencyMap.jsx, views/KanbanBoard.jsx)
