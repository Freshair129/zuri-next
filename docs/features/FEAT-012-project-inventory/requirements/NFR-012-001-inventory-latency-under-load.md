---
id: NFR-012-001
title: "Inventory latency under load"
delivery: live
legacy: []
---

# NFR-012-001 — Inventory latency under load

The inventory read SHALL complete without stalling the request pool for a Project at the section limits (500 rows per section). Measured by the inventory stall integration test.

## Verification

- TC-012-003 — Inventory under load (see [verification.md](../verification.md))
