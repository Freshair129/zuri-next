# Contracts — Market Intelligence

### API-243
Owner: DOM-MKI
`GET /api/market/observations`

**Purpose:** Read a Business's translated `MarketObservation`s, newest-observed first,
with per-provider and per-resolution-status counts, for the `/market` console page.

**Auth/scope:** Requires a resolved viewer; refuses (404, "Business not found") unless
the viewer both sees the Business (`seesBusiness`) and has the `market` domain granted
(`assertDomainVisible`) — identical refusal shape for "doesn't exist" and "not
permitted" so existence is never disclosed.

**Request:** query params `businessId` (required, non-empty string), `limit` (optional,
positive int, capped at 200, default 50).

**Response:** `{ version, scope: { businessId, businessName, tenantId }, counts: {
observations, providers, byResolutionStatus }, limit, truncated, observations: [{ id,
provider, observationType, sourceEntityType, externalId, sourceUri,
translationSchemaVersion, resolutionStatus, resolutionConfidence, canonicalProductRef,
canonicalCategoryRef, observedAt, translatedAt, title, price, currency, seller,
condition, candidate }] }`.

**Errors:** 403 if malformed/missing viewer session (upstream); 404 Business not found
(covers both nonexistent and not-visible); 400 on invalid query (zod).

**Implements:** FR-088-002
**Legacy:** `apps/server/src/app/api/market/observations/route.js`

---

### API-244
Owner: DOM-MKI
`POST /api/market/translations`

**Purpose:** Owner-triggered translation run over a Business's untranslated
`MARKET_INTELLIGENCE` raw backlog; the only production path that invokes the FR-088-001, FR-088-002, FR-088-003
translation seam outside a test.

**Auth/scope:** Requires a resolved viewer who both has `market` domain visibility and
`ownsBusiness` (write-level authorization) — refused 404 identically whether the
Business does not exist or is not owned, per this system's disclosure discipline.

**Request:** JSON body `{ businessId (required), limit (optional, positive int, capped
at 100, default 20) }`.

**Response:** `{ translated: number, unchanged: number, failed: [{ rawRecordId, reason
}] }`.

**Errors:** 404 Business not found/not owned; 400 on invalid body (zod, `.strict()`
rejects unknown fields).

**Side effects:** persists up to `limit` new `MarketObservation` rows; records exactly
one `MARKET_TRANSLATION_RUN` audit event per call (counts only, no raw payloads).

**Implements:** FR-088-003
**Legacy:** `apps/server/src/app/api/market/translations/route.js`

---

## Not yet routed (internal/service-facing, ADR-082)
The extracted `services/market-intelligence` process (M2, in progress) exposes
`/healthz`, `/readyz`, `GET /v1/observations`, `POST /v1/translations` internally, and
calls core's private façade `/api/internal/market-intelligence/v1/*` for authority, raw
evidence and audit. None of this is client-reachable or production-authoritative yet
(`MARKET_EXECUTOR` defaults to `legacy`) — not declared as a public API/EVT contract
in this pass; revisit once ADR-082 M3 lands core façade routing.
