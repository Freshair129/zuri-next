---
id: NFR-084-001
title: "Document-level rounding rule"
delivery: building
legacy: []
---

# NFR-084-001 — Document-level rounding rule

VAT is computed with document-level `ROUND_HALF_UP` integer-satang rounding — the
same rule applied consistently across preview and issue so a chart/CSV-equivalent
never disagrees with itself. Measured by `fr186-billing.test.js`.
