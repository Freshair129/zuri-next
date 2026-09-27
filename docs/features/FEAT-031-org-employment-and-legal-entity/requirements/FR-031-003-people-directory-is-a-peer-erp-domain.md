---
id: FR-031-003
title: "People Directory is a peer ERP domain over Person/Membership, not a Projects sub-screen"
delivery: implemented
legacy: [FR-042]
relations:
  specified_by: [SDD-031]
  decided_by: [ADR-004]
---

# FR-031-003 — People Directory is a peer ERP domain over Person/Membership, not a Projects sub-screen

The People Directory (route key `people`) SHALL be a Business-scoped peer
domain alongside Projects & Work, never nested under Development, reading
`Person`/`Membership`/`Employment` for its roster; Project Team membership
SHALL remain Project-local and SHALL NOT be unified with the People
Directory. Attendance, leave, payroll and performance tracking are
out of scope.

## Acceptance criteria

- AC-031-003-01 — Given the top-level navigation, when rendered, then "People" is a peer entry alongside Projects & Work, not a child route under it.
- AC-031-003-02 — Given a Project's Team panel, when compared with the Business's People Directory, then the two remain distinct reads (Project Team stays Project-local) rather than one unified list.

## Implementation

- `apps/server/src/modules/people/components/PeopleDirectory.jsx`, `apps/server/src/config/domains.js`, `apps/server/src/modules/project-manager/project-domain-catalog.js` (route key `people` registered as a peer domain)

## Verification

- TC-031-003 — People Directory is a peer domain, distinct from Project Team (see [verification.md](../verification.md))
