---
id: FR-007-003
title: "Transactional commit with audit and idempotency"
delivery: live
legacy: [FR-012 (split 3/3 — commit)]
relations:
  specified_by: [API-038]
  derived_from: [BR-006, BR-054, SEC-003]
---

# FR-007-003 — Transactional commit with audit and idempotency

The system SHALL commit a plan only after re-running the dry run, inside one database
transaction (bounded wait 10 s, timeout 120 s), upserting all entities, preserving the target
Space's Business as Project owner, recording AuditEvents and a `PlanImportReceipt`; on any
failure it SHALL roll back entirely. For schemaVersion 1.2 the `trace.idempotencyKey` SHALL
bind to the normalized payload hash: a replay with the same key and hash returns the prior
result; the same key with a different hash is refused.

## Acceptance criteria

- AC-007-003-01 — Given a failure while inserting the 9th Workstream, then no row of the plan exists afterwards.
- AC-007-003-02 — Given the same 1.2 envelope committed twice, then the second call returns the first receipt and writes nothing.
- AC-007-003-03 — Given the same key with a changed payload, then `committed: false` with "already used with a different payload".

## Verification

- TC-007-002 — Dry run, commit, rollback and idempotency (see [verification.md](../verification.md))
