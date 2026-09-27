---
id: FEAT-081
title: Catalogue intake — resolve before it creates
type: domain-feature
owner: DOM-INV
runtime: SRV-001
status: approved
delivery: implemented
legacy: [FEAT-032]
relations:
  depends_on: []
  decided_by: [ADR-074]
---

# FEAT-081 — Catalogue intake — resolve before it creates

## Summary

One envelope that JSON, a Business-specific Excel workbook and a LINE `#sku` command
all convert into; a planner that resolves every item by its identifiers/SKU code
(following merges) before it plans a CREATE, matches without overwriting, and
applies FEAT-080's guards across the catalogue and the batch; a persisted
preview whose plan hash a commit must match; an all-or-nothing commit through the
existing catalogue writers; the Import tab; and LINE previews only a verified staff
sender with Inventory write authority can confirm.

## Scope

**In:** `InventoryCatalogIntake` envelope v1; per-item resolve/plan (MATCH/CREATE/
CONFLICT/INVALID); persisted preview with plan hash and idempotent correlation;
transactional re-plan-and-commit; Excel template/reader/Import tab; LINE `#sku`
command parser and reply formatter.
**Out:** stock (quantity) intake; Google Sheets; a file/image sent over LINE;
updating an existing SKU's descriptive fields from an import.

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-INV |
| Runtime owner | SRV-001 |

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-081-001](requirements/FR-081-001-resolve-before-create-envelope-planner-and-idempotent.md) | Resolve-before-create envelope, planner and idempotent preview/commit | — |
| [FR-081-002](requirements/FR-081-002-excel-converter-never-a-second-source-of.md) | Excel converter, never a second source of truth | — |
| [FR-081-003](requirements/FR-081-003-line-sku-command-verified-sender-only-preview.md) | LINE `#sku` command, verified sender only, preview before write | — |
| [NFR-081-001](requirements/NFR-081-001-adapter-adds-no-authority.md) | Adapter adds no authority | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
