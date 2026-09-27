---
id: FR-003-003
title: "Project Business ownership and Space context"
delivery: live
legacy: [FR-043]
relations:
  decided_by: [ADR-005]
  derived_from: [BR-003]
---

# FR-003-003 — Project Business ownership and Space context

The system SHALL store a Project's owner as a direct nullable `businessId` plus a required
`workspaceId` (its Space). A Project in a BUSINESS Space SHALL have `businessId` equal to the
Space's Business; a Project in a PORTFOLIO/TENANT Space SHALL have a null owner; any other
combination SHALL be refused. Moving a Project to another Space SHALL require write
authority over both the current and the destination governing Business and SHALL be refused
across different Businesses.

## Acceptance criteria

- AC-003-003-01 — Given a BUSINESS Space of Business A and requested `businessId` B, then the create is refused ("owner must match its Space Business").
- AC-003-003-02 — Given a Project of A moved to a Space of B, then it is refused ("Cannot move a Project across Business Spaces").
- AC-003-003-03 — Given a null-owner Project, then Business Home of any Business does not count it.

## Implementation

- project-service.js (`resolveProjectBusinessId`, `updateProject`)

## Verification

- TC-003-003 — Business ownership binding (see [verification.md](../verification.md))
