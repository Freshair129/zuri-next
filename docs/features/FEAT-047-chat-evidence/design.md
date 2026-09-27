---
id: SDD-047
title: "Chat evidence (staff replies, cold archive, legal hold) — design"
---

# SDD-047 — Chat evidence (staff replies, cold archive, legal hold) design

- **Components:** CMP-097 — `reply-record-service.js#sendStaffReply`; CMP-079 — `chat-evidence-archive-service.js`, `chat-evidence-archive-crypto.js`; CMP-080 — `chat-evidence-retrieval-service.js`; CMP-091 — `chat-evidence-legal-hold-service.js`; CMP-078 — `chat-evidence-archive-expiry-service.js`.
- **Data owned:** Message (staff replies), CustomerArchiveKey, ArchiveManifest, CustomerLegalHold; archive files on disk.
- **Contracts exposed:** API-109, API-102, API-115.
- **Contracts consumed:** API-136 (`resolveAccount`, `pushTransport.send`); AAL2 gate `assertCredentialWriteAssurance` (DOM-IAM, FR-094-004); erasure (DOM-IAM `erase-principal.js` calls `destroyCustomerArchiveKey`).
- **Main sequence (sweep):** candidates per Tenant → group by Customer → get/create key → seal → temp write → fsync → rename → read back + hash → transaction(manifest insert + tombstone) → audit counts.
- **Failure modes:** archive storage not ready → Tenant skipped; LINE not accepting → 502 with nothing recorded; P2002 race on staff reply → winner returned.

## Implementation map

| Requirement | Current code (legacy repo path) |
|---|---|
| FR-047-001, FR-047-002 | apps/server/src/modules/crm/reply-record-service.js; apps/server/src/app/api/crm/conversations/[id]/reply/route.js; apps/server/src/app/(pm)/customer/conversations/page.jsx |
| FR-047-003, FR-047-004 | apps/server/src/modules/crm/chat-evidence-archive-service.js; apps/server/src/modules/crm/chat-evidence-archive-crypto.js; apps/server/src/modules/crm/retention-sweep-service.js; apps/server/docker-compose.cold-archive.yml |
| FR-047-005 | apps/server/src/modules/crm/chat-evidence-retrieval-service.js; apps/server/src/app/api/crm/customers/[customerId]/chat-evidence/retrieve/route.js |
| FR-047-006 | apps/server/src/modules/crm/chat-evidence-legal-hold-service.js; apps/server/src/modules/crm/chat-evidence-archive-expiry-service.js; apps/server/src/modules/identity/erase-principal.js; apps/server/src/app/api/crm/customers/[customerId]/legal-hold/route.js |
