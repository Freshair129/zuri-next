---
id: FR-024-002
title: "Users & Permissions administers Membership role and domain grants"
delivery: live
legacy: [FR-038]
relations:
  specified_by: [SDD-024]
  decided_by: [ADR-021]
---

# FR-024-002 — Users & Permissions administers Membership role and domain grants

The system SHALL restrict `/platform/users` to an OWNER (or the installation
operator) and SHALL let them edit a Membership's role and per-domain
visibility for Businesses they own. A `MEMBER` SHALL receive no domain
visibility unless explicitly granted; `OWNER`/`DEV` SHALL retain role-bound
all-domain access. `addBusinessMembership` (`POST
/api/platform/users/memberships`) SHALL attach an **existing** Person (exact
code or email) to an owned Business as `MEMBER` with a domain allow-list; it
SHALL NOT create a Person and SHALL NOT grant `OWNER`.

## Acceptance criteria

- AC-024-002-01 — Given a non-owner, non-operator caller, when they request `/platform/users` or its API, then the request is refused.
- AC-024-002-02 — Given an owner adding an existing Person to their own Business with a two-domain allow-list, when the request completes, then the Person's Membership grants exactly those two domains and no others.
- AC-024-002-03 — Given a request to grant `OWNER` through `addBusinessMembership`, when it is submitted, then it is refused — promotion to OWNER stays a separate, separately audited act.

## Implementation

- `apps/server/src/app/(pm)/platform/users/page.jsx`, `apps/server/src/app/api/platform/users/{route.js,memberships/route.js}`, `apps/server/src/modules/identity/{platform-users-view.js,profile-permission-service.js}`

## Verification

- TC-024-001 — Users & Permissions authority and read scope (see [verification.md](../verification.md))
