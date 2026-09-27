---
id: SDD-007
title: "Plan intake pipeline — design"
---

# SDD-007 — Plan intake pipeline design

- **Components:** CMP-020 (`resolveImportWorkspaceId`, `dryRunPlan`, `commitPlan`, `zPlanEnvelope`, `normalizePlanEnvelope`, `validatePlanSemantics`, `authorizeImportTarget`), CMP-015 (`human-plan-builder`, `plan-mode-envelope`, `task-envelope`, `xlsx-template`, `xlsx-convert`), UI `UploadPlanModal`, `PlanPreview`, `HumanPlanBuilderModal`, `PlanModeCustomizerModal`, `StandaloneTaskModal`, `usePlanIntake`.
- **Data owned:** writes Project/Workstream/Container/Item/Milestone/Gate/Repository/ProjectRepository/Dependency through the upsert pipeline; PlanImportReceipt (`idempotencyKey`, `payloadHash`, `executionRunId`, `stepKey`, `status`, `correlationId`, `schemaVersion`, `projectId`).
- **Contracts exposed:** API-039, API-038, API-041, API-040; normative JSON Schema `contracts/plan-envelope.schema.json` (per-Project intake contract for other domains and agents).
- **Contracts consumed:** IAM viewer; Membership read (assignee scope check).
- **Main sequence:** 1. resolve viewer 2. resolve + authorize target Workspace 3. Zod parse 4. normalize (defaults: execution ids, domain binding) 5. semantic check 6. classify (externalRef → scoped code → insert) 7. preview 8. (commit) dry run again → transaction: upserts, receipts, audit, trace steps → result.
- **Failure modes:** invalid → `{ valid:false, errors }` 200 from dry run; refusal → 404/403; idempotency conflict → `committed:false`; transaction timeout → rollback + failed trace recorded (FEAT-010).

## Implementation map

| Requirement | Current code (legacy repo path) |
|---|---|
| FR-007-001 | apps/server/src/modules/project-manager/import/plan-schema.js; contracts/plan-envelope.schema.json |
| FR-007-002/003 | apps/server/src/modules/project-manager/import/plan-import-service.js; apps/server/src/app/api/import/dry-run/route.js; apps/server/src/app/api/import/commit/route.js |
| FR-007-004 | apps/server/src/modules/project-manager/import/import-authorization.js; plan-import-service.js (`resolveAuthorizedTarget`) |
| FR-007-005 | apps/server/src/app/(pm)/projects/new/page.jsx; components/HumanPlanBuilderModal.jsx; components/PlanModeCustomizerModal.jsx; import/human-plan-builder.js; import/plan-mode-envelope.js |
| FR-007-006 | components/StandaloneTaskModal.jsx; import/task-envelope.js |
| FR-007-007 | import/xlsx-template.js; import/xlsx-convert.js; apps/server/src/app/api/import/template/route.js; apps/server/src/app/api/import/xlsx/route.js; components/UploadPlanModal.jsx |
