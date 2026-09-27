---
id: FR-043-001
title: "Consent status lifecycle on Customer"
delivery: live
legacy: [FR-103 (split 1/3)]
relations:
  specified_by: [SDD-043]
  derived_from: [SEC-004]
---

# FR-043-001 — Consent status lifecycle on Customer

The system SHALL hold on each Customer a `consentStatus` of `PENDING` (default for
every new Customer), `GRANTED`, `DECLINED` or `GRANDFATHERED` (the value backfilled for
Customers that existed before the column), plus `consentRecordedAt`,
`consentRecordedByPersonId` and an optional `consentNote`.

## Acceptance criteria

- AC-043-001-01 — Given a Customer created by the ingest seam, when read, then its status is `PENDING`.
- AC-043-001-02 — Given the consent migration applied to existing rows, when they are read, then their status is `GRANDFATHERED`, not `PENDING`.

## Implementation

- apps/server/prisma/schema.prisma (Customer consent columns); apps/server/supabase/migrations/20260826080000_customer_consent.sql; apps/server/src/lib/validation/enums.js

## Verification

- TC-043-002 — Default and grandfathered statuses (see [verification.md](../verification.md))
