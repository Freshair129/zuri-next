---
id: FR-016-002
title: "Edge creation with a non-skippable contract dialog"
delivery: declared
legacy: [FR-083]
relations:
  decided_by: [ADR-010]
  derived_from: [BR-062]
---

# FR-016-002 — Edge creation with a non-skippable contract dialog

The system SHALL let a user drag from a source node's handle to a target node on the Project
Dependency Map to propose an edge, followed by a contract dialog that cannot be skipped
(cancelling it cancels the edge); self-edges and cycles SHALL be refused by the existing dependency
rule (same message as the register) and rendered at the attempted edge; the keyboard equivalent is
select source → `Connect to…` → pick target from the accessible edge list.

## Acceptance criteria

- AC-016-002-01 — Given the dialog is cancelled, then no Dependency row exists.
- AC-016-002-02 — Given a cycle, then the canvas shows the same refusal text as `POST /api/dependencies`.
