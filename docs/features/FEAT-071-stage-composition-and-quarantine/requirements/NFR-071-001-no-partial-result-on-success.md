---
id: NFR-071-001
title: "No partial result on success"
delivery: implemented
legacy: []
---

# NFR-071-001 — No partial result on success

`runKnowledgeIngestionStages` (the non-tracing composition) SHALL either return a
complete seven-stage result or throw — it SHALL never return an object claiming
partial progress. Measured by the composition's own tests asserting a thrown stage
error propagates unchanged rather than being swallowed into a partial return value.
