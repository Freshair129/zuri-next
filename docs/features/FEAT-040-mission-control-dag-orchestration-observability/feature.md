---
id: FEAT-040
title: Mission Control DAG Orchestration Observability
type: domain-feature
owner: DOM-PLT
runtime: SRV-001
status: approved
delivery: building
legacy: [FEAT-044, FR-260, FR-261, FR-262, FR-263, FR-264]
relations:
  depends_on: []
  decided_by: [ADR-030]
---

# FEAT-040 — Mission Control DAG Orchestration Observability

## Summary

An installation-operator-only, read-only projection joining the canonical
roadmap DAG and its dependency waves with provenance-bound Programme
Orchestration Run Ledger (PORL) observations — never a scheduler, never a
merge/deploy authority, and never presented as more current than its own
evidence supports.

## Scope

**In:** the operator DAG/PORL read model; the observation contract's
provenance vocabulary (LIVE/SNAPSHOT/UNKNOWN/NOT_RUN,
LOCAL/ISOLATED/HOSTED_CI/PRODUCTION); candidate-parallel/merge-safety gate
evaluation and display; `/roadmap` member-view redaction of this data;
responsive/accessible rendering.
**Out:** any actual scheduling, merge, deploy, migration or activation
action (explicitly out of scope by design).

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-PLT |
| Runtime owner | SRV-001 |

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-040-001](requirements/FR-040-001-operator-only-dag-wave-task-observability-no.md) | Operator-only DAG/wave/task observability, no Business scope | — |
| [FR-040-002](requirements/FR-040-002-porl-observations-are-provenance-bound-and-never.md) | PORL observations are provenance-bound and never infer liveness from staleness | — |
| [FR-040-003](requirements/FR-040-003-candidate-parallelism-is-never-treated-as-merge.md) | Candidate parallelism is never treated as merge approval | — |
| [FR-040-004](requirements/FR-040-004-the-member-roadmap-redacts-all-mission-control.md) | The member roadmap redacts all Mission Control data | — |
| [FR-040-005](requirements/FR-040-005-the-evidence-view-stays-accessible-and-mobile.md) | The evidence view stays accessible and mobile-scannable | — |
| [NFR-040-001](requirements/NFR-040-001-truthful-state-vocabulary-is-preserved-at-every.md) | Truthful state vocabulary is preserved at every width and gate | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
