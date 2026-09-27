---
id: FR-060-004
title: "Replay creates new, linked lineage and never overwrites the source"
delivery: implemented
legacy: [FR-071 (split 4/5)]
relations:
  specified_by: [SDD-060, API-159]
  decided_by: [ADR-051]
---

# FR-060-004 — Replay creates new, linked lineage and never overwrites the source

The system SHALL let an installation operator request `FULL`, `FAILED_STAGE`,
`FAILED_RECORDS` or `PROVENANCE_FILTERED` replay of an existing run, creating
a new `PipelineRun` (and steps) linked by `replayOfExecutionRunId`/
`replayOfExecutionStepId`/`replayOfPipelineRecordId`, never mutating the
source run's rows. A `FAILED_STAGE` replay SHALL be refused `409` unless the
named step actually failed in the source run; an optional source hash
mismatch SHALL be refused `409`. Replay requests SHALL be idempotent on their
own `idempotencyKey`.

## Acceptance criteria

- AC-060-004-01 — Given a `FAILED_STAGE` replay naming a step that succeeded, when requested, then it is refused `409` and no replay run is created.
- AC-060-004-02 — Given a completed replay run, when the source run is read again, then its own rows and status are unchanged.

## Implementation

- apps/server/src/platform/integrations/core/pipeline-tracking-service.js (`requestPipelineReplay`); apps/server/src/app/api/pipelines/runs/[executionRunId]/replay/route.js

## Verification

- TC-060-004 — Replay lineage and refusal rules (see [verification.md](../verification.md))
