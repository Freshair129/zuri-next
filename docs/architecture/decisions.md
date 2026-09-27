---
title: System architecture decisions (ADR-SYS)
status: draft
owner: architecture
legacy: [ADR-007, ADR-010, ADR-015, ADR-018, ADR-019, ADR-022, ADR-042, ADR-043, ADR-058, ADR-062, ADR-076, ADR-104, ADR-110, SDD-002, SDD-003, SDD-004, SDD-008, SDD-009, SDD-048, SDD-091]
---

# ADR-SYS — System architecture decisions

Decisions that constrain more than one domain. ADR-083..013 carry forward legacy
ADRs still in force (history and incident narrative dropped); ADR-096..018 lift
cross-cutting design rules that the legacy registry recorded only as SDD rows.
legacy:ADR-041 is not carried forward (retired — see ADR-095 and the SYS
crosswalk).

### ADR-083 — Authority layering for the LINE/AI stack
**Status:** approved
**Context:** A conversational agent over business data can conflate channel identity,
memory, knowledge and business facts. Building layers out of order forces memory to
be keyed by channel id instead of by who the customer is, and lets an agent write
before authorization and audit exist.
**Decision:**
- Authority is layered: the channel (LINE) owns nothing; Identity maps channel
  subjects to a Zuri principal; Zuri is the system of record (tenant, customer,
  order, permission); MSP owns agent memory and context; GKS owns canonical knowledge
  and relations; the agent owns none of these and consumes their contracts.
- Order of dependency: Identity precedes Memory precedes Knowledge precedes Agent.
  Memory is keyed by principal (`tenant × principal …`), never by a channel user id.
- The Zuri store and the MSP store SHALL be distinct (separate database/schema/role
  and migration ownership even when one Postgres instance is shared); startup refuses
  a configuration where both resolve to the same store.
- Live transactional facts (price, credit, stock, invoice, schedule) stay Zuri
  queries; only relation-bearing entities are projected into knowledge.
- The agent is read-only (search, read, recommend, answer) until authorization,
  audit and step-up authentication exist for the action; any agent write goes
  through the same previewed, confirmed intake pipeline as a human (ADR-098).
- DuckDB (or any local analytical store) is a cache/analytics/evaluation tier, never
  the shared transactional store.
**Consequences:**
- A new channel (web portal, Facebook) reuses the same principal and memory.
- An MSP migration failure cannot take CRM, audit or invoicing down.
- Agent write capabilities are enabled per action, behind step-up, not globally.
Legacy: ADR-007 (P1–P7 sequencing, demo notes and program tracks dropped as history), FR-030 (DB boundary)

### ADR-084 — Design system: layered tokens, declared states, accessibility
**Status:** approved
**Context:** The console needs one visual identity that scales across domains without
global restyles, and a consistent accessibility and state baseline.
**Decision:**
- The Zuri Heritage identity is binding (amber-citrus accent, neutral surfaces, IBM
  Plex Sans Thai + Manrope, Lucide icons, dark navigation glass).
- Tokens are three layers: primitive → semantic → component; component code never
  references primitive colours.
- Shared primitives (card, button, input, pill, progress) are implemented against the
  contract first; feature UI migrates when it is touched for a scoped task.
- Every new or changed control declares its states and meets NFR-008.
- Navigation structure is owned by the shell decision (ADR-085); the design
  system supplies treatment only.
**Consequences:**
- Dark mode, white-label theming and bulk restyles are deferred decisions.
Legacy: ADR-010, SDD-010

### ADR-085 — Staged entry and shell layers
**Status:** approved
**Context:** A person must not appear to choose a Business inside the operating shell;
people without Business access must still have a place to wait or collaborate.
**Decision:**
- Four logical interface layers: EntryShell (`/` landing, `/login`), pre-Business
  onboarding (profile, waiting room, top-level collaboration workspace),
  BusinessRoutingShell (`/businesses`), BusinessShell (`/overview`, Business-bound
  domains), with ProjectResourceShell nested inside BusinessShell.
- A route guard resolves `AUTH_REQUIRED → /login`, `BUSINESS_REQUIRED → /businesses`,
  `READY`, `FORBIDDEN`, `NOT_FOUND` before any BusinessShell render.
- The selectable operating node is always a Business; Group/Organization are ancestry
  labels only. Business Routing is shown even when one Business is visible.
- Business Routing consumes a viewer-scoped entry read model computed server-side from
  visible Business ids (never client filtering of a broad scope list).
- The BusinessShell keeps exactly one non-dropdown return to `/businesses`.
**Consequences:**
- BusinessShell can assume an authorized active Business.
- Authentication is real (session-based, IAM) — the original demo-login transition is
  superseded.
Legacy: ADR-015 (D3 demo login superseded), SDD-022

### ADR-086 — Production tenant isolation in PostgreSQL
**Status:** approved
**Context:** Application filtering alone is not an isolation boundary; privileged
database keys bypass row-level security and request bodies can carry any scope.
**Decision:**
- Development, tests and staging never create tenants in the production project; they
  use a local database or a separate project.
- Every tenant-owned row carries non-null `tenant_id`; every business-owned row also
  carries `business_id`; child tables use a composite foreign key
  `(tenant_id, business_id) → Business(tenant_id, id)` so a valid Business paired with
  the wrong Tenant is rejected by the database.
- Row-level security is enabled and forced on tenant-owned tables; deny by default;
  equality paths are indexed tenant-first.
- Runtime roles are least-privilege: a migration role (deploy only), an application
  runtime role without RLS bypass and without DDL, and for machine channel reads a
  NOLOGIN scope-bound policy role entered per short transaction by an unprivileged
  login; anonymous/authenticated/service roles get no base-table grants.
- Service/secret keys that bypass RLS are never a runtime credential.
- Channel bindings are server-owned (`line_channel_binding`: tenant, business, hashed
  destination and credential, status, validity); inbound scope fields are rejected.
- Rollback disables routing first, revokes the runtime role, marks the binding
  inactive and quarantines imported rows by batch — never drops the project.
**Consequences:**
- Every new tenant-scoped table ships its RLS policy and grants in its migration.
- Stable production identities (UUID + code) are reserved once and never changed.
Legacy: ADR-018 (project reference, reserved UUIDs and import counts omitted), SDD-026

### ADR-087 — Readiness evidence is separate from activation
**Status:** approved
**Context:** Enabling a customer-facing channel requires reproducible proof (golden
answers, isolation probe, canary plan) without the tooling itself being able to
activate traffic or leak credentials.
**Decision:**
- Three independent evidence ports: a deterministic golden-question evaluator over
  injected knowledge/provider ports; a transaction-scoped runtime isolation probe that
  always rolls back; a mutation-free canary preflight (dry-run by default).
- Receipt states are never collapsed: `GENERATED`, `EVIDENCE_VERIFIED`,
  `ACCEPTED_BY_LINE`, `DISPLAYED_UNKNOWN`, `READ_UNKNOWN`.
- Evidence artifacts contain hashes, assertions and timestamps only.
- Activation is a separate, operator-approved action (dedicated role, one versioned
  compare-and-set mutation plus an append-only event).
**Consequences:** passing readiness is necessary, never sufficient, for production.
Legacy: ADR-019, SDD-027; related BR-058, BR-059, NFR-012, NFR-013

### ADR-088 — Principal-scoped memory vaults resolved per turn
**Status:** approved (production memory rollout gated)
**Context:** One LINE group can hold many principals; one principal can use many
agents and workspaces. A thread id, model claim or raw channel subject must never
own or select memory.
**Decision:**
- Each turn builds an immutable AuthContext (transport, actor, scope, conversation,
  request, policy) from server-derived facts only.
- A policy decision (membership, scope, thread audience, session assurance,
  capability, sensitivity, consent, retention, policy version) runs before any memory
  retrieval.
- The authorized vault set is resolved by the memory service from that context
  (`msp_vault_resolve`); Zuri never invents or accepts a vault id from a request or
  model.
- Private memory is owned by `Tenant × Principal × Agent × Workspace`; thread,
  session, instance and event are provenance, not ownership. Group threads never
  merge private context across participants.
- Resolver absence, denial or transport failure fails closed before any read/write.
**Consequences:** revocation takes effect on the next turn; principal-only legacy keys
exist only in an explicitly enabled compatibility mode.
Legacy: ADR-022, SDD-030

### ADR-089 — Retrieval substrate is separate from RAG orchestration
**Status:** approved
**Context:** Stitching several specialised stores, or embedding graph engines in the
application, couples business code to storage and duplicates writes.
**Decision:**
- GenesisBlockDB is the retrieval substrate with six lanes (vector, lexical, property
  graph, relational projection, bitemporal, provenance) behind a typed query IR
  (`query-ir.v1`) with in-engine fusion.
- Query planning, multi-hop reasoning, reranking, evidence packaging and citation
  verification belong to the knowledge service (GKS), not to the substrate.
- The substrate is client-neutral and contains no business workflow or prompt.
- Zuri (Tier 1) is not a direct substrate client (see ADR-090).
**Consequences:** one query contract serves several products without dual writes.
Legacy: ADR-042 (port numbers and consumer names dropped)

### ADR-090 — Four-tier cognitive architecture
**Status:** approved
**Context:** Agent execution, session memory policy, canonical knowledge and physical
retrieval must not be conflated, or chat history pollutes business knowledge and
tenant boundaries leak.
**Decision:**
- Tier 1 — Zuri (this product): business execution, scope chain, channel ingress,
  ingestion stages 1–8, agent turns.
- Tier 2 — MSP: session lifecycle, episodic memory, vault gates, tool ceilings; the
  sole gateway from Tier 1 to the tiers below.
- Tier 3 — GKS: canonical entities and relations, knowledge stages 9–14 and the
  publication gate (stage 17), promotion of verified memory into knowledge.
- Tier 4 — GenesisBlockDB worker/substrate: physical graph writes (13), embeddings and
  indexing (15–16), atomic publication and scoped query.
- Knowledge promotion is gated: conversation → MSP episode → reviewed candidate → GKS;
  never conversation → canonical knowledge directly.
- MSP, GKS and GenesisBlockDB are external systems with their own repositories and
  lifecycles; Zuri reaches them only through MSP's authenticated relay.
**Consequences:** the same Tier 2–4 stack can serve other products; Zuri never holds
substrate locks or credentials.
Legacy: ADR-043, ADR-063 context (read-only)

### ADR-091 — Container deployment with a public tunnel ingress
**Status:** approved
**Context:** The product must be deployable on an owner-controlled host (and later a
VPS) without a serverless platform dependency.
**Decision:**
- Docker Compose is the deployment unit, with one pinned project name. Services:
  `web` (the application), a public HTTPS tunnel agent (`ngrok`), optional workers
  and services behind named profiles/overlays, and an optional bundled Postgres
  (`local-db` profile) with a one-shot schema push.
- The tunnel targets `web` by service DNS name and preserves the Host header; only
  `web` is exposed; database, admin/inspection ports and the app's host port bind to
  loopback.
- The image is production-mode, non-root and secret-free; every credential arrives at
  run time via env files or mounted secrets.
- Production refuses SQLite; the database is chosen by `DATABASE_URL`.
- One public-origin variable (`PUBLIC_BASE_URL`) drives absolute URLs.
- `GET /api/health` (unauthenticated, one trivial query, states only) is the container
  health check and gates dependants.
- Pooling mode follows topology (NFR-025).
- Moving to a VPS changes only ingress (domain + TLS terminator, tunnel scaled to 0)
  and image source (immutable digest from a private registry).
**Consequences:**
- Because the Compose project name is pinned, compose commands from any checkout act
  on the same live stack; separate stacks need an explicit project name.
- Overlays that production relies on must be named in the host's `COMPOSE_FILE`; an
  explicit `-f` replaces that list.
Legacy: ADR-058, FR-145

### ADR-092 — One repository, independently released deployables
**Status:** approved
**Context:** Server, device runtime and extracted services share contracts but must
not share release cycles or native dependencies.
**Decision:**
- One monorepo: `apps/*` (web/server, device runtime), `services/*` (extracted
  back-end services), reserved `packages/contracts`, canonical `docs/`.
- Each app/service keeps its own lockfile, install, build, version and rollback; a
  shared commit never requires simultaneous deployment of another unit.
- Apps and services consume wire contracts only: they do not import another unit's
  source or access its tables.
- Moving directories never renumbers requirement or decision IDs.
**Consequences:** CI can verify a service-only change by that service's jobs plus the
core-side contract tests.
Legacy: ADR-062

### ADR-093 — ERP-canonical organizational hierarchy and vocabulary
**Status:** approved
**Context:** Overloading "Workspace" for both the top container and the operating
container, and any temptation to model a branch as a tenant, broke isolation reasoning
and user understanding.
**Decision:**
- Canonical hierarchy: Portfolio (UI "Group") → Tenant (UI "Organization", isolation
  boundary) → Business (operating company) → Workspace (operating unit) → Branch
  (location). Projects live under a Workspace.
- The shell context bar reads `Group › Organization › Business`; the shell context
  exposes only Portfolio, Tenant and Business; Workspace/Project are module-local.
- Display mapping lives in one place (`scope-views`); IDs and API fields are unchanged
  by label changes.
- A branch is never a tenant (BR-046).
**Consequences:** the legacy "Space" label is retired in favour of Workspace.
Legacy: ADR-076, SDD-018

### ADR-094 — Production migrations are applied by a controlled operator path
**Status:** approved (beta)
**Context:** The production migration ledger can diverge from the repository tree;
replaying historical SQL whose effects already exist can fail or mutate live data.
**Decision:**
- A model/column change ships its idempotent production migration in the same change;
  applying it is a separate owner-instructed operator step.
- Reconciliation is evidence-based: for each missing ledger version compare the live
  catalog; record already-present effects without replaying SQL; apply missing effects
  from the reviewed file; record both in the same operator transaction.
- The operator tool runs read-only preflight → redacted logical snapshot (hashed) →
  rolled-back dry run → explicit `--apply`, verifies target identity and file hashes,
  and checks post-apply RLS/grant invariants. Migration SQL never writes the ledger.
- Database apply and application image deploy are separate gates; application rollback
  is an image rollback; structural rollback needs its own reviewed migration.
**Consequences:** `db push`-style schema sync is never used against production.
Legacy: ADR-104 (ledger inventory and dates dropped)

### ADR-095 — Channel execution is server-owned; device surfaces retired
**Status:** approved (runtime removal is a deployment gate)
**Context:** LINE availability must not depend on a customer workstation, and two
competing connection models (device pairing vs. provider key) confused operators.
**Decision:**
- LINE ingress, signature verification, admission, job execution and delivery are
  server-owned; no device claims LINE work or holds channel credentials.
- Retired surfaces: device pairing, device credentials, heartbeat/registry, device-side
  evidence extraction (claim/download/complete/fail), device-to-server LINE forwarding
  adapters, harness device pairing and usage-report authentication.
- A Business connects a self-hosted model through the write-only model-provider key
  flow (e.g. a Private Runtime Platform client key validated against an operator-set
  endpoint); that key grants no Zuri authority.
- Stored records and schemas of retired surfaces are preserved (no drop, no rewrite);
  retired routes simply stop writing them.
- Execution-ownership fencing is decided only by core routing (one executor cohort per
  job, ADR-049); runtime health is never ownership.
**Consequences:** the device desktop app remains only as an optional local
knowledge/RAG runtime (SRV-008).
Legacy: ADR-110; supersedes the device scope of ADR-041, ADR-059, ADR-061, ADR-087

### ADR-096 — Persistence conventions
**Status:** approved
**Context:** The model must move between SQLite and PostgreSQL and be referenced from
Excel, envelopes and external systems without key churn.
**Decision:**
- Primary keys are application-generated UUIDs; each aggregate has a unique human
  `code` (collision-retried); external identifiers go to `ExternalRef` or typed
  attributes (BR-047).
- Persisted enums are strings; one Zod enum module is the single source of truth for
  validation, spreadsheet dropdowns and the API description — never hand-copied.
- JSON columns are validated at the boundary.
- Aggregate roots carry `version` (optimistic concurrency) and `deletedAt` (soft
  delete); `createdAt`/`updatedAt` everywhere.
**Consequences:** provider switch needs no enum or key migration (NFR-006).
Legacy: SDD-002, SDD-003, SDD-004

### ADR-097 — JavaScript with schema validation at every boundary
**Status:** approved
**Context:** The code base is JavaScript, so no compiler enforces contracts between
routes, services and consumers.
**Decision:**
- Every boundary (HTTP body, envelope, job payload, port response, provider output)
  is parsed by a strict schema (Zod) before use.
- An endpoint whose consumers already exist gets a contract test before its
  implementation changes.
- Cross-service wire contracts are versioned JSON schemas beside the producer.
**Consequences:** contract tests are the typing; removing one is a breaking change.
Legacy: SDD-008

### ADR-098 — One intake envelope pipeline
**Status:** approved
**Context:** Human forms, spreadsheets, agents, enterprise API, chat commands and
canvas gestures all create data; separate write paths drift and bypass review.
**Decision:**
- Every surface converts its input into one strict envelope per target (e.g.
  `PlanEnvelope`, catalogue and asset intake envelopes) and runs one chain:
  validate → semantic check → read-only dry run → preview → single transaction →
  audit.
- The commit applies exactly the previewed plan (plan hash compared) or nothing.
- Envelopes are data; nothing in them is executed (BR-052, SEC-002).
- A new surface adds a converter, never a second write path; where a modal preview is
  impractical (canvas), the pending visual state is the preview.
**Consequences:** one pipeline test suite covers every surface.
Legacy: SDD-009

### ADR-099 — Observability through one allowlisted emitter and one correlation id
**Status:** approved
**Context:** Logging scattered through call paths leaks sensitive fields and cannot
join a webhook to the rows it created.
**Decision:**
- One structured emitter with an injectable sink; field names are allowlisted, an
  unknown field is dropped and its name reported (`unsafeFieldsOmitted`).
- A correlation id (validated `^[A-Za-z0-9_-]{8,64}$`) flows route → turn → ingest →
  audit payload; the audit table is the durable join.
- Counts and durations are emitted; content, names, tokens and binding ids are not.
**Consequences:** new log fields require an allowlist change (a reviewable diff).
Legacy: SDD-048

### ADR-100 — Agents consume domain capabilities; tools add no authority
**Status:** approved
**Context:** An agent with direct database or broad tool access becomes a superuser
that bypasses domain ownership and authorization.
**Decision:**
- An agent tool is a thin adapter over the same exported application service a page
  or route calls; it takes the caller's already-resolved viewer, never assembles scope
  from tool arguments and never queries the database directly.
- Read tools and write tools live in separate registries; the read registry refuses
  non-read-only tools; irreversible writes declare high sensitivity and require
  step-up.
- Tool JSON schemas are generated from the service's own contracts.
**Consequences:** tool coverage grows only as domain services grow.
Legacy: SDD-091
