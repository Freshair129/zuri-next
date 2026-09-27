---
id: FR-010-004
title: "Execution trace ledger"
delivery: live
legacy: [FR-069 (split 3/4 — trace ledger)]
relations:
  specified_by: [API-024]
  decided_by: [ADR-017]
  derived_from: [BR-006]
---

# FR-010-004 — Execution trace ledger

The system SHALL record every plan, bundle and meeting-action commit as one
`ProjectExecutionRun` (new `executionRunId` per run; `executionContractId`, `contractVersion`,
`sourceKind`, scope ids, `correlationId`, `idempotencyKey`, `requestHash`, bounded input
snapshot ≤ 256 KiB, status) with ordered `ProjectExecutionStep` rows (`executionStepId`,
`stepKey`, `sequence`, `attemptId`, input/output hashes, status, `failureCode`, `errorRef`,
`retryable`, `auditEventId`). A failed commit SHALL still persist a failed trace identifying the
failed step, with later steps not silently omitted. Authorized Project readers SHALL be able to
read a run with its steps.

## Acceptance criteria

- AC-010-004-01 — Given a committed plan, then its run has steps `plan.validate`, `plan.dry_run`, `plan.authorize`, `plan.commit` in sequence, each with an `attemptId`.
- AC-010-004-02 — Given a commit that times out, then the run is FAILED with `failureCode` on `plan.commit` and no business rows exist.

## Implementation

- apps/server/src/modules/project-manager/application/execution-trace.js; project-execution-trace-service.js; apps/server/src/app/api/projects/[id]/execution-runs/[executionRunId]/route.js; …/replay/route.js

## Verification

- TC-010-004 — Trace ledger and replay (see [verification.md](../verification.md))
