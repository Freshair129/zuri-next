---
id: SDD-071
title: "Stage composition & quarantine — design"
---

# SDD-071 — Stage composition & quarantine design

- **Components:** CMP-223 (`src/modules/knowledge/stage-runner.js`,
  `runKnowledgeIngestionStages` and `runKnowledgeIngestionStagesWithTrace`,
  `src/modules/knowledge/quarantine.js` for the BR-067 envelope builder).
- **Data owned:** none — the composition is pure and returns an in-memory result;
  `owns_models: []` holds.
- **Contracts exposed:** none. `runKnowledgeIngestionStages`/
  `runKnowledgeIngestionStagesWithTrace` are library functions called by
  `apps/server/src/platform/integrations/core/knowledge-ingestion-executor.js`
  (integration lane), which is the actual FR-060-001, FR-060-002, FR-060-003, FR-060-004, FR-060-005 ledger writer.
- **Contracts consumed:** the six `FEAT-070` calculators, called in sequence.
- **Main sequence:** 1. caller supplies one artifact 2. Parse → Provenance →
  Normalize → Dedupe → Chunk → Entity Extraction run in order 3. (traced variant)
  each stage's success/failure is recorded individually 4. result (or the BR-067
  envelope for the failing stage) returns to the caller, which is responsible for
  any ledger write.
- **Failure modes:** non-traced composition — a stage's error propagates unchanged,
  ending the whole call; traced composition — the failing stage's error becomes a
  quarantine envelope, prior stages' evidence is preserved, no stage after the failure
  runs.

## Implementation map

| Requirement | Current code (legacy repo path) |
|---|---|
| FR-071-001 | apps/server/src/modules/knowledge/stage-runner.js |
| FR-071-002 | apps/server/src/modules/knowledge/stage-runner.js; apps/server/src/modules/knowledge/quarantine.js |
