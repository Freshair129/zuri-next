---
id: FEAT-060
title: Pipeline execution ledger, replay and worker bridge
type: domain-feature
owner: DOM-INT
runtime: SRV-001
status: draft
delivery: implemented
legacy: [FR-071, ADR-040]
relations:
  depends_on: []
  decided_by: [ADR-051, ADR-058]
---

# FEAT-060 — Pipeline execution ledger, replay and worker bridge

## Summary

The one server-owned, append-only execution ledger that every data pipeline
definition (the Supabase business-knowledge migration, knowledge ingestion,
and any future definition) writes its run/stage/record/gate evidence to, with
authorized full/partial replay as new lineage, and the one authenticated
worker transport (Codex-mediated, over `data_pipeline.*` MCP tools) an
external agent uses to create runs and submit that evidence without holding a
Supabase `service_role` key or an unrestricted Zuri write token. `FEAT-055`
(SoT pipeline console) and `FEAT-056` (catalog publication gate) both
read this ledger; neither owns it.

## Scope

**In:** `PipelineRun`/`PipelineStep` creation with the full identity envelope;
append-only stage/record/heartbeat/gate event recording with exact
idempotency; the scope-filtered monitor read; full/failed-stage/failed-record/
provenance-filtered replay as new, linked lineage; the `data_pipeline.*` MCP
worker bridge (`run_create`, `document_stage`, `event_record`, `monitor_read`,
`replay_request`) in its approved `EVIDENCE_ONLY` rollout.
**Out:** the SoT plan board and decision queue (FEAT-055); the catalog
publication gate decision and compliance detector (FEAT-056); the
knowledge ingestion pipeline's own stage composition (`FR-072-001, FR-072-002`,
`FR-071-001`, `FR-071-002`, DOM-KNW) and its live-health overlay
(`FR-076-004`, DOM-KNW); canonical Supabase apply, Product/Customer
promotion and publish (still gated per ADR-058 D5).

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-INT |
| Runtime owner | SRV-001 |

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-060-001](requirements/FR-060-001-a-pipeline-run-is-created-once-with.md) | A pipeline run is created once, with a stable identity envelope | — |
| [FR-060-002](requirements/FR-060-002-stage-record-heartbeat-and-gate-evidence-is.md) | Stage, record, heartbeat and gate evidence is appended, never overwritten | — |
| [FR-060-003](requirements/FR-060-003-the-monitor-read-is-scope-filtered-and.md) | The monitor read is scope-filtered and never leaks secrets | — |
| [FR-060-004](requirements/FR-060-004-replay-creates-new-linked-lineage-and-never.md) | Replay creates new, linked lineage and never overwrites the source | — |
| [FR-060-005](requirements/FR-060-005-codex-mediated-worker-bridge-submits-evidence-without.md) | Codex-mediated worker bridge submits evidence without a direct Supabase or service-role credential | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
