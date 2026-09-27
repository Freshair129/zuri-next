---
id: FR-003-009
title: "Writes are authorized at the governing Business"
delivery: live
legacy: [FR-072]
relations:
  specified_by: [SDD-003]
  derived_from: [BR-002, SEC-001, SEC-007]
---

# FR-003-009 — Writes are authorized at the governing Business

The system SHALL resolve a request viewer for every mutating route of this feature and
refuse the write unless `ownsBusiness(viewer, governingBusiness)`, where the governing
Business is the Project's direct owner (falling back to its Space's Business), reached from a
Workstream/Container/Item/Milestone/Gate through its Project, and — for a Dependency — the
governing Business of BOTH endpoints. An unowned target SHALL answer exactly as a
nonexistent one (404, same message); a target governed above Business (Project in a
PORTFOLIO/TENANT Space, unknown scope type) SHALL be refused for every principal (403) with a
message naming the missing authority.

## Acceptance criteria

- AC-003-009-01 — Given a visible-but-unowned Project, when a Workstream is created in it, then the response equals the response for a random UUID.
- AC-003-009-02 — Given a Project in a TENANT Space, when any principal patches it, then 403 naming the missing Business authority.
- AC-003-009-03 — Given no session, then every mutating route returns 401 before touching data.

## Implementation

- apps/server/src/modules/project-manager/application/project-authorization.js (all services above call it)

## Verification

- TC-003-006 — Governing-Business write authorization (see [verification.md](../verification.md))
- TC-003-007 — Milestone/gate authorization and route seams (see [verification.md](../verification.md))
