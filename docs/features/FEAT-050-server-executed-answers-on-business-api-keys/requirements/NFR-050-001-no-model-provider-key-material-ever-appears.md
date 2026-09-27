---
id: NFR-050-001
title: "No model-provider key material ever appears in a Studio response, log or trace"
delivery: building
legacy: []
---

# NFR-050-001 — No model-provider key material ever appears in a Studio response, log or trace

Every trace, response and log line the Studio produces for a model-credential
read carries a status and a validation code only — never the key or a
substring of it (`SEC-028`, `SEC-031`).
