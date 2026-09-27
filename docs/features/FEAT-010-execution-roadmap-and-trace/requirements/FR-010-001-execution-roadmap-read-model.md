---
id: FR-010-001
title: "Execution Roadmap read model"
delivery: live
legacy: [FR-068]
relations:
  specified_by: [SDD-010, API-065]
  decided_by: [ADR-007]
  derived_from: [BR-004]
---

# FR-010-001 — Execution Roadmap read model

The system SHALL return, for an authorized Project reader, a strict read-only Execution
Roadmap composed from existing Project, Workstream, WorkContainer, WorkItem, Gate (including
Project-level gates), Dependency, Membership and ProjectGoal records: project header (outcome,
authorized goals with code/title/status/progress, strategy-based progress, dates, summary
counts of total/backlog/done/blocked work), plans (`planId` = Workstream id, `planCode`,
`executionModeId`, `executionContractId`, mode vocabulary, strategy, weight, current
container), containers and items with typed aliases (e.g. `sprintId`, `batchId`), dependencies
with blocked state, roster from Memberships, and closure gates. Every field whose owner does
not exist yet (accountable owner, risks, sources, tags, criteria, item evidence, blocker
owner, closure decision, supporting identity refs) SHALL be returned as explicit `UNAVAILABLE`,
never a default that looks real. The view SHALL render under Project → Work → Execution
Roadmap and write nothing.

## Acceptance criteria

- AC-010-001-01 — Given a Project with a SOFTWARE_SPRINT Workstream and a sprint container, then the container carries `containerId`, `sprintId`, `planId` and the Workstream's calculated progress.
- AC-010-001-02 — Given no Risk owner, then `risks` has state `UNAVAILABLE` with a reason.
- AC-010-001-03 — Given a viewer who cannot read the Project, then 404.

## Implementation

- apps/server/src/modules/project-manager/application/project-roadmap-read-model.js; project-roadmap-labels.js; apps/server/src/app/api/projects/[id]/roadmap/route.js; apps/server/src/app/(pm)/projects/[projectId]/roadmap/page.jsx

## Verification

- TC-010-001 — Roadmap read model and view (see [verification.md](../verification.md))
- TC-010-004 — Trace ledger and replay (see [verification.md](../verification.md))
