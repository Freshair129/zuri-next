---
id: FR-005-001
title: "Strategy-based Workstream progress with evidence and warnings"
delivery: live
legacy: [FR-010 (split 1/2 — calculators)]
relations:
  specified_by: [SDD-005, API-050]
  derived_from: [BR-050, NFR-005]
---

# FR-005-001 — Strategy-based Workstream progress with evidence and warnings

The system SHALL compute a Workstream's progress with the calculator named by its
`progressStrategy`, excluding CANCELLED and deleted items, and return
`{ percent, evidence{strategy, inputs…, formula}, warnings[] }` with percent clamped to
0–100 and rounded to one decimal:
TASK_WEIGHT = Σ weight(DONE) / Σ weight × 100 (also reporting open BUG defects);
RECORD_VALIDATION = Σ validated / Σ recordsTotal × 100 over item metrics (items without
`recordsTotal` excluded with a warning); WEIGHTED_PIPELINE = (won value + Σ open value ×
probability) / `viewConfig.revenueTarget` × 100, falling back to total pipeline value with
a warning; KPI_ATTAINMENT = Σ attainment × weight / Σ weight over `viewConfig.kpis`
(direction up: min(1, actual/target); down: clamp(2 − actual/target)); MILESTONE_READINESS
= Σ weight(DONE milestones) / Σ milestone weight; SLA_SCORE = mean of available signals
(completion ratio, slaMet/slaTotal); EXPANSION_READINESS = Σ weight(done actions) / Σ
action weight. Degenerate inputs (no items, zero weight, missing target) SHALL yield 0 with
an explanatory warning, never a division error. An unknown strategy SHALL yield 0 with
formula "unknown strategy".

## Acceptance criteria

- AC-005-001-01 — Given items of weight 2 (DONE), 1 (IN_PROGRESS) and 5 (CANCELLED), then TASK_WEIGHT percent = 66.7 and `plannedWeight = 3`.
- AC-005-001-02 — Given a deal of value 100 with no probability, then it counts at 0 and a warning names the deal.
- AC-005-001-03 — Given the same inputs twice, then outputs are identical (no clock, no randomness).

## Implementation

- apps/server/src/modules/project-manager/progress/strategies.js

## Verification

- TC-005-001 — Strategy calculators (see [verification.md](../verification.md))
