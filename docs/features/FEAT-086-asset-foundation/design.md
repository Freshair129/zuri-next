---
id: SDD-086
title: "Asset foundation — intake, registration, custody, allocation, depreciation preview — design"
---

# SDD-086 — Asset foundation — intake, registration, custody, allocation, depreciation preview design

- **Components:**
  - `CMP-268` — `application/asset-intake-service.js` + `domain/asset-intake.js`:
    the one canonical envelope validator/writer.
  - `CMP-272` — `application/asset-register-service.js`: `RegisteredAsset`
    create/read/list, Asset ID issuance.
  - `CMP-269` — `application/asset-lifecycle-service.js`: relocate,
    allocate, responsibility, return actions (effective-interval writes).
  - `CMP-271` — `application/asset-maintenance-service.js`: maintenance
    open/complete actions.
  - `CMP-263` — `application/asset-disposal-service.js`: dispose action.
  - `CMP-262` — `application/asset-depreciation-service.js` +
    `domain/depreciation.js`: deterministic straight-line calculator.
  - `CMP-270` — `application/asset-lookup-service.js`: QR/code lookup
    (identifier only, never an authorization bypass — ADR-078 D10).
  - `CMP-261` — `application/asset-authority.js`,
    `application/asset-request-scope.js`: the read/write/review/manage authorization
    ladder and FR-072-style 404 refusal.
- **Data owned:** `RegisteredAsset`, `AssetIntake`, `AssetProcurementRef`, `AssetLot`,
  `AssetResponsibility`, `AssetLocationHistory`, `AssetProjectAllocation`,
  `AssetDepreciationCandidate`.
- **Contracts exposed:** `API-240`, `API-241`, `API-242`.
- **Contracts consumed:** none in this feature (evidence bytes/extraction is
  FEAT-087; Procurement/People/Project references are typed strings, not calls).
- **Main sequence** (receive → register → allocate):
  1. Receiver drafts an envelope (`POST /api/assets/intakes`), attaching evidence
     references and procurement refs; `Validate` runs the canonical schema/policy.
  2. `Submit` on a `PROCUREMENT_PURCHASE`-origin draft requires `ASSET_PHOTO` +
     `PAYMENT_PROOF`; approval requires PR + PO references.
  3. Registration issues a stable Asset ID (`POST /api/assets/register`).
  4. Responsibility/location/allocation actions (`.../relocate`, `.../allocate`,
     `.../responsibility`, `.../return`) close and append effective intervals.
  5. Depreciation preview is generated on demand
     (`GET/POST /api/assets/register/[id]/depreciation`), never posted.
- **Failure modes:** missing required evidence on procurement origin refused before
  any write; cross-Business Person/Project/FileAsset reference refused; overlapping
  exclusive Project allocation refused; depreciation inputs producing a negative or
  over-basis period rejected by the calculator's bounds check.

## Implementation map

| Requirement | Current code (legacy repo path) |
|---|---|
| FR-086-001 | `apps/server/src/modules/asset-management/application/asset-intake-service.js`, `application/asset-authority.js`, `application/asset-request-scope.js`, `apps/server/src/app/api/assets/intakes/route.js`, `apps/server/src/app/(pm)/assets/page.jsx` |
| FR-086-002 | `apps/server/src/modules/asset-management/domain/asset-intake.js`, `domain/evidence-policy.js`, `apps/server/src/app/api/assets/intakes/validate/route.js` |
| FR-086-003 | `apps/server/src/modules/asset-management/application/asset-lifecycle-service.js`, `apps/server/src/app/api/assets/register/[id]/relocate/route.js`, `.../allocate/route.js`, `.../responsibility/route.js`, `.../return/route.js` |
| FR-086-004 | `apps/server/src/modules/asset-management/application/asset-depreciation-service.js`, `domain/depreciation.js`, `apps/server/src/app/api/assets/register/[id]/depreciation/route.js` |
