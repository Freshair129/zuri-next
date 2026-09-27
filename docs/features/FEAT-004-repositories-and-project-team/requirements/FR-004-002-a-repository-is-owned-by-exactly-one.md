---
id: FR-004-002
title: "A Repository is owned by exactly one Business"
delivery: live
legacy: [FR-073]
relations:
  specified_by: [API-071, API-072]
  derived_from: [BR-002]
---

# FR-004-002 — A Repository is owned by exactly one Business

The system SHALL require `businessId` when creating a Repository and SHALL authorize
creation and update with `ownsBusiness(viewer, repository.businessId)`; an unowned
Repository SHALL answer exactly like a nonexistent one. Linking SHALL require write
authority over BOTH the Project's governing Business and the Repository's Business.
Listing SHALL return only Repositories of Businesses the viewer sees. A Repository with a
null `businessId` (predating this rule) SHALL be governed by nobody: refused for every
writer with the missing owner named, and invisible to every reader until backfilled; the
backfill SHALL infer an owner only when all of the Repository's Project links agree and
report the rest.

## Acceptance criteria

- AC-004-002-01 — Given a viewer who does not own Business B, when creating a Repository for B, then 404 "Business not found".
- AC-004-002-02 — Given a Repository of Business B and a Project of Business A owned by the viewer (B not owned), when linking, then the link is refused as not found.
- AC-004-002-03 — Given an ownerless Repository, then it is absent from every listing and PATCH is refused (403) naming the missing owner.

## Implementation

- repository-service.js; apps/server/src/modules/project-manager/application/project-authorization.js (`assertRepositoryWritable`); apps/server/src/lib/validation/entities.js; apps/server/scripts/backfill-repository-business.mjs

## Verification

- TC-004-002 — Repository Business ownership (see [verification.md](../verification.md))
