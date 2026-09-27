---
id: FEAT-090
title: Marketing Insights
type: domain-feature
owner: DOM-MKT
runtime: SRV-001
status: approved
delivery: building
legacy: []
relations:
  depends_on: []
  decided_by: []
---

# FEAT-090 — Marketing Insights

## Summary

A read-only reporting surface at `/growth/insights`: a signed-in Business member
lists the brands they may open, reads a brand's metric summary, one metric's daily
series (and its CSV export), and content performance — all sourced from one snapshot
so a chart and its export never disagree, and an unknown value is never shown as 0.
A companion refresh flow (declared, not yet implemented) will request and track a
sync run. Newer than this pass's input slice; declared directly against
`docs/PRD-SDD-v1.0.md` FR-090-001/FR-276 per this pass's brief.

## Scope

**In:** brand list, metric summary, per-metric daily series, CSV export of that
series, content performance — all read-only, snapshot-consistent, quality-carrying.
**In (declared, not implemented):** refresh request/state read, request coalescing,
retry-once-on-failure, never replacing the last complete snapshot with a failed/
partial one.
**Out:** any live provider call from a read/render/export path; persistence of real
brand data (routes answer 503 until a persistent repository lands); the
workflow-engine adapter behind `SyncOrchestratorPort`.

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-MKT |
| Runtime owner | SRV-001 |

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-090-001](requirements/FR-090-001-read-only-marketing-insights-surface.md) | Read-only Marketing Insights surface | — |
| [FR-090-002](requirements/FR-090-002-insights-refresh-request-and-state-declared.md) | Insights refresh request and state (declared) | — |
| [NFR-090-001](requirements/NFR-090-001-snapshot-consistency.md) | Snapshot consistency | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
