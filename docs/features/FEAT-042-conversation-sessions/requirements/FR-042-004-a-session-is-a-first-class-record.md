---
id: FR-042-004
title: "A session is a first-class record"
delivery: implemented
legacy: [FR-243 (split 4/6)]
relations:
  specified_by: [SDD-042]
---

# FR-042-004 — A session is a first-class record

The system SHALL store each session with an internal id, a tenant-unique code
`S-YYYYMMDD-XXXXXX` (open date in Asia/Bangkok plus six random base-36 characters),
the Tenant, Business, Conversation, Customer and channel-account ids, open,
last-message and close times, the idle timeout in force at opening, inbound and
outbound counts and, when MSP thread memory is on, the MSP session id.

## Acceptance criteria

- AC-042-004-01 — Given a session opened at 2026-09-15 20:00 UTC, when its code is generated, then it starts `S-20260916-`.

## Verification

- TC-042-001 — Idle rule, code format and timeout bounds (pure) (see [verification.md](../verification.md))
