---
id: NFR-089-001
title: "Server-loaded scope, never a payload tenant id"
delivery: building
legacy: []
---

# NFR-089-001 — Server-loaded scope, never a payload tenant id

Every write's scope derives from the server-loaded Business; no tenant/business
identifier supplied in a plan, intake or broadcast payload controls authorization.
Measured by the existing scope-refusal coverage across
`marketing-plan.test.js`, `marketing-operations.test.js`, `marketing-broadcast-intent.test.js`.
