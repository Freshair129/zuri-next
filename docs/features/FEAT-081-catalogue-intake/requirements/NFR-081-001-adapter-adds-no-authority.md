---
id: NFR-081-001
title: "Adapter adds no authority"
delivery: implemented
legacy: []
---

# NFR-081-001 — Adapter adds no authority

The LINE command adapter never widens what the resolved viewer could already do
through the HTTP API — it is a convenience surface over the same authority ladder,
never a second one (`ADR-100`). Measured by
`tests/unit/agent-line-catalog-command.test.js`'s authority-parity cases.
