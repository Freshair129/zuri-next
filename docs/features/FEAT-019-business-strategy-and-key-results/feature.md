---
id: FEAT-019
title: Business strategy, goals & key results
type: domain-feature
owner: DOM-PRJ
runtime: SRV-001
status: draft
delivery: implemented
legacy: [FEAT-002, FR-041, FR-059, FR-268, FR-271, ADR-101]
relations:
  depends_on: [FEAT-003, FEAT-005]
  decided_by: [ADR-016, ADR-004]
---

# FEAT-019 — Business strategy, goals & key results

## Summary

A Business's strategy: one or more Roadmaps, each with two or three ordered horizons, holding
Business Goals (OKR Objectives) that Projects are linked to. A Goal may carry measurable Key
Results with weekly check-ins; once it has any, its progress is derived from them and can no
longer be typed by hand. Owners edit strategy on Business Home; every Key Result is checked
against the deterministic part of SMART.

## Scope

**In:** strategy read model; Roadmap/horizon create and update; Goal create/update; Goal ↔ Project
links; Key Results; weekly check-ins; goal progress roll-up; SMART checks.
**Out:** Balanced-Scorecard KPIs and 4DX (FEAT-020, declared); Key-Result-owner write grants
(future); risks.

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-PRJ |
| Runtime owner | SRV-001 |

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-019-001](requirements/FR-019-001-business-strategy-read-model.md) | Business strategy read model | — |
| [FR-019-002](requirements/FR-019-002-roadmaps-and-horizons.md) | Roadmaps and horizons | — |
| [FR-019-003](requirements/FR-019-003-business-goals.md) | Business goals | — |
| [FR-019-004](requirements/FR-019-004-goal-project-links.md) | Goal ↔ Project links | — |
| [FR-019-005](requirements/FR-019-005-key-results.md) | Key Results | — |
| [FR-019-006](requirements/FR-019-006-weekly-check-ins-roll-up-goal-progress.md) | Weekly check-ins roll up goal progress | — |
| [FR-019-007](requirements/FR-019-007-smart-checks.md) | SMART checks | — |
| [NFR-019-001](requirements/NFR-019-001-deterministic-strategy-calculators.md) | Deterministic strategy calculators | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
