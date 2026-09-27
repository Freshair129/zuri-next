# Decisions — Inventory & Catalogue

### ADR-072 — Located stock ledger, WIP work orders and landed cost
Owner: DOM-INV
**Status:** Accepted; implemented locally (migration `20260910120000_smartgift_scm_wip`, production SQL not applied as of this writing).

**Context:** The core ledger (FEAT-077) knew *what* moved but not *where* it
physically sat across the SmartGift supply chain (a Chinese factory to a customer's
lobby), nor what a unit's landed cost actually was once freight/duty/inbound
delivery were absorbed, nor how to represent branding/kitting work in progress
without inventing a second stock table, nor how to guard aged perishable/rechargeable
stock, nor how to promise stock against a quote without touching the physical ledger.

**Decision:**
- Add `WarehouseLocation` typed by nine supply-chain buckets; a transfer is exactly
  one issue+receive pair through the existing `appendMovement`, never a fourth
  movement kind — Business-wide on-hand is unchanged by construction.
- Landed cost (`StockMovement.costSatang`) absorbs factory cost plus shared costs
  (sea freight, duty, inbound truck — flat single-drop default) divided per batch
  and rounded up; valuation is moving weighted average recomputed from the ledger,
  not a separate accounting book.
- Customization and kitting are `CustomizationWorkOrder`/`KittingWorkOrder` records
  holding no quantity the ledger doesn't also hold; they write stock only through
  `appendMovement`. Branding is irreversible: a completed customization produces a
  customer-dedicated `CUSTOM_COMPONENT` that can never un-dedicate except by an
  explicit write-off. Kitting declares a scrap allowance issued up front and
  requires a validated FlowAccount code on its output.
- De-kitting cannot launder branded stock back to generic.
- A shelf-life guard (`maintenanceIntervalDays`/`maxStorageDays`) surfaces due
  maintenance and refuses issue/kitting past the storage limit until reset.
- `StockReservation` (QUOTE soft-expiring / ORDER committed) computes
  Available-to-Promise without ever writing the ledger; never deleted, only
  RELEASED/CONVERTED/EXPIRED.
- A strict NONE/LOT stocktake preview+commit reconciles counts through the same
  `appendMovement`, fenced by a lock-only `InventoryLedgerFence` and idempotent by
  Business-scoped key.
- The console/route surface (13 thin route handlers, 3 pages) is this ADR's
  deferred consequence, discharged in the same slice.

**Consequences:**
- Inventory valuation moves in from "future Finance" — it is a physical-stock
  valuation, not a book entry, and stays here.
- The `warehouse` bar slot stays reserved for bins/stocktake *campaigns* UI; the
  location *model* and the located ledger already live here.
- No FlowAccount push, cycle-counting campaigns or SERIAL-line stocktake are
  authorized by this decision.

Legacy: ADR-074

### ADR-073 — SKU governance: nature at the master, variant identity, catalogue hygiene
Owner: DOM-INV
**Status:** Accepted; implemented and applied to production (migration
`20260913120000_inventory_sku_governance`, 2026-09-13).

**Context:** The catalogue's only identity guard was `code` alone — no defense
against the same variant entered twice, a case beside its single unit typed as a
new code, a barcode recorded as a name on one row, or an intake blind to whether the
SKU already existed. A service had also been recorded as UNTRACKED, conflating "we
don't count this good" with "this isn't a good" — an accounting distinction the
catalogue couldn't express.

**Decision:**
- `ProductMaster.nature` (GOOD/SERVICE) is declared once and every SKU inherits it;
  a mismatch is refused.
- `ProductMaster.variantAxes` + each SKU's `variant` derive a `variantKey` unique
  per master (archived or not) — the actual anti-duplication guard; a master with no
  axes falls back to an exact-match lookalike guard, overridable only explicitly and
  audited.
- `ProductIdentifier` (GTIN/BARCODE/SUPPLIER_CODE/MANUFACTURER_PART/LEGACY_CODE) is
  a resolvable attribute, never a key; `resolveProduct` is the one call an intake
  makes before it creates.
- `ProductUnitConversion` makes a pack size an integer factor on the SKU, never a
  second SKU; the ledger counts base units only.
- The SKU lifecycle (PHASE_OUT/ARCHIVE/REACTIVATE/MERGE) guards against archiving
  live stock and against losing history on consolidation — MERGE re-points
  references and archives the duplicate, never deletes.
- A read-only hygiene report and replenishment suggestion surface findings; they
  never write, and turning a suggestion into a purchase order stays Procurement's.

**Consequences:**
- One physical variant is now structurally one SKU (or an explicit, audited
  exception) rather than a convention nobody enforced.
- Category hierarchy and automatic merge remain out of scope — the report proposes,
  a person disposes.

Legacy: ADR-083

### ADR-074 — Catalogue intake resolves before it creates
Owner: DOM-INV
**Status:** Accepted; implemented and applied to production (migration
`20260913200000_inventory_catalog_intake`, 2026-09-13).

**Context:** With ADR-073's guards in place, a bulk intake (JSON, an Excel
workbook, or a LINE message) still needed one convergent path that checks whether
each item's SKU already exists — by its identifiers or its code, following a merge
— before ever planning to create it, and needed to apply the same anti-bloat guards
across a whole batch, not just one row at a time.

**Decision:**
- One `InventoryCatalogIntake` envelope v1 is the convergence point for JSON, Excel
  and LINE; items validate individually (a bad row is INVALID, not a rejected
  envelope).
- The planner resolves before it creates: MATCH only adds what's missing (never
  overwrites), CONFLICT when two items disagree on identity or when duplicates
  exist within the batch, CREATE only when every ADR-073 guard passes.
- Preview is idempotent on (Business, channel, correlation) and persists a plan
  hash; commit re-plans inside one transaction and must match that hash or refuse,
  running every action through the existing catalogue writers so nothing bypasses
  their own guards and audit.
- The LINE `#sku` command is an agent-lane adapter over the same envelope/planner —
  it owns no separate authority: only a verified sender with Inventory write
  authority can act, and only the person who previewed can confirm or cancel.

**Consequences:**
- A bulk import can never silently duplicate a SKU that already exists under a
  different code/identifier, and a partial-failure batch never leaves the catalogue
  half-written.
- Stock quantity, Google Sheets and LINE file/image intake remain explicitly out of
  scope for this pipeline.

Legacy: ADR-084
