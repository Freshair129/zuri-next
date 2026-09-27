---
id: FR-010-005
title: "Append-only replay"
delivery: live
legacy: [FR-069 (split 4/4 — replay)]
relations:
  specified_by: [API-025]
  decided_by: [ADR-017]
---

# FR-010-005 — Append-only replay

The system SHALL replay a recorded run (full, or partial by step keys) only for a caller who
may write the Project, by rebuilding the plan (or bundle) from the source run's snapshot and
committing it through the normal pipeline, re-validating contract, authorization and hashes,
producing a NEW run, steps and attempts linked by `replayOfExecutionRunId`/
`replayOfExecutionStepId`; source records SHALL never be mutated. A partial plan replay SHALL
include `plan.commit`; a partial bundle replay SHALL select every bundle step.

## Acceptance criteria

- AC-010-005-01 — Given a FAILED run, when replayed in full, then a new `executionRunId` exists whose `replayOfExecutionRunId` is the source and the source is unchanged.
- AC-010-005-02 — Given a partial replay without `plan.commit`, then 400 `TRACE_PARTIAL_STEP_NOT_REPLAYABLE`.

## Verification

- TC-010-004 — Trace ledger and replay (see [verification.md](../verification.md))
