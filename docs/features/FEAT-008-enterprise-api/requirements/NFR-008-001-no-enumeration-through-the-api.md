---
id: NFR-008-001
title: "No enumeration through the API"
delivery: live
legacy: []
---

# NFR-008-001 — No enumeration through the API

Responses for "wrong Tenant", "does not exist" and "invalid/revoked/missing key" SHALL be indistinguishable in status and body. Measured by enterprise-api-auth integration tests.

## Verification

- TC-008-002 — API key enforcement and Tenant scoping (see [verification.md](../verification.md))
