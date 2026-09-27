---
id: FR-060-002
title: "Stage, record, heartbeat and gate evidence is appended, never overwritten"
delivery: implemented
legacy: [FR-071 (split 2/5)]
relations:
  specified_by: [SDD-060, API-159]
  decided_by: [ADR-051]
---

# FR-060-002 — Stage, record, heartbeat and gate evidence is appended, never overwritten

The system SHALL accept validated stage/record/heartbeat/gate events scoped
to an existing run, applying `assertStatusTransition` before any status
change, aggregating `records_in`/`records_out`/`records_failed` onto the
owning step from what the caller reports, and persisting gate `evidenceJson`
verbatim. Every event SHALL be idempotent on its own request key. A missing
or stale heartbeat SHALL surface as `UNKNOWN`, never silently promoted to a
success status. `errorRef` SHALL be constrained to a bounded reference-token
alphabet, never a raw stack trace or quoted document fragment.

## Acceptance criteria

- AC-060-002-01 — Given the same stage-event request submitted twice, when the second arrives, then the step's evidence is unchanged and no second effect is applied.
- AC-060-002-02 — Given a step whose latest heartbeat is older than the staleness window (`PIPELINE_STALE_AFTER_MS`), when the monitor reads it, then it reports `UNKNOWN`, not `SUCCEEDED`.
- AC-060-002-03 — Given an `errorRef` value containing a raw sentence with spaces, when the event is validated, then it is refused.

## Implementation

- apps/server/src/platform/integrations/core/pipeline-tracking-service.js (`recordPipelineEvent`); apps/server/src/app/api/pipelines/runs/[executionRunId]/events/route.js

## Verification

- TC-060-002 — Event recording, staleness and redacted error references (see [verification.md](../verification.md))
