---
id: FR-040-003
title: "Candidate parallelism is never treated as merge approval"
delivery: building
legacy: [FR-262]
relations:
  specified_by: [SDD-040]
  decided_by: [ADR-030]
---

# FR-040-003 — Candidate parallelism is never treated as merge approval

Mission Control SHALL mark same-wave tasks candidate-parallel only when no
dependency path exists between them, then SHALL evaluate dependency, owner/
assignment, lane, shared-file, revision and capability-identity gates,
showing the first failed or unknown gate. Candidate parallelism SHALL NEVER
be displayed or treated as merge approval.

## Acceptance criteria

- AC-040-003-01 — Given two same-wave tasks with no dependency path but a shared-file conflict, when the gates are evaluated, then the shared-file gate is shown as the blocking reason, not silently passed.

## Implementation

- `apps/server/src/modules/platform-control/mission-control/{application/mission-control-read-model.js,mission-control-contract.js}`

## Verification

- TC-040-003 — Candidate-parallel gates never imply merge approval (see [verification.md](../verification.md))
