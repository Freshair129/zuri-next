---
id: NFR-007-001
title: "Commit bound for realistic programmes"
delivery: live
legacy: []
---

# NFR-007-001 — Commit bound for realistic programmes

A commit of an envelope of the size of a real programme (≥ 9 Workstreams, ≥ 28 items) SHALL complete within the 120 s transaction timeout against the production database pool; exceeding it rolls back whole. Measured by the commit-transaction unit test and production import receipts.

## Verification

- TC-007-002 — Dry run, commit, rollback and idempotency (see [verification.md](../verification.md))
