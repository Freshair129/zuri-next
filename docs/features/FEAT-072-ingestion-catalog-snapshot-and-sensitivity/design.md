---
id: SDD-072
title: "Ingestion stage catalog, snapshot contract & sensitivity lattice — design"
---

# SDD-072 — Ingestion stage catalog, snapshot contract & sensitivity lattice design

- **Components:** CMP-197 (`platform/integrations/core/
  genesisrag17-executor.js` — the ADR-068 production Tier 1 executor; calls
  `genesisrag17-source.js`'s parser/chunker and `genesisrag17-structured-record.js`'s
  renderer for `SMARTGIFT_CATALOG`, `FEAT-075`) · CMP-200
  (`genesisrag17-worker.js`, `genesisrag17-importer.js`, `genesisrag17-publication.js` —
  the durable source worker, evidence import and publication guard) ·
  CMP-198 (`genesisrag17-lineage-repository.js` — immutable raw/
  parsed/chunk lineage) · CMP-196 (`genesisrag17-contract.js` —
  strict wire schema/hash) · CMP-218
  (`published-snapshot-contract.js` — `evaluateKnowledgePublication`,
  `knowledgeJobState`, `knowledgeRunOutcome`) · CMP-189
  (`classification.js` — `classifyKnowledgeObject`, `resolveExecutionLocation`,
  `assertIndexable`) · CMP-195 (`knowledge-evidence-importer.js` —
  the pull importer, integration lane).
- **Data owned:** `KnowledgeRawArtifact`, `KnowledgeParsedArtifact`, `KnowledgeChunk`,
  `KnowledgeArtifactStorage`, `KnowledgeArtifactOperation`,
  `GenesisRag17IngestionIntent`, `GenesisRag17SourceMention`, `GenesisRag17Batch`,
  `GenesisRag17StageEvidence`, `GenesisRag17EvidenceCursor`,
  `GenesisRag17PublicationReceipt` (all this domain's, ADR-068); the FR-060-001, FR-060-002, FR-060-003, FR-060-004, FR-060-005
  `PipelineRun`/`PipelineStep`/`PipelineRecordEvent`/`PipelineGateDecision` ledger is
  the integration domain's, reused unchanged (SDD-072).
- **Contracts exposed:** API-188, API-189,
  API-186, API-185, API-181 (see
  `contracts.md`).
- **Contracts consumed:** MSP's stdio relay (`legacy:` agent domain's
  `msp-stdio-transport.js`) for both the GenesisRAG17 source worker's Stage 9 submission
  and this domain's own evidence-pull importer; `FR-060-001, FR-060-002, FR-060-003, FR-060-004, FR-060-005`'s `createPipelineRun`/
  `recordPipelineEvent` (integration domain) as the sole ledger writer.
- **Main sequence:** 1. source admitted (`FEAT-073`) enqueues a durable
  GenesisRAG17 intent 2. Stages 1–8 execute in-process, real evidence recorded 3. one
  batch per Stage 9 attempt submitted to MSP → GKS 4. GKS/GenesisBlockDB execute
  Stages 9–17, reporting back by push (ADR-065) or pulled by this domain
  (ADR-066) 5. Stage 17 gate evaluated; on `PASS`/`PASS_WITH_WARNINGS` and policy
  allow, GenesisBlock worker atomically publishes and returns a receipt 6. this domain
  imports the matching receipt and only then permits `finish` to close `SUCCEEDED`.
- **Failure modes:** any Tier 1 stage failure → BR-067 quarantine (`FEAT-071`); an
  external stage failure or rejected gate → run `FAILED`; a missing/mismatched
  publication receipt → run left open or `FAILED`, never a false `SUCCEEDED`; a
  reporter naming a Tier 1 stage id or another Tenant's run → refused 403/404.

## Implementation map

| Requirement | Current code (legacy repo path) |
|---|---|
| FR-072-001 | apps/server/src/platform/integrations/core/pipeline-tracking-contract.js; apps/server/src/platform/integrations/core/genesisrag17-executor.js; apps/server/src/modules/knowledge/genesisrag17-lineage-repository.js; apps/server/src/modules/knowledge/genesisrag17-contract.js |
| FR-072-002 | apps/server/src/platform/integrations/core/knowledge-ingestion-executor.js; apps/server/src/platform/integrations/core/knowledge-evidence-importer.js; apps/server/src/app/api/pipelines/knowledge/[executionRunId]/**; apps/server/src/app/api/pipelines/knowledge/evidence/pull/route.js |
| FR-072-003 | apps/server/src/lib/validation/enums.js; apps/server/src/modules/knowledge/classification.js |
| FR-072-004 | apps/server/src/modules/knowledge/published-snapshot-contract.js; apps/server/src/platform/integrations/core/genesisrag17-publication.js |
