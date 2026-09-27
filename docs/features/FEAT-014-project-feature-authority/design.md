---
id: SDD-014
title: "Project feature authority — design"
---

# SDD-014 — Project feature authority design

- **Components:** CMP-013 — `project-feature-service` (operation table, Zod inputs, `runMutation`, locks, error mapping), `project-feature-repository` (scope resolution, dialect adapters, Project lock), `project-feature-read-model` (view/list/detail/snapshots, cursor signing), `governance-snapshot-service` + `governance-source-verifier` (evidence port, manifest normalization), `project-feature-erasure`, `phase-b-backup`; UI `ProjectFeatureView`, `ProjectFeatureForms`, `ProjectFeaturePickers`.
- **Data owned:** ProjectFeature, FeatureContribution, FeatureWorkLink (`allocationBps`), RequirementBinding, GovernanceSnapshot, ProjectFeatureMutationReceipt — all carrying `tenantId`/`businessId`, `version`, `deletedAt`/`deleteBatchId` where applicable.
- **Contracts exposed:** API-058, API-061, API-054, API-057, API-055, API-059, API-060, API-056, API-037.
- **Contracts consumed:** IAM `assertApiWriteCsrfToken`, session port, viewer re-resolution; IAM erasure transaction (FR-029-005).
- **Main sequence (mutation):** 1. CSRF + Origin + session 2. parse headers (Idempotency-Key, If-Match) and body 3. scope-first hierarchy check 4. transaction: Project lock → fresh viewer/authority → idempotency lookup → row locks → CAS → effect → receipt → audit.
- **Failure modes:** lock/serialization conflicts → retryable 503 envelope; unknown repository error codes → `DATA_INTEGRITY_UNAVAILABLE`.

## Implementation map

| Requirement | Current code (legacy repo path) |
|---|---|
| FR-014-001/002/004/005 | apps/server/src/modules/project-manager/application/project-feature-service.js; project-feature-repository.js; apps/server/src/app/api/projects/[id]/features/**; apps/server/src/app/api/projects/[id]/feature-work-links/route.js |
| FR-014-003 | application/governance-snapshot-service.js; application/governance-source-verifier.js; apps/server/src/app/api/projects/[id]/governance-snapshots/route.js |
| FR-014-006 | application/project-feature-read-model.js; apps/server/src/app/api/projects/[id]/feature-view/route.js; apps/server/src/app/(pm)/projects/[projectId]/feature-view/page.jsx; components/ProjectFeature*.jsx |
| FR-014-007 | application/project-feature-erasure.js; application/phase-b-backup.js; application/backup-service.js |
