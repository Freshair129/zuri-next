---
id: FEAT-003
title: Project execution structure & write authorization
type: domain-feature
owner: DOM-PRJ
runtime: SRV-001
status: draft
delivery: live
legacy: [FR-003, FR-004, FR-005, FR-006, FR-007, FR-043, FR-072, ADR-014]
relations:
  depends_on: [FEAT-001, FR-024-003]
  decided_by: [ADR-005, ADR-003]
---

# FEAT-003 — Project execution structure & write authorization

## Summary

The neutral work model every Project is planned in: Project → Workstream (one of seven
execution modes, a progress strategy and a weight) → WorkContainer (nestable grouping:
sprint, stage, pipeline, wave, phase…) → WorkItem (weight, value, probability, metrics),
plus Milestones, Gates and typed Dependencies. Owners edit it in the web console
(Development domain) and through the intake pipeline; every write is authorized at the
Project's governing Business.

## Scope

**In:** CRUD/archive of Project, Workstream, WorkContainer, WorkItem, Milestone, Gate;
Dependency create/list/delete with self/cycle refusal and blocked evaluation; Project
list read contract; Project ↔ Business/Space ownership invariant; write authorization for
all of the above.
**Out:** progress maths (FEAT-005); visual views — board, schedule, maps
(FEAT-006); bulk intake (FEAT-007); priority/PIC/Team fields (FEAT-015);
Handoff Contracts on edges (FEAT-016, declared).

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-PRJ |
| Runtime owner | SRV-001 |

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-003-001](requirements/FR-003-001-project-create-update-and-archive.md) | Project create, update and archive | — |
| [FR-003-002](requirements/FR-003-002-project-list-read-contract.md) | Project list read contract | — |
| [FR-003-003](requirements/FR-003-003-project-business-ownership-and-space-context.md) | Project Business ownership and Space context | — |
| [FR-003-004](requirements/FR-003-004-workstreams-carry-execution-mode-strategy-and-weight.md) | Workstreams carry execution mode, strategy and weight | — |
| [FR-003-005](requirements/FR-003-005-work-containers-form-a-per-workstream-hierarchy.md) | Work containers form a per-Workstream hierarchy | — |
| [FR-003-006](requirements/FR-003-006-work-items-and-the-all-work-list.md) | Work items and the All Work list | — |
| [FR-003-007](requirements/FR-003-007-milestones-and-gates.md) | Milestones and gates | — |
| [FR-003-008](requirements/FR-003-008-typed-dependencies-with-self-cycle-refusal-and.md) | Typed dependencies with self/cycle refusal and blocked evaluation | — |
| [FR-003-009](requirements/FR-003-009-writes-are-authorized-at-the-governing-business.md) | Writes are authorized at the governing Business | — |
| [NFR-003-001](requirements/NFR-003-001-refusals-are-not-enumeration-oracles.md) | Refusals are not enumeration oracles | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
