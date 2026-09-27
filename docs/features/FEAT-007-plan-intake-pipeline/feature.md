---
id: FEAT-007
title: Plan intake pipeline
type: domain-feature
owner: DOM-PRJ
runtime: SRV-001
status: draft
delivery: live
legacy: [FR-012, FR-065, FR-017, FR-018]
relations:
  depends_on: [FEAT-003]
  decided_by: [ADR-005]
---

# FEAT-007 — Plan intake pipeline

## Summary

Every way of bringing a plan in — the goal-first wizard, the plan-mode customizer, the
"New Task" modal, an Excel workbook, the Enterprise API, agents over MCP — converges on one
canonical `PlanEnvelope` and one pipeline: authorize target → schema validation → semantic
check → read-only dry run → preview → one confirmation → single transaction → audit.
Imported plans are data only; nothing in them is executed.

## Scope

**In:** PlanEnvelope schema (1.0/1.1/1.2); dry run and commit; target-Workspace
authorization; human intake converters (wizard, plan-mode customizer, standalone task);
Excel template and workbook conversion.
**Out:** external-id upsert and API key auth (FEAT-008); multi-Project bundles
(FEAT-009); execution trace/replay ledger and meeting-action intake (FEAT-010).

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-PRJ |
| Runtime owner | SRV-001 |

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-007-001](requirements/FR-007-001-canonical-planenvelope-validation.md) | Canonical PlanEnvelope validation | — |
| [FR-007-002](requirements/FR-007-002-read-only-dry-run-and-preview.md) | Read-only dry run and preview | — |
| [FR-007-003](requirements/FR-007-003-transactional-commit-with-audit-and-idempotency.md) | Transactional commit with audit and idempotency | — |
| [FR-007-004](requirements/FR-007-004-import-target-authorization.md) | Import target authorization | — |
| [FR-007-005](requirements/FR-007-005-goal-first-human-intake-produces-envelopes.md) | Goal-first human intake produces envelopes | — |
| [FR-007-006](requirements/FR-007-006-standalone-tasks-land-in-a-visible-inbox.md) | Standalone tasks land in a visible inbox | — |
| [FR-007-007](requirements/FR-007-007-excel-template-and-workbook-intake.md) | Excel template and workbook intake | — |
| [NFR-007-001](requirements/NFR-007-001-commit-bound-for-realistic-programmes.md) | Commit bound for realistic programmes | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
