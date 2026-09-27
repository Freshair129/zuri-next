---
id: FEAT-076
title: Data pipeline map
type: domain-feature
owner: DOM-KNW
runtime: SRV-001
status: draft
delivery: implemented
legacy: [FR-212, FR-213, FR-214, FR-215]
relations:
  depends_on: [FR-060-001, FR-060-002, FR-060-003, FR-060-004, FR-060-005, FR-022-001, FR-022-002, FR-022-003, FR-018-002, FR-018-003, FR-024-003]
  decided_by: [ADR-070]
---

# FEAT-076 — Data pipeline map

## Summary

Opens the domain's one navigation slot — Knowledge (GKS), base path `/knowledge` — with
a generated, validated registry of where data enters zuri-ai, where it is combined, and
who receives it: a node/edge/chain graph derived from the filesystem and the
requirements snapshot, rendered as a hand-rolled SVG node-edge view with a live,
Business-scoped health overlay per edge. Meta/observability, not itself a data path —
this feature reads other domains' evidence, it does not produce any.

## Scope

**In:** the hand-maintained `docs/DATA-PIPELINE-MAP.md` registry and the generator that
derives surface levels, build statuses and FEATs and fails by name on any
contradiction; the committed runtime projection the server renders from; the Knowledge
(GKS) domain key and its Dashboard; the Data Pipeline Map view (columns, filters,
detail panel, list view, keyboard reachability); the later, Business-scoped live
overlay reading four owning-domain ledgers/job tables for per-edge counts and last-run
time.

**Out:** every other feature this map merely indexes — it holds no Tenant/Business/
Person data of its own and executes nothing. The knowledge base console
(`FEAT-073`), which is the next page planned for this same slot but a distinct
feature. Any GKS/MSP/GenesisBlockDB runtime, model or store — the slot's label names
the authority the lane consumes, never a claim that GKS is a zuri-ai domain.

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-KNW |
| Runtime owner | SRV-001 |

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-076-001](requirements/FR-076-001-data-pipeline-registry-and-generated-projection.md) | Data pipeline registry and generated projection | — |
| [FR-076-002](requirements/FR-076-002-data-pipeline-map-view.md) | Data Pipeline Map view | — |
| [FR-076-003](requirements/FR-076-003-knowledge-gks-navigation-slot.md) | Knowledge (GKS) navigation slot | — |
| [FR-076-004](requirements/FR-076-004-live-pipeline-health-overlay.md) | Live pipeline health overlay | — |
| [NFR-076-001](requirements/NFR-076-001-committed-projection-freshness.md) | Committed-projection freshness | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
