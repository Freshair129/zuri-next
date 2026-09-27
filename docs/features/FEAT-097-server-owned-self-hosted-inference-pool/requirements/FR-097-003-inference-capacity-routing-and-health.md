---
id: FR-097-003
title: "Inference capacity routing and health"
part: FEAT-097-P03
owner: DOM-AGT
delivery: declared
legacy: [FR-257]
relations:
  decided_by: [ADR-062]
  depends_on: [FEAT-097-P01]
---

# FR-097-003 — Inference capacity routing and health

The system SHALL admit model invocations only against current qualified-node
observations and an atomic per-engine capacity lease, preferring the first
eligible node and spilling new work to the next eligible node under capacity
and answer-deadline constraints, with no hidden hosted-provider fallback.

## Acceptance criteria

- AC-097-003-01 — Given two independent Server processes race to reserve the same engine's capacity, when both attempt a reservation, then at most one SHALL succeed, proved against PostgreSQL's serialized per-engine lock (not process-local counters).
- AC-097-003-02 — Given node A is eligible and within its calibrated capacity, when new work arrives, then A SHALL be preferred; when A is unhealthy, policy-ineligible or at capacity, new work SHALL spill to node B.
- AC-097-003-03 — Given a missing, stale or out-of-order node observation, when admission is evaluated, then that observation SHALL be treated as unknown, never as zero load or as extra available capacity.
- AC-097-003-04 — Given neither node can meet the remaining answer deadline or has free capacity, when admission is attempted, then the system SHALL defer the work within the existing job deadline or fail with a defined capacity/deadline code, with no cloud fallback.

## Implementation

- Not implemented — approved design only (legacy `FR-097-003`, `code: []`, `tests: []`)
