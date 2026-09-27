# Decisions — Asset Management

### ADR-078 — Asset Management is a first-class domain for the physical asset lifecycle
Owner: DOM-AST
**Status:** Accepted (architecture boundary; each runtime slice separately gated by its own requirement ids).

**Context:** Zuri needs an operational system for receiving equipment, recording
inspection evidence, issuing asset codes, assigning custody, transferring location,
maintaining, stocktaking and disposing of assets. The capability begins near
Procurement but outlives a single receipt — custody, maintenance, stocktake and
disposal continue long after a Goods Receipt closes. Putting it under
Commerce/Procurement, Platform, or HR/People would each misplace ownership; the
existing `FileAsset` model already means managed file content and cannot be reused
for physical equipment.

**Decision:**
- One first-class domain, `DOM-AST` (route key `assets`), peer to Commerce/CRM/
  Marketing, on the existing application origin (no separate deployment).
- `RegisteredAsset` is the physical asset aggregate (internal UUID + stable,
  never-recycled human Asset ID); `FileAsset` is untouched and unrenamed.
- Asset Management owns the full post-receipt physical lifecycle (registration,
  custody, location, maintenance, stocktake, disposal); Procurement keeps Supplier/
  PO/GRN authority; HR/People keeps Person/Membership authority; Platform/Identity
  keeps viewer/session/authorization; Accounting/Finance is a future, separate
  authority for capitalization and journals — this domain only produces advisory
  evidence for it.
- Every meaningful lifecycle transition is explicit, validated, authorized and
  appends an `AuditEvent`; disposed asset codes are never recycled; a QR/barcode is
  an identifier only, never an authorization credential.
- Intake channels converge on one strict envelope; evidence content stays in
  `FileAsset`, extraction output is candidate evidence that can never self-approve.

**Consequences:**
- Physical assets get one stable identity and owner across their operational life
  without merging Procurement/Asset Management tables or duplicating Zuri's
  authentication/session/audit infrastructure.
- The implementation is offline-first (SQLite/Prisma) with no independent asset
  database or microservice authorized by this ADR alone.
- Runtime changes (routes, models, services) still require their own declared
  requirement ids and tests — this ADR reserves architecture identity only.

Legacy: ADR-055

### ADR-079 — Asset Evidence Cloud and Extraction Boundary
Owner: DOM-AST
**Status:** Accepted as beta for implementation (2026-09-02).

**Context:** The foundation (ADR-078) stopped before cloud files, OCR/Vision,
workbook execution and LINE handoff. The next slice must process sensitive receipts
and payment proofs while preserving offline-first authority, Business isolation,
provider substitutability and a human decision boundary.

**Decision:**
- One canonical intake writer: every surface converges on `AssetIntakeEnvelope`, and
  adapters may normalize input but never write Asset tables directly.
- `FileAsset` owns content identity (server-calculated SHA-256, `MANAGED_BLOB`);
  `AssetEvidence` owns role/extraction/review meaning — never duplicated bytes.
- A provider-neutral private object port (`put`/`get`/`remove`) over an opaque
  reference; no public URLs; append-only, content-addressed paths; unavailable
  adapter yields an explicit unavailable result, never a false success.
- Content is verified (scope → size/MIME allow-list → magic-byte match → SHA-256)
  before any provider call.
- Extraction is candidate evidence only: provider/model identity, confidence,
  provenance persisted; a separate trusted reviewer decision is required before
  `READY_FOR_REGISTRATION`.
- Two distinct Business-scoped write capabilities (`ASSET_RECEIVER` intake write,
  `ASSET_REVIEWER` evidence review) — read visibility is not write authority.
- Excel/Google Sheets are bounded, preview-first, one-way snapshot adapters, never a
  live sync or a second source of truth.
- LINE transport stays outside this domain: zuri-cli owns signatures/byte-fetch;
  zuri-ai accepts only a trusted transport identity and opaque `FileAsset` ids.
- Idempotency binds `businessId + sourceChannel + sourceCorrelationId` to a payload
  hash; a replay returns the existing draft, a different payload returns a conflict.
- This slice stops before registration: the highest successful status is
  `READY_FOR_REGISTRATION`.

**Consequences:**
- Sensitive file/AI integrations stay replaceable and server-confined; every channel
  gets identical deterministic validation; provider outages cannot silently create an
  accepted intake.
- Reviewer roles and evidence status must be operated explicitly; Google Sheets
  remains snapshot-based; registration is a separate feature (FEAT-086).

Legacy: ADR-056

### ADR-080 — Asset Evidence Production Deployment and Migration Boundary
Owner: DOM-AST
**Status:** Accepted as beta (2026-09-02); remote target/apply/canary/promotion gates
run only under explicit operator instruction.

**Context:** ADR-079 defined the storage/extraction boundary; production
activation exposed operational facts the local implementation didn't need to close:
no unambiguous Vercel project/Supabase link bound at decision time, Asset migrations
existing only in the local Prisma lane, and required provider variable names absent
from example environment files. Production evidence includes real receipts and
payment proofs, so guessing a target or running SQLite-oriented SQL against
PostgreSQL would be a higher-severity failure than postponing activation.

**Decision:**
- Every production command binds to an explicit Vercel team/project and Supabase
  project ref; a missing/mismatched target fails closed (no auto-created duplicate
  project).
- `supabase/migrations/` reviewed SQL is the production PostgreSQL authority;
  SQLite Prisma migrations are never applied to Supabase directly.
- Asset production migrations are additive only, transactional, receipt-backed; no
  down-migration may drop evidence, audit or Asset data.
- Storage stays private, 20 MiB-bounded, MIME-restricted, server-service-role-only;
  responses/canaries carry opaque references, never public URLs or credentials.
- Provider variable names are explicit server contracts declared with empty/example
  values; secrets live only in the deployment's production secret scope.
- Activation sequence is target-identity+backup → additive migration+ledger
  verification → private bucket/config verification → protected deployment from a
  merged main SHA → synthetic redacted canary → promotion; promotion is forbidden
  while any earlier gate is missing.
- The first live canary uses synthetic evidence containing no real person/bank/tax
  data; logs may retain hashes/status/timing, never document bytes or extracted
  values.
- Rollback separates application traffic (alias rollback) from additive data
  (migrations/receipts are never dropped as a rollback shortcut).

**Consequences:**
- Production commands become target-specific, repeatable and reversible at the
  application layer; the first live proof carries no real payment/identity data.
- Activation waits on owner-authenticated target binding; two additional production
  migration artifacts and focused tests are required before any canary.

Legacy: ADR-057
