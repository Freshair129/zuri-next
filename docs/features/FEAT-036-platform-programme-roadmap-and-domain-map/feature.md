---
id: FEAT-036
title: Platform Programme Roadmap & Domain Map
type: domain-feature
owner: DOM-PLT
runtime: SRV-001
status: approved
delivery: live
legacy: [FR-105, FR-211, FR-241]
relations:
  depends_on: []
  decided_by: [ADR-030, ADR-036]
---

# FEAT-036 — Platform Programme Roadmap & Domain Map

## Summary

The installation-operator's read-only projection of the submitted delivery
plan and the chartered-domain inventory, plus a time-boxed, redacted member
view of the same plan for any signed-in person.

## Scope

**In:** `/control/roadmap` plan board; its Domain map & inventory tab; the
time-boxed `/roadmap` member view and its server-side redaction.
**Out:** delivery telemetry figures (FEAT-037), Mission Control DAG
observability (FEAT-040).

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-PLT |
| Runtime owner | SRV-001 |

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-036-001](requirements/FR-036-001-platform-programme-roadmap-is-an-operator-only.md) | Platform Programme Roadmap is an operator-only, read-only plan snapshot | — |
| [FR-036-002](requirements/FR-036-002-domain-map-projects-the-fr-124-product.md) | Domain map projects the FR-022-001, FR-022-002, FR-022-003 Product Readiness snapshot, computing nothing itself | — |
| [FR-036-003](requirements/FR-036-003-a-time-boxed-redacted-member-view-of.md) | A time-boxed, redacted member view of the plan | — |
| [NFR-036-001](requirements/NFR-036-001-the-member-windows-boundary-is-a-reviewed.md) | The member window's boundary is a reviewed code change, never a runtime switch | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
