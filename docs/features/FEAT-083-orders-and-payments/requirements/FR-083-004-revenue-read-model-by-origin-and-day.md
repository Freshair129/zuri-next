---
id: FR-083-004
title: "Revenue read model by origin and day"
delivery: building
legacy: [FR-163 (split 2/2 — revenue read model sub-behavior of the same PRD row)]
relations:
  specified_by: [SDD-083]
  decided_by: [ADR-076]
---

# FR-083-004 — Revenue read model by origin and day

The system SHALL expose a read-only revenue summary counting VERIFIED payments net of
VERIFIED refunds, on the day the money was paid in the Business's calendar
(Asia/Bangkok), grouped by `origin` and by day, with pending money shown separately —
never mixed into the verified total.

## Acceptance criteria

- AC-083-004-01 — Given one VERIFIED payment and one PENDING payment on the same day, when revenue is read, then only the VERIFIED amount appears in the verified total and the PENDING amount appears separately.
- AC-083-004-02 — Given a VERIFIED refund against a prior VERIFIED payment, when revenue is read for that day, then the day's verified total is net of the refund.

## Implementation

- `apps/server/src/modules/commerce/application/revenue-read-model.js`, `apps/server/src/app/api/commerce/revenue/route.js`

## Verification

- TC-083-004 — Revenue by origin/day, verified-only (see [verification.md](../verification.md))
