---
id: FR-031-001
title: "Employment is an HR record, separate from Membership, that grants nothing"
delivery: implemented
legacy: [FR-193]
relations:
  specified_by: [SDD-031]
  decided_by: [ADR-024]
---

# FR-031-001 — Employment is an HR record, separate from Membership, that grants nothing

`Employment` SHALL record `personId`, `tenantId`, `businessId`, optional
`branchId`, `employeeNo`, `title`, `employmentType`
(`EMPLOYEE`/`CONTRACTOR`/`INTERN`/`OWNER_OPERATOR`) and a lifecycle `status`
(`ACTIVE`/`ON_LEAVE`/`ENDED`), separate from `Membership`'s access grant.
`resolveViewer` and the rest of `src/modules/identity/` SHALL NEVER read
`Employment`. `people-service.js` SHALL derive one column,
`hasSystemAccess`, **from** `Membership`, never the reverse. Re-hiring SHALL
create a **new** Employment row, never reopen an ended one.

## Acceptance criteria

- AC-031-001-01 — Given a tenant-wide OWNER Membership holder with no Employment row, when the HR roster is read, then that Person does not appear as an employee.
- AC-031-001-02 — Given a suspended Membership on a Person with an ACTIVE Employment, when the roster is read, then the Person still appears, with `hasSystemAccess: false`.
- AC-031-001-03 — Given a scan of `src/modules/identity/` source, when it runs, then no file references the `Employment` model.

## Implementation

- `apps/server/src/app/api/people/employment/**`, `apps/server/src/modules/people/application/{employment-service.js,people-service.js}`, `apps/server/src/modules/people/components/PeopleDirectory.jsx`

## Verification

- TC-031-001 — Employment roster derivation and identity-module isolation (see [verification.md](../verification.md))
