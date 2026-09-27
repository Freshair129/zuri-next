---
id: NFR-017-001
title: "Crash-recoverable, portable local files"
delivery: live
legacy: []
---

# NFR-017-001 — Crash-recoverable, portable local files

Authoritative metadata SHALL survive restart and remount; the cache SHALL be fully rebuildable; absolute device paths SHALL never become shared relational identity (NFR-009). Measured by the reconcile/cache and remount tests.

## Verification

- TC-017-004 — Reconcile, cache and reveal (see [verification.md](../verification.md))
