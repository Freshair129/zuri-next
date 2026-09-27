---
id: SDD-010
title: "Execution roadmap, agent/meeting intake, stable identities & trace — design"
---

# SDD-010 — Execution roadmap, agent/meeting intake, stable identities & trace design

- **Components:** CMP-029 (`getProjectRoadmap`, `buildProjectRoadmapReadModel`, labels), CMP-017 (`createProjectManagerMcpTransport`, tool registry), CMP-015 (`meeting-action-intake`, `meeting-contracts`), CMP-012 (`createExecutionTraceContext`, `createExecutionTraceRows`, `finishExecutionStep/Run`, `recordFailedExecutionTrace`, `createReplayPlan/Bundle`, `presentExecutionRun`; service `getProjectExecutionTrace`, `replayProjectExecutionTrace`), CMP-011 (`project-domain-catalog`), CMP-020 (identity constants and validation in `plan-schema.js`).
- **Data owned:** ProjectExecutionRun, ProjectExecutionStep; Workstream identity columns (`executionModeId`, `executionContractId`, `contractVersion`, `primaryDomainId`, `supportingDomainIdsJson`, `technicalOwnerDomainId`, `identityRefsJson`); ProjectGoal links written by import.
- **Contracts exposed:** API-065, API-042, API-044, API-043, API-024, API-025; JSON schemas `meeting-recording-intake.schema.json`, `meeting-action-intake.schema.json`.
- **Contracts consumed:** IAM viewer and API key; IAM provider-subject bindings (`ExternalIdentity` FUNG/LALIN_AI, FR-029-004); BusinessGoal (FEAT-019).
- **Main sequence (commit with trace):** 1. create trace context (run id, step ids, attempts, request hash) 2. transaction: trace rows → business upserts → receipt → step audits → finish run 3. on error: record failed trace outside the rolled-back transaction, rethrow.
- **Failure modes:** replay of a run from another Project → 404; invalid replay selection → 400 `TRACE_*`; MCP parse error → -32700.

## Implementation map

| Requirement | Current code (legacy repo path) |
|---|---|
| FR-010-001 | apps/server/src/modules/project-manager/application/project-roadmap-read-model.js; project-roadmap-labels.js; apps/server/src/app/api/projects/[id]/roadmap/route.js; apps/server/src/app/(pm)/projects/[projectId]/roadmap/page.jsx |
| FR-010-002 | apps/server/src/modules/project-manager/mcp/transport.js; apps/server/src/app/api/mcp/route.js |
| FR-010-003 | apps/server/src/modules/project-manager/import/meeting-action-intake.js; import/meeting-contracts.js; apps/server/src/app/api/import/meeting-actions/{dry-run,commit}/route.js |
| FR-010-004/005 | apps/server/src/modules/project-manager/application/execution-trace.js; project-execution-trace-service.js; apps/server/src/app/api/projects/[id]/execution-runs/[executionRunId]/route.js; …/replay/route.js |
| FR-010-006 | apps/server/src/modules/project-manager/import/plan-schema.js; apps/server/src/modules/project-manager/project-domain-catalog.js; import/plan-import-service.js |
