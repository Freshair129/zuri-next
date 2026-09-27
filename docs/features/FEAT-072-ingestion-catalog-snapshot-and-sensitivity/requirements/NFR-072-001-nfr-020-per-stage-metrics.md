---
id: NFR-072-001
title: "NFR-019 per-stage metrics"
delivery: building
legacy: []
---

# NFR-072-001 — NFR-019 per-stage metrics

Every catalog stage SHALL report `records_in`, `records_out`, `records_failed`,
`records_quarantined`, `processing_time` and `retry_count`. Measured today: four of six
land on the ledger for the seven Tier 1 stages and, once reported, the external ones
(`records_quarantined`/`retry_count` have no ledger column and are returned `declined`
by name rather than dropped, per ADR-065 D5).
