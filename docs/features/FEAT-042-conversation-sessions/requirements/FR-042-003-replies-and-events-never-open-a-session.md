---
id: FR-042-003
title: "Replies and events never open a session"
delivery: implemented
legacy: [FR-243 (split 3/6)]
relations:
  specified_by: [SDD-042]
---

# FR-042-003 — Replies and events never open a session

The system SHALL record a reply in the session of the inbound message it answers
(incrementing its outbound count, extending `lastMessageAt` only while that session
is not closed) and SHALL record it without a session when the inbound message has
none; a ConversationEvent SHALL take the session open at its occurrence time, or none,
and SHALL never open or extend a session.

## Acceptance criteria

- AC-042-003-01 — Given a reply to a message whose session was already closed by a later session, when recorded, then it is counted in the original session and that session's `closedAt` is unchanged.
- AC-042-003-02 — Given a follow event with no open session, when recorded, then its `sessionId` is null.

## Verification

- TC-042-002 — Assignment on admission, replies, events and backfill (see [verification.md](../verification.md))
