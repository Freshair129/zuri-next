# Decisions — Commerce

### ADR-076 — The Commerce Lane: Orders and Payments
Owner: DOM-COM
**Status:** Accepted.

**Context:** The legacy ERD's "Orders & Payments" was deferred as prior art. The
`commerce` route slot existed with nothing behind it; Inventory (FEAT-077) already
held the goods and the owner's ontology named the offer layer as Commerce's future.
The legacy shapes carried four patterns this system has standing rules against: a
stored `paidAmount`, `items` as a JSON blob, a bank reference as a unique *key*, and
money as `float`.

**Decision:**
- Commerce owns `SalesOrder`/`SalesOrderLine`/`Payment` — the sell side; Procurement
  is the buy side; the two meet only in Inventory's ledger.
- Legacy corrections: `SalesOrderLine` rows replace a JSON blob; total/paid/balance/
  payment state are computed on read, never stored; money is integer satang; a
  Conversation forces `origin: CHAT` and supplies its own Customer (no separate ads
  attribution model yet); `Payment.bankReference` is a unique-as-attribute, not a
  key; `Transaction.type: CREDIT` (store credit) is deliberately not modelled yet.
- Fulfilment (COMPLETE) issues counted stock only through Inventory's exported
  `appendMovement` contract, inside the order's own transaction, and never widens
  Inventory's authority — a Commerce role binding does not grant an Inventory write.
- Authority is two ladders: `commerce.order.write` (Business OWNER or `SALES_REP`) to
  record; `commerce.payment.verify` (Business OWNER or `PAYMENT_VERIFIER`) to verify/
  reject — because revenue is counted from verified money only.
- Not decided here (deferred, each its own future FR): slip OCR, the offer/price
  catalogue, invoices/receipts/tax documents (delivered later by FR-084-003, FR-084-004, FR-084-005), store
  credit, an Ad/ROAS model.

**Consequences:**
- The Commerce slot is live (`/commerce`, `/commerce/orders`); three tables and one
  migration, production SQL not applied as of this writing.
- The legacy ERD's Orders & Payments mapping moves from *target* to *built,
  corrected*.

Legacy: ADR-065

### ADR-077 — Commerce pricing rules and governed Knowledge publication
Owner: DOM-COM
**Status:** Owner-approved for implementation (2026-09-17); implementation approval
is not deployment approval.

**Context:** An approved cost/quote proposal already assigned versioned pricing
rules, one price engine and structured sell-side Knowledge records to specific
tasks; this decision supplies the governing boundary and requirements. Legacy
SmartGift Python/browser calculators had inconsistent FX/floor handling — a fact to
review, not a default to reproduce.

**Decision:**
- Commerce owns `PricingRuleSet` versions and deterministic evaluation
  (`/commerce/pricing-rules`, Business-scoped); a customer-facing price projection
  carries no cost, floor or margin.
- Approved rule sets are immutable; draft writes need their current revision;
  approval records actor/reason/effective date; expiry/revocation preclude new
  calculations while existing pinned results are untouched; a future-effective
  version never activates early; a missing active rule fails closed.
- Formulas are bounded parsed arithmetic over declared typed variables and an
  allowed function set, with an acyclic dependency graph — never `eval`. Mandatory
  floor/rounding stay outside the editable expression.
- Money outputs are integer satang via exact decimal/rational arithmetic; preview,
  persisted calculations and migrated agent callers share one evaluator.
- This narrowly supersedes ADR-069 D9's pricing-execution placement: Commerce owns
  the engine; GKS never calculates business prices or calls Commerce.
- Only deliberately approved, allowlisted sell-side records enter Knowledge, through
  the existing `FR-075-001` pre-Stage-1 admission contract — never a direct
  substrate write or automatic publication on approval; a computed price's Knowledge
  visibility is re-checked against the latest effective approval at every later
  touchpoint (admission, publication, query, citation) and fails closed on any
  policy change.
- Storage has tenant/business isolation, audit, optimistic concurrency and request
  idempotency; migrations are authored/locally verified only — applying them to
  production stays a separate operator step (ADR-057-pattern).

**Consequences:**
- One evaluator and one explicit sell-side adapter preserve both business-price
  ownership and Knowledge traceability, at the cost of a coordinated migration and a
  rule-version lifecycle to operate.
- Keeping the browser/Python legacy calculators would have preserved calculation
  drift; moving the engine into GKS would have mixed business-price authority with
  Knowledge authority — both rejected.

Legacy: ADR-098
