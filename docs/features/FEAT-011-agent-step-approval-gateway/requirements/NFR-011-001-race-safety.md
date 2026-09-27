---
id: NFR-011-001
title: "Race safety"
delivery: implemented
legacy: []
---

# NFR-011-001 — Race safety

All state transitions SHALL be compare-and-set within a transaction so that concurrent request/decision/admission calls yield exactly one winning transition. Measured by the approval-gateway integration race tests.

## Verification

- TC-011-001 — Approval gateway lifecycle (see [verification.md](../verification.md))
