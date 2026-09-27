---
id: SDD-060
title: "Pipeline execution ledger, replay and worker bridge — design"
---

# SDD-060 — Pipeline execution ledger, replay and worker bridge design

- **Components:** `CMP-141` — `core/pipeline-tracking-service.js`
  (`createPipelineRun`, `recordPipelineEvent`, `listPipelineRuns`,
  `getPipelineMonitor`, `requestPipelineReplay`, `createPipelineRunFromWorker`),
  `core/pipeline-tracking-contract.js` (catalogs, envelope parsing, status
  transitions, request hashing); `CMP-147` —
  `core/cloud-sot-agent.js` (`stageDocumentIntakeForPipeline`),
  `modules/project-manager/mcp/transport.js` (the shared MCP transport that
  registers the `data_pipeline.*` tool namespace alongside `project_manager.*`
  and `knowledge.*`).
- **Data owned:** `PipelineRun`, `PipelineStep`, `PipelineEventReceipt`,
  `PipelineRecordEvent`, `PipelineReconciliation`, `PipelineGateDecision`.
- **Contracts exposed:** `API-159` (run create/list/read,
  event record, replay request); the `data_pipeline.*` MCP tool namespace.
- **Contracts consumed:** identity/session resolution (`DOM-IAM`,
  `resolveRequestViewer`); knowledge run-creation authority checks
  (`isKnowledgeExecutionAuthority`, `hasKnowledgeRunCreationAuthority`,
  `bindKnowledgeExecutionRun` — `DOM-KNW`, consulted so a knowledge-run create
  is admitted under that domain's own authority rather than a bare operator
  check); shared audit recorder (`DOM-PRJ`).
- **Main sequence:** 1. A caller (installation operator, or the Codex worker
  through MCP) creates a run for one definition; steps are pre-created from
  that definition's own catalog. 2. The worker or executor submits stage/
  record/heartbeat/gate events against the run, each checked for a valid
  status transition and stored idempotently. 3. Anyone with Business
  visibility reads the scope-filtered monitor. 4. An operator requests replay
  of a failed run or a slice of it; a new run is created linked to the
  source, never overwriting it.
- **Failure modes:** reused idempotency key with changed payload → `409`;
  unresolvable Business or out-of-scope viewer → `404`; invalid status
  transition → refused before write; stale heartbeat → `UNKNOWN`, never a
  false success; MCP tool call attempting to widen destination scope →
  server-resolved scope governs, argument ignored.

## Implementation map

| Requirement | Current code (legacy repo path) |
|---|---|
| FR-060-001 | apps/server/src/platform/integrations/core/pipeline-tracking-service.js (`createPipelineRun`), core/pipeline-tracking-contract.js; apps/server/src/app/api/pipelines/runs/route.js |
| FR-060-002 | apps/server/src/platform/integrations/core/pipeline-tracking-service.js (`recordPipelineEvent`); apps/server/src/app/api/pipelines/runs/[executionRunId]/events/route.js |
| FR-060-003 | apps/server/src/platform/integrations/core/pipeline-tracking-service.js (`listPipelineRuns`, `listPipelineRunsForHealth`, `getPipelineMonitor`); apps/server/src/app/api/pipelines/runs/route.js, apps/server/src/app/api/pipelines/runs/[executionRunId]/route.js |
| FR-060-004 | apps/server/src/platform/integrations/core/pipeline-tracking-service.js (`requestPipelineReplay`); apps/server/src/app/api/pipelines/runs/[executionRunId]/replay/route.js |
| FR-060-005 | apps/server/src/platform/integrations/core/cloud-sot-agent.js; apps/server/src/platform/integrations/core/pipeline-tracking-service.js (`createPipelineRunFromWorker`); apps/server/src/modules/project-manager/mcp/transport.js; apps/server/src/app/api/mcp/route.js |
