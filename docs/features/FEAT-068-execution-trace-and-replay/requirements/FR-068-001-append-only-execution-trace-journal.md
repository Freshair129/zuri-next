---
id: FR-068-001
title: "Append-only execution trace journal"
delivery: implemented
legacy: [FR-171 (split 1 of 3 — journal write contract)]
relations:
  specified_by: [none]
  decided_by: [ADR-061]
---

# FR-068-001 — Append-only execution trace journal

The system SHALL append one `AgentTraceEvent` row per observable turn
occurrence, restricted to a closed, versioned event-kind vocabulary
(`TURN_RECEIVED`, `MODEL_STARTED/COMPLETED/FAILED`, `TOOL_INVOKED/RESULT`,
`ACTION_STARTED/RESULT`, `EVIDENCE_SELECTED`, `MEMORY_WRITTEN`,
`MEMORY_DELIVERY_*`, `SEND_STARTED/RESULT`, `OUTBOUND_RECORDED`,
`CONTEXT_COMMITTED`, `CONTEXT_RECEIPT`, `ARTIFACT_CREATED`,
`RETENTION_TOMBSTONE`), each carrying a UUID `turnId`, an optional
`executionId`, a canonical-JSON `payloadJson` capped at 1 MiB, and a
`(tenantId, businessId, idempotencyKey)` uniqueness key. The system SHALL
reject a payload containing a secret-shaped field name (token, credential,
password, replyToken, …) before it is ever serialized, and SHALL refuse
any append against a turn that already carries a `RETENTION_TOMBSTONE`.

## Acceptance criteria

- AC-068-001-01 — Given a payload containing a key that normalizes to `replytoken` or `channelsecret`, when `appendTraceEvent` runs, then it throws `EXECUTION_TRACE_SECRET_FIELD` and no row is written.
- AC-068-001-02 — Given the same `(tenantId, businessId, idempotencyKey)` submitted twice with an identical payload and identity, when the second append runs, then the existing row is returned unchanged (idempotent); given the same key with a *different* payload or identity, it throws `EXECUTION_TRACE_IDEMPOTENCY_CONFLICT` (409).
- AC-068-001-03 — Given a turn whose job carries `errorCode: 'PDPA_ERASURE'`, when an append is attempted, then it throws `EXECUTION_TRACE_TURN_REDACTED` (409) rather than adding a new event to a closed turn.

## Implementation

- `apps/server/src/modules/agent/execution-trace.js`, `apps/server/src/modules/agent/memory-trace-contract.js`, `apps/server/src/modules/agent/line-execution-trace.js`
