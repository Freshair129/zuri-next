---
id: FR-006-004
title: "Project Board"
delivery: live
legacy: [FR-063]
relations:
  specified_by: [API-082]
  derived_from: [BR-005, BR-004]
---

# FR-006-004 — Project Board

The system SHALL render an opened Project's live WorkItems as a status board with exactly
one column per value of `WORK_STATUSES`, in enum order, derived from the enum source; opening
a card SHALL open the work-package editor, and every status change SHALL go through the work
service. The board SHALL persist nothing (no column, order or card position).

## Acceptance criteria

- AC-006-004-01 — Given an item in CANCELLED, then it appears in a CANCELLED column (never silently dropped).
- AC-006-004-02 — Given a new value added to `WORK_STATUSES`, then a column appears without editing the board.

## Implementation

- apps/server/src/app/(pm)/projects/[projectId]/board/page.jsx; views/KanbanBoard.jsx

## Verification

- TC-006-004 — Board columns (see [verification.md](../verification.md))
