---
id: FR-074-003
title: "Shipping rate card as governed business knowledge (declared)"
delivery: building
legacy: [FR-131]
relations:
  specified_by: [SDD-074]
  derived_from: [BR-047]
  relates_to: [FR-074-002]
---

# FR-074-003 — Shipping rate card as governed business knowledge (declared)

The system SHALL publish a Business's logistics rate matrix (Member tier × warehouse ×
shipping method × category, each cell a THB/CBM rate and a THB/kg rate with tier
minima) as `business_knowledge` rows under a second `knowledge_type`, scoped
`(tenant_id, business_id)`, sell-side only — never as a new Prisma model, a new
domain, or a settings write path. Rates SHALL enter only through the existing document
intake (a supplier rate sheet image/PDF) and the FR-056-001, FR-056-002 approval gate, so every
effective rate carries `as_of`, `approved_at`, `source_ref` and `source_sha256` — never
through an administrator-editable settings grid, which cannot carry a signature or an
effective date.

## Acceptance criteria

- AC-074-003-01 — Given a supplier rate sheet is admitted, when it is approved through the FR-056-001, FR-056-002 gate, then the resulting `business_knowledge` rows carry `as_of`, `approved_at`, `source_ref` and `source_sha256` naming the sheet.
- AC-074-003-02 — Given no `knowledge_type` discriminator exists yet on the contract, when a rate row and a product row are both queried by the existing `product_search` predicate, then rate rows must not be returned as products (an open gap — see §9).
- AC-074-003-03 — Given the sell-side boundary, when a rate row is read through the curated projection, then no cost basis or margin figure is present in the same record.

## Implementation

- declared, unbuilt — no code path exists yet; the target store is `apps/server/src/modules/knowledge/postgres-business-knowledge.js`'s `zuri_core.business_knowledge` table

## Verification

- TC-074-003 — Shipping rate card (declared only — no test exists) (see [verification.md](../verification.md))
