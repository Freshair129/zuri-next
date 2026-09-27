---
id: FR-032-003
title: "Operator access is time-boxed, renewable and its use is recorded"
delivery: implemented
legacy: [FR-197]
relations:
  specified_by: [SDD-032]
  decided_by: [ADR-025]
---

# FR-032-003 — Operator access is time-boxed, renewable and its use is recorded

`issueOperatorGrant` SHALL require an existing standing operator, a
mandatory reason and `expiresAt` capped at 90 days; renewal SHALL supersede
any prior ACTIVE grant for that Person/capability in the same transaction.
`hasOperatorGrant` SHALL honour `expiresAt` even while `status` still reads
`ACTIVE`. `assertOperatorAndRecordUse` SHALL write one `OPERATOR_ACTION`
audit event per successful audit-read or backup preview/restore; a denied
attempt SHALL write nothing.

## Acceptance criteria

- AC-032-003-01 — Given a grant past its `expiresAt` but still `ACTIVE` in the row, when `hasOperatorGrant` checks it, then it resolves false.
- AC-032-003-02 — Given a successful `GET /api/audit` by an operator, when the request completes, then exactly one `OPERATOR_ACTION` audit event is written; a denied attempt writes none.

## Implementation

- `apps/server/src/modules/identity/{operator-bootstrap.js,operator-use.js}`, `apps/server/src/app/api/{audit/route.js,backup/export/route.js}`

## Verification

- TC-032-003 — Operator grant expiry, renewal and use-recording (see [verification.md](../verification.md))
