---
id: FR-095-010
title: "Projections are receipted and stay off until MSP can erase (declared)"
part: FEAT-095-P06
owner: DOM-AGT
delivery: building
legacy: [FR-231 (split 2/2)]
relations:
  specified_by: [SDD-095]
  decided_by: [ADR-041]
---

# FR-095-010 — Projections are receipted and stay off until MSP can erase (declared)

The system SHALL record every projection MSP acknowledges as a `MemoryProjectionReceipt`
(CRM message, direction, MSP thread/session/message ids) in the transaction that settles
its delivery state, SHALL refuse projection with `MSP_THREAD_CONTRACT_UNAVAILABLE` until
MSP provides thread and erase tools, and SHALL treat `ZURI_MSP_THREAD_MEMORY_ENABLED` as a
kill switch rather than an opt-in.

## Acceptance criteria

- AC-095-010-01 — Given MSP without an erase tool, when a projection is attempted, then it is refused with `MSP_THREAD_CONTRACT_UNAVAILABLE`.

## Implementation

- — (declared)
