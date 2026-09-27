---
id: FR-006-001
title: "Seven execution-mode views over the neutral model"
delivery: live
legacy: [FR-009]
relations:
  specified_by: [API-085, API-081]
  derived_from: [BR-049, BR-004]
---

# FR-006-001 — Seven execution-mode views over the neutral model

The system SHALL render, for each of the seven execution modes, a view listing the
Workstreams of that mode — across the viewer's selected Business scope at `/execution/{mode}`
and within one Project at `/projects/{id}/execution/{mode}` — each with a mode-specific body
(Sprint board, Migration monitor, Sales pipeline, Campaign control, Launch timeline,
Operations board, Expansion portfolio) over the same Workstream/Container/Item data, using the
mode's vocabulary and the Workstream's calculated progress. Item status SHALL be editable
inline through the work service; the project-scoped view SHALL show a path back to its
Project. No mode-specific persistence SHALL exist.

## Acceptance criteria

- AC-006-001-01 — Given a Project with one DATA_MIGRATION Workstream, when `/projects/{id}/execution/DATA_MIGRATION` opens, then only that Workstream is listed with the migration monitor body.
- AC-006-001-02 — Given no Workstreams of a mode, then an empty state names the mode.
- AC-006-001-03 — Given a status changed inline, then the change is a PATCH on the WorkItem and the progress shown equals the calculator result.

## Implementation

- apps/server/src/app/(pm)/execution/page.jsx; apps/server/src/app/(pm)/execution/[mode]/page.jsx; apps/server/src/app/(pm)/projects/[projectId]/execution/[mode]/page.jsx; apps/server/src/modules/project-manager/views/execution/ExecutionModeView.jsx; views/execution/mode-bodies.jsx

## Verification

- TC-006-001 — Execution views and back path (see [verification.md](../verification.md))
