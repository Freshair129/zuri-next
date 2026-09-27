---
id: DOM-AST
title: Asset Management
status: proposed
version: 0.1.0
owner: governance
relations:
  decided_by: [ADR-078, ADR-079, ADR-080]
---

# DOM-AST — Asset Management

## Purpose
The Business-scoped authority for the physical identity and operational lifecycle of
company assets (ทรัพย์สิน): evidence-backed intake convergence across every surface,
registration into a stable Asset ID, temporal custody/location/Project allocation,
maintenance/disposal actions, and a deterministic depreciation preview handed to
Finance as advisory evidence — never an accounting posting.

## Ubiquitous language
- **RegisteredAsset** — the physical asset aggregate; internal UUID + stable,
  Business-scoped, human Asset ID (never recycled after disposal).
- **AssetIntakeEnvelope** — the one strict envelope every intake surface (Web, REST,
  Excel/Sheet, Agent/MCP, LINE OA/LIFF) converges on before registration.
- **AssetEvidence** — evidence *metadata* (role, extraction candidate, review
  decision) referencing an existing `FileAsset`'s bytes; Asset Management never
  duplicates file content or changes `FileAsset`'s own meaning.
- **Candidate** — OCR/Vision-extracted field values with provider/model identity and
  confidence; a candidate can never self-approve or self-review.
- **AssetProcurementRef** — a typed reference (PR/PO/PR line/PO line/GRN/invoice/
  supplier) into Procurement's records; a string until a later FR resolves it, never
  an edit of Procurement's own rows.
- **Effective interval** — the pattern used for responsibility, location and Project
  allocation: closing one interval and appending the next; history is never
  overwritten.
- **Depreciation candidate** — a deterministic straight-line preview; advisory
  evidence for Finance, never a capitalization, tax book or journal posting.

## Owned data
- `RegisteredAsset` — physical asset aggregate: code (Asset ID), category, serial,
  manufacturer/model, status, warranty, timestamps, version.
- `AssetIntake` — normalized-envelope snapshot, validation snapshot, status
  (…→`READY_FOR_REGISTRATION`), source correlation for idempotency.
- `AssetEvidence` — role (`ASSET_PHOTO`, `PAYMENT_PROOF`, `WARRANTY`, receipt/
  invoice/delivery/inspection/other), extraction candidate, review decision,
  reference to a `FileAsset`.
- `AssetProcurementRef` — typed external reference (PR/PO/PR line/PO line/GRN/
  invoice/supplier).
- `AssetLot` — expiry-controlled lot identity and expiry date.
- `AssetResponsibility` — effective-interval accountable person / custodian / actual
  user reference.
- `AssetLocationHistory` — effective-interval physical location beneath an optional
  Branch.
- `AssetProjectAllocation` — effective-interval link to a Project/Workstream
  (Project Manager owns the request; Asset owns the allocation and its read
  projection).
- `AssetDepreciationCandidate` — deterministic preview: inputs, calculation version,
  period rows, bounded accumulated depreciation, review state.
- `AssetExtractionJob` — retired queued unit for edge-executed extraction (see
  Legacy sources; owned by this domain historically, permanently retired identifier).

## Business rules
No rule found here that is not already covered by a legacy `BR-xxx` PRD row or by the
requirements below; this domain's aggregate invariants (asset code never recycled,
one active ACCOUNTABLE interval, exclusive Project allocations cannot overlap, a
candidate can never self-approve, meaningful writes are transactional/versioned/
audited) are stated as ADR-078 D3/D9/D14/D15 and folded into the FR ACs below rather
than re-declared as separate `BR-AST-*` rows.

## Public contracts
- `API-240` (envelope validate/submit/export)
- `API-241`
- `API-242` (create/read/list, allocate/relocate/responsibility/return/
  maintenance/dispose/verify/depreciation actions)
- `API-238` (upload, extract, review)
- `API-239` (Excel/Sheets template, import, export)

## Capabilities
Not used — two features cover this pass's declared scope.

## Depends on
- `FR-082-001`/`FR-082-002` (Procurement's `Supplier`/`PurchaseOrder`/
  `GoodsReceipt`) — `AssetProcurementRef` is a typed string reference only; Asset
  Management never edits a Procurement row.
- `legacy:` Identity/People (Person, Membership, employment status) — read reference
  only for responsibility/custody.
- `legacy:` file-management authority (`FileAsset`) — evidence references existing
  file content and never duplicates bytes or changes `FileAsset` semantics.
- `legacy:FR-144` (Identity's `EdgeDeviceCredential` / `resolveEdgeDeviceContext`) —
  historical dependency of the now-retired legacy:FR-143 edge extraction path only.

## Legacy sources
- Charter: `docs/domains/asset-management/CHARTER.md`, `CONTEXT-MAP.md`,
  `DATA-PIPELINE.md`, `SRS.md`
- Feature notes: `docs/domains/asset-management/features/FR-133-asset-management-foundation.md`,
  `FR-137-asset-evidence-intake-execution.md`, `FR-143-edge-executed-evidence-extraction.md`
- `docs/PRD-SDD-v1.0.md` rows FR-086-001..139
- `docs/FEATURES.md` rows FEAT-086, FEAT-087, legacy:FEAT-017
- ADRs: ADR-078, ADR-079, ADR-080 (in force); legacy:ADR-059 retired — see decisions.md and
  `registry/crosswalk/AST.csv`
- ADR-095 (system-level, not owned by this domain) retires FR-069-001/141/143/144 and
  legacy:FEAT-017's edge-specific behavior from active product scope (2026-09-25)

<!-- BEGIN GENERATED: feature-index -->

## Feature index (generated)

### Owned features (2)

| Feature | Title | Delivery | Requirements |
|---|---|---|---|
| [FEAT-086](../../features/FEAT-086-asset-foundation/feature.md) | Asset foundation — intake, registration, custody, allocation, depreciation preview | building | 5 |
| [FEAT-087](../../features/FEAT-087-evidence-intake-execution/feature.md) | Evidence intake execution — cloud storage, extraction, review, workbook/Sheet, LINE handoff | live | 5 |

### Participating in cross-domain features (0)

_None._

### Hosted by services (1)

- [SRV-001](../../services/SRV-001-web/SERVICE.md)

<!-- END GENERATED -->
