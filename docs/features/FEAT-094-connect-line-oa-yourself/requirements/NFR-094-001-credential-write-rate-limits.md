---
id: NFR-094-001
title: "Credential write rate limits"
delivery: implemented
legacy: []
---

# NFR-094-001 — Credential write rate limits

5 writes/validations per Person+Business per 15 min (rejected LINE validation weighs 2); 60 LINE validations per installation per minute.

## Verification

- TC-094-002 — Step-up gate and rate limits (see [verification.md](../verification.md))
