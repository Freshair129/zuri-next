---
id: NFR-086-001
title: "Fail-closed cross-Business isolation"
delivery: building
legacy: []
---

# NFR-086-001 — Fail-closed cross-Business isolation

Every owned row carries `tenantId`/`businessId` derived server-side from the trusted
viewer and selected Business; a payload, workbook, prompt, OCR result, LINE event or
QR code can never establish or widen scope. Measured by the existing cross-Business
denial test coverage (`asset-register-routes.test.js`, `asset-lifecycle-routes.test.js`).
