---
id: FR-040-001
title: "Operator-only DAG/wave/task observability, no Business scope"
delivery: building
legacy: [FR-260]
relations:
  specified_by: [SDD-040]
  decided_by: [ADR-030]
---

# FR-040-001 — Operator-only DAG/wave/task observability, no Business scope

An installation operator SHALL be able to read the canonical roadmap DAG,
dependency waves, task status/proof/implementation and blocker state, and
read-only orchestration observations, without any Business scope in view.
Non-operators SHALL be refused before any orchestration data loads. No
assignment, cancellation, retry, merge, deploy, migration or activation
write path SHALL exist.

## Acceptance criteria

- AC-040-001-01 — Given a non-operator, when they request Mission Control, then they are refused before any DAG data is fetched.
- AC-040-001-02 — Given the rendered page, when its available actions are inspected, then none of them mutate scheduling, merge, deploy, migration or activation state.

## Implementation

- `apps/server/src/app/(control)/control/mission-control/page.jsx`, `apps/server/src/modules/platform-control/mission-control/{application/mission-control-read-model.js,components/MissionControlBoard.jsx}`

## Verification

- TC-040-001 — Operator-only admission, no mutation surface (see [verification.md](../verification.md))
