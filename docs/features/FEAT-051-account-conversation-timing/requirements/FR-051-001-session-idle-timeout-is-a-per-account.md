---
id: FR-051-001
title: "Session idle-timeout is a per-account, bounded setting"
delivery: building
legacy: [FR-243 (LOA half, split 1/2)]
relations:
  specified_by: [API-121]
  decided_by: [ADR-044]
---

# FR-051-001 — Session idle-timeout is a per-account, bounded setting

The system SHALL let a publisher set an account's conversation session
idle-timeout between 10 and 120 minutes, defaulting to 30, through the
versioned `CONFIGURE_SESSION_TIMEOUT` action, refusing an out-of-range value
rather than clamping it.

## Acceptance criteria

- AC-051-001-01 — Given no prior configuration, when an account is read, then `sessionIdleTimeoutMinutes` is 30.
- AC-051-001-02 — Given `CONFIGURE_SESSION_TIMEOUT` with `sessionIdleTimeoutMinutes: 5`, when applied, then the write is refused (below the 10-minute floor).

## Implementation

- `apps/server/src/modules/line-oa-studio/domain/line-oa-account.js`, `apps/server/prisma/schema.prisma` (`sessionIdleTimeoutMinutes`)

## Verification

- TC-051-001 — Session timeout bounds and default (see [verification.md](../verification.md))
