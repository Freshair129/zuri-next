---
id: FEAT-055
title: SoT pipeline console
type: domain-feature
owner: DOM-INT
runtime: SRV-001
status: draft
delivery: live
legacy: [FEAT-011, FR-099, FR-100, FR-101]
relations:
  depends_on: [FR-060-003, FR-027-001]
  decided_by: [ADR-054, ADR-055]
---

# FEAT-055 — SoT pipeline console

## Summary

The business-wide Source-of-Truth (SoT) data pipeline runs in an external data plane.
This console lets people see its phase plan with evidence-derived status, approve or
reject the facts the data plane submits (price rows, entities, file classifications,
phase gates), and lets the data plane pull decided facts back — zuri-ai never writes
into the retrieval substrate. Surfaces: `/platform/sot-pipeline` (plan board),
`/platform/sot-pipeline/inbox` (approval inbox), `/platform/sot-pipeline/graph`.

## Scope

**In:** plan file validation and derived status; the SotDecision queue (submit, list,
decide, export); the graph view.
**Out:** the data plane itself; the pipeline run/event/replay ledger itself
(FEAT-060, `FR-060-001..004`); data-plane key minting (FR-027-001,
DOM-IAM).

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-INT |
| Runtime owner | SRV-001 |

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-055-001](requirements/FR-055-001-the-phase-plan-is-validated-data.md) | The phase plan is validated data | — |
| [FR-055-002](requirements/FR-055-002-phase-status-is-derived-never-typed.md) | Phase status is derived, never typed | — |
| [FR-055-003](requirements/FR-055-003-the-data-plane-submits-decisions-idempotently.md) | The data plane submits decisions idempotently | — |
| [FR-055-004](requirements/FR-055-004-a-human-decides-in-the-browser-immutably.md) | A human decides in the browser, immutably | — |
| [FR-055-005](requirements/FR-055-005-the-data-plane-pulls-decided-facts-by.md) | The data plane pulls decided facts by cursor | — |
| [FR-055-006](requirements/FR-055-006-graph-view-of-the-same-plan.md) | Graph view of the same plan | — |
| [NFR-055-001](requirements/NFR-055-001-batch-bounds.md) | Batch bounds | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
