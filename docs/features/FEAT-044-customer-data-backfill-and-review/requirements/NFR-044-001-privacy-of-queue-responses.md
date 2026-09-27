---
id: NFR-044-001
title: "Privacy of queue responses"
delivery: live
legacy: []
---

# NFR-044-001 — Privacy of queue responses

Every queue/target response declares `privacy.rawPii = false`; verified by contract tests over the API payloads.

## Verification

- TC-044-003 — Review queue service, API and UI (see [verification.md](../verification.md))
