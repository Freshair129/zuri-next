---
id: SDD-085
title: "Pricing rules and formula console — design"
---

# SDD-085 — Pricing rules and formula console design

- **Components:**
  - `CMP-258` — `application/pricing-rules-service.js` +
    `domain/pricing-rules.js`: draft/approve/revoke lifecycle, revision CAS.
  - `CMP-256` — `domain/pricing-engine.js` + `domain/pricing-formula.js`:
    bounded expression parser/evaluator, dependency-graph validation.
  - `CMP-255` — `application/pricing-catalog-service.js` +
    `domain/pricing-catalog-projection.js`: catalog-facing projection, no cost/margin
    leak.
  - `CMP-257` — `application/pricing-inventory-service.js`: reads
    Inventory-side facts needed by a formula variable (via Inventory's contracts,
    never a direct table read).
  - `CMP-259` — `domain/pricing-source.js`: source/lineage pinning.
- **Data owned:** `PricingRuleSet`, `PricingCalculation`.
- **Contracts exposed:** `API-236`, `API-235`,
  `API-233`, `API-234`.
- **Contracts consumed:** `FR-075-001` (Knowledge pre-Stage-1 admission);
  `API-199` (product/category reference resolution for formula
  variables).
- **Main sequence** (author → approve → evaluate → admit):
  1. Owner drafts a rule set (`POST /api/commerce/pricing-rules`), edits under
     revision CAS.
  2. `POST .../[id]/actions {action:'APPROVE'}` records actor/reason/effective date,
     freezes the version.
  3. `POST /api/commerce/pricing-rules/preview` or `/calculate` evaluates via the
     shared engine, pinning lineage on any persisted `PricingCalculation`.
  4. An approved, allowlisted computed price is admitted to Knowledge through
     `FR-075-001`'s contract — a separate, deliberate step, never automatic.
- **Failure modes:** stale-revision write refused; cyclic dependency rejected before
  approval; missing active rule fails closed; division/overflow refused; revoked/
  expired price fails closed at every later Knowledge touchpoint (admission,
  publication, query, citation).

## Implementation map

| Requirement | Current code (legacy repo path) |
|---|---|
| FR-085-001 | `apps/server/src/modules/commerce/application/pricing-rules-service.js`, `domain/pricing-rules.js`, `apps/server/src/app/api/commerce/pricing-rules/route.js`, `.../pricing-rules/[id]/route.js`, `.../pricing-rules/[id]/actions/route.js` |
| FR-085-002 | `apps/server/src/modules/commerce/domain/pricing-engine.js`, `domain/pricing-formula.js`, `apps/server/src/app/api/commerce/pricing-rules/preview/route.js`, `.../calculate/route.js` |
| FR-085-003 | `apps/server/src/modules/commerce/application/pricing-catalog-service.js`, `domain/pricing-source.js`, `apps/server/src/app/api/commerce/pricing-rules/catalog/route.js` |
