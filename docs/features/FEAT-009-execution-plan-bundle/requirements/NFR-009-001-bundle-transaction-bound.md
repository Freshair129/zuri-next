---
id: NFR-009-001
title: "Bundle transaction bound"
delivery: implemented
legacy: []
---

# NFR-009-001 — Bundle transaction bound

A bundle commit SHALL run within the shared import transaction bounds (max wait 10 s, timeout 120 s); a bundle too large for one transaction fails whole rather than partially. Measured by the bundle integration suite.
