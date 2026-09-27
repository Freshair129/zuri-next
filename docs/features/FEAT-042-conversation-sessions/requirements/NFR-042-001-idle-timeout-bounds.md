---
id: NFR-042-001
title: "Idle timeout bounds"
delivery: implemented
legacy: []
---

# NFR-042-001 — Idle timeout bounds

Effective timeout = the account's stored value when it is an integer in [10, 120]
minutes, else 30. Verified by the pure-function unit tests.

## Verification

- TC-042-001 — Idle rule, code format and timeout bounds (pure) (see [verification.md](../verification.md))
