---
id: NFR-030-001
title: "A declared status value nothing writes fails the build"
delivery: implemented
legacy: []
---

# NFR-030-001 — A declared status value nothing writes fails the build

Every `*_STATUSES` export in `enums.js` SHALL have at least one writer in
`src/`; a value no service ever assigns SHALL be a CRITICAL preflight failure
(`unreachable-state`), tracked against a shrink-only accepted-debt baseline.
