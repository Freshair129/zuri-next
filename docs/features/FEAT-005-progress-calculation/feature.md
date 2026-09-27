---
id: FEAT-005
title: Progress calculation & explain
type: domain-feature
owner: DOM-PRJ
runtime: SRV-001
status: draft
delivery: live
legacy: [FR-010, FR-011]
relations:
  depends_on: [FEAT-003]
  decided_by: []
---

# FEAT-005 — Progress calculation & explain

## Summary

Progress is never `tasks_done / tasks_total`. Each Workstream is measured by the strategy
its execution mode implies (task weight, record validation, weighted pipeline, KPI
attainment, milestone readiness, SLA score, expansion readiness), returning a percent,
the evidence behind it and warnings; Projects roll up as a weighted mean of their
Workstreams. Every surface (cards, dashboards, Business Home, Explain panel) calls the same
pure calculators, so no two screens disagree.

## Scope

**In:** seven pure strategy calculators; required-gate cap; Project and Business/portfolio
roll-up; progress read APIs; the "Explain" UI; advisory `progressCache`.
**Out:** Business goal / Key Result progress (FEAT-019); readiness scores of the
platform (FEAT-022).

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-PRJ |
| Runtime owner | SRV-001 |

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-005-001](requirements/FR-005-001-strategy-based-workstream-progress-with-evidence-and.md) | Strategy-based Workstream progress with evidence and warnings | — |
| [FR-005-002](requirements/FR-005-002-required-gates-cap-completion-at-99.md) | Required gates cap completion at 99 % | — |
| [FR-005-003](requirements/FR-005-003-weighted-roll-up.md) | Weighted roll-up | — |
| [FR-005-004](requirements/FR-005-004-explain-progress.md) | Explain progress | — |
| [NFR-005-001](requirements/NFR-005-001-deterministic-calculators.md) | Deterministic calculators | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
