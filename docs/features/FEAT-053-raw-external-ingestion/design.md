---
id: SDD-053
title: "Raw external ingestion substrate — design"
---

# SDD-053 — Raw external ingestion substrate design

- **Components:** CMP-142 — `core/contracts.js` (`zIngestionEnvelope`, `createIngestionEnvelope`), `core/idempotency.js`, `core/raw-ingest-service.js#ingestRawExternalRecord`, `core/raw-record-repository.js#createPrismaRawRecordRepository`, `core/raw-record-redaction.js`; adapters `providers/line/line-oa-webhook.js`, `providers/line/line-oa-evidence.js`, `modules/integration/adapters/{marketplace-listing,retail-price}-adapter.js`; `core/integration-registry.js#createIngestionRun`.
- **Data owned:** RawExternalRecord, IngestionRun, SyncCursor, ExternalEntityRef, DeadLetterRecord.
- **Contracts exposed:** API-160 (in-process).
- **Contracts consumed:** none (leaf substrate).
- **Main sequence:** adapter builds envelope → validate + hash → repository lookup by idempotency key → insert or `UNCHANGED` → adapter/consumer translates later.
- **Failure modes:** scope violation throws (fail closed); hash mismatch throws; repository missing throws.

## Implementation map

| Requirement | Current code (legacy repo path) |
|---|---|
| FR-053-001 | apps/server/src/platform/integrations/core/contracts.js |
| FR-053-002 | apps/server/src/platform/integrations/core/idempotency.js; apps/server/src/platform/integrations/core/raw-ingest-service.js |
| FR-053-003 | apps/server/src/platform/integrations/core/raw-record-repository.js |
| FR-053-004 | apps/server/src/platform/integrations/core/raw-ingest-service.js; apps/server/src/platform/integrations/core/raw-record-redaction.js; apps/server/src/platform/integrations/core/integration-registry.js; apps/server/src/platform/integrations/providers/line/line-oa-webhook.js |
