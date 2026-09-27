---
id: SDD-087
title: "Evidence intake execution — cloud storage, extraction, review, workbook/Sheet, LINE handoff — design"
---

# SDD-087 — Evidence intake execution — cloud storage, extraction, review, workbook/Sheet, LINE handoff design

- **Components:**
  - `CMP-264` — `application/asset-evidence-service.js`: upload
    authorization, storage-port invocation, `AssetEvidence` metadata writer.
  - `CMP-265` — `domain/evidence-policy.js`: MIME/size/magic-byte
    policy, role vocabulary.
  - `CMP-266` — `application/asset-extraction-job-service.js` (OpenAI
    adapter path retained; edge adapter path retired, see §9) + the shared candidate
    schema.
  - `CMP-267` — Excel/Sheets row adapter under `import/` and
    `apps/server/src/app/api/assets/import/**`.
- **Data owned:** `AssetEvidence` (role, extraction candidate JSON, review decision),
  `AssetIntake` status transitions up to `READY_FOR_REGISTRATION`.
- **Contracts exposed:** `API-238`, `API-239`.
- **Contracts consumed:** file-management's `FileAsset` creation service (not owned by
  this domain); an injected OCR/Vision provider port (OpenAI adapter, `store: false`).
- **Main sequence** (upload → extract → review):
  1. `POST /api/assets/evidence` authorizes scope, verifies content, uploads via the
     private object port, creates one `FileAsset` + `AssetEvidence` row with role.
  2. `POST /api/assets/evidence/[id]/extract` calls the configured provider, persists
     a candidate with provenance; intake status becomes `NEEDS_REVIEW`.
  3. `POST /api/assets/evidence/[id]/review` records ACCEPT/CORRECT/REJECT with
     immutable correction evidence; intake may advance to `READY_FOR_REGISTRATION`
     once all required evidence is reviewed.
- **Failure modes:** unavailable storage/provider adapter returns an explicit
  `UNAVAILABLE`, never a false success; spoofed/oversized content rejected before
  provider invocation; a workbook/Sheet row failing validation is reported per-row
  without blocking valid rows in the same batch; LINE handoff (FR-069-001, not in this
  slice) stays outside this feature per ADR-079 D8.

## Implementation map

| Requirement | Current code (legacy repo path) |
|---|---|
| FR-087-001 | `apps/server/src/modules/asset-management/application/asset-evidence-service.js`, `domain/evidence-policy.js`, `apps/server/src/app/api/assets/evidence/route.js` |
| FR-087-002 | `apps/server/src/modules/asset-management/application/asset-extraction-job-service.js`, `apps/server/src/app/api/assets/evidence/[id]/extract/route.js`, `.../review/route.js` |
| FR-087-003 | `apps/server/src/app/api/assets/import/xlsx/route.js`, `.../sheets/route.js`, `.../template/route.js`, `apps/server/src/app/api/assets/intakes/export/route.js` |
