---
id: FR-008-001
title: "Upsert by external id"
delivery: live
legacy: [FR-019 (split 1/3 — ExternalRef upsert)]
relations:
  specified_by: [API-039, API-038]
  derived_from: [BR-047]
---

# FR-008-001 — Upsert by external id

The system SHALL let each envelope entity carry `externalRefs[{system, id, labelAs?}]` and,
during dry run, resolve identity by external reference before code: a mapped reference SHALL
make the entity an update of the mapped record (only if that record lies in the plan's target
scope); references mapped to a different entity type, to a deleted record, or to more than one
record, or a code already owned by a different record than the reference, SHALL be conflicts;
unmapped references SHALL be created on commit. External ids SHALL never become primary keys.

## Acceptance criteria

- AC-008-001-01 — Given `externalRefs:[{system:"SAP", id:"P-1"}]` mapped to Project X, when a plan with code `NEW` is imported, then the preview shows an update of X.
- AC-008-001-02 — Given SAP:P-1 mapped to a WORK_ITEM, when used on a project, then conflict "already mapped to a WORK_ITEM".
- AC-008-001-03 — Given a new reference, when committed, then an ExternalRef row maps it to the new record's UUID.

## Implementation

- apps/server/src/modules/project-manager/import/external-ref.js; import/plan-import-service.js

## Verification

- TC-008-001 — External-ref upsert (see [verification.md](../verification.md))
- TC-008-002 — API key enforcement and Tenant scoping (see [verification.md](../verification.md))
