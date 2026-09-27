---
id: FR-092-001
title: "Inbox list scoped to the selected Business's tenant"
part: FEAT-092-P01
owner: DOM-CRM
delivery: live
legacy: [FR-091 (split 1/3)]
relations:
  specified_by: [SDD-092, API-107]
  derived_from: [BR-046]
---

# FR-092-001 — Inbox list scoped to the selected Business's tenant

The system SHALL answer `GET /api/crm/conversations?businessId=&limit=` only for a
viewer who sees the Business (403 otherwise) and holds its `customer` domain (FR-003-009
404 otherwise), listing — most recently updated first, at most 200 — the conversations
of that Business's Tenant that are tenant-shared (`businessId` null) or bound to that
Business, each with customer (code, name, lifecycle stage, consent), channel, channel
account, message counts by direction, last message preview and time, and owning
Business label.

## Acceptance criteria

- AC-092-001-01 — Given a conversation bound to another Business of the same Tenant, when the inbox of Business A is read, then it is not listed.
- AC-092-001-02 — Given a tenant-shared conversation, when any Business of the Tenant with the CRM domain reads its inbox, then it is listed.

## Implementation

- apps/server/src/modules/crm/conversation-read-model.js; apps/server/src/app/api/crm/conversations/route.js; apps/server/src/app/api/crm/conversations/[id]/route.js; apps/server/src/app/(pm)/customer/conversations/page.jsx; apps/server/src/app/(pm)/customer/page.jsx

## Verification

- TC-092-001 — Inbox scope and thread read (see [verification.md](../verification.md))
