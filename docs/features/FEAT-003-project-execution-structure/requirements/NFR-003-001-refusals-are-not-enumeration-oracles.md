---
id: NFR-003-001
title: "Refusals are not enumeration oracles"
delivery: live
legacy: []
---

# NFR-003-001 — Refusals are not enumeration oracles

For every write route in this feature, the status and body for "exists but unowned" SHALL equal those for "does not exist". Measured by the refusal-disclosure integration suite comparing both responses byte-for-byte.

## Verification

- TC-003-006 — Governing-Business write authorization (see [verification.md](../verification.md))
