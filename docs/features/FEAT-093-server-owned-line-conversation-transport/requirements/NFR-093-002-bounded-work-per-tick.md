---
id: NFR-093-002
title: "Bounded work per tick"
delivery: implemented
legacy: []
---

# NFR-093-002 — Bounded work per tick

≤ 4 parallel executions and ≤ 5 sends per tick by default; job TTL 30 min; lease 300 s; Push retry window 23 h.

## Verification

- TC-093-005 — Job ledger, fencing, send outcomes and cadence (see [verification.md](../verification.md))
