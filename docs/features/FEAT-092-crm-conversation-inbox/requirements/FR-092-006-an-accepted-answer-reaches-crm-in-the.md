---
id: FR-092-006
title: "An accepted answer reaches CRM in the job's own transaction"
part: FEAT-092-P03
owner: DOM-LOA
delivery: live
legacy: [FR-093 (split, server-transport caller, the retired edge receipt route is crosswalked)]
relations:
  specified_by: [SDD-092, API-117]
  depends_on: [API-117]
---

# FR-092-006 — An accepted answer reaches CRM in the job's own transaction

The system SHALL, when a LINE conversation job is `ACCEPTED` by LINE, fence the job
against a concurrent PDPA erasure (same version, error code not `PDPA_ERASURE`), call
the CRM acceptance writer with the job's scope, inbound message, answer text, source
`STACK` and provider ids, trace `OUTBOUND_RECORDED` with provider acceptance
`ACCEPTED_BY_LINE` and recipient delivery status `UNKNOWN`, clear the sealed reply token
and move the job to `RECORDED` — all in one transaction; the job ledger never writes
Message directly.

## Acceptance criteria

- AC-092-006-01 — Given a job erased under PDPA after acceptance, when reconciliation runs, then no OUTBOUND Message is written.
- AC-092-006-02 — Given an accepted job, when reconciled, then it is `RECORDED` and its CRM message id appears in the trace.

## Implementation

- apps/server/src/modules/line-oa-studio/application/line-conversation-jobs.js

## Verification

- TC-092-004 — Job ledger records accepted answers (see [verification.md](../verification.md))
