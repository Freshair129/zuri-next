---
id: SRV-001
title: Web application server
kind: web
status: draft
delivery: live
legacy: [apps/server (Next.js), compose service web, FR-142, FR-145]
relations:
  decided_by: [ADR-091, ADR-092, ADR-086, ADR-099]
---

# SRV-001 — Web application server

## Responsibility
The modular-monolith host: serves the web console, every public HTTP API route, the
LINE webhook ingress, private façades for extracted services, and all domain
application services (the only writers of domain data). It is the single public
entry point of the deployment.

## Domains hosted
DOM-PRJ, DOM-IAM, DOM-PLT, DOM-CRM, DOM-LOA, DOM-INT, DOM-AGT, DOM-KNW (Tier-1
stages, admission, publication reads), DOM-INV, DOM-PRC, DOM-COM, DOM-AST, DOM-MKI
(until the executor flag moves it to SRV-007), DOM-MKT.

## Entrypoints
| Entrypoint | Purpose |
|---|---|
| HTTP :3000 — console pages | staged entry, Business Routing, BusinessShell, operator console |
| `/api/**` route handlers | domain APIs (thin; delegate to application services) |
| `GET /api/health` | unauthenticated liveness/readiness: process state, DB state, DB latency |
| `POST /api/line-oa/accounts/{id}/webhook` | LINE native webhook: signature → durable admission |
| `POST /api/line-oa/worker`, `POST /api/line-oa/rich-menu-worker` | worker tick endpoints (bearer: worker token) |
| `/api/internal/conversation-runtime/v1/{operation}` | private core ports for SRV-003 |
| `/api/internal/market-intelligence/v1/{operation}` | private core façade for SRV-007 |
| `/api/plugin/auth/*`, enterprise API routes, `/api/docs` | machine clients (plugin PKCE, API keys, OpenAPI) |
| `GET /api/backup/export`, `POST /api/backup/import` | snapshot export and previewed/confirmed restore |
| MSP child process | spawned over stdio for memory and knowledge relay |

## Configuration (names only)
- Runtime: `NODE_ENV`, `PORT`, `HOSTNAME`, `PUBLIC_BASE_URL`, `ZURI_SESSION_SECRET`,
  `WEBAUTHN_RP_ID`, `WEBAUTHN_ORIGIN`, `ZURI_MFA_SECRET_KEY`, `ZURI_MFA_SECRET_KEY_VERSION`.
- Database: `DATABASE_URL`, `DIRECT_URL`, `ZURI_DB_POOL_MODE`, `ZURI_LINE_DB_URL`,
  `ZURI_LINE_DB_CA_FILE`, `ZURI_CUSTOMER_REVIEW_DATABASE_URL`,
  `ZURI_CUSTOMER_REVIEW_DB_CA_FILE`, `ZURI_CUSTOMER_REVIEW_MODE`.
- Secrets: `ZURI_SECRET_STORE`, `ZURI_SECRET_KEK`, `ZURI_SECRET_KEK_VERSION`,
  `SUPABASE_URL`, `SUPABASE_SECRET_KEY` / `SUPABASE_SERVICE_ROLE_KEY` (operator/storage
  paths only), `ZURI_CREDENTIAL_VAULT_PATH`, `ZURI_CREDENTIAL_VAULT_MASTER_KEY`
  (non-production vault).
- LINE server transport: `ZURI_LINE_SERVER_ENABLED`, `ZURI_LINE_WORKER_TOKEN`,
  `ZURI_LINE_REPLY_SEAL_KEY`, `ZURI_LINE_SECRET_FILE`,
  `ZURI_LINE_WORKER_EXECUTION_CONCURRENCY`, `ZURI_LINE_WORKER_SEND_BATCH`.
- Phase-1 binding (legacy path): `ZURI_LINE_BINDING_*`, `ZURI_PHASE1_RUNTIME_SOURCE`,
  `ZURI_PHASE1_SECRET_BACKEND`, `ZURI_LINE_BUSINESS_AGENT_ENABLED`.
- Models: `ZURI_MODEL_PROVIDER`, `ZURI_MODEL_NAME`, `ZURI_MODEL_TIMEOUT_MS`,
  `ZURI_OLLAMA_BASE_URL` (local evaluation only), `OPENAI_API_KEY` (asset extraction).
- Memory/knowledge: `ZURI_MSP_COMMAND`, `ZURI_MSP_ARGS`, `ZURI_MSP_CWD`,
  `ZURI_MSP_TIMEOUT_MS`, `ZURI_MSP_THREAD_*`, `MSP_DB_URL`/`MSP_DB_PATH` (must differ
  from `DATABASE_URL`), `MSP_THREAD_IDLE_TIMEOUT_MINUTES`, `MSP_GKS_TRANSPORT`,
  `MSP_GKS_HTTP_URL`, `ZURI_KNOWLEDGE_ENABLED`, `ZURI_KNOWLEDGE_BINDINGS`,
  `ZURI_KNOWLEDGE_TIMEOUT_MS`, `ZURI_KNOWLEDGE_STORAGE_*`, `MSP_PIPELINE_PRINCIPALS`.
- Evidence and archive: `ZURI_ASSET_EVIDENCE_BUCKET`, `ZURI_ASSET_EVIDENCE_MODEL`,
  `SUPABASE_STORAGE_SERVICE_ROLE_KEY`, `ZURI_ARCHIVE_DIR`, `ZURI_ARCHIVE_KEK`,
  `ZURI_ARCHIVE_KEK_VERSION`.
- Extracted services: `CONVERSATION_RUNTIME_TOKEN`, `MARKET_EXECUTOR`,
  `MARKET_SERVICE_URL`, `MARKET_SERVICE_TOKEN`.
- Integrations: `NOTION_CLIENT_ID`, `NOTION_CLIENT_SECRET`, `NOTION_REDIRECT_URI`,
  `ZURI_PLUGIN_CLIENT_ID`, `ZURI_PLUGIN_CLIENT_NAME`, `ZURI_PLUGIN_REDIRECT_URIS`,
  `ZURI_PLUGIN_POLICY_SNAPSHOT_ID`.
- Operator jobs: `ZURI_RETENTION_SWEEP_TOKEN`, `ZURI_USAGE_ROLLUP_TOKEN`,
  `ZURI_PROGRAMME_USAGE_TOKEN`.
- Local-only: `ZURI_LOCAL_FILE_BRIDGE` (managed local file workspace; Windows host).

## Dependencies
SRV-009 (required); secret store and private object storage; LINE Platform; model
providers; MSP (child process) and, through it, SRV-005 and SRV-004;
SRV-006 (optional); cold archive volume (production overlay only).

## Scaling and state
Stateless request processing; all durable state in SRV-009, secret store, object
storage and archive volume. Run as one instance today: some caches are process-local
(transport-health schedule, secret/token caches with hard expiry). Multiple replicas
require transaction pooling (`ZURI_DB_POOL_MODE`) and review of process-local caches.
`stop_grace_period` 60 s so post-acknowledgement admission finishes on redeploy.

## Deploy unit
Image built from `apps/server/Dockerfile` (targets `runner`, or `runner-ki17` when the
host runs the knowledge pipeline), non-root, secret-free. Compose service `web` in the
pinned project, with the public tunnel container (`ngrok`, Host header preserved) and
production overlays (`line-server`, `cold-archive`, `ki17-web`, optional `ki17-gks-http`)
named in the host's `COMPOSE_FILE`. See RB-005.

## Runbooks
RB-005 · RB-002 · RB-001 · RB-004 · RB-003
