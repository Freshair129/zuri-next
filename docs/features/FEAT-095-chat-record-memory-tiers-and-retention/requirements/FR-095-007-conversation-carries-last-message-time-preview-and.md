---
id: FR-095-007
title: "Conversation carries last-message time, preview and unread count"
part: FEAT-095-P04
owner: DOM-CRM
delivery: building
legacy: [FR-233 (split 1/2)]
relations:
  specified_by: [SDD-095, API-107]
---

# FR-095-007 — Conversation carries last-message time, preview and unread count

The system SHALL keep `Conversation.lastMessageAt`, `lastMessagePreview` (≤ 120 chars,
refreshed by every Message writer — ingest, reply, unsend, PDPA redaction, sweep — so
redaction reaches it) and `retentionClass`, and SHALL compute on read a per-Business
`unreadCount` = INBOUND messages newer than the conversation's newest OUTBOUND message
(all INBOUND when none), with no stored read marker.

## Acceptance criteria

- AC-095-007-01 — Given a customer's message erased under PDPA, when the inbox is read, then the preview shows the tombstone, not the text.
- AC-095-007-02 — Given three inbound messages after the last reply, when listed, then `unreadCount` is 3.

## Implementation

- apps/server/src/modules/crm/conversation-preview-service.js; conversation-read-model.js; conversation-search-service.js; apps/server/src/app/api/crm/conversations/search/route.js; event-counts/route.js

## Verification

- TC-095-003 — Read models and search (see [verification.md](../verification.md))
