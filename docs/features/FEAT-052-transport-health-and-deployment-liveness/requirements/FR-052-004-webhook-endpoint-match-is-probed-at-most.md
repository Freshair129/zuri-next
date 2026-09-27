---
id: FR-052-004
title: "Webhook endpoint match is probed at most hourly"
delivery: live
legacy: [FR-190 (split 2/2)]
relations:
  specified_by: [API-137]
  decided_by: [ADR-044]
---

# FR-052-004 — Webhook endpoint match is probed at most hourly

The system SHALL ask LINE for the channel's configured webhook endpoint at
most once per hour per account and classify it `MATCHED` (equals this
deployment's own account route), `MISMATCHED`, `DISABLED` (LINE reports the
webhook inactive) or `UNKNOWN` (the probe failed), comparing on origin and
path only, case-insensitive on host, indifferent to a trailing slash.

## Acceptance criteria

- AC-052-004-01 — Given LINE reports the account's own route with a trailing slash difference only, when compared, then the state is `MATCHED`.
- AC-052-004-02 — Given the endpoint probe itself fails, when classified, then the state is `UNKNOWN`, never guessed as `MATCHED` or `MISMATCHED`.

## Implementation

- `apps/server/src/modules/line-oa-studio/domain/transport-health.js`, `application/line-transport-health.js`

## Verification

- TC-052-004 — Endpoint match classification (see [verification.md](../verification.md))
