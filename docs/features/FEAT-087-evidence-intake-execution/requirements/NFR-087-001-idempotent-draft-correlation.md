---
id: NFR-087-001
title: "Idempotent draft correlation"
delivery: live
legacy: []
---

# NFR-087-001 — Idempotent draft correlation

`businessId + sourceChannel + sourceCorrelationId` identifies one intake occurrence;
replaying the same normalized payload returns the existing draft, and a different
payload under the same key returns a conflict rather than a silent second draft.
Measured by `asset-evidence-intake-service-contract.test.js`.
