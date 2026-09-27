---
id: SDD-095
title: "Chat record, memory tiers and retention — design"
---

# SDD-095 — Chat record, memory tiers and retention design

- **Components:** CMP-092 (non-text writers); CMP-108 (`admitLineConversation` dispatch); CMP-094 (`retention-override-service.js`, `retention-sweep-service.js`, `retention-sweep-tombstone.js`, route + `scripts/server-retention-sweep-worker.mjs`, `retention-sweep-worker-run.mjs`); CMP-085 (`conversation-preview-service.js`); CMP-087 (`conversation-search-service.js`); CMP-156 (`modules/agent/context-composer.js`) used by `server-line-answer.js` and `line-execution-trace.js`; CMP-172 (`msp-thread-memory-port.js`); CMP-041 (`modules/identity/erase-principal.js`).
- **Data owned:** DOM-CRM — Message.contentKind, MessageAttachment, ConversationEvent, Conversation preview columns, TenantRetentionOverride; DOM-AGT — AgentTraceEvent receipts (MemoryProjectionReceipt declared); DOM-LOA — LineOaAccount.memoryPolicy (declared).
- **Contracts exposed:** API-106, API-118, EVT-001, API-110, API-105.
- **Contracts consumed:** API-131; API-104 (by erasure); MSP thread tools (external).
- **Main sequence (record):** webhook → admission → CRM writer by event type → preview refresh. **(retention):** nightly → per Tenant effective window → archive → tombstone → audit. **(prompt):** authorize → collect slices → filter → prioritize → budget → packet + ContextReceipt → model.
- **Failure modes:** archive failure skips a Tenant's tombstones; unauthorized composer input → empty packet; MSP unavailable never blocks the CRM record.

## Implementation map

| Requirement | Current code (legacy repo path) |
|---|---|
| FR-095-001, FR-095-002 | apps/server/src/modules/crm/line-ingest-service.js; apps/server/src/modules/crm/conversation-redaction-service.js |
| FR-095-003 | apps/server/src/modules/line-oa-studio/application/line-conversation-jobs.js |
| FR-095-004..006 | apps/server/src/modules/crm/retention-override-service.js; retention-sweep-service.js; apps/server/src/app/api/crm/retention-sweep/route.js; apps/server/scripts/server-retention-sweep-worker.mjs; apps/server/src/lib/validation/enums.js |
| FR-095-007, FR-095-008 | apps/server/src/modules/crm/conversation-preview-service.js; conversation-read-model.js; conversation-search-service.js; apps/server/src/app/api/crm/conversations/search/route.js; event-counts/route.js |
| FR-095-009, FR-095-010 | — (declared) |
| FR-095-011 | apps/server/src/modules/identity/erase-principal.js (Tier 1 part only) |
| FR-095-012, FR-095-013 | apps/server/src/modules/agent/context-composer.js; apps/server/src/modules/agent/server-line-answer.js; apps/server/src/modules/agent/line-execution-trace.js |
