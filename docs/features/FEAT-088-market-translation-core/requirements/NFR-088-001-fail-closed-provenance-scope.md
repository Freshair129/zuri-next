---
id: NFR-088-001
title: "Fail-closed provenance scope"
delivery: implemented
legacy: []
---

# NFR-088-001 — Fail-closed provenance scope

Trusted Tenant/Business/connection scope and source lineage are always read from the
Integration-owned raw envelope, never from client/payload fields, and an explicit
`null` Business scope is distinguished from omitted scope. Measured by
`SEC-016`'s existing test coverage (scope-refusal cases in
`market-observation-service.test.js`, `market-intelligence-gks-resolution.test.js`).
