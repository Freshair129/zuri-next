---
id: DOM-COM
title: Commerce (Orders, Payments, Pricing)
status: proposed
version: 0.1.0
owner: governance
relations:
  decided_by: [ADR-076, ADR-077]
---

# DOM-COM — Commerce

## Purpose
The Business-scoped authority for what the Business sold, how the money settled, and
which local document snapshot records that sale: the sales order and its lines,
verified payments and refunds, revenue counted only from verified money by origin and
day, immutable invoice/receipt/tax-document snapshots, atomic POS checkout, and the
versioned pricing-rule engine that computes a sell price without leaking cost or
margin. Commerce is the sell side; Procurement is the buy side; the two meet only in
Inventory's stock ledger.

## Ubiquitous language
- **SalesOrder** — `ORD-YYYYMMDD-NNN`, Business-scoped, optional Customer/Conversation
  of the same Tenant, `origin` CHAT/WALK_IN/ONLINE, DRAFT→CONFIRMED→COMPLETED or
  CANCELLED.
- **Payment** — `PAY-YYYYMMDD-NNN`, PAYMENT or REFUND, PENDING→VERIFIED|REJECTED;
  only VERIFIED payments count toward an order's paid state or revenue.
- **CommerceDocument** — an immutable INVOICE/RECEIPT/TAX_INVOICE/ABB_TAX_INVOICE
  snapshot, issued once per idempotency key with a per-Business/type/year sequence;
  preview is non-persistent.
- **BusinessBillingProfile** — the Business's configured issuer/tax/PromptPay policy;
  seller legal identity is read from `LegalEntity`, never copied into a Commerce
  master.
- **POS checkout** — one atomic transaction that creates a WALK_IN order, a PENDING
  payment and issues tracked stock through Inventory, all or nothing.
- **PricingRuleSet / PricingCalculation** — Business-scoped versioned formula rules
  (draft → immutable approved) and pinned deterministic evaluation results; a
  customer-facing projection carries no cost/floor/margin.

## Owned data
- `SalesOrder`, `SalesOrderLine` — order + lines naming an Inventory SKU at sale-time
  price, integer satang.
- `Payment` — method, amount, status, `bankReference` unique per Tenant (attribute,
  not key), slip as a `FileAsset` reference.
- `BusinessBillingProfile` — issuer/VAT/PromptPay/non-VAT/walk-in policy.
- `CommerceDocument`, `CommerceDocumentSequence` — immutable billing snapshot +
  transactional per-Business/type/year counter.
- `PricingRuleSet`, `PricingCalculation` — versioned formula rules and pinned
  evaluation lineage.

**Never stored** (always computed on read): an order's total, paid, balance,
payment state.

## Business rules
No rule found here that is not already covered by a legacy `BR-xxx` PRD row or by the
requirements below; this domain's aggregate invariants (money in satang, lines
locked at CONFIRM, only VERIFIED payments count, fulfilment refuses a SERIAL-tracked
line, POS's atomic three-way write, every write transactional/versioned/audited) are
ADR-076/002 decisions folded into the FR ACs rather than re-declared as separate
`BR-COM-*` rows.

## Public contracts
- `API-229`
- `API-230`
- `API-237`
- `API-232`, `API-231`
- `API-225`, `API-227`, `API-226`, `API-228`
- `API-236`, `API-235`, `API-233`, `API-234`

## Capabilities
Not used — three features cover this pass's declared scope.

## Depends on
- `API-194` (Inventory) — order completion (FEAT-083) and POS
  checkout (FEAT-084) issue tracked stock through this contract inside their own
  transaction; a Commerce role never widens Inventory authority.
- `API-199` (Inventory) — a sales-order/PO-catalogue line naming a
  SKU, and the POS catalogue read, resolve against Inventory's catalogue.
- `legacy:` CRM's Customer/Conversation (read by internal id through the Business's
  Tenant only, never written) — a Conversation supplies its own Customer.
- `legacy:` Identity's `LegalEntity`/Branch (read for billing issuer identity;
  Commerce may update address fields only through the owner flow).
- `FR-075-001` (Knowledge's pre-Stage-1 sell-side admission contract) — the only
  path an approved, allowlisted computed price may enter Knowledge; Commerce never
  writes the Knowledge substrate directly.

## Legacy sources
- Charter: `docs/domains/commerce/CHARTER.md`
- Feature notes: `docs/domains/commerce/features/FR-166-sales-orders.md`,
  `FR-163-payments-and-revenue.md`, `FR-253-pricing-rules-and-engine.md`
- Proposal: `docs/change-requests/ZAI-PROPOSAL-COMMERCE-BILLING-POS-20260910.md`
- `docs/PRD-SDD-v1.0.md` rows FR-083-003, FR-083-004, FR-083-001, FR-083-002, FR-084-001, FR-084-002, FR-084-003, FR-084-004, FR-084-005, FR-085-001, FR-085-002, FR-085-003
- `docs/FEATURES.md` row FEAT-083
- ADRs: ADR-076, ADR-077

<!-- BEGIN GENERATED: feature-index -->

## Feature index (generated)

### Owned features (3)

| Feature | Title | Delivery | Requirements |
|---|---|---|---|
| [FEAT-083](../../features/FEAT-083-orders-and-payments/feature.md) | Orders and payments | building | 5 |
| [FEAT-084](../../features/FEAT-084-pos-billing-and-checkout/feature.md) | POS billing and checkout | building | 6 |
| [FEAT-085](../../features/FEAT-085-pricing-rules-and-formula-console/feature.md) | Pricing rules and formula console | building | 5 |

### Participating in cross-domain features (0)

_None._

### Hosted by services (1)

- [SRV-001](../../services/SRV-001-web/SERVICE.md)

### Classification (ADR-107)

Subdomain: **generic** · Role: **business** — declared in `registry/domains.yaml`.

### Context map (5)

| Direction | Context | Pattern | Evidence | Note |
|---|---|---|---|---|
| downstream of | DOM-IAM | open-host-service | BR-002, ADR-100, ARCH-001 | The one policy-enforcement point; every web, API, agent and tool path resolves its viewer here. |
| downstream of | DOM-PRJ | open-host-service | BR-001, BR-002, BR-003, ARCH-001 | Scope chain (Portfolio → Tenant → Business → Workspace → Project) and the audited-write seam every record hangs from. |
| upstream of | DOM-PLT | conformist | ARCH-001 | Operator-only projections read every domain as is and own nothing. |
| downstream of | DOM-INV | customer-supplier | ARCH-001 | Buy side and sell side meet only in the stock ledger; receipts and fulfilment post through the Inventory contract. |
| downstream of | DOM-MKI | published-language | ARCH-001 | Provider-neutral market observations with lineage and confidence, for another domain or a human to act on. |

<!-- END GENERATED -->
