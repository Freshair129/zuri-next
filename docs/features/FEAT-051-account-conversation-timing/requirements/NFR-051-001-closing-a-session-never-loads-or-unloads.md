---
id: NFR-051-001
title: "Closing a session never loads or unloads a model"
delivery: building
legacy: []
---

# NFR-051-001 — Closing a session never loads or unloads a model

Session-close events SHALL NOT be coupled to any model-residency signal;
residency (where it still exists elsewhere) is per loaded model, not per
conversation (recorded for completeness — no residency signal remains in this
domain after retirement, see §9).
