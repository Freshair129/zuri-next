---
id: FR-046-004
title: "Daily Sales Brief (declared)"
delivery: building
legacy: [FR-128]
relations:
  decided_by: [ADR-039]
  depends_on: [API-136]
  derived_from: [BR-056]
---

# FR-046-004 — Daily Sales Brief (declared)

The system SHALL produce one brief per `(businessId, briefDate)` (tenant denormalized)
aggregating that day's analyses — conversation and contact counts, engagement-state
breakdown, top CTAs and tags — recomputed from analyses, never incremented; with
delivery lifecycle `PENDING → PROCESSED → SENT | FAILED`, delivered by LINE push through
the existing server transport (no second LINE writer) to recipients resolved from
Membership authority for the Business.

## Acceptance criteria

- AC-046-004-01 — Given a day's analyses re-run, when the brief is recomputed, then its counts equal a fresh aggregation, not a sum of both runs.

## Implementation

- — (declared)
