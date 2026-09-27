---
id: NFR-053-001
title: "Deterministic identity"
delivery: implemented
legacy: []
---

# NFR-053-001 — Deterministic identity

The same logical payload with keys in any order yields the same `payloadHash`; verified by the contract unit tests.

## Verification

- TC-053-001 — Envelope and identity (see [verification.md](../verification.md))
