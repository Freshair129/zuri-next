---
id: SDD-078
title: "Product nature and stock policy — design"
---

# SDD-078 — Product nature and stock policy design

- **Components:** `CMP-239` — the `stockPolicy`/`movementRule` enum and
  refusal codes in `domain/inventory.js`, and the cross-domain consequence in
  `procurement/application/goods-receipt-service.js` (not owned here, listed for
  traceability).
- **Data owned:** the `Product.stockPolicy` column (already part of `Product`,
  owned by FEAT-077; this feature specifies its accounting *behavior*, not a
  separate model).
- **Contracts exposed:** none new — this feature specifies behavior of
  `API-194` and the catalogue write path already exposed by
  FEAT-077.
- **Contracts consumed:** none.
- **Main sequence:** a movement or receipt call reads `Product.stockPolicy`; the
  domain's `movementRule` function refuses SERVICE/UNTRACKED before any ledger
  write; Procurement's own service reads the same field before posting a receipt
  line.
- **Failure modes:** SERVICE movement refused; UNTRACKED movement refused (distinct
  code); SERVICE goods-receipt line refused (Procurement-side, cross-domain
  consequence of this domain's field).

## Implementation map

| Requirement | Current code (legacy repo path) |
|---|---|
| FR-078-001 | `apps/server/src/modules/inventory/domain/inventory.js` (`movementRule`, `INVENTORY_PRODUCT_IS_A_SERVICE`, `INVENTORY_PRODUCT_UNTRACKED`), `apps/server/src/modules/procurement/application/goods-receipt-service.js` (`PROCUREMENT_RECEIPT_LINE_IS_A_SERVICE`) |
