---
id: NFR-021-001
title: "Restore is all-or-nothing within a bound"
delivery: live
legacy: []
---

# NFR-021-001 — Restore is all-or-nothing within a bound

A restore SHALL complete within a 120 s transaction or roll back entirely. Measured by the backup integration suite and phase-B recovery tests.

## Verification

- TC-021-002 — Snapshot export/import (see [verification.md](../verification.md))
