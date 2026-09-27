---
id: FR-055-006
title: "Graph view of the same plan"
delivery: live
legacy: [FR-101]
relations:
  specified_by: [SDD-055, API-165]
---

# FR-055-006 — Graph view of the same plan

The system SHALL render `/platform/sot-pipeline/graph` as read-only nodes and edges in
topological layers (hand-drawn SVG, no client graph library) from the same API payload
as the board, with derived status as node state and per-phase pending-decision badges
linking to the inbox.

## Acceptance criteria

- AC-055-006-01 — Given a phase with two pending decisions, when the graph renders, then its node shows a badge of 2 linking to the inbox filtered to that phase.

## Implementation

- apps/server/src/modules/integration/application/sot-pipeline-graph.js; apps/server/src/app/(pm)/platform/sot-pipeline/graph/page.jsx

## Verification

- TC-055-003 — Graph and inbox rendering (see [verification.md](../verification.md))
