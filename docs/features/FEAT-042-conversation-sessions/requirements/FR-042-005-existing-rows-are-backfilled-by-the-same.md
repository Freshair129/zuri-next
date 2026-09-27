---
id: FR-042-005
title: "Existing rows are backfilled by the same rule"
delivery: implemented
legacy: [FR-243 (split 5/6)]
relations:
  specified_by: [SDD-042]
---

# FR-042-005 — Existing rows are backfilled by the same rule

The system SHALL provide a backfill that assigns existing messages, events and LINE
jobs (from their inbound message) to sessions using the same idle rule, SHALL write
nothing in its default dry-run mode and SHALL report what an apply would change;
an apply runs one transaction per conversation and may be limited to one Tenant.

## Acceptance criteria

- AC-042-005-01 — Given unassigned historical messages, when the backfill runs without `apply`, then no row changes and the report counts messages, events and jobs to assign.
- AC-042-005-02 — Given the same data, when run with `apply`, then every message has a session and each job carries its inbound message's session.

## Implementation

- apps/server/src/modules/crm/conversation-session-backfill.js; apps/server/scripts/backfill-conversation-sessions.mjs

## Verification

- TC-042-002 — Assignment on admission, replies, events and backfill (see [verification.md](../verification.md))
