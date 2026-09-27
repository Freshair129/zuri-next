---
id: NFR-074-001
title: "No cross-tenant graph read"
delivery: building
legacy: []
---

# NFR-074-001 — No cross-tenant graph read

Every graph or business-knowledge read SHALL be scoped to exactly one tenant/Business;
a principal-neighbourhood query for one tenant SHALL never surface another tenant's
relations. Measured by `tests/integration/knowledge-query.test.js` and
`tests/unit/business-knowledge-contract.test.js`.
