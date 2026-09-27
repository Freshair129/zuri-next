---
id: FR-009-002
title: "Symbolic references resolve inside the authorized scope"
delivery: implemented
legacy: [FR-108 (split 2/4 — reference resolution)]
relations:
  decided_by: [ADR-013]
  derived_from: [BR-006]
---

# FR-009-002 — Symbolic references resolve inside the authorized scope

The system SHALL resolve bundle-local symbols (roadmap, horizon, goal, project codes) to
canonical UUIDs only inside the authorized Business and Workspace, failing closed on unknown,
ambiguous, cross-Business, cross-Workspace or type-mismatched targets; symbols SHALL grant no
authority. A declared strategy `code` that is already taken by another record SHALL be refused
(409), never suffixed; a goal the bundle will create SHALL appear as a pending symbol in the
preview.

## Acceptance criteria

- AC-009-002-01 — Given `goal.code` referring to a goal of another Business, then a conflict "cross-Business" is listed.
- AC-009-002-02 — Given a new goal referenced by a Project, then the Project preview lists it under `pendingGoalRefs`.

## Implementation

- import/bundle/bundle-resolver.js
