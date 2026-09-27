---
id: FEAT-009
title: ExecutionPlanBundle import
type: domain-feature
owner: DOM-PRJ
runtime: SRV-001
status: draft
delivery: implemented
legacy: [FEAT-012, FR-108, ADR-049]
relations:
  depends_on: [FEAT-007, FEAT-019, FEAT-008]
  decided_by: [ADR-013]
---

# FEAT-009 — ExecutionPlanBundle import

## Summary

One portable, self-contained programme artifact — a Business strategy (Roadmap, Horizons,
Goals), N Projects each expressed as an existing PlanEnvelope, and cross-Project
dependencies — imported through one combined dry run and one confirmation. The bundle is a
transport/orchestration package above PlanEnvelope: it coordinates existing services and
never becomes a second writer or a persisted business object. Consumed by planning agents
and integrators through the API.

## Scope

**In:** bundle schema validation; scope resolution before parsing; strategy dry run;
bundle-local symbolic reference resolution; per-Project PlanEnvelope dry runs; cross-Project
dependency validation; combined preview; atomic commit; bundle receipt with idempotency and
audit lineage.
**Out:** UI uploader; MCP/agent adapters; coordinated (non-atomic) commit mode; roadmap/goal
dates, status and priority in bundle strategy entries.

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-PRJ |
| Runtime owner | SRV-001 |

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-009-001](requirements/FR-009-001-scope-and-schema-before-any-sensitive-parsing.md) | Scope and schema before any sensitive parsing | — |
| [FR-009-002](requirements/FR-009-002-symbolic-references-resolve-inside-the-authorized-scope.md) | Symbolic references resolve inside the authorized scope | — |
| [FR-009-003](requirements/FR-009-003-combined-dry-run-and-single-confirmation.md) | Combined dry run and single confirmation | — |
| [FR-009-004](requirements/FR-009-004-atomic-commit-with-bundle-receipt-and-idempotency.md) | Atomic commit with bundle receipt and idempotency | — |
| [NFR-009-001](requirements/NFR-009-001-bundle-transaction-bound.md) | Bundle transaction bound | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
