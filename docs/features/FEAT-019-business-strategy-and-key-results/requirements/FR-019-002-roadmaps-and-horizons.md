---
id: FR-019-002
title: "Roadmaps and horizons"
delivery: implemented
legacy: [FR-059 (split 1/3 — roadmaps)]
relations:
  specified_by: [API-016, API-015]
  derived_from: [BR-002]
---

# FR-019-002 — Roadmaps and horizons

The system SHALL let an owner of the Business (`ownsBusiness`, never the global OWNER label) create a
Roadmap (code declared or generated; a declared code already taken → 409) with 2 or 3 horizons of
unique key and unique position, and update it — reconciling horizons by stable `key` (kept keys updated
in place so goal links survive; a removed horizon that still holds goals is refused; cardinality 2–3
re-checked). Every write SHALL be audited.

## Acceptance criteria

- AC-019-002-01 — Given 4 horizons, then 400 "must have 2 or 3 horizons".
- AC-019-002-02 — Given an update dropping a horizon that has goals, then it is refused and nothing changes.
- AC-019-002-03 — Given a viewer who sees but does not own the Business, then the write is refused.

Delivery: live

## Implementation

- apps/server/src/modules/project-manager/application/business-strategy-mutation-service.js; apps/server/src/app/api/business/roadmaps/**; api/business/goals/**; api/business/key-results/**

## Verification

- TC-019-002 — Strategy mutations (see [verification.md](../verification.md))
