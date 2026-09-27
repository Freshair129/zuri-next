---
id: NFR-079-001
title: "Write-side serialization during stocktake"
delivery: building
legacy: []
---

# NFR-079-001 — Write-side serialization during stocktake

The `InventoryLedgerFence` lock-only revision serializes every write-side ledger
read during a stocktake commit, so a concurrent movement cannot race the snapshot
comparison. Measured by `fr184-inventory-stocktake.test.js`'s concurrency cases.
