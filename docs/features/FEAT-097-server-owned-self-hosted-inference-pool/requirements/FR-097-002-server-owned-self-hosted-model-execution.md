---
id: FR-097-002
title: "Server-owned self-hosted model execution"
part: FEAT-097-P02
owner: DOM-AGT
delivery: declared
legacy: [FR-256]
relations:
  decided_by: [ADR-062]
  depends_on: [FEAT-097-P01, FEAT-097-P03]
---

# FR-097-002 — Server-owned self-hosted model execution

The system SHALL execute authorized LINE answers through a qualified
self-hosted inference pool without requiring an Edge executor, while
preserving the existing deterministic-answer, tool-authority,
knowledge/memory, receipt and delivery boundaries.

## Acceptance criteria

- AC-097-002-01 — Given a SERVER account explicitly bound to a qualified self-hosted pool, when a model-needed turn is admitted, then the system SHALL call only an eligible private node — even with Edge stopped — and SHALL never transmit an Edge pairing credential to that node.
- AC-097-002-02 — Given an existing `LOCAL_ONLY` or external-provider account, when this capability is introduced, then that account's existing behavior SHALL remain unchanged.
- AC-097-002-03 — Given the self-hosted model returns a tool call, when Agent processes it, then it SHALL validate the tool name and arguments against the existing registry/schema and execute only capabilities the caller is already authorized for.
- AC-097-002-04 — Given a disconnect, cancellation or ambiguous post-dispatch result, when the attempt is later resolved, then it SHALL be fenced so it cannot cause a duplicate tool write or a duplicate LINE answer.

## Implementation

- Not implemented — approved design only (legacy `FR-097-002`, `code: []`, `tests: []`)
