---
id: DOM-KNW
title: Knowledge
status: proposed
version: 0.1.0
owner: governance
relations:
  decided_by: [ADR-063, ADR-064, ADR-065, ADR-066, ADR-067, ADR-068, ADR-069, ADR-070, ADR-071]
---

# DOM-KNW — Knowledge

## Purpose

Owns zuri-ai's **Tier 1** half of knowledge ingestion and the contracts that face the
external Genesis Knowledge System (GKS): the seventeen-stage ingestion pipeline's
declaration, catalog and job trace; the eight Tier-1 stages it actually executes
(parsing, provenance capture, normalization, classification, deduplication, chunking,
entity-candidate extraction, and their in-process composition); the immutable
raw→parsed→chunk lineage and receipt-bound evidence for the approved GenesisRAG17
isolated pipeline; source admission and corpus publication for authorized Text/Markdown,
FileAsset and structured-record sources; a curated, allow-listed business-knowledge read
contract; and the Knowledge (GKS) navigation slot, including the data pipeline map. It
never resolves entity identity, extracts facts, builds a graph, embeds or indexes
anything — those nine stages are GKS (Tier 3) and GenesisBlockDB (Tier 4) authority, never
executed here (ADR-063 D2, D3).

## Ubiquitous language

- **Source** — an authorized, versioned input (Text/Markdown, a readable `FileAsset`, or a
  structured-record projection) that becomes one durable queued ingestion.
- **RawArtifact** (`KnowledgeRawArtifact`) — the immutable byte-identical record of a
  source at Stage 1, linked to the integration domain's `RawExternalRecord`.
- **ParsedArtifact** (`KnowledgeParsedArtifact`) — Stage 2's structured artifact:
  `document_id`, `parsed_from` (link to the raw artifact), `structure`, `text_blocks`,
  `tables`, `warnings`, `metadata` (extractor version).
- **Chunk** (`KnowledgeChunk`) — Stage 7's retrieval unit: `chunk_id`, `parent_id`,
  `document_id`, `sequence`, `heading_path`, `token_count`, `scope`, `provenance`, plus
  its own text; parent-child lineage for a section too large to retrieve whole.
- **EntityCandidate** — Stage 8's mention-plus-type-guess: never a canonical entity
  identity (that is GKS Stage 9's authority alone).
- **KnowledgeObject** — anything the pipeline produces that must carry provenance
  (`source_id`, `source_type`, `source_uri`, `source_version`, `artifact_id`,
  `ingested_at`, `parsed_at`, `pipeline_version`, `extractor_version`, `checksum`) and,
  if derived, a resolvable `derivation_method` + `source_objects`.
- **KnowledgeSnapshot** (`knowledge_snapshot_id`) — the published, atomic, identified
  corpus a retrieval answer names; carries `tenant_id`, `business_id`,
  `ontology_version`, `pipeline_version`, `published_at`, object statistics.
- **Corpus generation** (`KnowledgeCorpusGeneration`) — a Tier 1 immutable manifest that
  joins independently gated per-source snapshot receipts; not a second GKS quality gate.
- **Sensitivity lattice** — `PUBLIC` / `INTERNAL` / `CONFIDENTIAL` / `RESTRICTED`
  (`KNOWLEDGE_SENSITIVITY_LEVELS`), plus per-object processing policy
  (`retention_policy`, `export_policy`, `cloud_processing_allowed`, `embedding_allowed`).
- **Provenance** — the ten-field source lineage record every knowledge object carries;
  never minted here, only validated and walked (`traceToSource`).
- **Corpus generation** vs **knowledge_snapshot_id** — a corpus generation is Tier 1's
  read-set manifest of many sources; a `knowledge_snapshot_id` is one document's own
  Stage 17 publication identity (FR-072-004).
- **Business knowledge** — the curated, allow-listed public/internal product projection
  served through `BusinessKnowledgeReadPort`; distinct authority from GKS canonical
  facts and from MSP episodic memory (`legacy:` agent domain).
- **Data Pipeline Map** — the validated node/edge/chain registry of where data enters,
  is combined, and is sent, opened from the domain's one navigation slot.

## Owned data

The domain owns **no canonical production knowledge store** (ADR-063 D4, ADR-064 D2).
What it persists:

- `KnowledgeRawArtifact`, `KnowledgeParsedArtifact`, `KnowledgeChunk` — immutable
  Tier 1 lineage for the approved GenesisRAG17 raw→parsed→chunk chain (ADR-068 D1).
- `KnowledgeArtifactStorage`, `KnowledgeArtifactOperation` — object-storage bindings
  and operation records for admitted source bytes.
- `GenesisRag17IngestionIntent`, `GenesisRag17SourceMention`, `GenesisRag17Batch`,
  `GenesisRag17StageEvidence`, `GenesisRag17EvidenceCursor`,
  `GenesisRag17PublicationReceipt` — durable source-worker intent, Stage 8 occurrence
  evidence, one Stage 9 batch per attempt, the pulled Tier 3/4 evidence cursor
  (ADR-066 D2) and the imported atomic publication receipt reference. These are
  execution records, never canonical GKS facts.
- `KnowledgeCorpus`, `KnowledgeSource`, `KnowledgeIngestion`, `KnowledgeCorpusGeneration`
  — the ADR-067 admission/corpus models: corpus identity (Business + optional Project),
  one durable queued ingestion per authorized source version, and the immutable
  per-source-snapshot manifest.
- `KnowledgeCandidate` — the sole exception to the pre-ADR-072 "no Prisma models"
  boundary (ADR-071 D6), a review record of a drafted LINE FAQ candidate. It is
  declared by **FR-096-002**, which is **not** part of this conversion's FR set (owned by a
  separate lane); listed here only because the charter's `owns_models` names it.
- `zuri_core.business_knowledge` — **not a Prisma model.** A raw-SQL Postgres table
  behind forced row-level security and a `SET LOCAL ROLE` login (ADR-086), reached only
  through `BusinessKnowledgeReadPort` adapters (`createPostgresBusinessKnowledgeReader`,
  `createSupabaseBusinessKnowledgeReader`, `createInMemoryBusinessKnowledgeReader`).
  This is where the curated public product projection (FR-074-002) and the shipping rate
  card (FR-074-003, declared) are published — as `business_knowledge` rows, never as new
  domain-owned models.
- `docs/DATA-PIPELINE-MAP.md` / `docs/.data-pipeline-map.json` /
  `runtime/data-pipeline-map.json` — a generated architecture-metadata registry (no
  Tenant/Business/Person data), owned as documentation + a committed runtime
  projection, not a database table.

## Business rules

### BR-039 — The domain persists no canonical fact store of its own
Owner: DOM-KNW
Everything Tier 1 persists is lineage, evidence, admission bookkeeping or a curated
read-only projection — never a second copy of a GKS canonical fact, entity, graph edge,
embedding or index. The one model exception (`KnowledgeCandidate`) is a human-review
record, not a fact GKS asserted (ADR-067, ADR-071 D6; see Owned data). A future model
proposal that would hold canonical entities/facts/graph data reopens ADR-063 D4 and
ADR-064 rather than extending this domain.

Every other governing invariant already has a legacy id and is referenced, not
re-declared: `BR-066` (ingestion identity — the four-part key: source identity,
source version, content hash, pipeline version, computed within one tenant only),
`BR-067` (quarantine vocabulary — retryable / non-retryable / review-required,
with the complete failure envelope), `SEC-001` (cross-tenant/business guard),
`SEC-008` (deny-by-default public read boundary), `SEC-020` (no
cross-tenant deduplication), `NFR-019` (six per-stage metrics).

## Public contracts

- `API-183`, `API-184`, `API-182` —
  source admission (FR-073-001).
- `API-174` — structured-record (SmartGift) admission
  (FR-075-001).
- `API-190`, `API-176`, `API-175` — corpus
  query and citation resolution (FR-073-001).
- `API-193`, `API-191`, `API-192` — source
  lifecycle (FR-073-001).
- `API-179`, `API-180` — corpus/generation listing
  (FR-073-001, FR-073-002).
- `API-178`, `API-177` — the knowledge base console
  (FR-073-002).
- `API-188`, `API-189`,
  `API-186`, `API-185` — the external-tier
  reporter surface onto the FR-060-001, FR-060-002, FR-060-003, FR-060-004, FR-060-005 ledger (FR-072-001, FR-072-002).
- `API-181` — the GKS evidence cursor pull, installation-operator only
  (FR-072-002).
- `API-187` — live per-edge pipeline health overlay (FR-076-004).
- Full list, methods and error shapes: `contracts.md`.

## Capabilities

Not used — no `CAP-KNW-*` grouping exists yet; seven features are flat under the domain.

## Depends on

- **GKS (Genesis Knowledge System), MSP (Memory and Soul Passport) and GenesisBlockDB
  are external systems, never zuri-ai domains** (`ADR-064` D3–D4). This domain
  holds only the Tier 1 contracts that face them: it sends batches, pulls evidence and
  records receipts through MSP; it never opens a GKS or GenesisBlockDB client, an
  embedding call, or an index mutation directly (`ADR-063` D3, `ADR-064`
  D1). "Knowledge (GKS)" in the navigation label names the authority this lane
  *consumes*, not a claim that this domain *is* GKS.
- `FR-060-001, FR-060-002, FR-060-003, FR-060-004, FR-060-005` (integration domain's Supabase data pipeline execution ledger —
  `PipelineRun`/`PipelineStep`/`PipelineRecordEvent`/`PipelineGateDecision`) — every
  ingestion run, stage report and gate decision is recorded on that ledger; this domain
  registers a second pipeline definition (`DPL-KNOWLEDGE-INGEST-V1`) and reuses its
  models exactly, never forking a second execution ledger.
  `apps/server/src/platform/integrations/core/knowledge-ingestion-executor.js` (the
  ledger-writing wiring) accordingly lives in the integration lane, not this domain.
- `FR-053-001, FR-053-002, FR-053-003, FR-053-004` (integration domain's raw external ingestion boundary /
  `RawExternalRecord`) — Stage 1's canonical raw persistence and the `artifactId`
  column FR-072-001, FR-072-002 added to it.
- `FR-067-001`/`SEC-012` (agent domain's MSP memory/vault ports,
  `msp-stdio-transport.js`) — the one transport this domain's evidence-pull importer and
  the GenesisRAG17 source worker both ride to reach MSP.
- `legacy:` project-manager domain (`business-knowledge-candidates-service.js`,
  `Business.knowledgeCandidatesEnabled`) for the `KnowledgeCandidate` admission gate —
  out of scope for this conversion's FR set (see Participates in).
- `ADR-072` D5 (`Product.flowAccountSku`) — the existing per-Tenant column the
  SmartGift structured adapter's occurrence attributes resolve through, never a new
  catalog-vault identity table (`BR-047`).
- `legacy:` project-manager domain's viewer/authorization contract
  (`resolveRequestViewer`, Business visibility) for every admission, console and
  data-pipeline-map read.

## Legacy sources

- Charter: `docs/domains/knowledge/CHARTER.md`
- `docs/FEATURES.md` rows FEAT-072, FEAT-073, FEAT-075, FEAT-076
- `docs/PRD-SDD-v1.0.md` rows FR-074-001, FR-074-002, FR-072-001, FR-072-002..FR-071-002, FR-074-003, FR-073-001, FR-075-001,
  FR-075-002, FR-075-003, FR-076-001..FR-076-004, FR-073-002
- `docs/KNOWLEDGE-INGESTION-17-STAGE-SPEC.md`, `docs/KNOWLEDGE-INGESTION-17-STAGE-FLOW.md`
- `docs/domains/knowledge/features/*.md` (per-FR feature notes)
- ADRs: ADR-063, ADR-064, ADR-065, ADR-066, ADR-067, ADR-068, ADR-069, ADR-070
  (converted, see `decisions.md`); ADR-089, ADR-090 (system-wide context, not converted)

<!-- BEGIN GENERATED: feature-index -->

## Feature index (generated)

### Owned features (8)

| Feature | Title | Delivery | Requirements |
|---|---|---|---|
| [FEAT-070](../../features/FEAT-070-tier1-structural-stage-calculators/feature.md) | Tier 1 structural stage calculators | implemented | 7 |
| [FEAT-071](../../features/FEAT-071-stage-composition-and-quarantine/feature.md) | Stage composition & quarantine | implemented | 3 |
| [FEAT-072](../../features/FEAT-072-ingestion-catalog-snapshot-and-sensitivity/feature.md) | Ingestion stage catalog, snapshot contract & sensitivity lattice | building | 5 |
| [FEAT-073](../../features/FEAT-073-admission-corpus-and-console/feature.md) | Knowledge admission, corpus publication & console | implemented | 3 |
| [FEAT-074](../../features/FEAT-074-business-knowledge-and-graph-read-contracts/feature.md) | Business knowledge & graph read contracts | building | 4 |
| [FEAT-075](../../features/FEAT-075-smartgift-catalog-convergence/feature.md) | SmartGift catalog convergence | building | 4 |
| [FEAT-076](../../features/FEAT-076-data-pipeline-map/feature.md) | Data pipeline map | implemented | 5 |
| [FEAT-096](../../features/FEAT-096-line-grounding-and-knowledge-candidates/feature.md) | LINE grounding and knowledge candidates | implemented | 5 |

### Participating in cross-domain features (0)

_None._

### Hosted by services (4)

- [SRV-001](../../services/SRV-001-web/SERVICE.md)
- [SRV-004](../../services/SRV-004-genesis-worker/SERVICE.md)
- [SRV-005](../../services/SRV-005-gks/SERVICE.md)
- [SRV-006](../../services/SRV-006-knowledge-storage/SERVICE.md)

<!-- END GENERATED -->
