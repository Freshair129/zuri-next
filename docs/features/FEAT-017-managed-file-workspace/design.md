---
id: SDD-017
title: "Managed file workspace & File Manager — design"
---

# SDD-017 — Managed file workspace & File Manager design

- **Components:** CMP-014 — `file-asset-service` (ingest, list, mounts, content, relink, delete, migrate, `createManagedBlobFileAsset` for DOM-AST), `file-manager-read-model`, `file-reconcile-cache-service`, `local-file-reveal-service`, `project-file-service`, `local-files/filesystem-port` (stage/promote/read/cleanup), `local-files/path-security`; UI `ManagedFilesPanel`, `FileManagerViews`.
- **Data owned:** FileAsset, FileLink, LocalWorkspaceMount, ProjectFile.
- **Contracts exposed:** API-030, API-026, API-027, API-028, API-029, API-031, API-032, API-033, API-034, API-007, API-063, API-062; in-process `createManagedBlobFileAsset` (consumed by Asset Management, LINE rich menus, payments slips).
- **Contracts consumed:** object-storage port for MANAGED_BLOB (SRV-006-style configured store).
- **Failure modes:** security error → 400 before I/O; missing mount → error; stale cache → canonical query.

## Implementation map

| Requirement | Current code (legacy repo path) |
|---|---|
| FR-017-001 | apps/server/src/modules/project-manager/application/project-file-service.js; apps/server/src/app/api/projects/[id]/files/**; apps/server/src/app/(pm)/projects/[projectId]/files/page.jsx |
| FR-017-002/003/007 | application/file-asset-service.js; apps/server/src/app/api/files/route.js; api/files/[id]/route.js; api/files/mounts/route.js; api/files/migrate/route.js |
| FR-017-004 | local-files/path-security.js; local-files/filesystem-port.js; apps/server/src/app/api/files/[id]/content/route.js |
| FR-017-005 | application/file-reconcile-cache-service.js; api/files/reconcile/route.js; api/files/cache/rebuild/route.js; api/files/[id]/relink/route.js |
| FR-017-006 | application/local-file-reveal-service.js; api/files/[id]/reveal/route.js |
| FR-017-008 | application/file-manager-read-model.js; apps/server/src/app/api/business/files/route.js; apps/server/src/app/(pm)/files/page.jsx |
| FR-017-009 | components/FileManagerViews.jsx; components/ManagedFilesPanel.jsx |
