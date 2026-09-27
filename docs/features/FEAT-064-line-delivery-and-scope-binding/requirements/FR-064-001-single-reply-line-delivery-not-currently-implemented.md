---
id: FR-064-001
title: "Single-reply LINE delivery (not currently implemented)"
delivery: building
legacy: [FR-050]
relations:
  specified_by: [none]
  decided_by: [ADR-060]
---

# FR-064-001 — Single-reply LINE delivery (not currently implemented)

The system SHALL, for the legacy transport-bound webhook seam, produce at
most one model request and one LINE reply per signature-verified normalized
event, with durable-or-explicitly-bounded dedupe, a kill switch, a bounded
timeout, and truthful `ACCEPTED_BY_LINE` versus display/read-unknown receipt
semantics — never claiming a customer read or displayed a message the
transport itself cannot confirm.

## Acceptance criteria

- AC-064-001-01 — Given the same normalized event delivered twice (redelivery), when the seam processes it, then at most one model request and one reply are produced (idempotent on the event's dedupe key).
- AC-064-001-02 — Given a receipt state that cannot be confirmed as read by the customer, when the seam reports it, then the label is `DISPLAYED_UNKNOWN`/`READ_UNKNOWN`, never a false `ACCEPTED_BY_LINE` used as a stand-in for read/displayed.

## Implementation

- *(removed — see §9)*
