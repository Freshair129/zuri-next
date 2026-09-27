---
id: SDD-020
title: "Balanced scorecard KPIs & 4DX weekly execution — design"
---

# SDD-020 — Balanced scorecard KPIs & 4DX weekly execution design

- **Components (planned):** CMP-009 (writers `setGoalWig`, KPI and 4DX writers), CMP-022 (`kpiStatus`; existing `week.js` `weekStartFor`), CMP-006 (scorecard, WIG card, attention rows).
- **Data owned (planned):** BusinessKpi, BusinessKpiObservation, BusinessLeadMeasure, BusinessLeadMeasureValue, BusinessWeeklyCommitment, BusinessWigSession; existing `BusinessGoal.isWig`, `BusinessGoal.perspective`.
- **Constraint:** model names carry the `Business` prefix (a bare `Kpi` collides with a UI component and ORM accessor naming).

## Implementation map

| Requirement | Current code (legacy repo path) |
|---|---|
| FR-020-001 | none — only perspective enum values in apps/server/src/lib/validation/enums.js |
| FR-020-002 | none — only `weekStartFor` in apps/server/src/modules/project-manager/progress/week.js and `BusinessGoal.isWig` column |
