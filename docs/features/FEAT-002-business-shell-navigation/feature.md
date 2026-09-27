---
id: FEAT-002
title: Business shell, entry & navigation
type: domain-feature
owner: DOM-PRJ
runtime: SRV-001
status: draft
delivery: live
legacy: [FR-020, FR-032, FR-033, FR-034, FR-039, FR-046, FR-056, FR-250, ADR-008, ADR-011, ADR-096]
relations:
  depends_on: [API-077, FR-023-001, FR-023-002, FR-002-005, FR-024-003]
  decided_by: [ADR-001, ADR-002, ADR-014]
---

# FEAT-002 — Business shell, entry & navigation

## Summary

The web console's frame: a branded public landing, a guarded Business shell that only
renders once a trusted viewer and a selected, visible Business exist, a read-only context
bar that stops at Business, a breadcrumb, and a domain → module → view navigation
hierarchy. The shell adapts to how many Businesses the viewer has, and never becomes an
authorization check — every API still authorizes on its own.

## Scope

**In:** landing page (`/`), shell-mode derivation, Business shell guard states, topbar,
Base Context Bar, breadcrumb, ERP/PM scope-view lens, Projects & Work hierarchical
navigation (six modules), domain slot hiding driven by visibility and Business capabilities.
**Out:** login, session, `/api/entry` and the Business chooser page `/businesses`
(DOM-IAM, FR-023-002/FR-046); domain visibility decision itself (FR-024-003);
Business Home content (FEAT-018); peer-domain page content.

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-PRJ |
| Runtime owner | SRV-001 |

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-002-001](requirements/FR-002-001-shell-mode-is-derived-from-data-never.md) | Shell mode is derived from data, never configured | — |
| [FR-002-002](requirements/FR-002-002-business-scope-ceiling-and-base-context-bar.md) | Business scope ceiling and Base Context Bar | — |
| [FR-002-003](requirements/FR-002-003-topbar-without-scope-selectors.md) | Topbar without scope selectors | — |
| [FR-002-004](requirements/FR-002-004-breadcrumb-mirrors-the-context.md) | Breadcrumb mirrors the context | — |
| [FR-002-005](requirements/FR-002-005-business-shell-guard.md) | Business shell guard | — |
| [FR-002-006](requirements/FR-002-006-branded-public-landing.md) | Branded public landing | — |
| [FR-002-007](requirements/FR-002-007-projects-work-hierarchical-navigation.md) | Projects & Work hierarchical navigation | — |
| [NFR-002-001](requirements/NFR-002-001-accessible-narrow-screen-shell.md) | Accessible, narrow-screen shell | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
