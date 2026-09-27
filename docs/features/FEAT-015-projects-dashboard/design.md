---
id: SDD-015
title: "Projects dashboard, priority, PIC & teams — design"
---

# SDD-015 — Projects dashboard, priority, PIC & teams design

- **Components:** CMP-027 (`parseProjectsDashboardQuery`, `resolveDashboardScope`, `buildProjectsDashboardReadModel`, `rankTopPriority`), CMP-031, CMP-025 (priority/PIC fields), CMP-022.
- **Data owned:** `Project.priority`, `Project.picPersonId`; Team (`businessId`, `deletedAt`), TeamMembership (unique team+person), ProjectTeam (unique project+team).
- **Contracts exposed:** API-070, API-080, API-078, API-079, API-067.
- **Contracts consumed:** IAM viewer predicates; Membership read for team membership eligibility.
- **Failure modes:** invisible Business → 404; unowned write → 404; cross-Business attach → 400.

## Implementation map

| Requirement | Current code (legacy repo path) |
|---|---|
| FR-015-001/002 | apps/server/src/modules/project-manager/application/projects-dashboard-read-model.js; apps/server/src/app/api/projects/overview/route.js; apps/server/src/app/(pm)/projects/page.jsx; apps/server/src/lib/validation/enums.js (`PROJECT_STATUS_HIGHLIGHTS`) |
| FR-015-003/004 | apps/server/src/lib/validation/entities.js; application/project-service.js; components/ProjectModal.jsx; components/project-status-options.js |
| FR-015-005 | apps/server/src/modules/project-manager/application/team-service.js; apps/server/src/app/api/teams/**; apps/server/src/app/api/projects/[id]/teams/route.js |
