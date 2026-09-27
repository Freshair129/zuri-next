---
id: NFR-010-001
title: "Trace is evidence, never a blocker"
delivery: live
legacy: []
---

# NFR-010-001 — Trace is evidence, never a blocker

Trace persistence failures SHALL never mask or replace the original mutation error, and trace snapshots SHALL be bounded to 256 KiB. Measured by execution-trace integration tests.

## Verification

- TC-010-004 — Trace ledger and replay (see [verification.md](../verification.md))
