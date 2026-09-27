---
id: DOM-INV
title: Inventory & Catalogue
status: proposed
version: 0.1.0
owner: governance
relations:
  decided_by: [ADR-072, ADR-073, ADR-074]
---

# DOM-INV — Inventory & Catalogue

## Purpose
The Business-scoped authority for what the Business sells or uses as goods, and how
many of them it holds (คลังสินค้า): catalogue identity from category down to one
serial-numbered unit, the append-only stock ledger, located stock across the
supply-chain, work-in-progress (customization, kitting, de-kitting), landed-cost
valuation, Available-to-Promise reservations, shelf-life guards, physical stocktake
reconciliation, SKU governance (nature, variant identity, lifecycle/merge) and
resolve-before-create catalogue intake. Offers, price tiers, segments and orders are
deferred to Commerce; purchase orders/suppliers to Procurement; physical company
assets to Asset Management.

## Ubiquitous language
- **The eight ids** — category, product family, factory, product master, product
  (SKU), bundle, lot, serial unit — every one an attribute; the primary key is
  always the internal UUID (BR-047).
- **stockPolicy** — TRACKED (นับสต๊อก, ledgered), UNTRACKED (ไม่นับสต๊อก, a good with
  no perpetual count), SERVICE (บริการ, not a good at all) — fixed at creation,
  inherited from the master's `nature` since ADR-073.
- **trackingMode** — NONE / LOT / SERIAL, how a TRACKED product's units are
  identified on the ledger.
- **StockMovement** — the one append-only ledger row type (RECEIPT/ISSUE/
  ADJUSTMENT); on-hand is always the recomputed sum, never a stored column.
- **variantKey** — the normalized `axis=value|axis=value` fingerprint that makes one
  physical variant one SKU (ADR-073).
- **Located ledger** — `StockMovement.sourceLocationId`/`targetLocationId` across
  nine supply-chain buckets; a transfer is one issue+receive pair in one
  transaction.
- **Landed cost** — `StockMovement.costSatang`, integer satang, moving weighted
  average, with shared costs (freight/duty/inbound truck/customization/kitting)
  divided per batch and rounded up.
- **ATP (Available-to-Promise)** — on-hand minus committed ORDER reservations minus
  live QUOTE reservations; reservations never write the ledger.
- **Resolve-before-create** — a catalogue intake resolves every item by its
  identifiers/SKU code before planning a CREATE, never overwriting a MATCH.

## Owned data
- `InventoryCategory`, `ProductFamily`, `Factory`, `ProductMaster`, `Product` (SKU),
  `ProductBundle`, `ProductBundleItem` — catalogue identity.
- `ProductLot`, `SerialUnit`, `StockMovement` — the stock ledger.
- `ProductRecipe`, `ProductRecipeLine` — bill of materials at a batch size.
- `WarehouseLocation` — nine supply-chain bucket locations.
- `CustomizationWorkOrder`, `KittingWorkOrder` — branded/assembled WIP.
- `StockReservation` — QUOTE/ORDER promises (never a ledger write).
- `InventoryStocktake`, `InventoryLedgerFence` — physical-count preview/commit and
  the write-serializing lock.
- `ProductIdentifier`, `ProductUnitConversion` — barcodes/partner codes, pack-size
  conversions.
- `InventoryCatalogIntake` — one catalogue intake preview + plan + result.

## Business rules
No rule found here that is not already a legacy `BR-xxx` PRD row (BR-047, BR-071,
BR-074, BR-075, BR-076, BR-077, BR-082, BR-083, BR-084, BR-085, BR-086, BR-087 all
govern this domain and are referenced as `legacy:BR-xxx` in the relevant FR's
Relations line rather than re-declared).

## Public contracts
- `API-200`, `API-200`, `API-200`, `API-200`, `API-207`, `API-195`
- `API-194` (exported ledger write contract — used cross-domain by Procurement/Commerce), `API-206`, `API-206`, `API-INV-stock-movements`, `API-206`
- `API-208`, `API-208`
- `API-205`, `API-205`, `API-205`
- `API-201`, `API-204`, `API-202`
- `API-211`
- `API-210`, `API-210`
- `API-212`, `API-212`
- `API-199` (product/identifier resolution), `API-203`, `API-203`
- `API-196`, `API-209`
- `API-197`, `API-197`, `API-198`, `API-198`

## Capabilities
| ID | Title | Features |
|---|---|---|
| Capability 1 | Catalogue governance | FEAT-078, FEAT-080, FEAT-081 |
| Capability 2 | Located ledger & fulfilment | FEAT-077, FEAT-079 |

## Depends on
- `legacy:` Knowledge/GKS canonical resolution — read by Market Intelligence
  (`FR-088-001, FR-088-002, FR-088-003`), not called by Inventory itself.
- No outbound dependency on Procurement or Commerce was found in code: those
  domains call **into** Inventory's `API-194` /
  `API-199` contracts; Inventory does not call out to them. See
  FEAT-079 §9 for the analysis behind keeping SmartGift SCM an INV-owned
  feature rather than splitting it.

## Legacy sources
- Charter: `docs/domains/inventory/CHARTER.md`, `ONTOLOGY.md`
- Feature notes: `docs/domains/inventory/features/FR-154-inventory-catalogue-identity.md`,
  `FR-155-inventory-stock-ledger.md`, `FR-184-inventory-stocktake.md`,
  `FR-201-nature-at-the-master.md`, `FR-202-variant-identity.md`,
  `FR-205-sku-lifecycle-and-merge.md`, `FR-210-line-sku-command.md`
- `docs/PRD-SDD-v1.0.md` rows FR-077-001, FR-077-002, FR-077-003, FR-078-001, FR-079-001..180, FR-079-008,
  FR-079-009, FR-080-001..210
- `docs/FEATURES.md` rows FEAT-077, FEAT-079, FEAT-080, FEAT-081
- ADRs: ADR-072, ADR-073, ADR-074

<!-- BEGIN GENERATED: feature-index -->

## Feature index (generated)

### Owned features (5)

| Feature | Title | Delivery | Requirements |
|---|---|---|---|
| [FEAT-077](../../features/FEAT-077-inventory-core-ledger/feature.md) | Inventory core ledger | building | 4 |
| [FEAT-078](../../features/FEAT-078-product-nature-and-stock-policy/feature.md) | Product nature and stock policy | implemented | 1 |
| [FEAT-079](../../features/FEAT-079-smartgift-scm/feature.md) | SmartGift SCM — located ledger, WIP, landed cost, ATP, stocktake | building | 10 |
| [FEAT-080](../../features/FEAT-080-sku-governance/feature.md) | SKU governance — nature, variant identity, identifiers, lifecycle, hygiene | implemented | 8 |
| [FEAT-081](../../features/FEAT-081-catalogue-intake/feature.md) | Catalogue intake — resolve before it creates | implemented | 4 |

### Participating in cross-domain features (0)

_None._

### Hosted by services (1)

- [SRV-001](../../services/SRV-001-web/SERVICE.md)

<!-- END GENERATED -->
