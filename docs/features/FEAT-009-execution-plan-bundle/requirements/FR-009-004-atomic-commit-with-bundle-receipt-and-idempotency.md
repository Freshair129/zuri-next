---
id: FR-009-004
title: "Atomic commit with bundle receipt and idempotency"
delivery: implemented
legacy: [FR-108 (split 4/4 — atomic commit and receipt)]
relations:
  specified_by: [API-004]
  decided_by: [ADR-013]
  derived_from: [BR-006]
---

# FR-009-004 — Atomic commit with bundle receipt and idempotency

The system SHALL re-run the combined dry run and, if committable, commit strategy, all Projects
(through the existing PlanEnvelope commit, joined to the same transaction), ProjectGoal links
and cross-Project PROJECT→PROJECT edges in ONE database transaction, then produce a bundle
receipt whose `trace.idempotencyKey` binds to the normalized payload hash: a replayed key with
the same hash returns the prior receipt, the same key with a different hash is refused, and
audit lineage (`BUNDLE_IMPORTED`) connects the bundle to each per-Project receipt.

## Acceptance criteria

- AC-009-004-01 — Given a failure while committing the third Project, then no strategy row, Project or edge of the bundle remains.
- AC-009-004-02 — Given the same bundle and key submitted twice, then the second response is the first receipt.
- AC-009-004-03 — Given the same key with a changed payload, then it is refused.

## Implementation

- import/bundle/bundle-commit-service.js; import/bundle/bundle-receipt.js; apps/server/src/app/api/import/bundle/commit/route.js
