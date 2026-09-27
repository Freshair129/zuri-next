---
id: SDD-056
title: "Catalog publication approval gate — design"
---

# SDD-056 — Catalog publication approval gate design

- **Components:** CMP-140 — `core/pipeline-gate-compliance.js` (pure detector); CMP-141 — `core/pipeline-tracking-service.js`, `core/pipeline-tracking-contract.js` (gate event schema, evidence persistence, monitor read).
- **Data owned:** PipelineRun, PipelineStep, PipelineGateDecision (and siblings PipelineEventReceipt, PipelineRecordEvent, PipelineReconciliation).
- **Contracts exposed:** API-159 (event ingestion + monitor read).
- **Contracts consumed:** none.
- **Main sequence:** executor posts step/gate events → service stores gate with evidence → monitor read loads steps and gates → `gateCompliance()` adds the compliance block.
- **Failure modes:** unreadable timestamps are reported `ordered: false`, never silently resolved.

## Implementation map

| Requirement | Current code (legacy repo path) |
|---|---|
| FR-056-001 | apps/server/src/platform/integrations/core/pipeline-tracking-service.js; apps/server/src/platform/integrations/core/pipeline-tracking-contract.js |
| FR-056-002 | apps/server/src/platform/integrations/core/pipeline-gate-compliance.js; apps/server/src/platform/integrations/core/pipeline-tracking-service.js |
