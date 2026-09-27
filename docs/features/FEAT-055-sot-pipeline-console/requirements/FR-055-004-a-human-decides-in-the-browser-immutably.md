---
id: FR-055-004
title: "A human decides in the browser, immutably"
delivery: live
legacy: [FR-100 (split 2/3)]
relations:
  specified_by: [SDD-055, API-162]
---

# FR-055-004 — A human decides in the browser, immutably

The system SHALL list decisions (`GET /api/platform/sot/decisions?tenantId=&businessId=&status=&decisionType=&phaseId=&limit≤200`)
for viewers who see the Business, and SHALL accept
`POST /api/platform/sot/decisions/{id}/decide` with `{decision: APPROVED|REJECTED, reason?}`
only from an installation operator or the owner of the decision's Business (or Tenant
when unbound); rejection requires a reason; a non-PENDING row is refused 409 (change
requires a new version); each decision is audited and the audit id stored on the row.

## Acceptance criteria

- AC-055-004-01 — Given a REJECTED decision without reason, when posted, then 400.
- AC-055-004-02 — Given an already APPROVED row, when decided again, then 409.

## Verification

- TC-055-002 — Decision queue submit/decide/export (see [verification.md](../verification.md))
