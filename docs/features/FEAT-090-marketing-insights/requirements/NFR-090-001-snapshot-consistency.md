---
id: NFR-090-001
title: "Snapshot consistency"
delivery: building
legacy: []
---

# NFR-090-001 — Snapshot consistency

Every read within one request answers from exactly one snapshot; a render and its
export of the same metric never diverge. Measured by AC-090-001-03's fixture
coverage (`tests/fixtures/marketing-insights/fixture-insights-repository.js`).
