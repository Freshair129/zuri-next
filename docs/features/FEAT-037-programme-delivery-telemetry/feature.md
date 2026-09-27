---
id: FEAT-037
title: Programme Delivery Telemetry
type: domain-feature
owner: DOM-PLT
runtime: SRV-001
status: approved
delivery: live
legacy: [FEAT-034, FR-216, FR-217, FR-218, FR-219]
relations:
  depends_on: []
  decided_by: [ADR-034]
---

# FEAT-037 — Programme Delivery Telemetry

## Summary

Phase cards on the operator programme board show planned counts, size and
effort estimate beside the time and tokens really used — measured from
local agent session logs and agent usage reports, never presented as
progress — and task cards carry evidence badges and subtask progress.

## Scope

**In:** phase-card delivery metrics (planned vs. measured); the local usage
meter; the usage-report ingestion endpoint (deployment-bearer path); task
card evidence badges and subtask progress bars.
**Out:** agent usage *detail* (tool/model/prompt/compaction counts —
FEAT-038); Mission Control DAG observability (FEAT-040); harness-
credential attribution (retired, `legacy:FR-221`).

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-PLT |
| Runtime owner | SRV-001 |

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-037-001](requirements/FR-037-001-phase-cards-show-planned-and-measured-figures.md) | Phase cards show planned and measured figures, always labelled and never blended | — |
| [FR-037-002](requirements/FR-037-002-the-usage-meter-measures-from-local-claude.md) | The usage meter measures from local Claude Code/Codex logs | — |
| [FR-037-003](requirements/FR-037-003-the-usage-report-endpoint-accepts-one-sessions.md) | The usage-report endpoint accepts one session's usage under a deployment bearer | — |
| [FR-037-004](requirements/FR-037-004-task-cards-show-evidence-badges-and-subtask.md) | Task cards show evidence badges and subtask progress | — |
| [NFR-037-001](requirements/NFR-037-001-card-colour-is-never-colour-only.md) | Card colour is never colour-only | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
