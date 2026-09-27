---
id: FR-047-006
title: "Legal hold and 10-year destruction"
delivery: building
legacy: [FR-245 (split 4/4)]
relations:
  specified_by: [SDD-047, API-115]
  decided_by: [ADR-042]
---

# FR-047-006 — Legal hold and 10-year destruction

The system SHALL let a Business owner record an additive legal hold on a Customer
(`POST /api/crm/customers/{customerId}/legal-hold`, `{businessId, reason ≤ 2000,
endDate in the future}`, no AAL2), SHALL on principal erasure destroy the Customer's
archive key unless an active hold exists, and SHALL provide an expiry routine that —
only after the Tenant's whole chain verifies — destroys a Customer's key once all their
archived lines are at least 10 years old and deletes a file once every line in it has
expired.

## Acceptance criteria

- AC-047-006-01 — Given an active legal hold, when the Customer is erased, then their archive key is kept.
- AC-047-006-02 — Given a broken manifest chain, when expiry runs, then nothing is destroyed or deleted and the Tenant is reported skipped.

## Implementation

- apps/server/src/modules/crm/chat-evidence-legal-hold-service.js; apps/server/src/modules/crm/chat-evidence-archive-expiry-service.js; apps/server/src/modules/identity/erase-principal.js; apps/server/src/app/api/crm/customers/[customerId]/legal-hold/route.js

## Verification

- TC-047-004 — Legal hold and expiry (see [verification.md](../verification.md))
