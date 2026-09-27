---
id: NFR-077-001
title: "Ledger append-only, never edited"
delivery: building
legacy: []
---

# NFR-077-001 — Ledger append-only, never edited

No route or service in this feature exposes an UPDATE/DELETE on `StockMovement`;
correction is always a new signed ADJUSTMENT row. Measured by the absence of such a
route and by `inventory-domain.test.js`'s calculator coverage.
