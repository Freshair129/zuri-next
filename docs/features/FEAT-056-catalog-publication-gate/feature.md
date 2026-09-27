---
id: FEAT-056
title: Catalog publication approval gate
type: domain-feature
owner: DOM-INT
runtime: SRV-001
status: draft
delivery: implemented
legacy: [FR-129]
relations:
  depends_on: [FR-060-001, FR-060-002]
  decided_by: [ADR-051]
---

# FEAT-056 — Catalog publication approval gate

## Summary

A run of the business-knowledge catalog pipeline (`DPL-SUPABASE-BUSINESS-KNOWLEDGE-V1`)
that produced a candidate projection should reach its publish stage (`DPS-PUBLISH`)
only after an authorized person recorded an APPROVED gate decision, and go to rollback
(`DPS-ROLLBACK`) on REJECTED. zuri-ai records the decision with the evidence the
reviewer saw and reports every publish that happened without prior approval. It
detects; it does not prevent (the executor lives outside Tier 1).

## Scope

**In:** gate decisions on the existing pipeline execution ledger with their evidence;
the compliance block of the pipeline monitor read.
**Out:** a second run table (refused — `IngestionRun` is acquisition evidence,
`PipelineRun` is the execution ledger); blocking the external executor; the knowledge
pipeline's own Stage 17 quality gate (FR-072-004, DOM-KNW).

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-INT |
| Runtime owner | SRV-001 |

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-056-001](requirements/FR-056-001-a-gate-decision-is-recorded-with-its.md) | A gate decision is recorded with its evidence | — |
| [FR-056-002](requirements/FR-056-002-publishes-without-prior-approval-are-reported.md) | Publishes without prior approval are reported | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
