# Decisions — DOM-INT
### ADR-050 — Legacy LINE binding activation is operator-only with truthful receipts
Owner: DOM-INT
Status: approved (narrowed on migration: the external `zuri-cli` transport ownership of the source ADR is superseded by server-owned transport, ADR-045)
Context: The first production LINE path used a `zuri_core.line_channel_binding` row that had to move from PENDING to ACTIVE safely, with evidence of what LINE actually accepted.
Decision:
- Activation is an operator-only command, never a webhook, browser API, agent tool or automatic consequence of preflight; a dedicated operator database role may update exactly one binding row and append activation events.
- Raw destination, binding bearer and HMAC pepper enter only through the process environment/secret store; stored values are HMAC-SHA256 hashes.
- Activation is one transaction with row lock plus compare-and-swap on the exact scope, expected version, PENDING status and a valid approval window; it writes hashes, ACTIVE, validity window and version, and appends the event atomically.
- Rollback disables routing first (ACTIVE→INACTIVE, versioned, append-only event); evidence and imported knowledge are preserved.
- Receipt evidence is append-only and correlation-idempotent; GENERATED, EVIDENCE_VERIFIED and ACCEPTED_BY_LINE are distinct; DISPLAYED_UNKNOWN / READ_UNKNOWN never promote to success; receipts carry hashes, never tokens, destinations or message content.
Consequences:
- Stale evidence, duplicate correlation or version conflict fails before mutation.
- "Provider acceptance is not delivery" is inherited by every later LINE transport.
Legacy: ADR-020

### ADR-051 — Pipeline execution ledger: definition vs occurrence ids, append-only, replay as new lineage
Owner: DOM-INT
Status: approved
Context: Data pipeline runs (catalog publication, knowledge ingestion) needed observability and replay without a second, contradictory record of what happened.
Decision:
- One monitored boundary per pipeline definition; catalog identity (`dataPipelineDefinitionId`, stage ids) is separated from runtime identity (run, step, attempt ids).
- Runs, stage occurrences, attempts and record outcomes are append-only; failures carry a structured code, safe error reference, retryability, input/output hashes and audit linkage.
- Replay (full, failed-stage, failed-record) creates new ids linked by `replayOf…`, never overwrites.
- The monitor is server-owned: the browser receives a filtered contract, never service-role keys, database URLs or another Tenant's metadata.
- Existing batch import audit stays readable and is linked by audit/batch/correlation ids and artifact hash.
Consequences:
- `PipelineRun`/`PipelineStep`/`PipelineGateDecision`/… are INT-owned; `IngestionRun` stays acquisition evidence only (FEAT-053, FEAT-056).
Legacy: ADR-030

### ADR-052 — Phase 1 LINE runtime selects one binding-scoped connection and resolves secrets through a port
Owner: DOM-INT
Status: approved (the `zuri-cli` transport-owner clause is superseded by ADR-045)
Context: The LINE runtime needed a model-provider credential without holding raw secrets or guessing which connection to use.
Decision:
- Every runtime has one explicit source: production LINE uses only the external production secret manager; local/dev/test/eval sources are explicit.
- The server-owned LINE binding resolves trusted Tenant/Business first; only then may the runtime select exactly one ACTIVE PRIMARY connection of purpose `PHASE1_LINE_LLM` in that scope; zero or several candidates fail closed.
- The secret manager port is provider-neutral: `resolve(secretRef, {tenantId, businessId})`; failure, expiry or version mismatch fails closed before knowledge/model/reply work.
- Local Ollama is an explicit LOCAL_DEV/TEST/EVAL provider on an exact loopback URL, never a production/public-LINE provider and never an automatic fallback.
- Promotion uses compare-and-swap and a database uniqueness invariant; rollback order is routing disablement, connection demotion, secret rotation.
Consequences:
- FEAT-091. Business-owned model keys (FEAT-054) later became the normal path for server answers; this operator path remains beside it.
Legacy: ADR-031

### ADR-053 — Integration management is a Platform sub-domain with metadata-only secret handling
Owner: DOM-INT
Status: approved (candidate in source; its metadata slice is implemented)
Context: Owners needed to see and create integration connections without the browser, Prisma, logs or audit ever holding secret material.
Decision:
- The UI lives under Platform (`/platform/integrations`), not as a new Business domain.
- Secrets live in Supabase Vault (private schemas) behind a private resolver; Prisma stores only opaque references (`supabase-vault:<uuid>`) and redacted status.
- Authorization is owner-only through the trusted viewer; client-supplied Business/Tenant ids are never authority.
- The page cannot activate public LINE routing, send a canary or claim acceptance; controlled operator paths remain the only activators.
- Only the metadata operations are exposed; lifecycle routes stay design-only until their ports and tests exist.
- Browser, `anon`, `authenticated`, `service_role` and read-only LINE roles never receive Vault plaintext; the runtime login may assume the resolver role only.
Consequences:
- Connector state is derived from evidence, never declared (FEAT-057); later browser write-only credential entry is governed by ADR-046.
Legacy: ADR-032

### ADR-054 — SoT pipeline interim serving and pulled decisions
Owner: DOM-INT
Status: approved (clause 1 is transitional until the knowledge service serves the graph)
Context: Approvals made in spreadsheets reached nothing; the SoT data plane runs outside zuri-ai and must stay outside Tier 1's write boundary.
Decision:
- The SoT knowledge graph is served by the standalone data-plane service until the knowledge service offers an equivalent governed surface.
- Decisions leave zuri-ai by pull only: the data plane submits pending facts and later pulls decided rows by stable cursor; zuri-ai never connects to the data plane's stores.
- Phase status is always derived from run evidence and pending counts; no hand-typed status is stored.
Consequences:
- FEAT-055; Tier 1 remains a non-writer toward the substrate.
Legacy: ADR-046

### ADR-055 — The SoT data plane authenticates with a Tenant-bound service key
Owner: DOM-INT
Status: approved
Context: The data plane needed to submit and export decisions without impersonating a Person or holding an operator session.
Decision:
- A dedicated credential type (`sdpk_…`), stored only as a SHA-256 lookup hash, bound to exactly one Tenant.
- Its own authority predicate (`isSotDataPlaneFor(viewer, tenantId)`), accepted only on submit and export; deciding and listing still need a human operator/owner or visibility.
- Bearer header checked ahead of the session seam on those two routes only; unknown or malformed tokens resolve to "no viewer", never an error.
- Revocation is immediate, with no grace period.
Consequences:
- Key minting is an operator CLI; the key model is owned by DOM-IAM (FR-027-001).
Legacy: ADR-047

### ADR-056 — FlowAccount read-only pull pipeline and credential provisioning
Owner: DOM-INT
Status: proposed (design candidate; no implementation authorized beyond a phased plan)
Context: A Business's accounting data in FlowAccount should arrive as evidence without write access, false completeness claims or secrets in the browser.
Decision:
- V1 uses client credentials per Business against fixed Sandbox/Production endpoints; no custom endpoints, arbitrary scopes or OpenID refresh tokens.
- A provider-specific wizard under Platform Integrations; the browser sends the secret write-only to a server provisioner; Prisma keeps only references.
- Connection is DRAFT until token exchange + company verification; `companyId` is the external account id, never a key.
- Pull adapter over the one raw-ingestion path; read-only GET resource allow-list.
- Cursor honesty: date watermark + lookback for documents, full snapshot for master data; advance only on complete runs.
- Bounded retry with backoff and jitter under the provider rate limit; computed DATA_SOURCE health; raw evidence is never accounting truth.
Consequences:
- FEAT-059 stays `declared`; a `DATA_SOURCE` connection kind needs separate approval.
Legacy: ADR-053

### ADR-057 — Notion OAuth and webhook boundary
Owner: DOM-INT
Status: approved
Context: Businesses want to connect Notion; tokens and webhook content must not leak into the browser or into business domains.
Decision:
- Business-scoped OAuth started by an owner at AAL2 under the per-Person/Business write limit, with one-time, short-lived hashed state bound to Tenant, Business and actor; tokens exchanged server-side and stored only in the typed vault.
- Signed webhook ingress: the initial verification token is captured once, encrypted and revealed once to an installation operator at AAL2; later requests are HMAC-verified over the exact raw body; only idempotent receipt metadata is stored.
- The feature is bounded to Integration: installation, token custody and receipts only — no search, sync or content import into business domains.
Consequences:
- FEAT-058; any content use needs its own requirement and owning domain.
Legacy: ADR-109

### ADR-058 — Codex-mediated worker bridge for the pipeline execution ledger
Owner: DOM-INT
Status: approved (local `EVIDENCE_ONLY` implementation only; production apply remains gated)
Context: SmartGift's local `ProductIngestAgent`/`CustomerIngestAgent` and migration agent produce evidence-bearing staging contracts, but had no safe worker transport into the server-owned pipeline ledger (`FEAT-060`) without holding a Supabase `service_role` key, a browser credential or an unrestricted Zuri write token.
Decision:
- Codex is the execution coordinator: local agent → redacted append-only evidence outbox → Codex worker → authenticated `data_pipeline.*` MCP adapter → the existing pipeline tracking service → the existing monitor. The local agent never calls Supabase directly.
- The MCP adapter is a thin, separate `data_pipeline.*` namespace (not an extension of `project_manager.*`) and must call only the existing application services — never a second persistence path.
- Scope (Tenant/Business/connection) is resolved server-side from the authenticated principal; the outbox may carry a source namespace and provenance, never a caller-selected destination override.
- Pipeline events carry identities, hashes, counts, status and redacted failure references only — never raw document bytes, OCR text, customer PII or secrets; the restricted document contract goes only through the existing server-side staging boundary.
- The bridge starts and stays in `EVIDENCE_ONLY` mode: no canonical Supabase apply, Product/Customer promotion, publish or rollback. Every mutation is idempotent and retries the same request key; a missing/stale heartbeat stays `UNKNOWN`, never promoted to success by the worker.
Consequences:
- `FEAT-060`'s worker-bridge requirement (`FR-060-005`) is this decision's approved local slice.
- Canonical Supabase apply, RLS/isolation proofs, Product/Customer promotion and publish remain separately gated; approving this decision does not approve those.
Legacy: ADR-040
