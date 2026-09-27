---
id: FR-060-001
title: "A pipeline run is created once, with a stable identity envelope"
delivery: implemented
legacy: [FR-071 (split 1/5)]
relations:
  specified_by: [SDD-060, API-159]
  decided_by: [ADR-051]
---

# FR-060-001 — A pipeline run is created once, with a stable identity envelope

The system SHALL create a `PipelineRun` keyed by a caller-supplied
`idempotencyKey`, resolving the Business/Tenant server-side (never from a
caller-selected override), stamping `executionRunId` as the canonical run id
distinct from `idempotencyKey`/`correlationId`/`bootstrapBatchId`/
`auditEventId`, and pre-creating one `PipelineStep` per stage of the run's own
`dataPipelineDefinitionId` catalog (never a different definition's catalog).
A repeated call with the same `idempotencyKey` and the same request payload
hash SHALL return the existing run unchanged; the same key with a different
payload hash SHALL be refused `409`.

## Acceptance criteria

- AC-060-001-01 — Given a run created for `DPL-SUPABASE-BUSINESS-KNOWLEDGE-V1`, when its steps are read, then they are exactly that definition's ten `DPS-*` stages, never the knowledge definition's seventeen.
- AC-060-001-02 — Given the same `idempotencyKey` submitted twice with identical input, when the second call runs, then it returns `UNCHANGED` with the first run's `executionRunId`, creating nothing.
- AC-060-001-03 — Given the same `idempotencyKey` submitted with a different input payload, when the second call runs, then it is refused `409` and the original run is untouched.

## Implementation

- apps/server/src/platform/integrations/core/pipeline-tracking-service.js (`createPipelineRun`), core/pipeline-tracking-contract.js; apps/server/src/app/api/pipelines/runs/route.js

## Verification

- TC-060-001 — Run creation, idempotency and per-definition catalog (see [verification.md](../verification.md))
