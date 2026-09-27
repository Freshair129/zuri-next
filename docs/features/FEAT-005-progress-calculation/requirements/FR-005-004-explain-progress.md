---
id: FR-005-004
title: "Explain progress"
delivery: live
legacy: [FR-010 (Explain UI), FR-011]
relations:
  specified_by: [API-050, API-049]
  derived_from: [BR-004]
---

# FR-005-004 — Explain progress

The system SHALL expose each Workstream's and Project's computed progress with its evidence,
formula and warnings to authorized readers, and the console SHALL offer an "Explain" view
that renders them. `Workstream.progressCache` SHALL be advisory only: every displayed
number is recomputed from the calculators; the cache may be refreshed as a side effect.

## Acceptance criteria

- AC-005-004-01 — Given a Workstream card showing 40 %, when Explain is opened, then the same 40 %, the formula and the warnings are shown.
- AC-005-004-02 — Given a Workstream of an invisible Business, then the progress read returns 404.

## Implementation

- apps/server/src/app/api/progress/workstream/[id]/route.js; apps/server/src/modules/project-manager/components/ProgressExplain.jsx

## Verification

- TC-005-004 — Progress read authorization and card agreement (see [verification.md](../verification.md))
