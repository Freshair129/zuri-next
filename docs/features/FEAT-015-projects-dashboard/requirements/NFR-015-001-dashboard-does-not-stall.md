---
id: NFR-015-001
title: "Dashboard does not stall"
delivery: live
legacy: []
---

# NFR-015-001 — Dashboard does not stall

The dashboard read SHALL remain bounded for large Businesses (single aggregate queries, no per-Project N+1 beyond calculators). Measured by the projects-dashboard stall integration test.

## Verification

- TC-015-004 — Dashboard load (see [verification.md](../verification.md))
