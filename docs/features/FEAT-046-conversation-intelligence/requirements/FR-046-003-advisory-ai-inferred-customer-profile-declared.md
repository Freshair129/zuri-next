---
id: FR-046-003
title: "Advisory AI-inferred Customer profile (declared)"
delivery: building
legacy: [FR-126]
relations:
  decided_by: [ADR-039]
  derived_from: [SEC-004]
---

# FR-046-003 — Advisory AI-inferred Customer profile (declared)

The system SHALL hold at most one advisory CustomerProfile per Customer with inferred
demographic band, occupation, motivations and budget signal plus `inferenceCount` and
`lastInferredAt`, with no scope column of its own, one writer in CRM, reads behind the
inbox's visibility, removal on PDPA erasure, and regenerability from retained
conversations; it SHALL never be used as identity or to merge channels.

## Acceptance criteria

- AC-046-003-01 — Given a Customer erased under PDPA, when erasure completes, then no CustomerProfile row remains for it.

## Implementation

- — (declared)
