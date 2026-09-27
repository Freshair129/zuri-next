---
id: NFR-085-001
title: "Formula sandboxing"
delivery: building
legacy: []
---

# NFR-085-001 — Formula sandboxing

Formula expressions are bounded parsed arithmetic over declared variables and an
allowed function set only — never a general-purpose `eval` — closing an entire class
of injection/DoS risk. Measured by formula-abuse and invalid-config test coverage
(`fr253-pricing-rules.test.js`).
