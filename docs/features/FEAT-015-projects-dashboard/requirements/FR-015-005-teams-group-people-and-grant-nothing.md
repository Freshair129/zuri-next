---
id: FR-015-005
title: "Teams group people and grant nothing"
delivery: live
legacy: [FR-089]
relations:
  specified_by: [API-080, API-078, API-079, API-067]
  decided_by: [ADR-012]
  derived_from: [BR-063, BR-061]
---

# FR-015-005 — Teams group people and grant nothing

The system SHALL let an owner of a Business create, rename, archive (soft) Teams (`code`, name,
description) in that Business; add/remove Persons who hold a Membership in the Business scope (409 if
already present); and attach/detach Teams to Projects of the same Business (many-to-many; 400 for
another Business's Team, 409 if already attached). Reads SHALL require `seesBusiness` and expose a
`manageable` flag from `ownsBusiness`; unowned targets SHALL answer as not found. Team rows SHALL
never be read by the identity resolver or any route guard: adding a Person to a Team changes no role,
grant, visible or owned Business. Work SHALL stay assigned to Persons, never Teams. Every write SHALL
be audited.

## Acceptance criteria

- AC-015-005-01 — Given P added to a Team of Business B, then P's viewer (visible/owned Businesses, domains) is unchanged.
- AC-015-005-02 — Given a Team of Business A and a Project of Business B, then attach is refused (400).
- AC-015-005-03 — Given a Person without Membership in the Team's Business, then 404 "Person not found".

## Implementation

- apps/server/src/modules/project-manager/application/team-service.js; apps/server/src/app/api/teams/**; apps/server/src/app/api/projects/[id]/teams/route.js

## Verification

- TC-015-003 — Teams scope and grants-nothing (see [verification.md](../verification.md))
