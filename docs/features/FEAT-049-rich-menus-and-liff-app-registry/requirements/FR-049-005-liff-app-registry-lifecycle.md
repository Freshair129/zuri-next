---
id: FR-049-005
title: "LIFF app registry lifecycle"
delivery: implemented
legacy: [FR-153 (split 1/2)]
relations:
  specified_by: [API-130]
  decided_by: [ADR-044]
---

# FR-049-005 — LIFF app registry lifecycle

The system SHALL register a LIFF app per account with a Tenant-unique `code`,
name, view size, https endpoint, an allow-listed scope set, and hold it
`DRAFT` until its LINE-issued `liffId` is recorded (`RECORD_LIFF_ID`, which
activates it), `ACTIVE` from then, `ARCHIVED` on request.

## Acceptance criteria

- AC-049-005-01 — Given a DRAFT app, when `RECORD_LIFF_ID` is applied with a shape-valid, account-unique id, then the app becomes `ACTIVE`.
- AC-049-005-02 — Given an https endpoint requirement, when a non-https endpoint is submitted, then the write is refused.

## Implementation

- `apps/server/src/modules/line-oa-studio/domain/line-oa-liff-app.js`, `application/line-oa-liff-app-service.js`

## Verification

- TC-049-005 — LIFF app lifecycle (see [verification.md](../verification.md))
