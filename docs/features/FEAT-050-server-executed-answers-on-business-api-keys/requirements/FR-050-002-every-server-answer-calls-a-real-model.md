---
id: FR-050-002
title: "Every server answer calls a real model; no canned substitute reaches a customer"
delivery: building
legacy: [FR-265 (split 2/2)]
relations:
  specified_by: [EVT-002]
  decided_by: [ADR-047]
---

# FR-050-002 — Every server answer calls a real model; no canned substitute reaches a customer

The system SHALL resolve the Business's own model credential (or the
installation's Phase-1 fallback only when the Business has none) for every
server-answered LINE message, and SHALL NOT reach the deterministic canned
answerer (`createDeterministicBusinessModel`) from a production answer path.

## Acceptance criteria

- AC-050-002-01 — Given a server-enabled account with no Business model credential and no Phase-1 fallback configured, when a message is admitted for a model answer, then the job fails closed with a distinguishable error code rather than answering with a canned reply.
- AC-050-002-02 — Given a Business with a validated `MODEL_PROVIDER` credential, when a customer message is answered, then the call is made under that credential, never the Phase-1 fallback.

## Implementation

- `apps/server/src/modules/agent/server-line-answer.js`

## Verification

- TC-050-002 — Real-model-only answer path (see [verification.md](../verification.md))
