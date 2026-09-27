---
id: FEAT-079
title: SmartGift SCM — located ledger, WIP, landed cost, ATP, stocktake
type: domain-feature
owner: DOM-INV
runtime: SRV-001
status: approved
delivery: building
legacy: [FEAT-025]
relations:
  depends_on: []
  decided_by: [ADR-072]
---

# FEAT-079 — SmartGift SCM — located ledger, WIP, landed cost, ATP, stocktake

## Summary

Extends the core ledger with *where* stock physically is across nine supply-chain
buckets, *what it cost* landed in satang with the single-drop truck absorbed into
valuation, the two work orders that turn blank hardware into branded components
(irreversibly customer-locked) and branded components into a finished gift set (with
a declared scrap allowance), a shelf-life guard that refuses an aged lot for issue
until maintained, Available-to-Promise net of quote/order reservations, the
in-canvas console surface for all of it, and a strict physical stocktake that
reconciles counts through the same append-only ledger.

## Scope

**In:** `WarehouseLocation` + located transfer; landed unit cost; customization and
kitting work orders; de-kitting; shelf-life storage guard; two-tier ATP
reservations; 13 `/api/inventory/**` route handlers + 3 console pages; NONE/LOT
stocktake preview+commit.
**Out:** FlowAccount catalogue/stock synchronisation; cycle-counting/stocktake
*campaigns*; SERIAL-line stocktake observation; bins UI (reserved `warehouse` bar
slot); the six agent tools over Gate E/Gate F registries (owned by the Agent Runtime
domain, `FR-063-003`, not this group's slice).

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-INV |
| Runtime owner | SRV-001 |

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-079-001](requirements/FR-079-001-located-ledger-and-atomic-transfer.md) | Located ledger and atomic transfer | — |
| [FR-079-002](requirements/FR-079-002-landed-cost-in-integer-satang-single-drop.md) | Landed cost in integer satang, single-drop truck absorbed | — |
| [FR-079-003](requirements/FR-079-003-customization-work-order-irreversible-branding.md) | Customization work order, irreversible branding | — |
| [FR-079-004](requirements/FR-079-004-kitting-work-order-with-declared-scrap-allowance.md) | Kitting work order with declared scrap allowance and FlowAccount code | — |
| [FR-079-005](requirements/FR-079-005-de-kitting-cannot-launder-branded-stock.md) | De-kitting cannot launder branded stock | — |
| [FR-079-006](requirements/FR-079-006-shelf-life-storage-guard.md) | Shelf-life storage guard | — |
| [FR-079-007](requirements/FR-079-007-available-to-promise-two-tier-reservations.md) | Available-to-Promise, two-tier reservations | — |
| [FR-079-008](requirements/FR-079-008-console-and-route-surface-for-the-scm.md) | Console and route surface for the SCM lane | — |
| [FR-079-009](requirements/FR-079-009-physical-stocktake-reconciliation-none-lot.md) | Physical stocktake reconciliation (NONE/LOT) | — |
| [NFR-079-001](requirements/NFR-079-001-write-side-serialization-during-stocktake.md) | Write-side serialization during stocktake | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
