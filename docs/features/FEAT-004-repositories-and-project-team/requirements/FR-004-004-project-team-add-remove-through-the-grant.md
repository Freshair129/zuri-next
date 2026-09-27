---
id: FR-004-004
title: "Project Team add/remove through the grant contract"
delivery: live
legacy: [FR-036 (split 2/2 — mutations)]
relations:
  specified_by: [API-066]
  depends_on: [FR-030-001]
  derived_from: [BR-061]
---

# FR-004-004 — Project Team add/remove through the grant contract

The system SHALL let an owner of the Project's Business add a Person to the Business scope
(granting a Business Membership with domain `projects` via the identity grant contract,
provenance ADMIN, reason `project-team:<projectId>`) and remove a Business-scoped
Membership (revocation via the identity contract with a recorded reason), each also audited
on the Project. Memberships of Group (PORTFOLIO/TENANT) workspaces and tenant-wide
Memberships SHALL be read-only here. A role change SHALL NOT be performed here: a request
whose role differs from the current one SHALL be refused (409 `ROLE_CHANGE_MOVED_TO_PERMISSIONS`).

## Acceptance criteria

- AC-004-004-01 — Given a Person already in scope, when added again, then refused "already in this project scope".
- AC-004-004-02 — Given a Project in a TENANT Space, when adding a member, then refused ("Group project team memberships are read-only").
- AC-004-004-03 — Given a PATCH changing MEMBER → OWNER, then 409 and no Membership change.

## Verification

- TC-004-003 — Project Team service and authorization (see [verification.md](../verification.md))
