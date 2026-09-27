---
id: SDD-073
title: "Knowledge admission, corpus publication & console — design"
---

# SDD-073 — Knowledge admission, corpus publication & console design

- **Components:** CMP-185 (`knowledge-admission-service.js`,
  `admitKnowledge`, `readKnowledgeIngestion`, `listKnowledgeIngestions`) ·
  CMP-191 (`knowledge-corpus-service.js`, `publishVerifiedKnowledgeIngestion`,
  `readAuthorizedKnowledgeManifest`, `queryKnowledgeCorpus`, `resolveKnowledgeCitation`,
  `withdrawKnowledgeSource`) · CMP-186 (`knowledge-authorization.js`,
  `knowledge-execution-authority.js` — the unforgeable in-process scoped capability) ·
  CMP-220 (`knowledge-repository.js`, `knowledge-runtime.js`) ·
  CMP-190 (`knowledge-console-service.js`, `knowledge-console-repository.js`,
  `knowledge-console-http.js`).
- **Data owned:** `KnowledgeCorpus`, `KnowledgeSource`, `KnowledgeIngestion`,
  `KnowledgeCorpusGeneration` (ADR-067).
- **Contracts exposed:** API-183, API-184,
  API-182, API-190, API-176,
  API-175, API-193, API-191,
  API-192, API-179, API-180,
  API-178, API-177 (see `contracts.md`); the same
  operations again through the project-manager MCP transport.
- **Contracts consumed:** `FEAT-072`'s GenesisRAG17 executor and worker (Stages
  1–17 execution); `legacy:` project-manager's FileAsset ACL and Project
  read/write-ancestry guards; `FR-067-001` (MSP relay) for per-snapshot query.
- **Main sequence (admit → publish → query):** 1. caller authorized, content/version
  frozen and hashed 2. durable `KnowledgeIngestion` queued, scoped source runtime
  drains it 3. FEAT-072 executes Stages 1–17 4. a verified Stage 17 receipt is
  atomically merged into the corpus's `KnowledgeCorpusGeneration` manifest 5. a later
  query pins that manifest, asks MSP per source snapshot, fuses ranks, returns
  citations bound to generation/source/ingestion/chunk.
- **Failure modes:** hash/version conflict → 409; wrong scope or forbidden write →
  403/404 (same shape as nonexistent); unsupported source type → 415/422; a required
  snapshot read failure → the whole query fails, never a silent partial; runtime
  restart → resumes queued/admitted work from durable state, no fabricated stage
  completion.

## Implementation map

| Requirement | Current code (legacy repo path) |
|---|---|
| FR-073-001 | apps/server/src/modules/knowledge/knowledge-admission-service.js; apps/server/src/modules/knowledge/knowledge-corpus-service.js; apps/server/src/modules/knowledge/knowledge-authorization.js; apps/server/src/modules/knowledge/knowledge-execution-authority.js; apps/server/src/app/api/knowledge/ingestions/**; apps/server/src/app/api/knowledge/queries/route.js; apps/server/src/app/api/knowledge/citations/**; apps/server/src/app/api/knowledge/sources/**; apps/server/src/app/api/knowledge/corpora/** |
| FR-073-002 | apps/server/src/modules/knowledge/console/KnowledgeConsole.jsx; apps/server/src/modules/knowledge/knowledge-console-service.js; apps/server/src/modules/knowledge/knowledge-console-repository.js; apps/server/src/app/(pm)/knowledge/console/page.jsx; apps/server/src/app/api/knowledge/console/**; apps/server/src/app/api/knowledge/citations/[citationId]/artifact/route.js |
