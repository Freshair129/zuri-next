---
id: FR-034-002
title: "Command palette provides filtered, searchable navigation"
delivery: live
legacy: [FR-015]
relations:
  specified_by: [SDD-034]
---

# FR-034-002 — Command palette provides filtered, searchable navigation

The system SHALL provide a command palette (`Ctrl+K`) that indexes every
reachable route and lets the viewer filter and search it from the keyboard.

## Acceptance criteria

- AC-034-002-01 — Given a viewer with visibility into three domains, when they open the command palette, then only routes for domains/Businesses they may see appear in the index.

## Implementation

- `apps/server/src/components/layouts/CommandPalette.jsx`

## Verification

- TC-034-002 — Command palette index and filtering (see [verification.md](../verification.md))
