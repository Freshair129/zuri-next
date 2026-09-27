---
id: FEAT-018
title: Business Home dashboard
type: domain-feature
owner: DOM-PRJ
runtime: SRV-001
status: draft
delivery: live
legacy: [FEAT-002, FR-035, FR-060, ADR-013]
relations:
  depends_on: [FEAT-003, FEAT-005, FEAT-019, FR-031-003, FR-024-003]
  decided_by: [ADR-004, ADR-001]
---

# FEAT-018 — Business Home dashboard

## Summary

The selected Business's operational home (`/overview`): a briefing line, KPI tiles, strategy,
per-domain health and an attention queue ordered by impact. It is a shell-level, non-owning read
projection — every figure is recomputed from the owning domain's read model, nothing is stored, and
domains without a module appear as reserved slots, never as zero or invented numbers.

## Scope

**In:** Business-first Overview; composite health covering live domains only; per-domain health
states; attention queue from real signals; briefing line; shortcuts to enabled domains; strategy
card (content from FEAT-019).
**Out:** Goals & KPIs / Risks & Alerts / Reports sub-pages; revenue, CAC, SLA, pipeline, MRP figures
(no source); a Group roll-up across Businesses; AI-generated briefing.

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-PRJ |
| Runtime owner | SRV-001 |

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-018-001](requirements/FR-018-001-business-first-overview.md) | Business-first Overview | — |
| [FR-018-002](requirements/FR-018-002-non-owning-business-home-projection.md) | Non-owning Business Home projection | — |
| [FR-018-003](requirements/FR-018-003-attention-queue-and-briefing.md) | Attention queue and briefing | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
