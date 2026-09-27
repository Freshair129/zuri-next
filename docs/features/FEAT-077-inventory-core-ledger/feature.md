---
id: FEAT-077
title: Inventory core ledger
type: domain-feature
owner: DOM-INV
runtime: SRV-001
status: approved
delivery: building
legacy: [FEAT-020]
relations:
  depends_on: []
  decided_by: []
---

# FEAT-077 — Inventory core ledger

## Summary

The catalogue identity every other Inventory feature builds on — category, family,
factory, product master, SKU (product) and bundle — and the append-only stock
ledger that makes on-hand always a computed fact, never a stored number; plus the
bill-of-materials (recipe) that explodes a batch build against that same ledger.

## Scope

**In:** catalogue CRUD; `stockPolicy`/`trackingMode` fixed at creation; append-only
`StockMovement` (RECEIPT/ISSUE/ADJUSTMENT); lot and serial identity; FEFO issue;
recipe explosion and atomic build.
**Out:** located ledger, WIP, landed cost, ATP, stocktake (FEAT-079); SKU
governance — nature/variant/identifiers/lifecycle/hygiene (FEAT-078/004);
catalogue intake (FEAT-081); the Commerce offer layer.

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-INV |
| Runtime owner | SRV-001 |

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-077-001](requirements/FR-077-001-catalogue-identity-eight-ids-as-attributes.md) | Catalogue identity, eight ids as attributes | — |
| [FR-077-002](requirements/FR-077-002-append-only-stock-ledger-with-lot-serial.md) | Append-only stock ledger with lot/serial identity and FEFO | — |
| [FR-077-003](requirements/FR-077-003-recipe-bill-of-materials-explosion-and-atomic.md) | Recipe (bill of materials) explosion and atomic build | — |
| [NFR-077-001](requirements/NFR-077-001-ledger-append-only-never-edited.md) | Ledger append-only, never edited | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
