---
id: FR-040-005
title: "The evidence view stays accessible and mobile-scannable"
delivery: building
legacy: [FR-264]
relations:
  specified_by: [SDD-040]
---

# FR-040-005 — The evidence view stays accessible and mobile-scannable

The read-only operator projection SHALL remain keyboard-accessible and
mobile-scannable at 390×844 and 430×932, using bounded evidence-table
scrolling without document-level overflow, and preserving the same
truthful-state vocabulary at every width.

## Acceptance criteria

- AC-040-005-01 — Given the page at 390×844, when a long evidence table renders, then only the table scrolls — the document itself does not overflow.

## Implementation

- `apps/server/src/modules/platform-control/mission-control/components/MissionControlBoard.jsx`

## Verification

- TC-040-005 — Responsive, accessible evidence view (see [verification.md](../verification.md))
