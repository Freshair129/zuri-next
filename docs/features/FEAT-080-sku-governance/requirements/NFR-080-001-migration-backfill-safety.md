---
id: NFR-080-001
title: "Migration backfill safety"
delivery: implemented
legacy: []
---

# NFR-080-001 — Migration backfill safety

The nature/variant-key migration backfills existing masters/SKUs without deleting
or renumbering anything (0 masters needed backfill in this system's own production
apply — a fact, not a target). Measured by the migration's own recorded ledger
verification.
