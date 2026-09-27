---
id: SDD-075
title: "SmartGift catalog convergence — design"
---

# SDD-075 — SmartGift catalog convergence design

- **Components:** CMP-222 (`smartgift-catalog-adapter.js` — record
  shapes, splitter, identity, hashes; `smartgift-catalog-upload-service.js`) ·
  CMP-224 (`structured-record-policy.js` — the ported deny regex) ·
  CMP-225 (`genesisrag17-structured-record.js` — parser-2 rendering,
  the pinned structured recognizer) · CMP-199
  (`genesisrag17-source.js` — profile dispatch, `genesisRag17ParserProfileForProvider`)
  · CMP-EDGE-genesisrag17 (`apps/edge/src/rag/genesisrag17/*.ts` —
  `corpus-context.ts`, `msp-stdio.ts`, `product-rag.ts`, `published-rag.ts`,
  `record-store.ts`, `settings.ts`, `types.ts`; not a zuri-ai server component, see §9).
- **Data owned:** none new — the structured descriptor rides in the existing
  `KnowledgeIngestion.sourceMetaJson`; no column or migration is added by this feature.
  The production catalog FileAsset is bound to the private `knowledge-catalog`
  Supabase Storage bucket (16 MiB cap, `application/json` only), separate from the
  general `asset-evidence` bucket.
- **Contracts exposed:** API-174 (see `contracts.md`); edge's
  `msp_pipeline_query` call is a consumer of MSP's relay, not an exposed contract of
  this domain.
- **Contracts consumed:** `FEAT-072`'s admission queue and Stage 1–17 executor;
  `FEAT-073`'s `admitKnowledge`; `BR-047`/`ADR-072` D5's
  `Product.flowAccountSku` for occurrence attribute resolution; MSP's
  `msp_pipeline_query` tool (edge side, external).
- **Main sequence:** 1. SmartGift's 5-stage ETL produces a hashed, prepared JSON
  projection 2. the adapter splits it into per-record sources and admits them through
  the standard queue 3. Stage 5 Zero-PII deny runs per record 4. `genesisrag17-parser-2`
  renders each record into descriptive + claim chunks at Stage 2/7 5. Stage 8 extracts
  typed occurrences via the pinned structured recognizer 6. GKS resolves against
  `ontology_v2` 7. once published, edge (if `mode != off`) queries the generation
  through MSP instead of its own v4 store.
- **Failure modes:** a CRM-shaped record → denied at admission or Stage 5, 422; a
  caller-chosen parser/chunker override on a SmartGift source → 400; a mixed-date
  batch → Stage 2 parser error; edge missing a prerequisite for a non-`off` mode →
  refuses to start, naming the setting; edge's own response validation failure →
  refused regardless of MSP's own check.

## Implementation map

| Requirement | Current code (legacy repo path) |
|---|---|
| FR-075-001 | apps/server/src/modules/knowledge/smartgift-catalog-adapter.js; apps/server/src/modules/knowledge/structured-record-policy.js; apps/server/src/modules/knowledge/knowledge-admission-service.js; apps/server/src/app/api/knowledge/catalog-files/route.js |
| FR-075-002 | apps/server/src/modules/knowledge/genesisrag17-structured-record.js; apps/server/src/modules/knowledge/genesisrag17-source.js; apps/server/src/platform/integrations/core/genesisrag17-executor.js; apps/server/src/modules/knowledge/knowledge-corpus-service.js |
| FR-075-003 | apps/edge/src/rag/genesisrag17/corpus-context.ts; apps/edge/src/rag/genesisrag17/msp-stdio.ts; apps/edge/src/rag/genesisrag17/product-rag.ts; apps/edge/src/rag/genesisrag17/published-rag.ts; apps/edge/src/rag/genesisrag17/record-store.ts; apps/edge/src/rag/genesisrag17/settings.ts; apps/edge/src/conversation/executor.ts |
