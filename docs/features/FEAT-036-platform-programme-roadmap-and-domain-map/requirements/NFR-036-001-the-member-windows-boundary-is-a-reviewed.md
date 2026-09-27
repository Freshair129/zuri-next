---
id: NFR-036-001
title: "The member window's boundary is a reviewed code change, never a runtime switch"
delivery: live
legacy: []
---

# NFR-036-001 — The member window's boundary is a reviewed code change, never a runtime switch

Extending or closing the window early requires a code change to the
constant and a deploy — no environment variable or database flag governs it
(`ADR-036` D2).
