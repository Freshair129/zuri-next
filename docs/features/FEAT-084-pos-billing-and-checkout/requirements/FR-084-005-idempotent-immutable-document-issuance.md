---
id: FR-084-005
title: "Idempotent immutable document issuance"
delivery: building
legacy: [FR-186 (split 3/3 — issuance), BR-002]
relations:
  specified_by: [SDD-084]
  decided_by: [ADR-076]

---

# FR-084-005 — Idempotent immutable document issuance

The system SHALL issue a `CommerceDocument` as one immutable snapshot in one
transaction, retry-safe via an idempotency key and a stored canonical request hash
(reusing the key with a changed order/type/branch/buyer/PromptPay choice fails with
409), allocating an atomic per-Business/type/calendar-year sequence and writing
exactly one audit event. A durable RECEIPT SHALL require verified payment at least
equal to the document's gross amount. Billing SHALL accept only the existing FR-083-001, FR-083-002
THB order currency in this slice, with no FX conversion.

## Acceptance criteria

- AC-084-005-01 — Given a fresh idempotency key and a fully VERIFIED-paid order, when RECEIPT issue is requested, then one immutable `CommerceDocument` is created with the next per-Business/type/year sequence number and one audit event.
- AC-084-005-02 — Given the same idempotency key retried with the identical request, when issue is called again, then the same document is returned, not a second one.
- AC-084-005-03 — Given the same idempotency key reused with a different order, when issue is called, then it is refused with 409.
- AC-084-005-04 — Given an order paid less than the document's gross amount, when a durable RECEIPT issue is requested, then it is refused.

## Implementation

- `apps/server/src/app/api/commerce/billing/documents/route.js`, `.../documents/[id]/route.js`

## Verification

- TC-084-002 — Billing config, preview non-persistence, issuance idempotency (see [verification.md](../verification.md))
- TC-084-003 — Domain calculators (unit) (see [verification.md](../verification.md))
- TC-084-004 — Console end-to-end billing/POS flow (see [verification.md](../verification.md))
