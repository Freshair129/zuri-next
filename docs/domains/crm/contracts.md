# Contracts — DOM-CRM
All HTTP routes run in SRV-001 and resolve the viewer from the session
(`resolveRequestViewer`) unless stated otherwise. Refusal order everywhere:
`customer` domain gate (FR-003-009 404, FR-003-009) before ownership (403).
Validation failures answer 400 with the Zod issue list.

## In-process contracts

### API-116
Owner: DOM-CRM
In-process: `modules/crm/line-ingest-service.js#ingestLineMessage`.
Purpose: the only writer that turns an inbound LINE message into Customer/Conversation/Message rows.
Auth/scope: trusted server callers only (LINE admission); `tenantId`, `businessId`, `channelAccountId` come from the server-resolved binding, never from LINE payload.
Request: `{tenantId, businessId?, channelAccountId?, lineUserId, displayName?, threadId, text, externalMessageId?, direction, contentKind?, attachment?, occurredAt?, sessionIdleTimeoutMinutes?, correlationId?}`; optional transaction client.
Response: `{personId, customerId, conversationId, messageId, attachmentId, sessionId, created:{customer, conversation, message}}`.
Errors: 400 `BUSINESS_REQUIRED_FOR_CHANNEL_ACCOUNT`; 404 `BUSINESS_NOT_FOUND`; 409 `CONVERSATION_BUSINESS_SCOPE_CONFLICT`; Prisma `P2002`/`P2034` propagate inside a caller transaction.
Implements: FR-041-001, FR-041-002, FR-041-003, FR-041-004, FR-093-001, FR-093-002, FR-095-001
Legacy: apps/server/src/modules/crm/line-ingest-service.js

### API-106
Owner: DOM-CRM
In-process: `line-ingest-service.js#ingestLineConversationEvent` (follow, unfollow, postback — resolves identity like a message), `#recordExistingConversationEvent` (join, leave, memberJoined, memberLeft — existing conversation only, payload carries `memberCount`, never a user id), `#ingestLineUnsendEvent` (unsend — tombstones the named message body `[ข้อความถูกเรียกคืนโดยผู้ส่ง]` and its attachment).
Purpose: record non-message LINE events as ConversationEvent rows; none creates an answer job.
Auth/scope: called only from the LINE admission seam (API-131).
Request: event kind, external event id, thread/account/tenant/business ids, bounded payload of ids.
Response: event id and created flag; skipped when no conversation exists (join/leave/member/unsend).
Errors: as API-116.
Implements: FR-095-002
Legacy: apps/server/src/modules/crm/line-ingest-service.js

### API-117
Owner: DOM-CRM
In-process: `modules/crm/reply-record-service.js#recordLineReply`.
Purpose: the automatic outbound writer — records the text LINE accepted for an inbound message as an `OUTBOUND` Message.
Auth/scope: server transport callers; the conversation is derived from the named inbound `Message.id` inside the given Tenant/Business/account scope, never taken from the request.
Request: `{tenantId, businessId, channelAccountId, receipt:{inboundMessageId, text, source: STACK|TRANSPORT_FALLBACK}, acceptance?, correlationId?}`.
Response: `{messageId, conversationId, created}`; idempotent on external id `reply:<inboundMessageId>` (one automatic reply per inbound message).
Errors: 404 when the inbound message is not in scope.
Implements: FR-092-004, FR-092-005, FR-093-002
Legacy: apps/server/src/modules/crm/reply-record-service.js

### API-104
Owner: DOM-CRM
In-process: `modules/crm/conversation-redaction-service.js#redactConversationContentForCustomers(tx, {tenantId, customerIds})`.
Purpose: PDPA erasure writer called by identity inside its own transaction; replaces bodies with `[ข้อความถูกลบตามคำขอ PDPA]`, marks attachments `ERASED` and clears provider content ids, refreshes previews; ids, direction and timestamps survive.
Auth/scope: DOM-IAM erasure flow only; tenant-scoped; idempotent.
Response: counts of redacted messages and attachments.
Implements: FR-029-005, FR-095-001, FR-095-007, FR-095-011
Legacy: apps/server/src/modules/crm/conversation-redaction-service.js

### API-103
Owner: DOM-CRM
In-process: `modules/crm/conversation-consent-reader.js#readConversationConsentStatus({tenantId, businessId, conversationId})`.
Purpose: viewer-free consent lookup for another lane's decision (knowledge candidates).
Response: `consentStatus` or `null` on any mismatch/missing row; never content.
Implements: FR-043-003
Legacy: apps/server/src/modules/crm/conversation-consent-reader.js

### API-111
Owner: DOM-CRM
In-process: `modules/crm/conversation-session-service.js#assignMessageSession`, `#joinReplySession`, `#openSessionIdAt`.
Purpose: assign a message/reply/event to its ConversationSession inside the writer's transaction.
Request: transaction client, conversation, occurrence time, direction, account idle timeout.
Response: session row (and whether it was opened) or session id / null.
Implements: FR-042-001, FR-042-002, FR-042-003
Legacy: apps/server/src/modules/crm/conversation-session-service.js

### API-118
Owner: DOM-CRM
In-process: `modules/crm/retention-override-service.js#setTenantRetentionOverride`, `#getEffectiveRetentionWindowDays`.
Purpose: a Tenant's downward-only retention window per data class; a value above the installation default is refused (not clamped); audited `RETENTION_OVERRIDE_SET`.
Implements: FR-095-004
Legacy: apps/server/src/modules/crm/retention-override-service.js

## HTTP contracts

### API-107
Owner: DOM-CRM
GET /api/crm/conversations?businessId=&limit=
Purpose: inbox list for the Tenant of the selected Business.
Auth/scope: Business visible + `customer` domain; rows limited to tenant-shared conversations (`businessId` null) or conversations of Businesses the viewer sees.
Response: `{version, rows:[{conversation id, customer, channel, channelAccountId, message counts, lastMessageAt, lastMessagePreview, retentionClass, unreadCount, owning-Business label}]}`; `limit` ≤ 200.
Errors: 400 validation; 404 domain/Business.
Implements: FR-092-001, FR-095-007
Legacy: apps/server/src/app/api/crm/conversations/route.js

### API-108
Owner: DOM-CRM
GET /api/crm/conversations/{id}?businessId=
Purpose: one thread with messages oldest-first, the customer (incl. consent fields) and per-message session id/code/openedAt.
Auth/scope: as API-107.
Errors: 404 when outside scope.
Implements: FR-092-002, FR-042-006, FR-043-003
Legacy: apps/server/src/app/api/crm/conversations/[id]/route.js

### API-109
Owner: DOM-CRM
POST /api/crm/conversations/{id}/reply
Purpose: staff reply sent through LINE push and recorded after acceptance.
Auth/scope: `customer` domain + Business OWNER; Person identity required.
Request: `{businessId, text (1–5000), clientRequestId (uuid)}`.
Response: `{messageId, conversationId, created}`.
Errors: 401 `VIEWER_IDENTITY_REQUIRED`; 403; 404; 409 `STAFF_REPLY_NOT_SUPPORTED_FOR_CHANNEL` | `LINE_ACCOUNT_NOT_SERVER_ENABLED`; 502 `STAFF_REPLY_NOT_ACCEPTED_BY_LINE`.
Implements: FR-047-001, FR-047-002
Legacy: apps/server/src/app/api/crm/conversations/[id]/reply/route.js

### API-110
Owner: DOM-CRM
GET /api/crm/conversations/search?businessId=&query=&channelAccountId=&limit=
Purpose: search message bodies (trigram index on Postgres, `LIKE` on SQLite) within the inbox scope, optionally one LINE OA account.
Auth/scope: same predicate as the inbox.
Request: `query` 1–200 chars; `limit` ≤ 100.
Response: matching messages with conversation reference.
Implements: FR-095-008
Legacy: apps/server/src/app/api/crm/conversations/search/route.js

### API-105
Owner: DOM-CRM
GET /api/crm/conversations/event-counts?businessId=&channelAccountId=
Purpose: per-account follow/unfollow counts from ConversationEvent.
Auth/scope: same predicate as the inbox.
Implements: FR-095-008
Legacy: apps/server/src/app/api/crm/conversations/event-counts/route.js

### API-112
Owner: DOM-CRM
POST /api/crm/customers/{customerId}/consent
Purpose: PDPA consent attestation.
Auth/scope: `customer` domain + Business OWNER; Customer resolved within the Business's Tenant.
Request: `{businessId, status: GRANTED|DECLINED, note? ≤ 1000}`.
Response: consent summary + `auditEventId`.
Errors: 400; 403; 404 `BUSINESS_NOT_FOUND` | `CUSTOMER_NOT_FOUND`.
Implements: FR-043-002
Legacy: apps/server/src/app/api/crm/customers/[customerId]/consent/route.js

### API-113
Owner: DOM-CRM
POST /api/crm/customers/{customerId}/erasure
Purpose: route shell for PDPA erasure; delegates to DOM-IAM `eraseCustomerPrincipal` (which calls API-104 and destroys the archive key unless held). No GET preview, no DELETE; the Customer survives as a redacted tombstone.
Auth/scope: Business OWNER over a Business in the Customer's Tenant.
Response: counts only — never the erased person's data.
Implements: FR-029-005, FR-095-011
Legacy: apps/server/src/app/api/crm/customers/[customerId]/erasure/route.js

### API-115
Owner: DOM-CRM
POST /api/crm/customers/{customerId}/legal-hold
Purpose: record an additive legal hold that defers archive-key destruction on erasure.
Auth/scope: `customer` domain + Business OWNER in the Customer's Tenant; no AAL2.
Request: `{businessId, reason (1–2000), endDate (future date)}`.
Response: `{customerId, legalHoldId, reason, endDate, recordedAt}`.
Errors: 400 `END_DATE_MUST_BE_IN_THE_FUTURE`; 401 `AUTH_REQUIRED`; 403; 404 `CUSTOMER_NOT_FOUND`.
Implements: FR-047-006
Legacy: apps/server/src/app/api/crm/customers/[customerId]/legal-hold/route.js

### API-102
Owner: DOM-CRM
POST /api/crm/customers/{customerId}/chat-evidence/retrieve
Purpose: recover one Customer's archived messages for a date range as a hash-carrying export.
Auth/scope: `customer` domain + Business OWNER + AAL2 step-up (credential-write gate, FR-094-004).
Request: `{businessId, startDate, endDate (YYYY-MM-DD, start ≤ end), caseReference (1–500)}`.
Response: `{sessions:[{sessionId, messages}], manifests:[{manifestId, runId, filePath, fileSha256, manifestHash}], missingMessageIds, auditEventId}`.
Errors: 403 / step-up refusal; 404 `BUSINESS_NOT_FOUND` | `CUSTOMER_NOT_FOUND`.
Implements: FR-047-005
Legacy: apps/server/src/app/api/crm/customers/[customerId]/chat-evidence/retrieve/route.js

### EVT-001
Owner: DOM-CRM
POST /api/crm/retention-sweep (triggered nightly by `scripts/server-retention-sweep-worker.mjs` / `retention-sweep-worker-run.mjs`).
Purpose: run the retention sweep of `MESSAGE_BODY_AND_ATTACHMENTS` (archive-then-tombstone per Tenant).
Auth/scope: bearer `ZURI_RETENTION_SWEEP_TOKEN` (no user session).
Response: `{auditEventId, countsByClass, alreadyRanToday}`; at most one completed run per UTC day (a second call returns the first run's counts); 10-minute timeout.
Errors: 401 `RETENTION_SWEEP_CREDENTIAL_REQUIRED`; 503 `RETENTION_SWEEP_UNAVAILABLE`.
Implements: FR-095-005, FR-047-003
Legacy: apps/server/src/app/api/crm/retention-sweep/route.js

### API-120
Owner: DOM-CRM
GET /api/crm/sales-tasks?businessId=&status=&assigneePersonId=&customerId=&conversationId=&due=&includeClosed=&limit= · POST /api/crm/sales-tasks
Purpose: list with computed due state and summary; create a sales task.
Auth/scope: read — Business visible + `customer` domain; write — plus OWNER or `SALES_REP`.
Request (POST): `{businessId, title, description?, type?, priority?, scheduleKind?, dueDate, startDate?, timeStart?, timeEnd?, customerId?, conversationId?, assigneePersonId?}`.
Errors: 403; 404; 409 `SALES_TASK_CODE_EXHAUSTED`; 422 `CUSTOMER_NOT_FOUND` | `CONVERSATION_NOT_FOUND` | `CONVERSATION_CUSTOMER_MISMATCH` | `ASSIGNEE_NOT_MEMBER`.
Implements: FR-045-001, FR-045-002, FR-045-004
Legacy: apps/server/src/app/api/crm/sales-tasks/route.js

### API-119
Owner: DOM-CRM
GET /api/crm/sales-tasks/{id} · PATCH /api/crm/sales-tasks/{id}
Purpose: read one task; apply an action.
Request (PATCH): `{action: UPDATE|ASSIGN|START|COMPLETE|CANCEL|REOPEN, version, fields?, assigneePersonId?, outcome?, reason?}`.
Errors: 400 `SALES_TASK_ACTION_UNKNOWN`; 403; 404; 409 `SALES_TASK_VERSION_CONFLICT` | `SALES_TASK_STATUS_INVALID`.
Implements: FR-045-003, FR-045-004
Legacy: apps/server/src/app/api/crm/sales-tasks/[id]/route.js

### API-114
Owner: DOM-CRM
GET /api/platform/customer-import-reviews?businessId=&batchId=&status= · GET /api/platform/customer-import-reviews/targets?businessId=&query=&limit= · POST /api/platform/customer-import-reviews/{caseId}/decisions
Purpose: redacted duplicate review queue, masked target lookup, append-only decisions.
Auth/scope: contract Business only (else 404); `CUSTOMER_REVIEW_READ` / `CUSTOMER_REVIEW_DECIDE` permission from the Business-scoped `CUSTOMER_DATA_REVIEWER` binding (403 otherwise).
Request (POST): `{businessId, expectedVersion, decisions:[{reviewItemId, action: CREATE_SEPARATE|LINK_EXISTING|REJECT|DEFER, targetCustomerId?, note?}]}`.
Response: queue/case DTOs with `privacy.rawPii=false`; decision response `{decisionRecorded:true, applyRequired:true, publishesCustomers:false, lineReplay:false, reviewCase}`.
Errors: 401; 403; 404; version conflict.
Implements: FR-044-005
Legacy: apps/server/src/app/api/platform/customer-import-reviews/**
