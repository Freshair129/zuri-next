---
id: FR-052-003
title: "Inbound silence is classified against configurable thresholds"
delivery: live
legacy: [FR-190 (split 1/2)]
relations:
  specified_by: [API-137]
  decided_by: [ADR-044]
---

# FR-052-003 — Inbound silence is classified against configurable thresholds

The system SHALL classify a server-enabled account's inbound silence as `OK`
(under 6 hours), `QUIET` (6–24 hours) or `SILENT` (24 hours or more), measured
from the later of its last recorded inbound delivery and when it became
monitorable, using only existing Integration evidence and
`LineConversationJob` rows — no new column.

## Acceptance criteria

- AC-052-003-01 — Given an account enabled 4 minutes ago with no inbound delivery yet, when classified, then the state is `OK` (a fresh account is never SILENT by default).
- AC-052-003-02 — Given an account whose last inbound delivery was 25 hours ago, when classified, then the state is `SILENT`.

## Implementation

- `apps/server/src/modules/line-oa-studio/domain/transport-health.js`

## Verification

- TC-052-003 — Silence classification thresholds (see [verification.md](../verification.md))
