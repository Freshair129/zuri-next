---
id: SDD-003
title: "Project execution structure & write authorization — design"
---

# SDD-003 — Project execution structure & write authorization design

- **Components:** CMP-025 (Project/Workstream CRUD, `resolveProjectBusinessId`, list read), CMP-032 (containers, items, `listWork`, read visibility helpers), CMP-018, CMP-010 (`createDependency`, `wouldCreateCycle`, `evaluateBlocked`, `listDependencies`), CMP-024 (`assertProjectWritable`, `assertWorkstreamWritable`, `assertEndpointWritable`, `assertWorkspaceWritable`, refusal helpers), CMP-002.
- **Data owned:** Project (`businessId?`, `workspaceId`, `type`, `status`, `priority?`, `picPersonId?`, dates, `deletedAt`, `version`), Workstream (`executionMode`, `progressStrategy`, `progressWeight`, `progressCache` advisory, `viewConfigJson`, execution-contract/identity columns used by FEAT-010), WorkContainer (`parentId`, `subtype`), WorkItem (`assigneeRef`, `weight`, `numericValue`, `probability`, `metricDataJson`, `metadataJson`, `deletedAt`, `version`), Milestone, Gate (`required`, `evidenceJson`), Dependency (`sourceType/Id`, `targetType/Id`, `dependencyType`).
- **Contracts exposed:** API-069, API-051, API-068, API-085, API-084, API-019, API-018, API-082, API-081, API-046, API-045, API-036, API-035, API-020, API-021. The services are also the in-process write contract used by intake (FEAT-007) and agent tools (FR-003-009 agent line-project-work-tools).
- **Contracts consumed:** IAM viewer predicates (`ownsBusiness`, `seesBusiness`, `isInstallationOperator`).
- **Main sequence (write):** 1. route resolves viewer 2. service parses input (Zod) 3. loads target and walks to its governing Business 4. authorizes (404-shaped / 403 above Business) 5. validates structural invariants (same Workstream/Project, owner = Space owner, cycle) 6. writes with `version` increment 7. records AuditEvent.
- **Failure modes:** unowned → 404; ungoverned → 403; invariant violation → 400; version mismatch → conflict; Prisma P2025 → 404; other DB errors → 500.

## Implementation map

| Requirement | Current code (legacy repo path) |
|---|---|
| FR-003-001 | apps/server/src/modules/project-manager/application/project-service.js; apps/server/src/app/api/projects/route.js; apps/server/src/app/api/projects/[id]/route.js; apps/server/src/app/(pm)/projects/page.jsx |
| FR-003-002 | apps/server/src/modules/project-manager/application/project-list-read-model.js; project-service.js (`listProjects*`); apps/server/src/app/api/projects/route.js |
| FR-003-003 | project-service.js (`resolveProjectBusinessId`, `updateProject`) |
| FR-003-004 | project-service.js (workstreams); apps/server/src/app/api/workstreams/route.js; apps/server/src/app/api/workstreams/[id]/route.js; apps/server/src/lib/validation/enums.js |
| FR-003-005/006 | apps/server/src/modules/project-manager/application/work-service.js; work-read-service.js; active-filters.js; apps/server/src/app/api/containers/**; apps/server/src/app/api/work/**; apps/server/src/modules/project-manager/views/universal/AllWorkView.jsx; apps/server/src/app/(pm)/work/page.jsx |
| FR-003-007 | apps/server/src/modules/project-manager/application/milestone-gate-service.js; apps/server/src/app/api/milestones/**; apps/server/src/app/api/gates/**; views/universal/MilestonesView.jsx |
| FR-003-008 | apps/server/src/modules/project-manager/application/dependency-service.js; apps/server/src/app/api/dependencies/**; apps/server/src/app/(pm)/dependencies/page.jsx |
| FR-003-009 | apps/server/src/modules/project-manager/application/project-authorization.js (all services above call it) |
