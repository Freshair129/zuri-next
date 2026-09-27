---
id: FEAT-086
title: Asset foundation — intake, registration, custody, allocation, depreciation preview
type: domain-feature
owner: DOM-AST
runtime: SRV-001
status: approved
delivery: building
legacy: [FEAT-015]
relations:
  depends_on: [FR-082-001, FR-082-002]
  decided_by: [ADR-078]
---

# FEAT-086 — Asset foundation — intake, registration, custody, allocation, depreciation preview

## Summary

Lets an authorized Business user enter Asset Management (`/assets`), converge any
supported intake channel (Web, REST, Excel/Sheet, Agent/MCP, LINE OA/LIFF) onto one
strict `AssetIntakeEnvelope`, validate procurement/evidence/lot rules deterministically,
register a physical unit under a stable Asset ID, track who is accountable/custodian/
using it and where it physically is over time, allocate it to a Project without
duplicating Project Inventory, and preview a straight-line depreciation schedule as
advisory Finance evidence.

## Scope

**In:** domain registration, dashboard, envelope validation; registration into
`RegisteredAsset` with a stable Asset ID; responsibility/location/Project-allocation
effective-interval history; lifecycle actions (relocate, allocate, return,
responsibility, maintenance, dispose, verify); deterministic depreciation preview.

**Out:** cloud evidence storage, OCR/Vision extraction and human review (FEAT-087);
edge-executed extraction (retired, see `registry/crosswalk/AST.csv`);
Procurement's PR/PO/GRN authority; People's Person/Membership authority; Finance's
capitalization/journal authority; Project Manager's `ProjectAssetRequest` intent.

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-AST |
| Runtime owner | SRV-001 |

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-086-001](requirements/FR-086-001-domain-foundation-and-one-canonical-intake-envelope.md) | Domain foundation and one canonical intake envelope | — |
| [FR-086-002](requirements/FR-086-002-multi-surface-intake-and-evidence-reference-validation.md) | Multi-surface intake and evidence/reference validation | — |
| [FR-086-003](requirements/FR-086-003-temporal-responsibility-location-and-project-allocation.md) | Temporal responsibility, location and Project allocation | — |
| [FR-086-004](requirements/FR-086-004-deterministic-depreciation-candidate.md) | Deterministic depreciation candidate | — |
| [NFR-086-001](requirements/NFR-086-001-fail-closed-cross-business-isolation.md) | Fail-closed cross-Business isolation | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
