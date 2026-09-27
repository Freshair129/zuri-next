# Knowledge — decisions

Eight ADRs assigned to this domain, converted in chronological order. All eight remain
`accepted`/`beta` and none is superseded; several later ones amend an earlier one's
scope (recorded under each entry's Consequences) rather than retiring it.

### ADR-063 — Knowledge ingestion tier boundary and stage ownership
Owner: DOM-KNW
Relations: decided_by: ADR-090, ADR-054
Legacy: ADR-050

**Status:** Accepted (contract/documentation boundary only; no runtime slice authorized
by this ADR alone — later ADR-068 authorizes execution).

**Context.** The 17-stage specification names stages but not who may run them. Adopting
it risked being read as permission to implement all seventeen inside zuri-ai, which
would put a substrate writer inside Tier 1 and contradict two already-approved
decisions (Tier 1 never talks directly to GenesisBlockDB or bypasses MSP governance).

**Decision.**
- The seventeen stage names/ids are the one canonical vocabulary (`DPS-KI-*`); the
  numbered sequence is display ordering only, never a lookup key.
- Stages 1–8 (Ingestion, Parsing, Provenance, Normalization, Classification, Dedup,
  Chunking, Entity Extraction) are Tier 1 (zuri-ai). Stages 9–12, 14 (Entity
  Resolution, Fact Extraction, Ontology Mapping, Temporal Mapping, Enrichment) are GKS
  Tier 3. Stage 13 (Graph Construction) is decided by GKS, written by GenesisBlockDB
  Tier 4; Tier 1 does neither. Stages 15–16 (Embedding, Indexing) are Tier 4. Stage 17
  (Quality Gate) is executed jointly by GKS and Tier 4; Tier 1 holds only the evidence
  and the publish/quarantine decision.
- zuri-ai never executes a substrate-writing stage — no GKS/GenesisBlockDB client, no
  embedding call, no index mutation, not even a "thin" index-only adapter.
- The pipeline reuses the FR-060-001, FR-060-002, FR-060-003, FR-060-004, FR-060-005 execution ledger unchanged as a second pipeline
  definition (`DPL-KNOWLEDGE-INGEST-V1`); no new Prisma model for the ledger itself.
- Publication is atomic and snapshot-identified (`knowledge_snapshot_id` +
  `ontology_version` + `pipeline_version`); only `PASS`/`PASS_WITH_WARNINGS` may
  publish.
- Execution location is policy-driven, not topology-driven: `RESTRICTED` data with
  `cloud_processing_allowed = false` forces all seventeen stages local, resolved per
  object at each stage boundary.
- Classify → scope → index → scoped retrieval; never index-then-filter.

**Consequences.**
- Declares FR-072-001, FR-072-002, FR-072-004, FR-072-003 (and the rules NFR-019, BR-066, BR-067, SEC-020) as
  registry entries, initially unimplemented; the first implementation slice inherits
  parameterising the FR-060-001, FR-060-002, FR-060-003, FR-060-004, FR-060-005 envelope by pipeline definition id.
- Makes the domain's ingestion role falsifiable: any future Tier 4 write credential,
  embedding call or index mutation in this repository is a reviewable violation.
- Later amended in scope, not substance, by ADR-068 (isolated execution) and
  ADR-065/ADR-066 (reporter/evidence-pull), which build the runtime this ADR
  withheld.

---

### ADR-064 — Retire Tier 1 GenesisBlockDB direct clients: MSP, GKS and
Owner: DOM-KNW
GenesisBlockDB are external systems, never zuri-ai domains
Relations: decided_by: ADR-101, ADR-089, ADR-090, ADR-054; supersedes: ADR-063 (D3, scope only)
Legacy: ADR-063

**Status:** Accepted by owner instruction.

**Context.** Two files predating the tier-boundary decisions still held a direct
`GenesisDatabase` (GenesisBlockDB) client with no production caller
(`gbdb-rag-service.js`, `genesisblockdb-sink.js`); a third, found during the same
retirement, did the same for SmartGift (`smartgift-rag-pipeline.js`).

**Decision.**
- All three files, and their only test consumers, are deleted outright (not
  deprecated) — a deprecated export is still an import path.
- FR-074-001 keeps only its Tier 1 half: `projectKnowledgeGraph` (deterministic, tenant-
  scoped, `assertNoLiveFacts`-guarded), `writeGraph`/`GraphSink`/`createJsonSink`, and
  `queryKnowledge`/`createGraphKnowledgeReader`. The reader's injected `traverse` may
  only ever be bound through MSP → GKS or the ADR-054 interim surface, never to the
  substrate directly.
- The SmartGift webhook e2e test is rewritten to seed a PUBLIC business-knowledge
  fixture through the in-memory reader and answer via `answerBusinessQuestion`,
  instead of mocking a GenesisBlockDB client.
- MSP, GKS and GenesisBlockDB are named by canonical repository (not local drive path)
  and recorded as forever-external: no `src/modules/<d>` lane, ever, for any of the
  three — a lane here would either duplicate their cross-product authority or fork it.

**Consequences.**
- `grep`-verifiable: zero occurrences of `GenesisDatabase`, `hybridSearch`,
  `flushIndex` in `src/` outside this document.
- No requirement id is declared, retired or reworded — FR-074-001's statement and
  implementation status are unchanged by this ADR; only two unreachable files and one
  test's setup are removed.

---

### ADR-065 — The knowledge ingestion reporter: the SoT data-plane key
Owner: DOM-KNW
authenticates Stages 9–17 onto the FR-060-001, FR-060-002, FR-060-003, FR-060-004, FR-060-005 ledger, and a run closes only from what was
reported
Relations: decided_by: ADR-090, ADR-054, ADR-055; decided_by: ADR-063
Legacy: ADR-067

**Status:** Accepted by owner decision (reuse the existing `SotDataPlaneKey` rather
than mint a new credential type or defer the route).

**Context.** ADR-063 assigned Stages 9–17 to GKS/GenesisBlockDB and obliged them to
report evidence back onto the FR-060-001, FR-060-002, FR-060-003, FR-060-004, FR-060-005 ledger, but nothing let that evidence arrive:
`recordPipelineEvent` admitted only an installation operator, and every knowledge run
stayed `RUNNING` forever with no one entitled to close it.

**Decision.**
- The FR-027-001 `SotDataPlaneKey`, Tenant-bound, authenticates the reporter — never an
  installation operator, and it may write only the nine external stage ids plus
  `GATE_UPDATED`/`RUN_FINISHED`; a Tier 1 stage id from a reporter is refused 403.
- A report is identified by run + stage + attempt + outcome; a replay of the same
  report is `UNCHANGED`, a conflicting one is refused 409. Step identity is checked
  (stage/step/attempt must all agree with the materialised row).
- `startedAt`/`finishedAt` are required on every report; the run's own liveness clock
  never mixes with a late report of an old execution.
- A run closes (`finishKnowledgeIngestionRun`) purely from ledger facts — every stage
  2–17 `SUCCEEDED` behind an `APPROVED`, publishable gate → `SUCCEEDED`; any failed
  stage or rejected gate → `FAILED`; otherwise refused naming what is still owed. Stage
  1 is out of band (its step stays `NOT_STARTED` by design) and a `WAIVED` gate is not
  a verdict.
- FR-072-001, FR-072-002's §5 job state (`knowledgeJobState`) is a pure, clockless projection over the
  run status, step board and newest Stage 17 decision — `PUBLISHED` has exactly one
  derivation.
- Four of NFR-019's six per-stage metrics land on the ledger (`records_in`,
  `records_out`, `records_failed`, `processing_time`); `records_quarantined` and
  `retry_count` have no column and are returned `declined`, named rather than dropped.

**Consequences.**
- Closes FR-072-001, FR-072-002 AC-109.11 and FR-072-004 AC-110.4 outright; AC-109.12 gets its receiving
  half (the fetching half is ADR-066).
- Four routes under `/api/pipelines/knowledge/{executionRunId}` (`GET`,
  `POST …/stages`, `…/gate`, `…/finish`), each trying the bearer key first and falling
  through to session auth.
- This is half an answer on its own: GKS never calls outward, so its evidence still
  needs a pull — built the same day by ADR-066.

---

### ADR-066 — Tier-3 stage evidence is pulled: zuri-ai → MSP →
Owner: DOM-KNW
`gks_stage_evidence_export`, cursor owned here, every row attributed or named
Relations: decided_by: ADR-090, ADR-054; decided_by: ADR-063, ADR-065
Legacy: ADR-068

**Status:** Accepted by owner instruction (the full pull direction, GKS → MSP →
zuri-ai, chosen from four scoped options).

**Context.** GKS's own accepted design never calls outward — its evidence leaves only
as a cursor pull through a read-only registry tool. ADR-065's receiver was
therefore only half the answer; nothing yet fetched what it was built to receive.

**Decision.**
- zuri-ai reaches MSP by spawning it as a child process from deployment configuration
  (`msp-stdio-transport.js`, shared with the agent domain's memory port); when
  unconfigured the route fails closed (503), never a silent empty pull.
- Cursor ownership is zuri-ai's, per exact `KnowledgeScope` tuple
  (`KnowledgeEvidenceCursor`, one new model + Supabase migration, not itself a ledger
  model). No wildcard scope; the cursor advances only past rows that landed, after
  their ledger writes committed.
- Every exported row is classified purely: **apply** (an external stage on a run this
  ledger holds), **unattributed** (no matching run — advances, listed),
  **held** (GKS's Stage 17 dimensions with no verdict yet — advances, listed), or
  **blocked** (a contract violation — a Tier 1 stage id from a Tier 3 export, a scope
  mismatch, a missing materialised step, or a receiver refusal — cursor stops before
  the row, retried next pull).
- A row applies as `SUCCEEDED` only (GKS's export carries no failure outcome — a row
  exists because the stage ran); this repository persists no derived per-record
  objects, so `records` entries stay in GKS.
- `POST /api/pipelines/knowledge/evidence/pull` is one installation-operator tick over
  one scope; scheduling and the forward MSP promotion handoff are explicitly out of
  scope.

**Consequences.**
- Closes AC-109.12 for every external stage that exists today, proven live across
  zuri-ai, MSP and GKS (`fr110-knowledge-evidence-chain.test.js`).
- One new model, one new route, three new env variables; deployment configuration
  (an MSP for zuri-ai, a GKS for MSP) is an operator step, not code.

---

### ADR-067 — Knowledge admission and corpus publication
Owner: DOM-KNW
Relations: decided_by: ADR-068; relates_to: FR-073-001, FR-073-002
Legacy: ADR-072

**Status:** Beta — phases 0–4 implemented and validated in the isolated profile;
production excluded.

**Context.** Before this decision, FileAsset staging, legacy business knowledge and the
internal GenesisRAG17 raw entrypoint were three disconnected paths: UI/API/MCP callers
stopped at files or staging, and the tested 17-stage chain started at an internal
operator call. Treating the two separate successes as one end-user flow was the
readiness gap this ADR closes.

**Decision.**
1. One knowledge admission service handles Text/Markdown and existing readable
   FileAsset text/Markdown for both UI and MCP; no direct binary/OCR parser, remote URL
   fetch, fabricated stage report, or caller-supplied worker credential.
2. Four additive models — `KnowledgeCorpus`, `KnowledgeSource`, `KnowledgeIngestion`,
   `KnowledgeCorpusGeneration` — with corpus identity Business + optional live Project.
3. Each authorized immutable source version becomes one durable queued ingestion,
   idempotent on request/key; the raw executor's source identity is namespaced by
   corpus/source UUIDs, never a user display name.
4. End-user authorization precedes any disclosure of source content/configuration;
   machine credentials need an explicit configured knowledge grant.
5. Runtime execution uses an unforgeable in-process scoped capability, distinct from
   installation-operator authority; it cannot be minted from request JSON.
6. An opt-in source runtime starts/resumes from durable queue and persisted intent;
   leases and compare-and-set prevent two workers publishing the same job.
7. GKS and the native worker remain the sole authority for one document's 17-stage
   publication; a corpus generation is an immutable Tier 1 manifest of verified
   per-source snapshot receipts, never a replacement fact store.
8. Only an ingestion whose run succeeded and whose exact receipt validates may update
   corpus membership; an older revision cannot overwrite a newer one.
9. Query pins one corpus manifest, asks MSP for each active source's explicit
   snapshot, and combines per-snapshot ranks with reciprocal-rank fusion (k=60);
   native hybrid/BM25 scores stay snapshot-local evidence.
10. Citation ids bind generation + source + ingestion + chunk; resolution rechecks
    current ACL/revocation, so a revoked source denies even an old, otherwise-valid
    citation.
11. FileAsset metadata removal does not mutate historical snapshots; explicit source
    withdrawal atomically removes serving membership.
12. Files/Project Files gain bounded Text/Markdown controls; no new navigation domain,
    crawler, LLM extractor, or public "reporter-success" surface.

**2026-09-24 amendment (owner-approved, "approve").** An OWNER-admitted
`KNOWLEDGE_ADMISSION` TEXT/FILE document now runs its own Stage 5 Zero-PII gate
(identity `knowledge-document-zero-pii-1`) — identifier rules only (LINE id, Thai/intl
phone, e-mail), reusing FR-096-002's exported patterns, deliberately excluding the
name/quote heuristics that would refuse ordinary approved document content. The
existing `LINE_STUDIO_DESCRIPTION` no-gate decision (out of this conversion's FR set)
is explicitly preserved via its own provider descriptor rather than a shared fallback.

**Consequences.**
- The atomic corpus manifest proves multi-document retrieval and membership, not
  corpus-wide graph deduplication or one aggregate native quality gate.
- Business owner Files-browser admission and session HTTP/MCP reached the real native
  pipeline in isolated acceptance; production activation is a separate, later gate.

---

### ADR-068 — GenesisRAG17 isolated execution and publication
Owner: DOM-KNW
Relations: decided_by: ADR-063, ADR-065, ADR-066
Legacy: ADR-073

**Status:** Beta — user-approved implementation; acceptance remains evidence-gated.

**Context.** ADR-065 supplied reporting/run-close and ADR-066 supplied evidence
pull, but the source-to-GKS forward worker, durable parsed/chunk lineage, the remaining
GKS stages and physical publication were still missing — a run cannot complete by
installing only its reporter.

**Decision.** Authorizes the isolated `genesisrag17.v1` wire contract:
1. Tier 1 owns immutable versioned raw → parsed → chunk lineage (amending ADR-063's
   historical no-new-model limit for these seven lineage/batch/evidence models only);
   the FR-060-001, FR-060-002, FR-060-003, FR-060-004, FR-060-005 ledger remains the only execution ledger.
2. One document per run, one batch per Stage 9 attempt; exact source/chunk hashes and
   positions accompany the complete batch; GKS validates before use.
3. Every terminal report binds run/stage/step/attempt with real outcome and times;
   delivery retries keep idempotency, true reruns use FR-060-001, FR-060-002, FR-060-003, FR-060-004, FR-060-005 attempts.
4. GKS stays passive, reached only through MSP; the separate GenesisBlock worker pulls
   decisions through MSP and holds the one native store process. Tier 1 never gains
   substrate access by this amendment.
5. Stage 10 is `rule_v1` (confidence floors .90/.85/≤.70, write floor .80); Stage 11 is
   `ontology_v1` (`WORKS_FOR`, `PURCHASED`); Stage 12 pins temporal parity to a named
   MSP commit; Stage 13 completes only on real write evidence.
6. GenesisBlock and the embedding model are pinned by exact commit/revision hash; no
   revision fallback; the six-lane manifest identifies native vs. worker-derived lanes
   honestly.
7. The worker writes a candidate generation, flushes, checkpoints, reads back and
   benchmarks before asking GKS for publication permission; physical publication
   atomically switches a pointer and produces a scope/run/attempt/decision/snapshot/
   generation/model/transaction-bound receipt.
8. Successful run finish requires both an allowed gate **and** its matching publication
   receipt — a passing gate alone is not publication.

**2026-09-11 amendment.** Lifts "no production deployment" for exactly one case: the
SmartGift structured-record profile (FR-075-001/FR-188 adapter + `ontology_v2`), on the
edge device only, one runtime binding, after Phase 2 acceptance passes, as a separate
owner-triggered operator step (see ADR-069 D8).

**2026-09-23 amendment.** Authorizes an isolated, no-customer-traffic canary of an
authenticated MSP-to-GKS HTTP transport on an internal Compose network; explicitly
authorizes no production service start, secret change, or customer traffic.

**2026-09-24 amendment.** Rules that the Stage 16/17 retrieval benchmark stays a
per-record publish condition for the SmartGift profile (Option A over Option B); a new
or changed catalog record needs its fixture entry added by an owner-triggered operator
step before it can publish.

**Consequences.**
- Text/Markdown sources admitted through FR-073-001 remain outside production scope for
  any Business other than the one SmartGift profile.
- The specification's frozen fixture thresholds (Recall@5 ≥ .80, MRR ≥ .65, citation
  correctness 1.00, cross-tenant leakage 0) are test-corpus results, never a production
  quality claim on their own.

---

### ADR-069 — SmartGift catalog enters GenesisBlockDB only through the 17-stage
Owner: DOM-KNW
source adapter
Relations: decided_by: ADR-089, ADR-090, ADR-072; decided_by: ADR-068; relates_to: FR-075-001, FR-075-002, FR-075-003
Legacy: ADR-075

**Status:** Approved by the owner (direction + Phase 1 unconditionally; Phases 2–5 each
gated on their own explicit approval, recorded in D8).

**Context.** Three independent writers put SmartGift catalog data into GenesisBlockDB
or a private substitute without going through MSP/GKS at all: SmartGift's own 5-stage
ETL (direct `vaults/vlt-catalog-product/genesis-db` write), `apps/edge`'s Genesis RAG
v4 (a private store re-derived from a sibling checkout's raw file, serving live LINE
traffic), and the unactivated 17-stage pipeline (the one correct path, unused).

**Decision.**
- **D1.** SmartGift catalog data enters GenesisBlockDB only through Stage 13 of the
  17-stage pipeline; no script writes any vault directly.
- **D2.** A structured-record source adapter enters **before Stage 1** (never a new
  Stage 18); it authorizes, freezes bytes/hash/version and enqueues — never
  synthesizes a stage result (declared as FR-075-001).
- **D3.** SmartGift's 5-stage ETL becomes a source producer; its own SHA-256 registry
  hash becomes the adapter's Stage 1 version identity, so a byte-identical re-run is
  the same idempotent non-event Stage 6 already defines.
- **D4.** SKU/FlowAccount codes stay attributes of the occurrence, never the
  occurrence's `resolutionKey` and never a new catalog-vault mapping — extending
  `BR-047`/`ADR-072` D5's `Product.flowAccountSku` rule to the knowledge
  side.
- **D5.** Zero-PII is enforced at Stage 5 classify, reusing (porting, not copying)
  SmartGift's own deny regex for customer/contact/quotation source paths.
- **D6.** A structured parser profile, typed mentions and `ontology_v2` are a
  **four-repository contract change** (zuri-ai, MSP, GKS, GenesisBlock worker must all
  accept before any one ships a field); declared as FR-075-002. Revision 2 (owner-approved)
  fixes the vocabulary (`HAS_COMPONENT`, `PRICED_AT`, `IN_CATEGORY`), models a
  tier-qualified price as its own `PRICE_TIER` entity, and rolls out accept-before-
  produce across the four repositories.
- **D7.** Edge becomes a reader of the published generation through the existing
  MSP-mediated query path; Genesis RAG v4 is kept only as an explicit, time-boxed
  Phase 4 fallback (declared as FR-075-003).
- **D8.** Five phases, each gated on the previous and its own separate owner approval:
  0 (declare), 1 (adapter code), 2 (four-repo `ontology_v2` contract), 3 (edge-device
  deployment for this one profile), 4 (FR-075-003 shadow-then-cutover, 120-day fallback
  window), 5 (sunset the two bypassing writers — conditional on zero shadow mismatches
  across two full campaign windows).
- **D9.** Non-goals: no pricing engine here (superseded in scope only by
  `ADR-077`), no PDF/OCR adapter, no Stage 18.
- **D10 (2026-09-23 amendment).** A private authenticated GKS HTTP service is
  canary-only, on an internal Compose network with no host-published port, until
  separately released; stdio remains MSP's default and rollback transport.

**Consequences.**
- One entry path replaces three; SmartGift's existing SHA-256 registry becomes the
  recognized version identity instead of an implicit convention two repositories
  separately assumed.
- `ontology_v2`/`genesisrag17-parser-2` took effect on the production edge deployment
  from 2026-09-21 (pinned GKS/GenesisBlock/MSP commits, `apps/server/deploy/ki17/pins.json`)
  — the first of this ADR's phases to reach real production traffic.
- Approving this ADR alone did not close the violation it describes: SmartGift Stage 5
  and edge v4 keep writing/reading as before until Phase 5's conditions are met.

---

### ADR-070 — A Knowledge (GKS) slot, and the data pipeline map as a validated
Owner: DOM-KNW
registry
Relations: decided_by: ADR-064, ADR-102, ADR-032; relates_to: FR-076-001, FR-076-002, FR-076-003, FR-076-004
Legacy: ADR-085

**Status:** Accepted; implemented locally by FR-076-001..FR-076-004 in the same lane;
production/live activation is a separate gate.

**Context.** Nowhere in the repository answered, in one place, where data enters
zuri-ai, where it is combined, and who receives it — three separate documents each
covered only part of it, one already stale. The owner asked for a visual node-edge view
as a sub-domain of the Genesis Knowledge System; two existing facts constrain where it
can live: GKS is never a zuri-ai domain (`ADR-064` D4), and the knowledge lane
had no navigation slot at all.

**Decision.**
- **D1.** One flat domain key, `knowledge`, labelled **Knowledge (GKS)**, base path
  `/knowledge`, owned by this charter — a real grantable domain key (not a
  `DOMAIN_GROUPS` container), because it owns pages. The label names the authority the
  lane *consumes*, never a claim that GKS is a zuri-ai domain.
- **D2.** The map is a registry of hand-maintained facts (nodes, labelled edges,
  chains) plus a generator that derives everything derivable — surface existence,
  requirement status, FEAT — and fails by name on any contradiction or unknown id.
- **D3.** Two axes are tracked, never folded into one number: **build status**
  (`BLOCKED`/`DECLARED`/`PARTIAL`/`CODE_TESTS`/`PRODUCTION`) and **surface level**
  (`NONE`/`WORKER`/`MCP`/`ENDPOINT`/`UI`); an edge takes the weakest status of the
  nodes it joins, a chain the weakest of its edges.
- **D4.** A committed static projection (`docs/.data-pipeline-map.json`, built-not-
  committed; `runtime/data-pipeline-map.json`, committed, per `ADR-102`),
  rendered server-side and admitted only when `knowledge` is visible in the active
  Business.
- **D5.** The only live part is a later, Business-scoped overlay: counts and last-run
  time per edge, read through four bounded owning-domain read ports, one read per
  backing table; an edge with no backing table or a failed read shows no number, never
  a false zero.
- **D6.** Hand-rolled inline SVG (no graph library), fully keyboard-reachable, plus a
  list view presenting the same chains/nodes/edges as tables.

**Consequences.**
- Two older diagram documents (`ARCHITECTURE-DIAGRAMS.md` §3, `SYSTEM-DIAGRAM.md`) now
  point at this map as the current data-flow view and keep their own text as dated
  records.
- A new data surface not added to the registry is invisible to the generator by
  construction — the map validates what it is told, it cannot discover what it is not.
- The `knowledge` domain key joins every consumer of `DOMAINS` (permission checkboxes,
  route guard, domain bar) the same way any other domain does.

### ADR-071 — LINE answers are grounded by the published GKS corpus; LINE-derived knowledge enters only as reviewed candidates
Owner: DOM-KNW
Relations: relates_to: FR-096-001, FR-096-002, FR-096-003, FR-096-004
Legacy: ADR-090

**Status:** Accepted, 2026-09-14 (owner instruction, all proposed decisions accepted as
presented). Phase 0 (declaration) plus the implementation FEAT-096 documents.

**Context.** Before this decision, no LINE byte reached the knowledge corpus and no
LINE answer read from it: the server path answered only from the Business's curated
`business_knowledge` table, and production LINE customers were answered by a separate
edge-side store this decision does not touch. A lawful, already-existing read seam
(`queryKnowledgeCorpus`) let a caller ask for one published corpus generation with
citation-bound results, and the agent lane's `answerBusinessQuestion` already refused
to call a model without evidence — but nothing wired the two together, and nothing let
conversation content flow back into the corpus at all: the knowledge charter, an
internal "PHASE-04" design note and a related architecture decision all forbade
admitting raw conversations, and the one function that promotes content into the
corpus had no caller from this codebase and required a provenance reference this
codebase cannot produce.

**Decision.**
- **D1 — Per-account mode selects the reader.** `LineOaAccount` gains a publisher-set
  `knowledgeGrounding` mode (`BUSINESS_KNOWLEDGE` default / `GKS_CORPUS` / `GKS_THEN_
  BUSINESS_KNOWLEDGE`). The corpus reader is an in-process implementation of the
  existing `knowledge.query` port — never an HTTP self-call, never a direct read of
  the lowest storage tier — scoped to the turn's own server-derived Tenant/Business.
- **D2 — Mode-gated, traced fallback; no evidence, no model call.** Every hop writes
  one trace event naming its source, reason and budget. `GKS_CORPUS` never falls
  back; `GKS_THEN_BUSINESS_KNOWLEDGE` falls back only on unavailability or no
  evidence. No evidence from any allowed source means the existing deterministic
  reply, and the model is not called — an invariant the agent lane already enforced
  for one source, now applied across sources.
- **D3 — Budgeted hop.** 2500 ms wall clock, top-K 5, an 8 KiB evidence packet cap —
  all configuration. Over budget resolves to unavailable, never a slower answer.
- **D4 — Retrieval references travel on the trace, not the reply.** Citation/source/
  snapshot/generation references are recorded on the trace; the customer-facing reply
  carries none of them.
- **D5 — A single named Business goes first, after external dependencies land.** The
  first account ever switched to a corpus mode is a specific Business, and only once
  a separate, unconverted infrastructure decision has deployed its own prerequisites.
  A second Business's switch waits on a separate routing decision (the runtime
  accepts one binding).
- **D6 — Chat becomes knowledge only as a reviewed, locator-only candidate.** The only
  LINE-derived content that may enter the corpus is a canonical question/answer with
  product locators, policy names and amounts — never a name, a messaging-platform user
  id, or quoted customer wording — drawn only from consent-GRANTED conversations.
  Zero-PII is enforced twice: at candidate creation/edit/decision and again when the
  source is classified after admission, and both checks run the *same* candidate-prose
  policy rather than an unrelated structured-record policy that would have wrongly
  denied ordinary approved FAQ prose merely for containing the words for "customer" or
  "quotation." A Business OWNER or its LINE OA publisher role edits and approves or
  rejects each candidate, audited. An approved candidate is admitted as one immutable
  TEXT source through the existing admission service, before the corpus pipeline's
  first stage. Refused, explicitly: raw transcripts; session-memory summaries admitted
  as sources; automatic promotion of anything; a first-tier call to the promotion
  primitive that remains a separate memory system's own.
- **D7 — Studio descriptions become sources later; the gap report never enters the
  corpus.** A published rich menu's / LIFF app's / bot profile's human-readable copy
  is admitted as a TEXT source on a publisher action — never its underlying JSON.
  Questions answered with no evidence become a Business-scoped report of counts,
  locators and last-seen times only; the question text stays in the conversation
  system and nothing from the report is ever admitted.
- **D8 — Erasure withdraws what was admitted.** A candidate carries only a
  conversation and message reference. A principal's erasure tombstones every
  candidate naming that conversation, and for one already admitted, withdraws its
  knowledge source and starts a correction run; the corpus cannot delete a row
  outright, which is why Zero-PII is enforced *before* admission rather than relied on
  to be cleaned up after.
- **D9 — Registry rows land with their surfaces.** New process/store nodes (the
  grounding reader, the candidate extractor, the candidate store, the gap report) are
  declared only once they exist on disk, alongside the edges connecting them to what
  already existed.

**Consequences.**
- Nothing changes for any account until a publisher switches its mode — the default
  reader is untouched. The knowledge domain gains its first consumer-facing read for
  LINE and, once D6 lands, its first model and review surfaces for feedback from
  conversations. The agent lane composes across sources and owns no new data for this
  decision. Conversation content still cannot reach the corpus by any route this
  decision did not explicitly open, and a wrongly admitted candidate can only be
  withdrawn and corrected, never deleted — which is why prevention (Zero-PII before
  admission) carries the weight, not cleanup after.
- FR-096-001's SmartGift production switch (D5) is gated on work outside the
  converting group's scope (legacy ADR-069 Phase 3, legacy ADR-045's implementation-
  validation boundary); no legacy:ADR-075 exists yet to cite as a formal relation.

**Alternatives rejected:** an HTTP self-call from the web process to its own query
endpoint (an unnecessary machine grant and an extra hop, though kept for the separate
edge-device path); replacing the curated business-knowledge table with the corpus
outright before the corpus has real production content for any Business; reading the
edge-side store directly from the server (a boundary violation between execution
tiers); routing candidates through the session-memory system's own promotion
primitive (that system's design was not ready, and admission was already available);
indexing raw conversations or memory summaries directly (forbidden by the knowledge
domain's own charter).

**Amends by pointer:** three prior decisions outside this conversion's scope, each
carrying a one-line pointer back to this one — an implementation-validation boundary
that said server-grounded answers use only the curated table (still true for the
default mode); the admission service's set of source kinds (extended by two, both
TEXT, both still bound by "no binary parser, no fabricated stage report"); and the
corpus classification stage's Zero-PII gate (now scoped per source-kind provider
rather than one policy for every structured/candidate source). None of the three has
a converted id in this effort; cited here by description only.

Legacy: ADR-090
