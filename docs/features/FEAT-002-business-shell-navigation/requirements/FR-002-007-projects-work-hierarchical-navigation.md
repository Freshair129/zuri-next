---
id: FR-002-007
title: "Projects & Work hierarchical navigation"
delivery: live
legacy: [FR-250]
relations:
  decided_by: [ADR-014]
  derived_from: [NFR-008]
---

# FR-002-007 — Projects & Work hierarchical navigation

The system SHALL present the `projects` domain as "Projects & Work" with six logical
modules — Project Management, Work Management, Delivery Design, Resource Coordination,
Delivery Governance, Agent Delivery — and show only the selected module's views in content
navigation. All Business destinations (`/projects`, `/work`, `/execution`, `/timeline`,
`/dependencies`, `/milestones`, `/files`, `/repositories`) and all Project route templates
SHALL stay reachable at their existing URLs; Work Management SHALL expose one seven-view row
(Execution Roadmap, Structure Plan, Board, Work Items, Schedule, Milestones, Dependency Map)
entered at Structure Plan; "Import plan" SHALL be one persistent Project action; planned
capabilities (e.g. Requirements, Risks, Resources, Agents) SHALL be named with an
explanation and no href. Switching modules SHALL keep the authorized Project context;
navigation SHALL never be the authorization check and SHALL create no grant or domain key.

## Acceptance criteria

- AC-002-007-01 — Given the Projects & Work domain, then exactly six module entries appear and no new grant key exists.
- AC-002-007-02 — Given a planned capability, then it renders a "Planned" explanation and no link.
- AC-002-007-03 — Given Project P open in Work Management, when switching to Resource Coordination, then Team/Files/Repositories open for P.
- AC-002-007-04 — Given a path sharing a prefix with a module route (e.g. `/workspace`), then no module is falsely selected (segment-boundary matching).

## Implementation

- apps/server/src/modules/project-manager/navigation.js; apps/server/src/modules/project-manager/components/ProjectManagerBusinessNav.jsx; apps/server/src/modules/project-manager/components/ProjectTabs.jsx; apps/server/src/app/(pm)/projects/[projectId]/layout.jsx; apps/server/src/components/layouts/AppShell.jsx

## Verification

- TC-002-005 — Hierarchical navigation (see [verification.md](../verification.md))
