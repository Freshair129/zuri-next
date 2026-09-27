# Contracts — Marketing

### API-260
Owner: DOM-MKT
Routes: `GET/POST /api/growth/plans`, `GET/PATCH /api/growth/plans/[id]`
**Purpose:** Strategy plan draft/revise/review/decision.
**Auth/scope:** `growth` visibility to read; Business ownership to write; expected-version CAS.
**Implements:** FR-089-001
**Legacy:** `apps/server/src/app/api/growth/plans/route.js`, `.../plans/[id]/route.js`

### API-261
Owner: DOM-MKT
Route: `POST /api/growth/plans/[id]/handoff`
**Purpose:** Generate a `PlanEnvelope` from an approved revision and commit through PM's importer with a Marketing receipt.
**Auth/scope:** Business ownership; concurrency guard on the target Workspace.
**Errors:** refused on expired/revoked decision, stale content, scope mismatch.
**Implements:** FR-089-002
**Legacy:** `apps/server/src/app/api/growth/plans/[id]/handoff/route.js`

### API-247
Owner: DOM-MKT
Routes: `GET/POST /api/growth/campaigns`, `GET/PATCH /api/growth/campaigns/[id]`
**Purpose:** Campaign initiative CRUD, PM-handoff binding, close/cancel.
**Auth/scope:** Business ownership; audited optimistic transactions.
**Implements:** FR-089-003
**Legacy:** `apps/server/src/app/api/growth/campaigns/route.js`, `.../campaigns/[id]/route.js`

### API-248
Owner: DOM-MKT
Routes: `GET/POST /api/growth/content`, `GET /api/growth/content/briefs/[id]`, `GET /api/growth/content/assets/[id]`
**Purpose:** Content brief/creative version/review/decision, Library projection.
**Auth/scope:** Business ownership to write; scope+fingerprint+rights revalidated on every read.
**Implements:** FR-089-004
**Legacy:** `apps/server/src/app/api/growth/content/route.js`, `.../briefs/[id]/route.js`, `.../assets/[id]/route.js`

### API-249
Owner: DOM-MKT
Route: `GET /api/growth/content/references`
**Purpose:** Resolve exact Files references for a brief/version without duplicating bytes.
**Implements:** FR-089-004
**Legacy:** `apps/server/src/app/api/growth/content/references/route.js`

### API-257
Owner: DOM-MKT
Route: `GET/POST /api/growth/operations`, `GET/PATCH /api/growth/operations/intake/[intakeId]`
**Purpose:** Intake CRUD and the composed Intake/Calendar/Approvals/Handoffs DTO.
**Auth/scope:** `growth` visibility; expected-version CAS on intake writes.
**Implements:** FR-089-005
**Legacy:** `apps/server/src/app/api/growth/operations/route.js`, `.../operations/intake/[intakeId]/route.js`

### API-258
Owner: DOM-MKT
Route: `GET /api/growth/operations/handoffs/[handoffId]`
**Purpose:** Read one validated owner-domain handoff receipt.
**Implements:** FR-089-005
**Legacy:** `apps/server/src/app/api/growth/operations/handoffs/[handoffId]/route.js`

### API-246
Owner: DOM-MKT
Routes: `GET/POST /api/growth/broadcast-intents`, `GET/PATCH /api/growth/broadcast-intents/[id]`
**Purpose:** Create/revise/archive a `MarketingBroadcastIntent`; dispatch always unavailable.
**Auth/scope:** Business ownership; idempotency key per Business.
**Implements:** FR-089-006
**Legacy:** `apps/server/src/app/api/growth/broadcast-intents/route.js`, `.../broadcast-intents/[id]/route.js`

### API-245
Owner: DOM-MKT
Route: `GET/POST /api/growth/ask-marketing`
**Purpose:** Deterministic Paid Media/AskMarketing projection distinguishing EMPTY/
PARTIAL/UNAVAILABLE/UNKNOWN; never calls CRM or a provider.
**Implements:** FR-089-006
**Legacy:** `apps/server/src/app/api/growth/ask-marketing/route.js`

### API-259
Owner: DOM-MKT
Route: `GET /api/growth/paid-media`
**Purpose:** Paid Media projection (planning intent only; no live account connection).
**Legacy:** `apps/server/src/app/api/growth/paid-media/route.js`

### API-250
Owner: DOM-MKT
Route: `GET /api/insights/brands`
**Purpose:** List brands the signed-in member may open.
**Auth/scope:** server-owned Business binding.
**Errors:** 503 `INSIGHTS_NOT_CONFIGURED` when no persistent repository is wired.
**Implements:** FR-090-001
**Legacy:** `apps/server/src/app/api/insights/brands/route.js`

### API-256
Owner: DOM-MKT
Route: `GET /api/insights/summary`
**Purpose:** A brand's metric summary from one snapshot.
**Implements:** FR-090-001
**Legacy:** `apps/server/src/app/api/insights/summary/route.js`

### API-252
Owner: DOM-MKT
Route: `GET /api/insights/metric/[metricKey]`
**Purpose:** One metric's daily series.
**Implements:** FR-090-001
**Legacy:** `apps/server/src/app/api/insights/metric/[metricKey]/route.js`

### API-253
Owner: DOM-MKT
Route: `GET /api/insights/metric/[metricKey]/export`
**Purpose:** The same series as CSV, from the identical snapshot as the render.
**Implements:** FR-090-001
**Legacy:** `apps/server/src/app/api/insights/metric/[metricKey]/export/route.js`

### API-251
Owner: DOM-MKT
Route: `GET /api/insights/content`
**Purpose:** Content performance read.
**Implements:** FR-090-001
**Legacy:** `apps/server/src/app/api/insights/content/route.js`

### API-254 (declared, not implemented)
Owner: DOM-MKT
Route: `POST /api/insights/refresh` (does not exist in code as of this reading)
**Purpose:** Request a sync run; coalesces same binding/window requests; refuses a
conflicting concurrent run.
**Implements:** FR-090-002
**Legacy:** none — declared in `docs/PRD-SDD-v1.0.md` only

### API-255 (declared, not implemented)
Owner: DOM-MKT
Route: `GET /api/insights/refresh/[syncRunId]` (does not exist in code as of this
reading)
**Purpose:** Read a sync run's state.
**Implements:** FR-090-002
**Legacy:** none — declared in `docs/PRD-SDD-v1.0.md` only
