---
id: NFR-085-002
title: "Tenant/Business isolation, audit, concurrency"
delivery: building
legacy: []
---

# NFR-085-002 — Tenant/Business isolation, audit, concurrency

`PricingRuleSet`/`PricingCalculation` storage carries tenant/business isolation,
audit events, optimistic concurrency (revision-based) and request idempotency.
Measured by `fr253-pricing-catalog.test.js`'s scope/concurrency cases.
