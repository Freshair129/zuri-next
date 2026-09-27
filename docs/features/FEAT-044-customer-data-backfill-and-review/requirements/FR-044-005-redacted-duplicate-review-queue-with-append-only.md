---
id: FR-044-005
title: "Redacted duplicate review queue with append-only decisions"
delivery: live
legacy: [FR-078 (split 5/5)]
relations:
  specified_by: [SDD-044, API-114]
  derived_from: [BR-046]
---

# FR-044-005 — Redacted duplicate review queue with append-only decisions

The system SHALL expose held rows grouped into deterministic review cases
(case id from batch id + SHA-256 group fingerprint) showing only ids, source row
numbers, hashes, counts and boolean evidence flags; SHALL let a holder of the
Business-scoped `CUSTOMER_DATA_REVIEWER` capability list cases
(`GET /api/platform/customer-import-reviews`), search masked target Customers
(`GET …/targets`, limit ≤ 50) and append decisions `CREATE_SEPARATE`, `LINK_EXISTING`,
`REJECT` or `DEFER` (`POST …/{caseId}/decisions`) with the case's expected version;
decisions are append-only, actor-bound, versioned per item, and a `LINK_EXISTING`
target outside the contract Tenant/Business is refused. The response states
`decisionRecorded: true, applyRequired: true, publishesCustomers: false`.

## Acceptance criteria

- AC-044-005-01 — Given a Product Owner or platform operator without the reviewer binding, when listing the queue, then 403.
- AC-044-005-02 — Given a stale `expectedVersion`, when appending, then the decision is refused and nothing is written.
- AC-044-005-03 — Given a queue response, when inspected, then no display name, tax id, email, phone, postcode or raw source key appears; target labels are masked (first character + dots).
- AC-044-005-04 — Given a Business other than the contract Business, when requested, then 404.

## Implementation

- apps/server/src/modules/crm/customer-import-review-service.js; apps/server/src/modules/crm/customer-import-review-store.js; apps/server/src/app/api/platform/customer-import-reviews/**; apps/server/src/app/(pm)/platform/customer-import-reviews/page.jsx; apps/server/scripts/build_smartgift_customer_review_queue.py

## Verification

- TC-044-003 — Review queue service, API and UI (see [verification.md](../verification.md))
