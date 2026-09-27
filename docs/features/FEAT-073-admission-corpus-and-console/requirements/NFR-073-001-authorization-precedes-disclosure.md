---
id: NFR-073-001
title: "Authorization precedes disclosure"
delivery: implemented
legacy: []
---

# NFR-073-001 — Authorization precedes disclosure

Every admission, query, citation and console read SHALL resolve the caller's current
authority before any source content, configuration or existence is disclosed —
including a machine credential, which gains no new authority merely because a route
exists. Measured by tests issuing an unauthenticated or under-scoped request and
asserting a fail-closed refusal before any data read (`tests/unit/knowledge-admission-*`,
`tests/unit/knowledge-corpus-routes.test.js`).
