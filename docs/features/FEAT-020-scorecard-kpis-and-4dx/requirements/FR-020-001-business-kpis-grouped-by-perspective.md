---
id: FR-020-001
title: "Business KPIs grouped by perspective"
delivery: declared
legacy: [FR-269]
relations:
  decided_by: [ADR-016]
  derived_from: [BR-004]
---

# FR-020-001 — Business KPIs grouped by perspective

The system SHALL let an owner define Business-scoped KPIs (name, exactly one perspective — Financial,
Customer, Internal Process, Learning & Growth — unit, target, direction, cadence) and record an
append-only observation series; a pure `kpiStatus(kpi, latestObservation)` SHALL classify OK/WARN/BAD;
Business Home SHALL show a scorecard grouped strictly by perspective (a KPI without perspective in its own
labelled group), a KPI with no observation as "no signal", and a KPI-breached attention row — never
folding KPI status into the composite health score.

## Acceptance criteria

- AC-020-001-01 — Given a KPI with no observation, then it renders "no signal", not 0 and not breached.
- AC-020-001-02 — Given the composite health score, then it is unchanged by any KPI.

## Implementation

- none — only perspective enum values in apps/server/src/lib/validation/enums.js
