---
id: NFR-005-001
title: "Deterministic calculators"
delivery: live
legacy: []
---

# NFR-005-001 — Deterministic calculators

All calculators SHALL be pure (no I/O, clock or randomness) and the same inputs SHALL give byte-identical outputs (NFR-005). Measured by the calculator unit suites and the card/calculator agreement test.

## Verification

- TC-005-001 — Strategy calculators (see [verification.md](../verification.md))
