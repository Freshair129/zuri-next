# Contracts — Asset Management

### API-240
Owner: DOM-AST
Routes: `GET/POST /api/assets/intakes`, `POST /api/assets/intakes/validate`,
`POST /api/assets/intakes/export`

**Purpose:** Draft, validate and export an `AssetIntakeEnvelope` occurrence; the one
canonical writer every surface converges on.

**Auth/scope:** Business visibility + `assets` domain to read; Business OWNER or
`ASSET_RECEIVER` (`asset.intake.write`) to draft/submit.

**Request/response:** `AssetIntakeEnvelope` JSON in; normalized snapshot + validation
result (structure/evidence/PR-PO/OCR-required/duplicate issues) out.

**Errors:** 404 scope refusal (FR-003-009 shape); 422 field-level validation issues; 409
on same-correlation different-payload conflict.

**Implements:** FR-086-001, FR-086-002
**Legacy:** `apps/server/src/app/api/assets/intakes/route.js`, `.../validate/route.js`, `.../export/route.js`

---

### API-241
Owner: DOM-AST
Route: `GET /api/assets/lookup`

**Purpose:** Resolve a QR/barcode lookup token or human Asset ID to an asset summary
for an authenticated, authorized viewer — the label itself grants no access
(ADR-078 D10).

**Auth/scope:** Business visibility + `assets` domain; the server always re-resolves
viewer/Business/permission regardless of what the scanned code carries.

**Implements:** FR-086-001
**Legacy:** `apps/server/src/app/api/assets/lookup/route.js`

---

### API-242
Owner: DOM-AST
Routes: `GET/POST /api/assets/register`, `GET /api/assets/register/[id]`,
`POST .../allocate`, `.../relocate`, `.../responsibility`, `.../return`,
`.../maintenance`, `.../dispose`, `.../verify`, `GET/POST .../depreciation`

**Purpose:** Register a `RegisteredAsset` and drive its lifecycle actions
(allocation, relocation, responsibility change, return, maintenance, disposal,
verification, depreciation preview).

**Auth/scope:** Business visibility + `assets` domain to read; write actions require
Business OWNER or the applicable capability. `dispose`, `maintenance` and `verify`
require the `manage` capability.

**Errors:** 404 scope; 422 invalid transition/overlap; validation-specific codes per
action (e.g. exclusive-allocation overlap, cross-Business Person/Project reference).

**Implements:** FR-086-001, FR-086-003, FR-086-004
**Legacy:** `apps/server/src/app/api/assets/register/**`

---

### API-238
Owner: DOM-AST
Routes: `GET/POST /api/assets/evidence`, `POST /api/assets/evidence/[id]/extract`,
`POST /api/assets/evidence/[id]/review`

**Purpose:** Upload evidence to private storage, run provider extraction, and record
an independent human review decision.

**Auth/scope:** Business OWNER or `ASSET_RECEIVER` to upload; Business OWNER or
`ASSET_REVIEWER` to review; extraction gated the same as upload.

**Errors:** 401/403 authorization; 422 unsupported/spoofed content; `UNAVAILABLE`
outcome (not a thrown error) when the storage/provider adapter is unconfigured.

**Implements:** FR-087-001, FR-087-002
**Legacy:** `apps/server/src/app/api/assets/evidence/route.js`, `.../[id]/extract/route.js`, `.../[id]/review/route.js`

---

### API-239
Owner: DOM-AST
Routes: `GET /api/assets/import/template`, `POST /api/assets/import/xlsx`,
`POST /api/assets/import/sheets`

**Purpose:** Bounded Excel workbook template/import and Google Sheets snapshot
convergence through the same canonical row adapter as every other intake surface;
preview-first, no hidden apply.

**Auth/scope:** Business OWNER or `ASSET_RECEIVER`.

**Errors:** per-row/column validation issues in the response body; never a silent
partial apply.

**Implements:** FR-087-003
**Legacy:** `apps/server/src/app/api/assets/import/**`

---

## Retired (not declared as contracts here)
`/api/edge/extraction-jobs/**` (claim, evidence stream, complete, fail) implemented
legacy:FR-143's device-authenticated edge extraction lane. legacy:FR-143, legacy:FR-144, FR-069-002 and
legacy:FEAT-017's edge-specific behavior are retired from active product scope by ADR-095
D5 (2026-09-25); the identifiers remain permanently assigned but are not
re-specified here — see `registry/crosswalk/AST.csv`.
