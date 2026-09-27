# Knowledge — contracts

HTTP routes exposed under `apps/server/src/app/api/knowledge/**` and
`apps/server/src/app/api/pipelines/**` that implement an FR in this conversion's set.
Routes serving `FR-096-002`/`FR-096-003`/`FR-096-004` (`/api/knowledge/candidates/**`,
`/api/knowledge/gap-report`) exist in the same module tree but implement FRs **outside**
this conversion's assigned set (owned by a separate lane per the LINE-grounding
cross-domain feature) and are listed at the end for completeness only, not converted.
`/api/pipelines/runs/**` is the integration domain's generic pipeline-run contract
(`FR-060-001, FR-060-002, FR-060-003, FR-060-004, FR-060-005`) and is referenced under Depends-on in `DOMAIN.md`, not repeated here.

## Source admission and corpus serving

### API-183
Owner: DOM-KNW
`POST /api/knowledge/ingestions`
Purpose: admit a Text/Markdown body or an existing readable FileAsset reference under a
Business/optional-Project scope, returning the durable `KnowledgeIngestion` job identity
(and its bound `executionRunId` once one exists).
Auth/scope: session Business writer authority, or a machine credential holding an
explicit configured knowledge grant; scope/policy resolved server-side, never trusted
from the request.
Request: `{ businessId, projectId?, content | fileAssetId, format?, requestKey }`.
Response: `{ ingestionId, executionRunId?, status }`.
Errors: 401/403 (authorization), 409 `KNOWLEDGE_SOURCE_VERSION_CONFLICT` (changed input
under an existing key), 415 (unsupported content type/format), 422 (validation, or a
Zero-PII denial for a structured format).
Implements: FR-073-001
Legacy: `POST /api/knowledge/ingestions` (ADR-072 D1, D3)

### API-184
Owner: DOM-KNW
`GET /api/knowledge/ingestions`
Purpose: list scoped source jobs and publication state for a Business/Project.
Auth/scope: Business reader visibility.
Response: paginated list of `{ ingestionId, sourceId, status, executionRunId }`.
Implements: FR-073-001
Legacy: `GET /api/knowledge/ingestions` (ADR-072)

### API-182
Owner: DOM-KNW
`GET /api/knowledge/ingestions/{runId}`
Purpose: read one opaque admission job (`KnowledgeIngestion.id`), including its bound
`executionRunId` when one exists.
Auth/scope: Business reader visibility.
Errors: 404 (unknown or unauthorized job — same shape).
Implements: FR-073-001
Legacy: `GET /api/knowledge/ingestions/{runId}` (ADR-072)

### API-190
Owner: DOM-KNW
`POST /api/knowledge/queries`
Purpose: query one authorized corpus manifest; pins one generation, asks MSP for each
active source's explicit snapshot, fuses per-snapshot ranks (RRF, k=60), returns
manifest identity and citations.
Auth/scope: Business reader visibility over the corpus's Business/Project.
Errors: fails the whole query (never a partial "complete" answer) on a required
snapshot/read failure.
Implements: FR-073-001
Legacy: `POST /api/knowledge/queries` (ADR-072 D9)

### API-176
Owner: DOM-KNW
`GET /api/knowledge/citations/{citationId}`
Purpose: resolve an authorized citation — binds corpus generation, source, ingestion
and chunk; rechecks current ACL/revocation before returning anything.
Errors: 403/404 on a withdrawn source or a deleted Project/FileAsset, even for a
citation that was valid when the answer was generated.
Implements: FR-073-001
Legacy: `GET /api/knowledge/citations/{citationId}` (ADR-072 D10)

### API-175
Owner: DOM-KNW
`GET /api/knowledge/citations/{citationId}/artifact`
Purpose: resolve the exact immutable chunk/parsed/raw artifact identity a citation
points at, for console/audit display; no fallback to current file bytes.
Implements: FR-073-002
Legacy: `GET /api/knowledge/citations/{citationId}/artifact` (FR-254, TASK-ZAI-047)

### API-193
Owner: DOM-KNW
`GET /api/knowledge/sources`
Purpose: list Business/Project-scoped knowledge sources.
Implements: FR-073-001
Legacy: `GET /api/knowledge/sources` (ADR-072)

### API-191
Owner: DOM-KNW
`GET /api/knowledge/sources/{sourceId}`
Purpose: read one source's current state and corpus membership.
Implements: FR-073-001

### API-192
Owner: DOM-KNW
`DELETE /api/knowledge/sources/{sourceId}`
Purpose: withdraw a source's serving membership with optimistic concurrency and audit;
retains audit history, denies current and delayed query/citation responses.
Errors: 409 (stale version).
Implements: FR-073-001
Legacy: `DELETE /api/knowledge/sources/{sourceId}` (ADR-072 D8, D11)

### API-179
Owner: DOM-KNW
`GET /api/knowledge/corpora`
Purpose: list corpora (Business + optional Project identity) visible to the caller.
Implements: FR-073-001, FR-073-002

### API-180
Owner: DOM-KNW
`GET /api/knowledge/corpora/{corpusId}/generations`
Purpose: list a corpus's immutable generation history.
Implements: FR-073-001, FR-073-002

### API-174
Owner: DOM-KNW
`POST /api/knowledge/catalog-files`
Purpose: admit a SmartGift structured-record catalog file (`format:
"SMARTGIFT_CATALOG_V1"`) into the same admission queue as any other source; splits into
per-record sources, applies the per-record Zero-PII deny before enqueue.
Auth/scope: same as `API-183`; file capped at 16 MiB, `application/json`
only, admitted only with a named structured format.
Errors: 409 `KNOWLEDGE_SOURCE_CONFLICT` (two FileAssets claiming one catalog file name),
422 (a record denied by the Zero-PII policy, or every record in the file denied).
Implements: FR-075-001
Legacy: `POST /api/knowledge/catalog-files` (ADR-075 D2, D3, D5; FR-187)

## Knowledge base console

### API-178
Owner: DOM-KNW
`GET /api/knowledge/console/runs`
Purpose: list FR-060-001, FR-060-002, FR-060-003, FR-060-004, FR-060-005 execution runs with stage evidence for a Business/Project,
bounded and paginated.
Implements: FR-073-002
Legacy: `GET /api/knowledge/console/runs` (FR-254, TASK-ZAI-047)

### API-177
Owner: DOM-KNW
`GET /api/knowledge/console/runs/{executionRunId}`
Purpose: read one run's stage-by-stage evidence for console display.
Implements: FR-073-002
Legacy: `GET /api/knowledge/console/runs/{executionRunId}` (FR-254)

## External-tier reporter and evidence pull (fronting `knowledge-ingestion-executor.js`, integration lane)

These four routes authenticate the run's Tenant's FR-027-001 data-plane key ahead of the
session (ADR-065 D1); the writer refuses a Tier 1 stage id from a reporter key
regardless of which route is called.

### API-188
Owner: DOM-KNW
`GET /api/pipelines/knowledge/{executionRunId}`
Purpose: read a knowledge run's ledger state, its seventeen step identities and FR-072-001, FR-072-002's
derived job-state.
Implements: FR-072-001, FR-072-002
Legacy: `GET /api/pipelines/knowledge/{executionRunId}` (ADR-067)

### API-189
Owner: DOM-KNW
`POST /api/pipelines/knowledge/{executionRunId}/stages`
Purpose: an external tier (GKS/GenesisBlockDB) reports Stage 9–16 evidence — outcome,
four of six NFR-019 metrics, timing — onto the run's materialised step.
Auth: FR-027-001 `SotDataPlaneKey`, Tenant-bound to this run only.
Errors: 403 (Tier 1 stage id, or a run of another Tenant/definition), 409 (conflicting
retry — same attempt, different input).
Implements: FR-072-002
Legacy: `POST /api/pipelines/knowledge/{executionRunId}/stages` (ADR-067 D1, D2)

### API-186
Owner: DOM-KNW
`POST /api/pipelines/knowledge/{executionRunId}/gate`
Purpose: report the Stage 17 gate decision (`PASS`/`PASS_WITH_WARNINGS`/`QUARANTINE`/
`FAIL` as evidence; ledger `status` stays `PENDING`/`APPROVED`/`REJECTED`/`WAIVED`).
Implements: FR-072-001
Legacy: `POST /api/pipelines/knowledge/{executionRunId}/gate` (ADR-067 D2; FR-110 AC-110.4)

### API-185
Owner: DOM-KNW
`POST /api/pipelines/knowledge/{executionRunId}/finish`
Purpose: close a knowledge run; the caller supplies no status — the terminal status is
derived entirely from the ledger (`knowledgeRunOutcome`).
Errors: 409, naming every unmet condition (`STAGE_NOT_SUCCEEDED:<id>`, `GATE_MISSING`,
`GATE_PENDING`, `GATE_WAIVED_IS_NOT_A_VERDICT`).
Implements: FR-072-001
Legacy: `POST /api/pipelines/knowledge/{executionRunId}/finish` (ADR-067 D3)

### API-181
Owner: DOM-KNW
`POST /api/pipelines/knowledge/evidence/pull`
Purpose: one installation-operator tick that pulls GKS's `gks_stage_evidence_export`
through MSP for one `KnowledgeScope`, classifies and applies every row, and advances
this domain's own cursor.
Auth: installation operator only.
Implements: FR-072-002
Legacy: `POST /api/pipelines/knowledge/evidence/pull` (ADR-068 D1–D3)

## Data pipeline map

### API-187
Owner: DOM-KNW
`GET /api/pipelines/health`
Purpose: live per-edge counts and last-run time for the active Business only, read
through four bounded owning-domain read ports (the FR-060-001, FR-060-002, FR-060-003, FR-060-004, FR-060-005 ledger, LINE conversation
jobs, rich-menu publish jobs, asset-extraction jobs); an edge with no backing table or a
failed read returns unavailable/null, never a false zero.
Implements: FR-076-004
Legacy: `GET /api/pipelines/health` (ADR-085 D5; FR-215)

The Data Pipeline Map page itself (`/knowledge/data-pipeline`, FR-076-002) and the
Knowledge dashboard (`/knowledge`, FR-076-003) are server-rendered UI surfaces with
no API of their own beyond this one live-overlay route — "It has no API, input beyond
filters, persistence or write" (FR-076-002).

## Out of scope for this conversion (listed for completeness only)

- `POST /api/knowledge/candidates`, `GET /api/knowledge/candidates`,
  `GET|PATCH /api/knowledge/candidates/{id}`, `POST /api/knowledge/candidates/{id}/decision`
  — implement `FR-096-002` (knowledge candidates review), not in this conversion's
  FR set.
- `GET /api/knowledge/gap-report` — implements `FR-096-003` (knowledge gap report,
  declared, not built), not in this conversion's FR set.

Both are part of `FEAT-096` (see `DOMAIN.md` → Participates in) and are written by a
different part of this effort.
