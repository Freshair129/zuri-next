---
id: SDD-041
title: "Customer and conversation record (LINE ingest seam) — design"
---

# SDD-041 — Customer and conversation record (LINE ingest seam) design

- **Components:** CMP-092 — `line-ingest-service.js#ingestLineMessage`, the only writer that turns inbound LINE messages into rows.
- **Data owned:** Customer, Conversation, Message (Person is created by DOM-IAM's resolver; CRM holds the Customer link).
- **Contracts exposed:** API-116.
- **Contracts consumed:** FR-029-004 identity resolver (`resolveLineIdentity`, DOM-IAM); API-111 (FEAT-042); audit recorder (DOM-PRJ).
- **Main sequence:** 1. Validate input (`zIngestLineMessageInput`). 2. Resolve channel account (default `LEGACY:LINE`) and check Business scope. 3. Look up Conversation by account/thread key; refuse Business change. 4. Resolve identity → Person. 5. Duplicate check on `(conversationId, externalMessageId)`. 6. Find/create Customer (tenant+person) and Conversation. 7. Assign session (FEAT-042). 8. Create Message (+ attachment row for media, FEAT-095). 9. Refresh inbox preview columns. 10. Audit `MESSAGE_INGESTED`.
- **Failure modes:** unique/serialization conflict → whole-transaction retry by the owner of the transaction; scope conflict → 4xx with nothing written; identity resolver failure aborts the transaction.

## Implementation map

| Requirement | Current code (legacy repo path) |
|---|---|
| FR-041-001 | apps/server/src/modules/crm/line-ingest-service.js (`ingestLineMessage`); apps/server/src/modules/identity/resolve-line-identity.js |
| FR-041-002 | apps/server/src/modules/crm/line-ingest-service.js |
| FR-041-003 | apps/server/src/modules/crm/line-ingest-service.js |
| FR-041-004 | apps/server/src/modules/crm/line-ingest-service.js; apps/server/src/lib/validation/entities.js (`zIngestLineMessageInput`) |
