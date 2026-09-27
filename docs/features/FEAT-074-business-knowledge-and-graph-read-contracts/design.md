---
id: SDD-074
title: "Business knowledge & graph read contracts — design"
---

# SDD-074 — Business knowledge & graph read contracts design

- **Components:** CMP-201 (`graph-query.js`, `createGraphKnowledgeReader`)
  · CMP-216 (`project-graph.js`, `projectKnowledgeGraph`) ·
  CMP-221 (`sink.js`, `writeGraph`, `createJsonSink`, the `GraphSink` seam) ·
  CMP-219 (`query.js`, `queryKnowledge`) · CMP-207 (`live-facts.js`,
  `assertNoLiveFacts`, `LIVE_FACT_FIELDS`) · CMP-187
  (`business-contract.js`, `PUBLIC_BUSINESS_KNOWLEDGE_FIELDS`,
  `normalizeBusinessKnowledgeRecord`, `parseBusinessKnowledgeQuery`,
  `createInMemoryBusinessKnowledgeReader`, `buildBusinessKnowledgePacket`) ·
  CMP-215 (`postgres-business-knowledge.js`,
  `createPostgresBusinessKnowledgeReader`) · CMP-226
  (`supabase-business-knowledge.js`, `createSupabaseBusinessKnowledgeReader`).
- **Data owned:** none as a Prisma model. `zuri_core.business_knowledge` (raw SQL,
  RLS-scoped, `DOMAIN.md` → Owned data) is the one store both FR-074-002 and
  FR-074-003 publish into.
- **Contracts exposed:** none as HTTP — `queryKnowledge`/`createGraphKnowledgeReader`
  and `BusinessKnowledgeReadPort` are in-process ports consumed by the agent domain
  (`FR-062-002`'s `createAgentPorts`) and by `legacy:phase1-runtime.js`.
- **Contracts consumed:** `FR-064-003`'s server-owned LINE binding resolves
  `{tenantId, businessId}` for the caller of `BusinessKnowledgeReadPort`; the FR-056-001, FR-056-002
  `PipelineGateDecision` gate for FR-074-003's rate-card approval.
- **Main sequence (business knowledge):** 1. caller resolves `{tenantId, businessId}}`
  2. adapter (DuckDB/Postgres/Supabase/in-memory) queries the allow-listed fields only
  3. `buildBusinessKnowledgePacket` verifies every record is at or below `PUBLIC`
  4. packet returned to the agent runtime for grounded answer composition.
- **Failure modes:** a record above `PUBLIC` in the result set → packet build refused
  entirely, not silently trimmed; a live-fact field in a graph projection input →
  refused before any sink write; a `traverse` bound to anything but MSP/GKS or the
  interim surface → a design violation reviewable by inspection (ADR-064).

## Implementation map

| Requirement | Current code (legacy repo path) |
|---|---|
| FR-074-001 | apps/server/src/modules/knowledge/graph-query.js; apps/server/src/modules/knowledge/project-graph.js; apps/server/src/modules/knowledge/sink.js; apps/server/src/modules/knowledge/query.js; apps/server/src/modules/knowledge/live-facts.js; apps/server/src/modules/knowledge/index.js |
| FR-074-002 | apps/server/src/modules/knowledge/business-contract.js; apps/server/src/modules/knowledge/postgres-business-knowledge.js; apps/server/src/modules/knowledge/supabase-business-knowledge.js; apps/server/src/modules/agent/phase1-runtime.js |
| FR-074-003 | declared, unbuilt — no code path exists yet; the target store is `apps/server/src/modules/knowledge/postgres-business-knowledge.js`'s `zuri_core.business_knowledge` table |
