---
id: FR-022-001
title: "Readiness is not progress"
delivery: live
legacy: [FR-124 (split 1/3 — metric contract)]
relations:
  derived_from: [BR-004]
---

# FR-022-001 — Readiness is not progress

The system SHALL compute requirement progress as a declared weighted sum of evidence (declaration 20 %,
code 40 %, test 40 %) held in one named methodology constant that is carried in the snapshot and printed
beside the numbers; feature progress = mean of its requirements, domain progress = mean of the unique
requirements of its primary features, overall = mean of every unique requirement. A feature SHALL be
`ready` only when every underlying requirement is verified and, for an explicit feature bundle, its
registry delivery status is `live`; the UI SHALL always print progress and readiness together with the
blocking reason.

## Acceptance criteria

- AC-022-001-01 — Given a bundle at 100 % progress whose registry status is `building`, then it shows not ready with reason "registry says building".
- AC-022-001-02 — Given the methodology constant changed, then every displayed percentage changes and nothing else.

## Implementation

- apps/server/scripts/domain-state.mjs; apps/server/runtime/domain-state.json; apps/server/src/modules/project-manager/application/product-readiness-read-model.js

## Verification

- TC-022-001 — Readiness read model and projection (see [verification.md](../verification.md))
