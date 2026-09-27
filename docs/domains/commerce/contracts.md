# Contracts — Commerce

### API-229
Owner: DOM-COM
Routes: `GET/POST /api/commerce/orders`, `GET/PATCH /api/commerce/orders/[id]`
**Purpose:** Create/list/read/update `SalesOrder` and drive its status machine
(CONFIRM/COMPLETE/CANCEL).
**Auth/scope:** Business visibility + `commerce` domain to read; Business OWNER or
`SALES_REP` to write.
**Errors:** 404 scope; 409 stale `version`/invalid transition; per-SKU shortage list
on COMPLETE refusal.
**Implements:** FR-083-001, FR-083-002
**Legacy:** `apps/server/src/app/api/commerce/orders/route.js`, `.../orders/[id]/route.js`

### API-230
Owner: DOM-COM
Routes: `POST /api/commerce/orders/[id]/payments`, `GET/PATCH /api/commerce/payments/[id]`
**Purpose:** Record a payment against an order; verify or reject a PENDING payment.
**Auth/scope:** `commerce.order.write` to record; `commerce.payment.verify` to
verify/reject — two distinct ladders.
**Errors:** 404 scope; 409 duplicate `bankReference` / acting on a non-PENDING payment.
**Implements:** FR-083-003
**Legacy:** `apps/server/src/app/api/commerce/orders/[id]/payments/route.js`, `.../payments/[id]/route.js`

### API-237
Owner: DOM-COM
Route: `GET /api/commerce/revenue`
**Purpose:** Read-only revenue summary — VERIFIED payments net of VERIFIED refunds,
by origin and day (Asia/Bangkok calendar), pending money shown separately.
**Auth/scope:** Business visibility + `commerce` domain.
**Implements:** FR-083-004
**Legacy:** `apps/server/src/app/api/commerce/revenue/route.js`

### API-232
Owner: DOM-COM
Route: `POST /api/commerce/pos/checkout`
**Purpose:** Atomic walk-in order + pending payment + tracked-stock issue, with cash
change.
**Auth/scope:** Business OWNER or `SALES_REP`, selected active Branch/WarehouseLocation.
**Errors:** whole-transaction rollback on any of: invalid line/product/customer
scope, missing location, insufficient cash, duplicate reference, inventory
shortage, lot/serial refusal, later audit failure.
**Implements:** FR-084-001
**Legacy:** `apps/server/src/app/api/commerce/pos/checkout/route.js`

### API-231
Owner: DOM-COM
Route: `GET /api/commerce/pos/catalogue`
**Purpose:** Same-Business active-product identity + recomputed stock for POS, no
cost-derived price.
**Auth/scope:** Business visibility + `commerce` domain.
**Implements:** FR-084-002
**Legacy:** `apps/server/src/app/api/commerce/pos/catalogue/route.js`

### API-225
Owner: DOM-COM
Route: `GET/POST /api/commerce/billing/config`
**Purpose:** Configure/read `BusinessBillingProfile` (issuer/VAT/PromptPay/non-VAT/
walk-in policy).
**Auth/scope:** Business OWNER.
**Implements:** FR-084-003
**Legacy:** `apps/server/src/app/api/commerce/billing/config/route.js`

### API-227
Owner: DOM-COM
Route: `POST /api/commerce/billing/documents/preview`
**Purpose:** Non-persistent `CommerceDocument` preview — no number, timestamp or row.
**Auth/scope:** Business visibility + `commerce` domain, validated issuer/tax/buyer
policy.
**Implements:** FR-084-004
**Legacy:** `apps/server/src/app/api/commerce/billing/documents/preview/route.js`

### API-226
Owner: DOM-COM
Route: `POST /api/commerce/billing/documents`
**Purpose:** Idempotent, immutable `CommerceDocument` issuance with sequence
allocation and one audit event.
**Auth/scope:** Business OWNER or billing-authorized role.
**Errors:** 409 idempotency-key reuse with changed input; refused if durable RECEIPT
under-paid.
**Implements:** FR-084-005
**Legacy:** `apps/server/src/app/api/commerce/billing/documents/route.js`

### API-228
Owner: DOM-COM
Route: `GET /api/commerce/billing/documents/[id]`
**Purpose:** Read one immutable issued document snapshot.
**Auth/scope:** Business visibility + `commerce` domain.
**Implements:** FR-084-005
**Legacy:** `apps/server/src/app/api/commerce/billing/documents/[id]/route.js`

### API-236
Owner: DOM-COM
Routes: `GET/POST /api/commerce/pricing-rules`, `GET /api/commerce/pricing-rules/[id]`,
`POST /api/commerce/pricing-rules/[id]/actions`
**Purpose:** Author/list/read a `PricingRuleSet`; apply a lifecycle action
(APPROVE/REVOKE/etc.) under revision CAS.
**Auth/scope:** Business OWNER + domain visibility.
**Errors:** 409 stale revision; refused on cyclic dependency or an edit to an
approved (immutable) rule set.
**Implements:** FR-085-001
**Legacy:** `apps/server/src/app/api/commerce/pricing-rules/route.js`, `.../[id]/route.js`, `.../[id]/actions/route.js`

### API-235
Owner: DOM-COM
Route: `POST /api/commerce/pricing-rules/preview`
**Purpose:** Non-persisted price evaluation preview through the shared evaluator.
**Auth/scope:** Business OWNER + domain visibility (internal cost/variable view).
**Implements:** FR-085-002
**Legacy:** `apps/server/src/app/api/commerce/pricing-rules/preview/route.js`

### API-233
Owner: DOM-COM
Route: `POST /api/commerce/pricing-rules/calculate`
**Purpose:** Persisted `PricingCalculation` with pinned rule/input/evaluator lineage.
**Auth/scope:** Business OWNER or an authorized runtime caller (e.g. SmartGift quote
engine) + domain visibility.
**Implements:** FR-085-002
**Legacy:** `apps/server/src/app/api/commerce/pricing-rules/calculate/route.js`

### API-234
Owner: DOM-COM
Route: `GET /api/commerce/pricing-rules/catalog`
**Purpose:** Customer-safe catalog projection of approved computed prices — no cost,
floor or margin exposed.
**Auth/scope:** Scope depends on caller (public sell-side projection vs. internal
read) — see FEAT-085 §9 for a caveat on how thoroughly this was re-verified.
**Implements:** FR-085-003
**Legacy:** `apps/server/src/app/api/commerce/pricing-rules/catalog/route.js`
