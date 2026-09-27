---
id: NFR-014-001
title: "Serializable graph writes"
delivery: building
legacy: []
---

# NFR-014-001 — Serializable graph writes

Concurrent mutations on one Project's Feature graph SHALL serialize (PostgreSQL row locks in deterministic order; SQLite `BEGIN IMMEDIATE`) so competing CAS writers yield one winner and allocation totals never exceed 10000 bps. Measured by the Feature mutation integration suite and PostgreSQL proofs.

## Verification

- TC-014-001 — Feature mutations, CAS, idempotency, audit (see [verification.md](../verification.md))
