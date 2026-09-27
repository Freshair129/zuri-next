---
id: FR-043-002
title: "Only a Business owner may attest consent"
delivery: live
legacy: [FR-103 (split 2/3)]
relations:
  specified_by: [SDD-043, API-112]
  derived_from: [SEC-004, BR-046]
---

# FR-043-002 — Only a Business owner may attest consent

The system SHALL accept an attestation (`POST /api/crm/customers/{customerId}/consent`,
body `{businessId, status: GRANTED|DECLINED, note?}` with note ≤ 1000 chars) only when
the viewer has the `customer` domain for that Business (else the FR-003-009 404) and owns
that Business (else 403), and SHALL resolve the Customer only within that Business's
Tenant (404 `CUSTOMER_NOT_FOUND` otherwise). It SHALL write the status, time, actor and
note and one `CUSTOMER_CONSENT_GRANTED|DECLINED` audit event in one transaction; the
audit payload carries previous and new status and scope ids only.

## Acceptance criteria

- AC-043-002-01 — Given a Member without owner authority but with the CRM domain, when attesting, then 403 and nothing changes.
- AC-043-002-02 — Given a principal without the CRM domain in the Business, when attesting, then 404 (existence not revealed).
- AC-043-002-03 — Given an owner of Business A and a Customer of another Tenant, when attesting through A, then 404.
- AC-043-002-04 — Given a valid attestation, when stored, then the audit payload has `previousStatus` and `status` and no contact detail.

## Implementation

- apps/server/src/modules/crm/customer-consent-service.js; apps/server/src/app/api/crm/customers/[customerId]/consent/route.js

## Verification

- TC-043-001 — Attestation authority, scope and audit (see [verification.md](../verification.md))
