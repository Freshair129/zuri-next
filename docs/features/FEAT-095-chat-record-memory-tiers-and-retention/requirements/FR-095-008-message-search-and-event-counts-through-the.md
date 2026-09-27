---
id: FR-095-008
title: "Message search and event counts through the inbox scope"
part: FEAT-095-P04
owner: DOM-CRM
delivery: building
legacy: [FR-233 (split 2/2)]
relations:
  specified_by: [SDD-095, API-110, API-105]
---

# FR-095-008 — Message search and event counts through the inbox scope

The system SHALL search message bodies (`GET /api/crm/conversations/search`, query
1–200 chars, ≤ 100 rows; trigram index on Postgres, `LIKE` on SQLite) and count
follow/unfollow events per LINE OA account (`GET /api/crm/conversations/event-counts`),
both through exactly the inbox's scope predicate and optionally one channel account.

## Acceptance criteria

- AC-095-008-01 — Given a matching message in a conversation of another Business, when searched, then it is not returned.

## Implementation

- apps/server/src/modules/crm/conversation-preview-service.js; conversation-read-model.js; conversation-search-service.js; apps/server/src/app/api/crm/conversations/search/route.js; event-counts/route.js

## Verification

- TC-095-003 — Read models and search (see [verification.md](../verification.md))
