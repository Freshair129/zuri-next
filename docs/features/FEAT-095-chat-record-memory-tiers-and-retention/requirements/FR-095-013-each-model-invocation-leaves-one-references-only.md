---
id: FR-095-013
title: "Each model invocation leaves one references-only ContextReceipt"
part: FEAT-095-P08
owner: DOM-AGT
delivery: building
legacy: [FR-234 (split 2/2)]
relations:
  specified_by: [SDD-095]
  decided_by: [ADR-041]
---

# FR-095-013 — Each model invocation leaves one references-only ContextReceipt

The system SHALL record exactly one `ContextReceipt` per model invocation on the
execution trace — references (MSP, citations, records), a hash, the budget
`{max, used, trimmed}` and dropped entries, never content — and MSP's injection receipt
SHALL reference it.

## Acceptance criteria

- AC-095-013-01 — Given an answered turn, when its trace is read, then it has one ContextReceipt without any slice text.

## Implementation

- apps/server/src/modules/agent/context-composer.js; apps/server/src/modules/agent/server-line-answer.js; apps/server/src/modules/agent/line-execution-trace.js

## Verification

- TC-095-004 — Context Composer and receipts (see [verification.md](../verification.md))
