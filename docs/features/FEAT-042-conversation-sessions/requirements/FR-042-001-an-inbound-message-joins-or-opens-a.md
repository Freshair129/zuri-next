---
id: FR-042-001
title: "An inbound message joins or opens a session by the idle rule"
delivery: implemented
legacy: [FR-243 (split 1/6)]
relations:
  specified_by: [SDD-042, API-111]
---

# FR-042-001 — An inbound message joins or opens a session by the idle rule

The system SHALL assign an inbound message to the conversation's latest session when
the message time is at most `lastMessageAt + idleTimeout` (inclusive), incrementing
its inbound count and advancing `lastMessageAt`; otherwise it SHALL open a new session
and, if the previous session has no `closedAt`, set it to that session's
`lastMessageAt + idleTimeout`. There is no midnight cut and no sweeper.

## Acceptance criteria

- AC-042-001-01 — Given a session whose last message was 30 minutes ago and a 30-minute timeout, when a message arrives, then it joins that session.
- AC-042-001-02 — Given 31 minutes of silence, when a message arrives, then a new session opens and the old one's `closedAt` equals its last message time + 30 minutes.
- AC-042-001-03 — Given messages at 23:50 and 00:05 Bangkok time with a 30-minute timeout, when both are ingested, then they share one session.

## Implementation

- apps/server/src/modules/crm/conversation-session-service.js; apps/server/src/modules/crm/line-ingest-service.js; apps/server/src/modules/crm/reply-record-service.js

## Verification

- TC-042-001 — Idle rule, code format and timeout bounds (pure) (see [verification.md](../verification.md))
