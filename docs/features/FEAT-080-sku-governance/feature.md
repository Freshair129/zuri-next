---
id: FEAT-080
title: SKU governance — nature, variant identity, identifiers, lifecycle, hygiene
type: domain-feature
owner: DOM-INV
runtime: SRV-001
status: approved
delivery: implemented
legacy: [FEAT-031]
relations:
  depends_on: []
  decided_by: [ADR-073]
---

# FEAT-080 — SKU governance — nature, variant identity, identifiers, lifecycle, hygiene

## Summary

Closes the anti-SKU-bloat gap: the product nature declared once at the master and
inherited by every SKU, variant identity as the key that makes one physical variant
one SKU, barcodes/partner codes as resolvable attributes an intake checks before it
creates, pack sizes as unit conversions rather than new SKUs, a SKU lifecycle with
phase-out/reactivate/merge, and a read-only catalogue hygiene report with
replenishment suggestions.

## Scope

**In:** `ProductMaster.nature`/`defaultStockPolicy`; `variantAxes`/`variant`/
`variantKey` + lookalike guard; `ProductIdentifier` (GTIN/BARCODE/SUPPLIER_CODE/
MANUFACTURER_PART/LEGACY_CODE) + `resolveProduct`; `ProductUnitConversion`; SKU
lifecycle (UPDATE/ARCHIVE/PHASE_OUT/REACTIVATE/MERGE); hygiene report;
replenishment parameters/suggestion.
**Out:** category hierarchy; automatic merge (the report proposes, a person
disposes); catalogue intake itself (FEAT-081, which *consumes* this feature's
guards).

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-INV |
| Runtime owner | SRV-001 |

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-080-001](requirements/FR-080-001-nature-declared-once-at-the-master-inherited.md) | Nature declared once at the master, inherited by every SKU | — |
| [FR-080-002](requirements/FR-080-002-variant-identity-one-physical-variant-one-sku.md) | Variant identity: one physical variant, one SKU | — |
| [FR-080-003](requirements/FR-080-003-identifiers-as-resolvable-attributes-resolve-before-create.md) | Identifiers as resolvable attributes, resolve before create | — |
| [FR-080-004](requirements/FR-080-004-unit-conversions-pack-size-as-a-factor.md) | Unit conversions, pack size as a factor not a SKU | — |
| [FR-080-005](requirements/FR-080-005-sku-lifecycle-and-merge.md) | SKU lifecycle and merge | — |
| [FR-080-006](requirements/FR-080-006-catalogue-hygiene-report.md) | Catalogue hygiene report | — |
| [FR-080-007](requirements/FR-080-007-replenishment-suggestion-never-a-purchase-order.md) | Replenishment suggestion, never a purchase order | — |
| [NFR-080-001](requirements/NFR-080-001-migration-backfill-safety.md) | Migration backfill safety | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
