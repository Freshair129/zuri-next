---
id: FR-040-002
title: "PORL observations are provenance-bound and never infer liveness from staleness"
delivery: building
legacy: [FR-261]
relations:
  specified_by: [SDD-040]
  decided_by: [ADR-030]
---

# FR-040-002 — PORL observations are provenance-bound and never infer liveness from staleness

The read-only PORL adapter SHALL return worker, thread, branch, worktree,
base/head commit, check and evidence references with a source and an
observed/captured time, distinguishing `LIVE`, `SNAPSHOT`, `UNKNOWN` and
`NOT_RUN`, and preserving `LOCAL`/`ISOLATED`/`HOSTED_CI`/`PRODUCTION` proof
scope. It SHALL NEVER infer current execution from a stale or absent
record.

## Acceptance criteria

- AC-040-002-01 — Given a PORL record last observed an hour ago with no fresher record, when it is displayed, then it is shown as `SNAPSHOT` or `UNKNOWN`, never re-labelled `LIVE`.
- AC-040-002-02 — Given no PORL record exists for a task, when it is displayed, then its state is `NOT_RUN`, never a guessed status.

## Implementation

- `apps/server/src/modules/platform-control/mission-control/application/programme-orchestration-run-ledger.js`

## Verification

- TC-040-002 — PORL provenance vocabulary and never-infer-liveness rule (see [verification.md](../verification.md))
