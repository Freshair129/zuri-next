---
id: FR-055-003
title: "The data plane submits decisions idempotently"
delivery: live
legacy: [FR-100 (split 1/3)]
relations:
  specified_by: [SDD-055, API-163]
  depends_on: [FR-027-001]
  decided_by: [ADR-054, ADR-055]
---

# FR-055-003 — The data plane submits decisions idempotently

The system SHALL accept `POST /api/platform/sot/decisions` with a strict envelope
`{tenantId (uuid), submittedBy, items[1..500]: {decisionType: PRICE_ROW|ENTITY|FILE_CLASSIFICATION|PHASE_GATE, subjectRef, businessId?, phaseId?, payload}}`
only from an installation operator or a data-plane key bound to that Tenant (403
otherwise); per item it SHALL hash the payload and return `UNCHANGED` when the latest
version for `(tenant, type, subjectRef)` has the same hash, else create the next
`decisionVersion` as PENDING.

## Acceptance criteria

- AC-055-003-01 — Given the same batch submitted twice, when the second arrives, then every item is `UNCHANGED`.
- AC-055-003-02 — Given a changed payload for a decided subject, when submitted, then a new PENDING version is created and the decided row is untouched.

## Implementation

- apps/server/src/modules/integration/application/sot-decision-service.js; apps/server/src/app/api/platform/sot/decisions/**; apps/server/src/app/(pm)/platform/sot-pipeline/inbox/page.jsx

## Verification

- TC-055-002 — Decision queue submit/decide/export (see [verification.md](../verification.md))
