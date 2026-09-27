---
id: NFR-070-001
title: "Determinism across all six calculators"
delivery: implemented
legacy: []
---

# NFR-070-001 — Determinism across all six calculators

Every calculator SHALL be pure — no I/O, no database, no clock, no randomness, no
model call — so that the same input reprocessed at any later time produces identical
ids and classifications. Measured by each calculator's own test suite asserting
identical output on a repeated call, and by BR-066's cross-stage requirement that a
reprocessed document is recognised as the same knowledge rather than fresh.
