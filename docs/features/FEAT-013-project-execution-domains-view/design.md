---
id: SDD-013
title: "Project execution domains view — design"
---

# SDD-013 — Project execution domains view design

- **Components:** CMP-011 (`project-domain-read-model.js`, `project-domain-catalog.js`), UI `ProjectDomainView`; guard `assertProjectRoadmapReadable` (CMP-029).
- **Data owned:** none.
- **Contracts exposed:** API-053.
- **Main sequence:** authorize → load active Workstreams with bindings and active items → dedupe by WorkItem UUID per domain and at root → map labels → DTO.
- **Failure modes:** unauthorized/missing → redacted 404; catalogue miss → UNMAPPED row.

## Implementation map

| Requirement | Current code (legacy repo path) |
|---|---|
| FR-013-001 | apps/server/src/modules/project-manager/application/project-domain-read-model.js; apps/server/src/modules/project-manager/project-domain-catalog.js |
| FR-013-002 | apps/server/src/app/api/projects/[id]/domain-view/route.js; apps/server/src/app/(pm)/projects/[projectId]/domain-view/page.jsx; components/ProjectDomainView.jsx; navigation.js; components/ProjectTabs.jsx |
