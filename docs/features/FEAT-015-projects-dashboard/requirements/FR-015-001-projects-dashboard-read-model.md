---
id: FR-015-001
title: "Projects Dashboard read model"
delivery: live
legacy: [FR-086 (split 1/2 — band and list)]
relations:
  specified_by: [SDD-015, API-070]
  decided_by: [ADR-011]
  derived_from: [BR-004, BR-005]
---

# FR-015-001 — Projects Dashboard read model

The system SHALL serve, for a visible Business (optionally one Workspace), a dashboard with:
Projects by status and WorkItems by status where the highlighted statuses (PLANNED, ACTIVE,
DONE for Projects) are shown with an explicit "other" remainder so the parts always sum to the
totals; **people with work** = distinct `WorkItem.assigneeRef` on in-scope live Projects; **teams on
projects** = distinct Teams attached via ProjectTeam — two separate figures; and a list with Code,
Name, Size (count of non-deleted WorkItems), Space, Streams, Status, Progress (pure calculators),
Target, PIC and Priority. The sidebar entry for `/projects` SHALL be labelled "Dashboard" and "New
project" SHALL be this page's primary action (not in the Topbar).

## Acceptance criteria

- AC-015-001-01 — Given 12 Projects (7 ACTIVE, 3 DONE, 1 ON_HOLD, 1 PLANNED), then the band shows 12 total, 7 active, 3 done, 1 planned and "other 1", summing to 12.
- AC-015-001-02 — Given a Team attached to a Project with nobody assigned, then Teams = 1 and People = 0.
- AC-015-001-03 — Given a Business the viewer cannot see, then 404.

## Implementation

- apps/server/src/modules/project-manager/application/projects-dashboard-read-model.js; apps/server/src/app/api/projects/overview/route.js; apps/server/src/app/(pm)/projects/page.jsx; apps/server/src/lib/validation/enums.js (`PROJECT_STATUS_HIGHLIGHTS`)

## Verification

- TC-015-001 — Dashboard read model and UI (see [verification.md](../verification.md))
- TC-015-004 — Dashboard load (see [verification.md](../verification.md))
