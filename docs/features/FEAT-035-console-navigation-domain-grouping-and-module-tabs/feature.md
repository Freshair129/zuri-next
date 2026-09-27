---
id: FEAT-035
title: "Console Navigation: Domain Grouping & Module Tabs"
type: domain-feature
owner: DOM-PLT
runtime: SRV-001
status: approved
delivery: live
legacy: [FR-167, FR-170, FR-172]
relations:
  depends_on: []
  decided_by: [ADR-032, ADR-033]
---

# FEAT-035 — Console Navigation: Domain Grouping & Module Tabs

## Summary

The ERP-taxonomy grouping layer over the flat domain-bar registry (SCM over
Warehouse/Inventory/Procurement/Order Management; CRM over Customer/Market
Intelligence), and the in-canvas tab pattern a multi-page sub-domain module
uses instead of separate sidebar entries.

## Scope

**In:** `DOMAIN_GROUPS` and its two derivations (`domainBarSlots()`,
`sidebarDomainForPath()`); `<ModuleTabs>` and `src/lib/module-tabs.js`.
**Out:** the flat `DOMAINS` registry and its permission semantics
(`DOM-IAM`); the domains being grouped (owned by their own domains).

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-PLT |
| Runtime owner | SRV-001 |

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-035-001](requirements/FR-035-001-scm-groups-inventory-warehouse-procurement-and-order.md) | SCM groups Inventory, Warehouse, Procurement and Order Management under one bar slot | — |
| [FR-035-002](requirements/FR-035-002-a-multi-page-sub-domain-module-renders.md) | A multi-page sub-domain module renders its pages as in-canvas tabs | — |
| [FR-035-003](requirements/FR-035-003-crm-groups-customer-and-market-intelligence-under.md) | CRM groups Customer and Market Intelligence under one bar slot | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
