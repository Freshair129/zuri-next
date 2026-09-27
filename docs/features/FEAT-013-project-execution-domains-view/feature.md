---
id: FEAT-013
title: Project execution domains view
type: domain-feature
owner: DOM-PRJ
runtime: SRV-001
status: draft
delivery: live
legacy: [FR-251]
relations:
  depends_on: [FEAT-010, FEAT-002]
  decided_by: [ADR-014, ADR-008]
---

# FEAT-013 — Project execution domains view

## Summary

Answers "which business domains does this Project's execution touch, and how much active
work sits in each?" by projecting the domain bindings every Workstream already carries
(primary, supporting, technical owner). Shown in Project context under Delivery Design →
Execution Domains; read-only, and it never infers Features or grants.

## Scope

**In:** `ProjectDomainView` DTO; `/projects/{id}/domain-view` tab; counts of active
Workstreams and deduplicated active WorkItems per domain; unknown-binding handling.
**Out:** Feature authority (FEAT-014); Business-level Delivery Design (planned); any
domain grant or visibility decision.

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-PRJ |
| Runtime owner | SRV-001 |

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-013-001](requirements/FR-013-001-domain-view-projection-of-workstream-bindings.md) | Domain-view projection of Workstream bindings | — |
| [FR-013-002](requirements/FR-013-002-authorization-refusal-shape-and-no-side-effects.md) | Authorization, refusal shape and no side effects | — |
| [NFR-013-001](requirements/NFR-013-001-accessible-narrow-view.md) | Accessible narrow view | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
