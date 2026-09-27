---
id: SDD-093
title: "Server-owned LINE conversation transport — design"
---

# SDD-093 — Server-owned LINE conversation transport design

- **Components:** CMP-134 (`providers/line/line-oa-evidence.js`, `line-oa-webhook.js`); CMP-135 (`providers/line/server-line-transport.js`); CMP-122 (`app/api/line-oa/accounts/[id]/webhook/route.js`); CMP-108 (`line-conversation-jobs.js`: admission, claim, settle, send, reconcile accepted); CMP-100 (`line-admission-reconciler.js`); CMP-116 (`server-line-runtime.js`, gated by `ZURI_LINE_SERVER_ENABLED`); CMP-105 (`line-job-failures.js`); CMP-103 (`conversation-runtime-core.js`, SRV-003 boundary); CMP-178 (`modules/agent/server-line-answer.js`); CMP-092, CMP-093.
- **Data owned:** DOM-LOA — LineConversationJob, LineOaWorkerCheckpoint; DOM-INT — RawExternalRecord; DOM-CRM — Conversation, Message.
- **Contracts exposed:** API-132, EVT-002, API-127, API-126, API-128, API-124.
- **Contracts consumed:** API-146, API-147, API-116, API-117.
- **Main sequence:** LINE → webhook (verify, capture, ADMITTING) → 2xx → admission tx (epoch check, CRM ingest, job QUEUED) → tick: reconcile → claim ≤4 → answer → READY → send ≤5 (Reply/Push) → ACCEPTED → reconcile-accepted tx (CRM OUTBOUND, RECORDED).
- **Failure modes:** capture failure → non-2xx and LINE redelivery; crash after ack → reconciler; lease loss → 409 and no send; ambiguous send → UNKNOWN; account disabled → fenced by epoch.

## Implementation map

| Requirement | Current code (legacy repo path) |
|---|---|
| FR-093-001, FR-093-002 | apps/server/src/modules/crm/line-ingest-service.js; apps/server/src/modules/crm/reply-record-service.js; apps/server/src/modules/identity/resolve-line-identity.js |
| FR-093-003, FR-093-004 | apps/server/src/platform/integrations/providers/line/line-oa-evidence.js; line-oa-webhook.js; server-line-transport.js |
| FR-093-005 | apps/server/src/app/api/line-oa/accounts/[id]/webhook/route.js |
| FR-093-006, FR-093-007 | apps/server/src/modules/line-oa-studio/application/line-conversation-jobs.js; line-admission-reconciler.js |
| FR-093-008..010 | apps/server/src/modules/line-oa-studio/application/line-conversation-jobs.js; server-line-runtime.js; apps/server/src/app/api/line-oa/worker/route.js; apps/server/scripts/server-line-worker.mjs; apps/server/scripts/worker-cadence.mjs; apps/server/src/modules/line-oa-studio/application/conversation-runtime-core.js |
| FR-093-011 | apps/server/src/modules/line-oa-studio/application/line-job-failures.js; apps/server/src/app/api/line-oa/jobs/**; apps/server/src/modules/line-oa-studio/ui/LineStudioJobFailures.jsx |
| FR-093-012 | apps/server/src/modules/agent/server-line-answer.js |
