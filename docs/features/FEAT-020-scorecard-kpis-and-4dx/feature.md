---
id: FEAT-020
title: Balanced scorecard KPIs & 4DX weekly execution
type: domain-feature
owner: DOM-PRJ
runtime: SRV-001
status: draft
delivery: declared
legacy: [FEAT-002, FR-269, FR-270]
relations:
  depends_on: [FEAT-019, FEAT-018]
  decided_by: [ADR-016]
---

# FEAT-020 — Balanced scorecard KPIs & 4DX weekly execution

## Summary

Phases 2 and 3 of the Business-goals model: ongoing Business health metrics grouped by Balanced
Scorecard perspective, shown as a scorecard on Business Home separate from the composite health
score; and the 4DX weekly ritual — at most two Wildly Important Goals, lead measures with weekly
values, personal weekly commitments and the weekly WIG session. Declared only: no model, route or UI
exists yet (the enum values and the Bangkok week calculator already exist).

## Scope

**In:** BusinessKpi + observations; `kpiStatus`; scorecard card; KPI-breached attention row; `isWig`
limit; lead measures + weekly values; weekly commitments; WIG sessions; session-incomplete attention
row.
**Out:** a `Cycle` or per-Business timezone model; domain-owned KPIs publishing into the scorecard;
automated observation ingestion; Slack/LINE reminders.

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-PRJ |
| Runtime owner | SRV-001 |

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-020-001](requirements/FR-020-001-business-kpis-grouped-by-perspective.md) | Business KPIs grouped by perspective | — |
| [FR-020-002](requirements/FR-020-002-4dx-weekly-execution.md) | 4DX weekly execution | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
