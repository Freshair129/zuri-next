---
id: FR-095-012
title: "One composer builds every prompt context, authorization first"
part: FEAT-095-P08
owner: DOM-AGT
delivery: building
legacy: [FR-234 (split 1/2)]
relations:
  specified_by: [SDD-095]
  decided_by: [ADR-041]
---

# FR-095-012 — One composer builds every prompt context, authorization first

The system SHALL assemble each LINE turn's model context in one agent-lane module from
the server-built authorization context, MSP packet slices with provenance, knowledge
evidence with citation ids, CRM/ERP operational facts and the account policy: an
unauthorized request SHALL yield an empty packet (never a partial one); priority is
record > knowledge > memory, memory contradicting a record is dropped
`SUPERSEDED_BY_RECORD`, slices of another thread are dropped `THREAD_SCOPE_MISMATCH`,
passport/cross-thread slices in a non-direct audience `AUDIENCE_SCOPE_DENIED`, and one
prompt-wide budget (default 4 000 characters) trims by priority, reporting every trim
`BUDGET_TRIMMED`.

## Acceptance criteria

- AC-095-012-01 — Given an unauthorized context, when composed, then the packet is empty and the receipt shows zero used budget.
- AC-095-012-02 — Given a memory slice stating a price that a CRM/ERP record contradicts, when composed, then the slice is dropped `SUPERSEDED_BY_RECORD`.

## Implementation

- apps/server/src/modules/agent/context-composer.js; apps/server/src/modules/agent/server-line-answer.js; apps/server/src/modules/agent/line-execution-trace.js

## Verification

- TC-095-004 — Context Composer and receipts (see [verification.md](../verification.md))
