---
id: SDD-092
title: "CRM conversation inbox — design"
---

# SDD-092 — CRM conversation inbox design

- **Components:** CMP-086 — `modules/crm/conversation-read-model.js` (`resolveScope`, `getConversationInbox`, `getConversationThread`); CMP-093 — `modules/crm/reply-record-service.js` (`recordLineReply`, `appendOutbound`); CMP-108 — `modules/line-oa-studio/application/line-conversation-jobs.js` (`reconcileAccepted`); inbox UI `app/(pm)/customer/conversations/page.jsx`; navigation `config/domains.js` (DOM-PRJ).
- **Data owned:** DOM-CRM — Message (OUTBOUND rows); DOM-LOA — LineConversationJob status.
- **Contracts exposed:** API-107, API-108, API-117.
- **Contracts consumed:** viewer authority (DOM-IAM); session join (FEAT-042).
- **Main sequence:** LINE accepts answer → job `ACCEPTED` → reconcile: fence → `appendOutbound` → `recordLineReply` (scope-derived conversation, idempotent) → trace → `RECORDED` → inbox shows both sides.
- **Failure modes:** out-of-scope inbound → 404 without write; erasure race → no write; P2002 race → existing row returned.

## Implementation map

| Requirement | Current code (legacy repo path) |
|---|---|
| FR-092-001..003 | apps/server/src/modules/crm/conversation-read-model.js; apps/server/src/app/api/crm/conversations/route.js; apps/server/src/app/api/crm/conversations/[id]/route.js; apps/server/src/app/(pm)/customer/conversations/page.jsx; apps/server/src/app/(pm)/customer/page.jsx |
| FR-092-004, FR-092-005 | apps/server/src/modules/crm/reply-record-service.js |
| FR-092-006 | apps/server/src/modules/line-oa-studio/application/line-conversation-jobs.js |
| FR-092-007 | apps/server/src/config/domains.js |
