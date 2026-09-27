---
id: NFR-095-001
title: "Retention windows"
delivery: building
legacy: []
---

# NFR-095-001 — Retention windows

Defaults: raw LINE payload 90 d, message bodies/attachments 730 d, trace payloads 90 d, MSP session content 90 d; Tenant overrides only shorter.

## Verification

- TC-095-002 — Retention overrides and sweep (see [verification.md](../verification.md))
