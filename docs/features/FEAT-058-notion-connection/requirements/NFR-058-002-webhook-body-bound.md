---
id: NFR-058-002
title: "Webhook body bound"
delivery: building
legacy: []
---

# NFR-058-002 — Webhook body bound

Webhook bodies above 1 MiB are refused with 413 before parsing.

## Verification

- TC-058-001 — OAuth and webhook end to end (see [verification.md](../verification.md))
