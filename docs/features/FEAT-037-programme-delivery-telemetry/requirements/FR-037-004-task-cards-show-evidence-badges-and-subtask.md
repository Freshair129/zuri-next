---
id: FR-037-004
title: "Task cards show evidence badges and subtask progress"
delivery: live
legacy: [FR-219]
relations:
  specified_by: [SDD-037]
  decided_by: [ADR-034]
---

# FR-037-004 — Task cards show evidence badges and subtask progress

Every task card SHALL show DOC/CODE/TEST badges (link resolution + task
status), FR/NFR/FEAT badges (delivered-id status against the FR-022-001, FR-022-002, FR-022-003
snapshot), and descriptor badges (domain, complexity, priority) — colour
always paired with a word. A container listing subtasks SHALL show them with
a progress bar computed under the board's status mapping; a task with no
subtasks SHALL show no bar.

## Acceptance criteria

- AC-037-004-01 — Given a task whose declared CODE link path no longer exists, when its card renders, then the CODE badge is red ("needs fix"), not silently omitted.
- AC-037-004-02 — Given a task with no subtasks, when its card renders, then no progress bar is shown at all (not an empty one).

## Implementation

- `apps/server/src/modules/platform-control/program-task-evidence.js`, `apps/server/scripts/programme-containers.mjs`

## Verification

- TC-037-004 — Task evidence badges and subtask progress (see [verification.md](../verification.md))
