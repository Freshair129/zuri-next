# Procurement — Architecture Decision Records

### ADR-075 — Procurement is a lane; suppliers, orders and receipts are its first slice, receipts post through Inventory's contract
Owner: DOM-PRC
Status: Accepted
Relations: decided_by: none; depends_on: API-194

**Context**

The owner's ERP taxonomy named "Warehouse, Inventory, Procurement, Order
Management" as one SCM row. Inventory and Commerce already had a home;
Procurement had none, and four legacy documents disagreed on where it would
live. Meanwhile the Inventory ledger already accepted a free-text
`RECEIPT` reference (e.g. `PO-1`), so stock could arrive with no record of
what was ordered, from whom, at what cost, or whether the delivery matched
the order.

**Decision**

- Procurement owns `Supplier`, `PurchaseOrder`/`PurchaseOrderLine`,
  `GoodsReceipt`/`GoodsReceiptLine` — the buy side. Commerce stays the sell
  side; the two meet only in Inventory's ledger (a receipt adds, a fulfilled
  sales order removes).
- The legacy Phase-5 shapes are adopted with corrections: `code` fields
  become attributes (never primary keys); money becomes integer satang;
  received/outstanding quantities and the order's receipt state are computed
  on read, never stored; the ledger effect is Inventory's `StockMovement`
  rows referenced `PO:<code>/GRN:<code>`, not a second stock table.
- A receipt line naming a counted (TRACKED) SKU calls Inventory's exported
  `appendMovement` inside the receipt's own transaction; the caller needs
  Inventory's own write authority on top of the Procurement buyer's — a
  Procurement role never widens Inventory authority.
- A goods receipt is created once and never edited; a wrong one is corrected
  by an Inventory ADJUSTMENT.
- Not decided here (deferred, each its own future FR): purchase requests and
  approvals, RFQs and supplier quotes, purchase returns and credit notes,
  supplier invoices/payables/advances, landed cost and valuation, warehouse
  locations for a receipt, promoting a Market Intelligence
  `SupplierCandidate` into a `Supplier`.

**Consequences**

- `/procurement` and `/procurement/purchase-orders` (and later
  `/procurement/receipts`) become live console surfaces.
- The legacy ERD's "Phase 5 shared/procurement" mapping row moves from
  *target* to *built, corrected*.
- Five tables (`Supplier`, `PurchaseOrder`, `PurchaseOrderLine`,
  `GoodsReceipt`, `GoodsReceiptLine`) and one shared migration
  (`20260907010000_procurement`); production SQL not applied as of this
  writing (ADR-080 governs applying it).
- A later split of "manage orders" from "receive goods" into separate roles
  is a registry change, not a schema change (materialised later by
  `GOODS_RECEIVER` outside this ADR's scope).

Legacy: ADR-066
