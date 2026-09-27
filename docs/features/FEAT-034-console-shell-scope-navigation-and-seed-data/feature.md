---
id: FEAT-034
title: "Console Shell: Scope, Navigation & Seed Data"
type: domain-feature
owner: DOM-PLT
runtime: SRV-001
status: approved
delivery: live
legacy: [FR-002, FR-015, FR-016]
relations:
  depends_on: []
  decided_by: []
---

# FEAT-034 — Console Shell: Scope, Navigation & Seed Data

## Summary

The foundational console-shell chrome every Business user relies on before
touching a single domain: remembering the last selected scope, finding
anything fast from the keyboard, and a demo dataset that seeds the same way
every time. None of this has a chartered module home in the legacy tree; it
is assigned to this domain by this blueprint's slicing.

## Scope

**In:** Portfolio/Business/Workspace/Project scope selectors and last-
selection memory; the command palette (`Ctrl+K`) with filters and search;
the idempotent seed/demo dataset across all seven product modes.
**Out:** the domain-bar/sidebar ERP grouping and module tabs (FEAT-035);
Business-scoped authorization itself (`DOM-IAM`).

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-PLT |
| Runtime owner | SRV-001 |

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-034-001](requirements/FR-034-001-scope-selectors-remember-the-last-selection.md) | Scope selectors remember the last selection | — |
| [FR-034-002](requirements/FR-034-002-command-palette-provides-filtered-searchable-navigation.md) | Command palette provides filtered, searchable navigation | — |
| [FR-034-003](requirements/FR-034-003-seed-demo-dataset-is-idempotent-across-all.md) | Seed/demo dataset is idempotent across all seven product modes | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
