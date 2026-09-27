---
id: FR-095-002
title: "LINE events become ConversationEvents; unsend tombstones"
part: FEAT-095-P01
owner: DOM-CRM
delivery: building
legacy: [FR-229 (split 2/3)]
relations:
  specified_by: [SDD-095, API-106]
  decided_by: [ADR-041]
---

# FR-095-002 — LINE events become ConversationEvents; unsend tombstones

The system SHALL record follow, unfollow and postback (resolving identity like a message),
and join, leave, member joined and member left (attaching only to an existing conversation,
payload `memberCount` only, never a user id) as `ConversationEvent` rows idempotent per
`(conversation, externalEventId)` with bounded id-only payloads; an unsend SHALL tombstone
the referenced Message body (`[ข้อความถูกเรียกคืนโดยผู้ส่ง]`) and attachment
(`fetchState = ERASED`, provider id cleared) when the conversation exists, and be skipped
otherwise.

## Acceptance criteria

- AC-095-002-01 — Given an unsend for a recorded image message, when admitted, then its body is the unsend tombstone and its attachment is ERASED.
- AC-095-002-02 — Given a join event for a group with no recorded conversation, when admitted, then nothing is created.

## Implementation

- apps/server/src/modules/crm/line-ingest-service.js; apps/server/src/modules/crm/conversation-redaction-service.js

## Verification

- TC-095-001 — Non-text admission and events (see [verification.md](../verification.md))
- TC-095-003 — Read models and search (see [verification.md](../verification.md))
