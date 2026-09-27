---
id: FR-034-001
title: "Scope selectors remember the last selection"
delivery: live
legacy: [FR-002]
relations:
  specified_by: [SDD-034]
---

# FR-034-001 — Scope selectors remember the last selection

The system SHALL provide Portfolio/Business/Workspace/Project scope
selectors and SHALL remember the most recently selected scope across
sessions for the same viewer.

## Acceptance criteria

- AC-034-001-01 — Given a viewer who selected Business B last session, when they return, then Business B is pre-selected rather than a default.

## Implementation

- `apps/server/src/context/ScopeContext.jsx`

## Verification

- TC-034-001 — Scope selection persists across sessions (see [verification.md](../verification.md))
