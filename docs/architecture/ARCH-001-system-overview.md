---
id: ARCH-001
title: System overview — context, containers, data, tenancy and integration
status: draft
owner: architecture
legacy: [FR-030, SDD-007, SDD-095, SDD-104, SDD-105, SDD-110]
relations:
  decided_by: [ADR-083, ADR-086, ADR-090, ADR-091, ADR-092, ADR-095, ADR-098, ADR-099]
---

# ARCH-001 — System overview

Zuri is an AI-native business operating system: LINE is the primary surface for
customers and staff; a web console is the back office for detail, complex edits and
audit. It is built as a **domain-driven modular monolith** (one web application
hosting most domains) plus a small number of extracted services and workers, over
one shared PostgreSQL database with strict per-domain write ownership. Product
behavior lives in `domains/` and `features/`; this document fixes the system shape
those features run on.

## 1. System context

```text
 Actors                        Channels                          Zuri (this system)
 ───────────────────────────   ───────────────────────────────   ─────────────────────────────────
 Business owner / staff  ────► Web console (browser) ──────────► SRV-001  (UI + HTTP API +
 (Person · Membership)         Enterprise API / plugin / MCP ──►           channel webhooks)
 Customer (LINE user)    ────► LINE Official Account ──(webhook via public tunnel)──► SRV-001
 Installation operator   ────► Web console (/control/**)                   │
                                                                          ▼
 External systems (own lifecycles)                               SRV-009 (PostgreSQL)
 ─────────────────────────────────                               + secret store, object storage
 LINE Platform (Messaging API, OAuth token, rich menu, LIFF)
 Model providers (OpenRouter, OpenAI, Anthropic, Gemini, Groq; PRP private runtime; Ollama local-eval only)
 MSP — Tier 2 memory/session authority (separate repo, reached via stdio child or relay)
 GKS — Tier 3 knowledge authority (separate repo; stdio or private HTTP)
 GenesisBlockDB — Tier 4 retrieval substrate (driven by SRV-004)
 Notion (OAuth + webhooks), GitHub (repository projection), FlowAccount (candidate pull source)
```

Four-tier cognitive stack (ADR-090): Zuri is Tier 1 only. It never talks to
GKS or GenesisBlockDB directly for customer traffic; it reaches them through MSP's
authenticated relay, and only a published corpus generation is read for LINE answers.

## 2. Containers and services

| Service | Kind | Runs | Scaling / state | Deploy unit |
|---|---|---|---|---|
| SRV-001 | web | Next.js app: console UI, all `/api/**` handlers, LINE webhooks, internal façades for extracted services, domain application services | stateless process; single instance today (process-local health/heartbeat caches) | Compose service `web` |
| SRV-002 | worker | ticks the durable LINE job ledger through an authenticated internal endpoint of SRV-001 | stateless; holds no channel secret | Compose service `line-worker` (profile `line-server`) |
| SRV-003 | service | extracted LINE turn execution over the `conversation-runtime.v1` core ports | stateless; memory-only credential grants | Compose overlay/profile `conversation-runtime` |
| SRV-004 | worker | GenesisRAG17 Tier-4 worker (graph writes, embeddings, publication) in SRV-001's network namespace | stateful named volumes (native store, MSP/GKS SQLite state, model) | Compose service `genesis-worker` (profile `knowledge`) |
| SRV-005 | service | knowledge service over private HTTP (optional; stdio default) | shares knowledge state volume; private network only | Compose overlay `gks-http` |
| SRV-006 | storage | S3-compatible object store for knowledge artefacts | primary data on a dedicated host path; backup on a separate host | Compose overlay/profile `knowledge-storage` |
| SRV-007 | service | Market translation and `MarketObservation` writes (extracted; not routed yet) | stateless; restricted DB role (SELECT, INSERT on one table) | own image, own Compose project for rehearsal |
| SRV-008 | desktop | optional customer-premise app; after ADR-095 only a local knowledge/RAG runtime and local worker | local disk | independently released desktop build |
| SRV-009 | database | PostgreSQL (managed in production; bundled `local-db` profile for self-host/testing) | durable | managed project or Compose `db` + `db-migrate` |

Ingress: a public HTTPS tunnel container (`ngrok`) forwards to `web:3000` with the
Host header preserved; it is part of the SRV-001 deploy unit (RB-005). Nothing
else is published; admin/inspection ports bind to loopback (ADR-091).

## 3. Domain-to-service placement

| Domain | Hosted in | Notes |
|---|---|---|
| DOM-PRJ Projects & Work | SRV-001 | owns the shared `recordAudit` seam and snapshot backup service |
| DOM-IAM Identity & Access | SRV-001 | the only authority for viewers, sessions, grants; façades answer extracted services |
| DOM-PLT Platform Control | SRV-001 | operator-only projections, health, usage rollup |
| DOM-CRM Customer & Conversation | SRV-001 | conversation record, consent, erasure, cold archive writer |
| DOM-LOA LINE OA Studio | SRV-001, SRV-002 | accounts, admission, job ledger; worker executes ticks |
| DOM-INT Integrations | SRV-001 | secret stores, provider transports (LINE, model, Notion), raw evidence, pipeline ledger |
| DOM-AGT Agent Runtime | SRV-001, SRV-003 | answer adapters, context composer, tools; runtime cohort executes opted-in turns |
| DOM-KNW Knowledge | SRV-001 (stages 1–8, admission), SRV-004, SRV-005, SRV-006 | Tier 2–4 executions are external systems packaged as sidecars |
| DOM-INV Inventory & Catalogue | SRV-001 | stock ledger writer |
| DOM-PRC Procurement | SRV-001 | receipts post through the Inventory contract |
| DOM-COM Commerce | SRV-001 | fulfilment issues stock through the Inventory contract |
| DOM-AST Asset Management | SRV-001 | evidence bytes in private object storage |
| DOM-MKI Market Intelligence | SRV-001 today; SRV-007 when the executor flag flips | single writer enforced by flag + ownership answer |
| DOM-MKT Marketing | SRV-001 | handoff into DOM-PRJ through the intake pipeline |

## 4. Layering inside SRV-001

```text
UI routes (client components)  ──fetch──►  route handlers (thin: parse, resolve viewer, call service)
                                                 │
                                                 ▼
                             application services (the only writers; one transaction;
                             record AuditEvent; enforce scope and domain grants)
                                                 │
                     pure domain logic (calculators, validators, envelope schemas — no I/O)
                                                 │
                                                 ▼
                         ORM client (SQLite dev/test · PostgreSQL production)
```

- Route handlers never write models directly; cross-domain reads/writes go through
  the owning domain's exported contract (STD-001 R4, ADR-103).
- Cross-domain dashboards (Business Home, Projects Overview) are **non-owning read
  models**: they call each domain's read model, write nothing, and do not render a
  figure no live domain can source.
- Agents call the same services (ADR-100).

## 5. Data stores

| Store | Holds | Authority / rules |
|---|---|---|
| PostgreSQL `public` schema | all application models | forced RLS; one runtime policy + grants to the application runtime role; none to anonymous/authenticated/service roles (ADR-086) |
| PostgreSQL private schema (`zuri_core`) | channel bindings, activation events, LINE-facing business knowledge, legacy phase-1 connection metadata | not exposed through any data API; scope-bound policy roles |
| Secret store | channel and model-provider credentials, webhook tokens | referenced by prefixed `secretRef` (`supabase-vault:`, `envelope:`, `deployment-secret:`); write-only (SEC-028) |
| Private object storage | asset evidence bytes (bucket, 20 MiB, allow-listed types); knowledge artefacts (S3-compatible) | content-addressed, no public URL, server-only credentials |
| Cold archive volume | encrypted chat evidence archive files | mounted only in production; per-customer data keys (SEC-032) |
| Knowledge state volumes | MSP and GKS SQLite state, GenesisBlock native store, embedding model | named volumes; exactly one process holds the native store; never deleted by routine operations |
| MSP store | agent memory | always distinct from the Zuri store (ADR-083) |
| SQLite | development and test database (one per test run) | refused in production |
| Local file workspace | Business/Project working files under a mounted root | relational DB is authority; `.zuri/cache` disposable; Windows-path containment, unavailable in containers |

Schema management: the canonical model generates the PostgreSQL schema; production
changes arrive only as idempotent migration files applied by the operator path
(ADR-094). Data moves between providers by UUID-preserving snapshot, never by
copying database files (NFR-006).

## 6. Tenancy and isolation

- Scope chain: Portfolio (Group) → Tenant (isolation) → Business → Workspace →
  Project; Branch is a location under Business (ADR-093, BR-046).
- Every tenant-owned row has `tenantId`; business-owned rows also `businessId`;
  composite foreign keys bind Business to its Tenant (ADR-086).
- Scope is resolved by the server from the session (console), API key (enterprise
  API), data-plane key (external pipeline), or channel binding/account (LINE) —
  never from request bodies (BR-057).
- Knowledge deduplication never crosses a Tenant (SEC-020).
- Refusals for foreign scope are 404-shaped (SEC-001).

## 7. Identity and session model

- **Person** is the canonical principal; channel subjects (LINE user id, provider
  subjects) are `ExternalIdentity`/`ChannelIdentity` rows linked via link tokens.
- **Authority:** ACTIVE `Membership` (Tenant/Business, role, per-domain grants) and
  scope-valid `RoleBinding` (e.g. LINE OA publisher); `PlatformGrant` (time-boxed) for
  the installation operator; Team never grants (BR-063).
- **Console session:** signup/login creates a persisted `Session` row referenced by a
  signed cookie; a cookie without an active row is unauthenticated. MFA (TOTP, sealed
  secrets) and WebAuthn passkeys provide step-up to AAL2, required for credential
  writes, archive retrieval and operator secrets.
- **Machine identities** (each accepted only by its own routes, never Person-shaped
  except as documented): Tenant-bound `ApiAccessKey` (enterprise API), Tenant-bound
  data-plane key (external pipeline decisions), `PluginSession` (PKCE public client),
  private service tokens for the LINE worker and extracted services.
- `resolveViewer` / `resolveAuthorizationContext` recompute authority per request and
  per agent turn (NFR-018); extracted services forward the end-user credential
  opaquely and core resolves it — they hold no viewer logic.

## 8. Integration points

| Integration | Direction | Boundary |
|---|---|---|
| LINE Messaging API | in (webhook) / out (reply, push, rich menu, LIFF) | account-scoped webhook `POST /api/line-oa/accounts/{id}/webhook`, signature verified before parsing; channel access tokens minted from channel id/secret and cached ≤ 13 min; one reply owner (BR-056) |
| Public tunnel (ngrok) | in | single stable HTTPS origin; host header preserved. An operator may run a different tunnel for an external agent; only one owner may receive a channel's webhook at a time |
| Managed PostgreSQL / secret store / object storage | out | pinned CA; session pooling (NFR-025); secret functions under dedicated roles |
| Model providers | out | Business-scoped write-only provider key resolved per turn; phase-1 resolver only as traced fallback; local Ollama only for loopback evaluation |
| MSP | out (stdio child process or relay) | per-turn vault resolution and memory append; distinct store |
| GKS / GenesisBlockDB | out via MSP / worker | published generations only for answers; pipeline credentials as mounted secrets |
| Notion | in/out | OAuth with hash-only state; HMAC-verified webhooks (SEC-035) |
| GitHub | in | repository metadata projection only; file contents are never persisted |
| FlowAccount | in (candidate) | read-only pull; item codes stored as attributes (BR-077) |

## 9. Intake envelope pipeline

All writes that originate outside a single form field go through one chain
(ADR-098):

```text
surface converter ─► strict envelope (schema) ─► semantic check (codes, refs, scope)
  ─► read-only dry run (diff vs DB, conflicts) ─► preview (UI table, pending canvas edge,
  LINE preview message) ─► explicit confirm ─► single transaction (apply exactly the
  previewed plan, hash-compared) ─► AuditEvent (+ receipt for idempotent replay)
```

Surfaces: UI wizard, Excel/Sheets, agent/JSON (PlanEnvelope, ExecutionPlanBundle),
enterprise API, LINE catalogue/work commands, canvas gestures, asset evidence intake.

## 10. LINE conversation path

1. **Admission** (SRV-001): verify signature → match destination to the server-owned
   connection → durably record each event as sanitized integration evidence and mark
   it `ADMITTING`; HTTP 2xx acknowledges that durable capture only. Admission to CRM
   (Person/Customer/Conversation/Message, session split by 30-minute idle gap using
   provider timestamps) and to the job ledger continues after the acknowledgement,
   idempotently, with a reconciler as the restart mechanism.
2. **Job ledger** (DOM-LOA): `LineConversationJob` with compare-and-set versions and
   bounded leases; each job snapshots its executor cohort (`SERVER` or
   `CONVERSATION_RUNTIME`).
3. **Execution:** SRV-002 ticks answer up to N jobs concurrently, then send
   ready answers in order; SRV-003 claims its cohort through core
   ports. Context is assembled by the context composer (MSP memory, published corpus,
   CRM/ERP facts) with a budgeted receipt; model credentials are claim-bound.
4. **Delivery:** reply token (sealed at rest, excluded from backups) or push; an
   ambiguous outcome is `UNKNOWN` and never blindly resent; CRM outbound is reconciled
   transactionally with the accepted send.
5. Account pause or ownership change fences waiting work; in-flight provider calls
   cannot be recalled and a stale lease cannot complete.

## 11. Knowledge pipeline placement

The 17-stage ingestion pipeline (DOM-KNW) runs stages 1–8 in Zuri (pure calculators
plus durable lineage), relays through MSP, lets GKS decide stages 9–14 and the stage-17
gate, and lets the GenesisBlock worker perform physical graph writes (13), embeddings
and indexing (15–16) and atomic publication. Stage execution location is decided per
object by its classification, never by deployment configuration (restricted content
stays local). Ingestion evidence is written to the shared pipeline ledger
(`PipelineRun`/`PipelineStep`/record events) owned by the execution-ledger feature.

## 12. Audit and observability

- `AuditEvent` is append-only; every application-service mutation writes one in the
  same transaction. Scope columns (`tenantId`, `businessId`, `reason`,
  before/after JSON, `requestId`, `sessionId`) are nullable and indexed by
  `(tenantId, occurredAt)`, `(businessId, occurredAt)`, `(actorId, occurredAt)`;
  older rows state their scope as absent (BR-081). Actors resolve to display
  names at read time. Access history reads join through grant ids.
- One structured emitter with allowlisted fields and one correlation id
  (ADR-099); the audit table is the durable join from webhook to rows.
- Error events carry no person id; usage events are retained 90 days then rolled up
  (NFR-022).
- `GET /api/health` reports process and database state (and DB latency) without
  authentication.

## 13. Secrets

- Deployment secrets (session secret, sealing keys, KEKs, worker/service tokens,
  database URLs) come from host env files or mounted secret files, never from the
  image or the repository.
- Business-provided credentials (LINE channel, model provider, OAuth clients) are
  written from the browser at AAL2 into the configured secret store and are never
  readable back (SEC-028). The store is chosen per installation
  (`ZURI_SECRET_STORE`); a reference whose store is not configured resolves
  `Unavailable`, never falls back.
- Backups exclude sealed reply tokens, envelope ciphertext and key-encryption keys.

## 14. Generated versus authored data

| Authored (source of truth) | Generated (build output, never hand-edited) |
|---|---|
| Canonical ORM model; production migration files | PostgreSQL schema twin; ORM clients |
| Enum module (validation source of truth) | spreadsheet dropdowns, OpenAPI enum lists |
| Envelope JSON schemas (`contracts/`) | tool JSON schemas for agents |
| Blueprint documents, registries, `@trace` tags | relation graph, feature/domain maps, trace matrix (ADR-102) |
| — | the one committed runtime artefact the container build cannot regenerate (domain-state projection read by the product-readiness view) |

Progress figures and ATP are always recomputed from pure calculators; stored caches
are advisory.

## 15. Declared, not built

- **Self-hosted inference pool:** independent model-server replicas behind the Server
  provider/router seam (no distributed model state, no second durable LINE queue);
  each invocation reserved atomically by canonical engine identity through a bounded
  database lease, distinguishing pre-dispatch expiry from uncertain post-dispatch work
  and never recycling disputed capacity. Governed by NFR-023/025 and
  SEC-033/036; feature behavior in FEAT-097.
- **Domain events and outbox:** the target architecture (modular monolith → events →
  outbox → selective extraction) is adopted for taxonomy and ownership; runtime events
  and an outbox are not implemented. Extraction happens only on an operational trigger
  (load, cadence, security, availability, ownership), one domain at a time.

## 16. Strategic classification and context map

Every domain carries a subdomain type and a role (ADR-107), declared once in
`registry/domains.yaml`; the relationships between domains are the context map in
`registry/relations.yaml`. Both are rendered into each domain README's generated
block and into the graph views under `docs/governance/plans/`.

```text
 role        foundation            platform                        business
 ──────────  ────────────────────  ──────────────────────────────  ─────────────────────────────────
 core                              DOM-AGT · DOM-KNW               DOM-CRM · DOM-LOA
 supporting  DOM-PRJ                                               DOM-AST · DOM-MKI · DOM-MKT
 generic     DOM-IAM               DOM-INT · DOM-PLT               DOM-INV · DOM-PRC · DOM-COM
```

Reading the map: the two foundation contexts publish one protocol for everyone
(open-host-service: the viewer gate and the scope chain / audit seam); the LINE
conversation loop (LOA ⇄ CRM, LOA ⇄ AGT) is a partnership; platform contexts are
suppliers to it (INT → LOA / AGT, KNW → AGT / LOA); buy and sell sides meet only in
Inventory (INV → PRC / COM); every external system enters through one domain that
acts as its anticorruption layer (INT for LINE, model providers and Notion; AGT for
MSP; KNW for GKS and GenesisBlockDB; PRJ for GitHub).

## Legacy sources

docs/ARCHITECTURE.md, ARCHITECTURE-NOTES.md, ARCHITECTURE-TARGET-MODULAR-MONOLITH.md,
SYSTEM-DIAGRAM.md, DOMAIN-MODEL.md, DATA-PIPELINE-MAP.md, DB-MIGRATION-NOTES.md,
deployment/docker-ngrok.md, apps/server/docker-compose*.yml, services/*/README.md,
apps/edge/README.md; NFR-006, ADR-083, ARCH-001 (DB boundary, generated schema, snapshot cutover),
ARCH-001 (layering), ARCH-001 (audit columns), ARCH-001 and
ARCH-001 (inference pool), ARCH-001 (Conversation Runtime placement);
read-only context ADR-045,
ADR-047, ADR-048, ADR-049, ADR-082.
