---
id: SDD-021
title: "Audit trail & snapshot backup/restore — design"
---

# SDD-021 — Audit trail & snapshot backup/restore design

- **Components:** CMP-002 (`recordAudit`, `listAudit`, `listAuditEntityTypes`), CMP-003 (`SNAPSHOT_MODELS`, `SNAPSHOT_EXCLUDED_MODELS`, `exportSnapshot`, `extractSnapshot`, `previewSnapshot`, `validateSnapshotRecovery`, `previewImport`, `importSnapshot`, `restoredRow`, domain recovery validators).
- **Data owned:** AuditEvent (shape and retention). The snapshot touches every domain's tables as an installation operation.
- **Contracts exposed:** API-001, API-002, API-003; `recordAudit` as the in-process audit contract for all domains.
- **Contracts consumed:** IAM `assertOperatorAndRecordUse` / `assertOperator` (FR-032-003).
- **Failure modes:** invalid snapshot → errors, no write; recovery-manifest hash mismatch → restore refused; remount to unknown Business → rollback.

## Implementation map

| Requirement | Current code (legacy repo path) |
|---|---|
| FR-021-001/002 | apps/server/src/modules/project-manager/application/audit.js; apps/server/src/app/api/audit/route.js; apps/server/src/app/(pm)/audit/page.jsx |
| FR-021-003/004 | apps/server/src/modules/project-manager/application/backup-service.js; apps/server/src/app/api/backup/export/route.js; apps/server/src/app/api/backup/import/route.js; apps/server/src/app/(pm)/backup/page.jsx |
