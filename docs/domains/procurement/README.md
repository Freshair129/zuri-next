---
id: DOM-PRC
title: Procurement
status: proposed
version: 0.1.0
owner: governance
relations:
  decided_by: [ADR-075]
---

# DOM-PRC — Procurement

## Purpose
The Business-scoped authority for what the Business buys and what actually arrived
(จัดซื้อ): the approved supplier, the purchase order with its lines and agreed costs,
and the goods receipt that records a delivery and puts counted goods into the
Warehouse ledger. It is the buy side; Commerce is the sell side; the two lanes meet
only in Inventory's stock ledger.

## Ubiquitous language
- **Supplier** — a Business-scoped vendor, `code` unique per Tenant (an attribute, not
  a key), ACTIVE until archived (never deleted).
- **Purchase order (PO)** — `PO-YYYYMMDD-NNN`, names one ACTIVE supplier of its own
  Business; DRAFT → SENT → RECEIVED (only by the receipt completing every line) or
  SHORT_CLOSED (explicit, lines outstanding) or CANCELLED (only before any receipt).
- **Purchase order line** — names a non-archived Inventory SKU (or is free-text) at the
  unit cost agreed for this purchase.
- **Goods receipt (GRN)** — `GRN-YYYYMMDD-NNN`, posted only against a SENT order,
  never edited; a line naming a counted SKU posts into Inventory's ledger in the same
  transaction.
- **`receiptState`** (NONE / PARTIAL / COMPLETE) — always computed on read from the
  order's lines and its receipts' lines, never stored.
- **Supplier cost sheet** — a locked-FX, Business-scoped factory source version with
  person-confirmed SKU price-break lines (TASK-ZAI-053; not yet a declared FR).

## Owned data
- `Supplier` — code, name, tax id, contact, payment terms, lead time, ACTIVE/ARCHIVED.
- `PurchaseOrder` — code, supplier ref, status machine, money in integer satang.
- `PurchaseOrderLine` — product ref or free-text item, quantity, unit cost satang.
- `GoodsReceipt` — code, delivery-note reference, `receivedAt`; never edited.
- `GoodsReceiptLine` — quantity received against one order line, lot/expiry/serials
  carried into the Inventory ledger.
- `SupplierCostSheet` / `SupplierCostLine` — locked-FX cost-sheet intake (TASK-ZAI-053).

**Never stored** (always computed on read): order total, received/outstanding value,
a line's received/outstanding quantity, `receiptState`.

## Business rules
### BR-040 — Human codes are attributes, never keys
Owner: DOM-PRC
`Supplier.code`, `PurchaseOrder.code` and `GoodsReceipt.code` are unique per Tenant but
are display/lookup attributes; the internal key is always the row's UUID.

### BR-041 — Money is integer satang everywhere
Owner: DOM-PRC
Every cost/total column is integer satang; the API speaks baht with at most two
decimal places.

### BR-042 — Order totals and receipt state are always computed, never stored
Owner: DOM-PRC
A `PurchaseOrder`'s total, received value, outstanding value, each line's
received/outstanding quantity and `receiptState` (NONE/PARTIAL/COMPLETE) are derived on
every read from the order's lines and its receipts' lines; no such column exists to
drift out of sync.

### BR-043 — A goods receipt is immutable
Owner: DOM-PRC
A `GoodsReceipt` is posted by its creation, has no status, no version and no
PATCH/DELETE; a wrong receipt is corrected by an Inventory ADJUSTMENT, never by
rewriting the receipt.

### BR-044 — Posting into the Inventory ledger needs Inventory's own authority
Owner: DOM-PRC
A receipt line naming a counted SKU requires the poster to hold Inventory's write
authority in addition to the Procurement buyer's/receiver's — a Procurement role
binding never widens Inventory authority by itself.

### BR-045 — Every write is one transaction with version bump and audit
Owner: DOM-PRC
Every Supplier/PurchaseOrder/GoodsReceipt write is one transaction that bumps
`version` where the row has one and appends exactly one `AuditEvent`; a receipt that
completes an order also audits the order.

Existing global rows are referenced rather than re-declared: `BR-046`
(tenant/business scope derived server-side, never client-selected), `FR-024-003`
(domain visibility gate), `FR-003-009` (404-shaped scope refusal).

## Public contracts
- `API-223`, `API-222`, `API-224`, `API-221`
- `API-219`, `API-218`, `API-220`, `API-217`
- `API-214`, `API-215`, `API-213`, `API-216`
- (six `cost-sheets/**` routes exist in code but are not FR-backed — see contracts.md "Not FR-backed" and FEAT-082 §9)

## Capabilities
Not used — one feature covers the domain's declared scope.

## Depends on
- `API-194` (Inventory) — a receipt line naming a counted SKU posts
  ledger rows through this contract inside the receipt's own transaction; the viewer
  needs Inventory's own write authority for that half
  (`403 PROCUREMENT_RECEIPT_REQUIRES_INVENTORY_AUTHORITY`) — a Procurement role never
  widens Inventory authority.
- `API-199` (Inventory) — a purchase order line naming a SKU, and
  the cost-sheet commit's Product carton write, resolve against Inventory's catalogue;
  Procurement never writes an Inventory-owned row directly.
- `FR-024-003` (domain visibility gate) and `FR-003-009` (404-shaped scope
  refusal) — the authorization pattern this domain reuses, owned by Identity.

## Legacy sources
- Charter: `docs/domains/procurement/CHARTER.md`
- Feature notes: `docs/domains/procurement/features/FR-164-suppliers-and-purchase-orders.md`, `FR-165-goods-receipts.md`
- `docs/PRD-SDD-v1.0.md` rows FR-082-001, FR-082-002
- `docs/FEATURES.md` row FEAT-082
- ADR: ADR-075

<!-- BEGIN GENERATED: feature-index -->

## Feature index (generated)

### Owned features (1)

| Feature | Title | Delivery | Requirements |
|---|---|---|---|
| [FEAT-082](../../features/FEAT-082-procurement-core/feature.md) | Procurement core — suppliers, purchase orders, goods receipts | building | 2 |

### Participating in cross-domain features (0)

_None._

### Hosted by services (1)

- [SRV-001](../../services/SRV-001-web/SERVICE.md)

<!-- END GENERATED -->
