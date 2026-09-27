---
id: SDD-012
title: "Project inventory snapshot — design"
---

# SDD-012 — Project inventory snapshot design

- **Components:** CMP-016 (`parseProjectInventoryQuery`, `assertProjectReadable`, `buildProjectInventoryReadModel`, `paginateCollection`, Zod DTO schemas); consumes CMP-022, CMP-010 (project graph), CMP-014 read model.
- **Data owned:** none (projection).
- **Contracts exposed:** API-064; `assertProjectReadable` is reused as the Project read guard by other routes.
- **Main sequence:** 1. viewer 2. load Project header → authorize 3. load children anchored to the Project 4. compute progress 5. redact, paginate, validate DTO.
- **Failure modes:** a section source failing → `status: UNAVAILABLE` with `reasonCode`, other sections still returned.

## Implementation map

| Requirement | Current code (legacy repo path) |
|---|---|
| FR-012-001/002 | apps/server/src/modules/project-manager/application/project-inventory-read-model.js; apps/server/src/app/api/projects/[id]/inventory/route.js; apps/server/src/app/(pm)/projects/[projectId]/inventory/page.jsx; apps/server/src/app/api/_helpers.js |
