---
id: FR-072-001
title: "Seventeen-stage knowledge ingestion stage catalog and job trace"
delivery: building
legacy: [FR-109]
relations:
  specified_by: [SDD-072]
  derived_from: [BR-066, BR-067, NFR-019]
  decided_by: [ADR-063, ADR-068]
---

# FR-072-001 — Seventeen-stage knowledge ingestion stage catalog and job trace

The system SHALL register `DPL-KNOWLEDGE-INGEST-V1` as one governed pipeline
definition on the FR-060-001, FR-060-002, FR-060-003, FR-060-004, FR-060-005 execution ledger, carrying the seventeen stable `DPS-KI-*`
stage ids in a fixed catalog (`PIPELINE_DEFINITIONS`), distinct from and validated
independently against `DPL-SUPABASE-BUSINESS-KNOWLEDGE-V1`'s own catalog — a stage id
SHALL be validated only against its own definition's catalog, never the union. The
stage sequence number SHALL be ordering metadata only; a stage occurrence SHALL be
identified by `pipelineStageId + executionStepId`, so inserting a new stage never
renumbers an earlier job's evidence. Every stage SHALL carry the NFR-019 per-stage
metric set (`records_in`, `records_out`, `records_failed`, `records_quarantined`,
`processing_time`, `retry_count`); a stage that produced nothing SHALL report zero
rather than being absent. A failing object SHALL be classified retryable /
non-retryable / review-required and quarantined with BR-067's complete envelope, never
silently dropped. Reprocessing the same event SHALL create no duplicate knowledge,
keyed on BR-066's four-part identity — a database `@unique` constraint on
`PipelineRun.idempotencyKey`, not a caller-performed comparison.

## Acceptance criteria

- AC-072-001-01 — Given `DPL-KNOWLEDGE-INGEST-V1` and `DPL-SUPABASE-BUSINESS-KNOWLEDGE-V1`, when their stage ids are compared, then the two catalogs share no id, and a run claiming one definition under the other's execution contract id is rejected by the envelope.
- AC-072-001-02 — Given a structured record and a prose document, when each is ingested through `ingestKnowledgeDocument`, then both register a real `DPL-KNOWLEDGE-INGEST-V1` run and write real per-stage evidence through the same seven-stage call sequence, proven against the real database.
- AC-072-001-03 — Given a duplicate ingestion of the same event, when submitted twice, then the second submission returns the run that already exists rather than creating a second one (a `@unique` constraint violation, not an application check).
- AC-072-001-04 — Given a document that fails partway, when ingested, then it is quarantined with the full nine-field BR-067 envelope plus a classification, and `RECORD_FAILED` is written so the document is never silently dropped.

## Implementation

- apps/server/src/platform/integrations/core/pipeline-tracking-contract.js; apps/server/src/platform/integrations/core/genesisrag17-executor.js; apps/server/src/modules/knowledge/genesisrag17-lineage-repository.js; apps/server/src/modules/knowledge/genesisrag17-contract.js

## Verification

- TC-072-001 — Stage catalog, run identity and quarantine on the real database (see [verification.md](../verification.md))
- TC-072-005 — Isolated end-to-end acceptance (fixed corpus thresholds) (see [verification.md](../verification.md))
