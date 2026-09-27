---
id: FR-014-001
title: "Feature records"
delivery: building
legacy: [FR-252 (split 1/7 — records)]
relations:
  specified_by: [SDD-014, API-061, API-054]
  decided_by: [ADR-015]
---

# FR-014-001 — Feature records

The system SHALL let an owner of the Project's Business create a ProjectFeature (`code` unique
within the Project, 1–128 chars; `title` ≤ 500; `problem` and `outcome` ≤ 5000; `primaryDomainId`
recognised by the product-domain catalogue; optional `canonicalFeatureKey` + `governanceSnapshotId`
supplied together or not at all; lifecycle starting DRAFT) and edit title, problem, outcome,
primary domain and lifecycle (DRAFT, ACTIVE, RETIRED), with at most 200 Features per Project.

## Acceptance criteria

- AC-014-001-01 — Given a code already used by a live Feature, then 409 `DUPLICATE_FEATURE_CODE`; by a deleted Feature, then 409 `DELETED_FEATURE_CODE_REQUIRES_RESTORE`.
- AC-014-001-02 — Given `canonicalFeatureKey` without `governanceSnapshotId`, then 400 `MALFORMED_REQUEST`.
- AC-014-001-03 — Given 200 Features, when creating another, then 422 `FEATURE_LIMIT_REACHED`.

## Implementation

- apps/server/src/modules/project-manager/application/project-feature-service.js; project-feature-repository.js; apps/server/src/app/api/projects/[id]/features/**; apps/server/src/app/api/projects/[id]/feature-work-links/route.js

## Verification

- TC-014-001 — Feature mutations, CAS, idempotency, audit (see [verification.md](../verification.md))
- TC-014-005 — Owner forms in the browser (see [verification.md](../verification.md))
