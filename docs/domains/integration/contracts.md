# Contracts — DOM-INT
HTTP routes run in SRV-001. "Credential route" means the shared request path
`handleCredentialRequest`: body ≤ 16 KiB (413 `CREDENTIAL_INPUT_TOO_LARGE`), invalid
JSON 400 `CREDENTIAL_INPUT_INVALID`, trusted viewer, the credential-write gate (AAL2
step-up + per-Person/Business and installation rate limits, DOM-IAM FR-094-004) as
service ports, and `Cache-Control: no-store` on every response. No response, log or
audit payload of any contract below carries secret material.

## In-process contracts

### API-161
Owner: DOM-INT
In-process: `platform/integrations/core/secret-store/secret-store-port.js` (bundle schemas `LINE_CHANNEL`, `OAUTH_CLIENT`, `MODEL_PROVIDER_KEY`, `NOTION_OAUTH_TOKEN`; `parseSecretBundle`, `displayHintFor`), stores `envelope-secret-store.js` / `supabase-vault-secret-store.js` selected by `ZURI_SECRET_STORE`, the read-only deployment mount adapter, `dispatching-secret-manager.js` (resolve by ref prefix), `credential-lifecycle.js` (`storeValidatedCredential`, `revokeCredential`, `markCredentialsReentryRequired`).
Purpose: the only way a provider secret is written, rotated, revoked or resolved.
Auth/scope: server code only; the resolver re-checks Tenant, Business, connection and destination from rows, never from arguments.
Request/Response: write → new version `PENDING_VALIDATION` → ACTIVE after validation; resolve → bundle for a `(tenant, business, connection, kind)`.
Errors: `CHANNEL_SECRET_SCOPE_MISMATCH` (404), `CHANNEL_SECRET_KIND_UNSUPPORTED` (400), `CREDENTIAL_KIND_MISMATCH` (409), store unavailable (503).
Implements: FR-054-001, FR-054-002, FR-054-006, FR-094-001, FR-094-002, FR-094-003
Legacy: apps/server/src/platform/integrations/core/secret-store/**

### API-160
Owner: DOM-INT
In-process: `core/raw-ingest-service.js#ingestRawExternalRecord(envelope, {repository})`, `core/raw-record-repository.js#createPrismaRawRecordRepository(db, scope)`, `core/raw-record-redaction.js#tombstoneRawRecordsForExternalIds`.
Purpose: the one raw-evidence writer for every acquisition channel.
Request: `zIngestionEnvelope`; Response: `{status: CREATED|UNCHANGED, rawRecord, envelope}`.
Errors: validation, hash/key mismatch, scope violation (thrown).
Implements: FR-053-001, FR-053-002, FR-053-003, FR-053-004
Legacy: apps/server/src/platform/integrations/core/raw-ingest-service.js

### API-147
Owner: DOM-INT
In-process: `providers/line/server-line-transport.js` — `resolveServerLineAccount` (account + credential through the secret manager), `verifyServerLineWebhook({rawBody, signature, account})`, `createServerLineReplyTransport`, `createServerLinePushTransport` (10 s timeout), `createServerLineSecretManagerFromEnv`.
Purpose: every LINE Messaging API call and webhook signature check for server-owned transport; callers never see the token.
Response: send outcome `ACCEPTED_BY_LINE` or a classified failure with provider request id.
Implements: FR-093-004, FR-094-001
Legacy: apps/server/src/platform/integrations/providers/line/server-line-transport.js

### API-146
Owner: DOM-INT
In-process: `providers/line/line-oa-evidence.js#createLineOaEvidenceRecorder`, `providers/line/line-oa-webhook.js` (`normalizeLineWebhookEvent`, lane CUSTOMER, entity by event type; reply token stripped from evidence).
Purpose: record each inbound LINE event as raw Integration evidence before admission.
Implements: FR-093-003, FR-053-002
Legacy: apps/server/src/platform/integrations/providers/line/line-oa-evidence.js

### API-141
Owner: DOM-INT
In-process: `providers/line/line-channel-admin-port.js#createLineChannelAdminPort` (stateless token mint, bot info, webhook endpoint set/get/test, `classifyWebhookTest`), `createLineChannelTokenCache`.
Purpose: prove a Channel ID/secret pair with LINE, fill destination/basic id/display name, manage the webhook endpoint.
Errors: `LINE_CREDENTIALS_REJECTED` (422, one code for wrong id or secret), `LINE_UNAVAILABLE` (503), `LINE_TOKEN_MINT_THROTTLED` (503 + `retryAfterSeconds`), `LINE_ADMIN_PORT_CONFIGURATION_INVALID` (503).
Implements: FR-094-006, FR-094-009
Legacy: apps/server/src/platform/integrations/providers/line/line-channel-admin-port.js

### API-149
Owner: DOM-INT
In-process: `providers/line/server-line-rich-menu-transport.js#createServerLineRichMenuTransport` (15 s timeout; create, upload image, set default, set alias; `zLineRichMenuObject`).
Purpose: the only path by which rich menus reach LINE; acceptance is HTTP acceptance, not delivery.
Implements: FR-049-003, FR-049-004
Legacy: apps/server/src/platform/integrations/providers/line/server-line-rich-menu-transport.js

### API-138
Owner: DOM-INT
In-process: `core/channel-account-claim.js` — `hashExternalAccount` (SHA-256 of the LINE destination), `claimChannelAccount`, `resolveClaimRace`, `readChannelAccountClaim`, `abandonChannelAccountClaim`.
Purpose: one LINE bot bound to at most one live connection per installation; claim taken before any secret is stored.
Implements: FR-094-007
Legacy: apps/server/src/platform/integrations/core/channel-account-claim.js

### API-150
Owner: DOM-INT
In-process: `providers/model/model-provider-admin-port.js#createModelProviderAdminPort` (per-provider model probe; PRP `GET /v1/models`), `providers/model/private-runtime-config.js#readPrivateRuntimeBaseUrl`.
Errors: `MODEL_KEY_REJECTED` (422), `MODEL_NOT_FOUND` (422), provider unavailable; 10 s timeout.
Implements: FR-054-003, FR-054-005
Legacy: apps/server/src/platform/integrations/providers/model/**

### API-159
Owner: DOM-INT
In-process: `core/pipeline-tracking-service.js` + `core/pipeline-tracking-contract.js` (run create/list/read, step/gate/record events, monitor read with `gateCompliance`, replay), `core/pipeline-gate-compliance.js`.
HTTP: `POST/GET /api/pipelines/runs`, `GET /api/pipelines/runs/{executionRunId}`, `POST /api/pipelines/runs/{executionRunId}/events`, `POST /api/pipelines/runs/{executionRunId}/replay`.
Purpose: append-only execution ledger for data pipelines, replay as new lineage, and the FR-056-001, FR-056-002 compliance block.
Implements: FR-060-001, FR-060-002, FR-060-003, FR-060-004, FR-056-001, FR-056-002
Legacy: apps/server/src/platform/integrations/core/pipeline-tracking-service.js; FR-060-001, FR-060-002, FR-060-003, FR-060-004, FR-060-005

### API-139
Owner: DOM-INT
In-process: `data_pipeline.*` MCP tool namespace (`run_create`, `document_stage`, `event_record`, `monitor_read`, `replay_request`) registered by `modules/project-manager/mcp/transport.js`; `core/cloud-sot-agent.js#stageDocumentIntakeForPipeline`; `core/pipeline-tracking-service.js#createPipelineRunFromWorker`.
Purpose: authenticated worker transport for the Codex-mediated SmartGift pipeline bridge (`EVIDENCE_ONLY`), calling the same application services as the HTTP contract above rather than a second persistence path.
Errors: scope mismatch → server-resolved scope governs, argument ignored; malformed args → thrown before dispatch.
Implements: FR-060-005
Legacy: apps/server/src/platform/integrations/core/cloud-sot-agent.js; ADR-058

## HTTP contracts

### API-142
Owner: DOM-INT
POST /api/line-oa/connections (credential route)
Purpose: create a Business's `LINE_OA` connection. With `{businessId, channelId, channelSecret, channelAccessToken?}`: validate with LINE (stateless token), take the channel account claim, store the credential through the vault, return connection, masked credential and bot metadata. Without secret fields: owner-only provisioning from a deployment-secret mount reference (operator path).
Auth/scope: Business OWNER; AAL2 + rate limits for the secret-bearing form.
Errors: 422 `LINE_CREDENTIALS_REJECTED`; 409 `LINE_CHANNEL_ALREADY_CONNECTED` (same Tenant) | `LINE_CHANNEL_CLAIMED_ELSEWHERE` (other Tenant, names none); 503 LINE outage (nothing stored); step-up/rate-limit refusals (403 `ASSURANCE_LEVEL_INSUFFICIENT` / `MFA_FACTOR_REQUIRED`, 429 `CREDENTIAL_RATE_LIMITED`).
Implements: FR-094-001, FR-094-004, FR-094-005, FR-094-006, FR-094-007 (the mount-reference provisioning branch has no FR; FR-093-005)
Legacy: apps/server/src/app/api/line-oa/connections/route.js

### API-143
Owner: DOM-INT
POST /api/line-oa/connections/{id}/credential (credential route)
Purpose: rotate (or migrate a mount-backed credential into the vault by re-entering the secret); the previous version stays resolvable until the new one validates.
Errors: 404 `CREDENTIAL_NOT_FOUND`; 409 `LINE_CONNECTION_NOT_ACTIVE`; 422 `LINE_CHANNEL_MISMATCH` (secret belongs to another channel); gate refusals.
Implements: FR-094-002, FR-094-008
Legacy: apps/server/src/app/api/line-oa/connections/[id]/credential/route.js

### API-144
Owner: DOM-INT
POST /api/line-oa/connections/{id}/credential/revoke (credential route)
Purpose: mark REVOKED, purge stored material, invalidate the runtime cache and fence the account.
Implements: FR-094-003
Legacy: apps/server/src/app/api/line-oa/connections/[id]/credential/revoke/route.js

### API-145
Owner: DOM-INT
POST /api/line-oa/connections/{id}/credential/validate (credential route)
Purpose: live re-validation with LINE; a rejected validation counts twice against the rate limit.
Errors: 409 `CREDENTIAL_REENTRY_REQUIRED` after a restore.
Implements: FR-094-002, FR-094-005
Legacy: apps/server/src/app/api/line-oa/connections/[id]/credential/validate/route.js

### API-151
Owner: DOM-INT
GET /api/integration/model-providers?businessId= · POST /api/integration/model-providers (credential route)
Purpose: read model-credential status + provider catalogue; provision/rotate a Business's model key.
Request (POST): `{businessId, provider: anthropic|openai|gemini|groq|prp, model, apiKey}`.
Errors: 404; 422 `MODEL_KEY_REJECTED` | `MODEL_NOT_FOUND`; 503 `PRIVATE_RUNTIME_NOT_CONFIGURED` | `MODEL_PROVIDER_UNAVAILABLE` | `CHANNEL_SECRET_STORE_UNAVAILABLE`; gate refusals.
Implements: FR-054-003, FR-054-004, FR-054-005
Legacy: apps/server/src/app/api/integration/model-providers/route.js

### API-152
Owner: DOM-INT
POST /api/integration/model-providers/{id}/revoke (credential route), body `{reason, confirmation: "REVOKE"}`.
Implements: FR-054-004
Legacy: apps/server/src/app/api/integration/model-providers/[id]/revoke/route.js

### API-153
Owner: DOM-INT
POST /api/integration/model-providers/{id}/validate (credential route), body `{}`.
Errors: 404 `CREDENTIAL_NOT_FOUND`; 409 `CREDENTIAL_REENTRY_REQUIRED`; 422 provider refusal.
Implements: FR-054-004
Legacy: apps/server/src/app/api/integration/model-providers/[id]/validate/route.js

### API-140
Owner: DOM-INT
GET /api/platform/integrations?businessId= · POST /api/platform/integrations
Purpose: owner read model of Business-scoped providers/connections/credential metadata with computed health (`CONNECTED · DEGRADED · ERROR · DISABLED · MISCONFIGURED` + reasons) and the connector catalog; create Phase-1 LLM connection metadata (`purpose=PHASE1_LINE_LLM`, reference `supabase-vault:<uuid>` only).
Auth/scope: trusted Business ownership; cannot activate LINE routing.
Implements: FR-091-006, FR-091-007, FR-057-001
Legacy: apps/server/src/app/api/platform/integrations/route.js

### API-148
Owner: DOM-INT
GET /api/platform/integrations/line-registry?businessId=&type= · POST /api/platform/integrations/line-registry
Purpose: list and save the Business's known LINE groups and users (registry metadata for the Platform page).
Auth/scope: trusted Business scope via the request resolver.
Implements: FR-091-006
Legacy: apps/server/src/app/api/platform/integrations/line-registry/route.js

### API-154
Owner: DOM-INT
GET /api/integrations/notion/connect?businessId=
Purpose: start Notion OAuth (owner, AAL2, rate limit; 10-minute single-use hashed state); redirects to Notion.
Errors: 400 `NOTION_BUSINESS_REQUIRED`; 401; 404 `NOTION_BUSINESS_NOT_FOUND`; 503 `NOTION_OAUTH_NOT_CONFIGURED`.
Implements: FR-058-001
Legacy: apps/server/src/app/api/integrations/notion/connect/route.js

### API-155
Owner: DOM-INT
GET /oauth/notion/callback?code=&state=
Purpose: consume state, exchange code server-side, vault tokens, redirect with an outcome code only (`no-store`, `no-referrer`).
Errors (as redirect codes): `NOTION_OAUTH_STATE_INVALID`, `NOTION_OAUTH_ACTOR_MISMATCH`, `NOTION_OAUTH_DENIED`, `NOTION_OAUTH_EXCHANGE_FAILED`, `NOTION_WORKSPACE_ALREADY_CONNECTED`.
Implements: FR-058-002
Legacy: apps/server/src/app/oauth/notion/callback/route.js

### API-156
Owner: DOM-INT
POST /api/integrations/notion/webhook (no session; Notion-signed)
Purpose: capture the first verification challenge; then verify `X-Notion-Signature` and record idempotent receipts only.
Errors: 400, 401 `NOTION_WEBHOOK_VERIFICATION_REQUIRED` | `NOTION_WEBHOOK_SIGNATURE_INVALID`, 409 `NOTION_WEBHOOK_TOKEN_ALREADY_CONFIGURED`, 413, 415, 503.
Implements: FR-058-003, FR-058-004
Legacy: apps/server/src/app/api/integrations/notion/webhook/route.js

### API-158
Owner: DOM-INT
POST /api/platform/integrations/notion/webhook-verification/reveal
Purpose: one-time reveal of the verification token to an installation operator at AAL2.
Errors: 401; 403 `INSTALLATION_OPERATOR_REQUIRED`; 404 `NOTION_WEBHOOK_TOKEN_NOT_AVAILABLE`; 409 `NOTION_WEBHOOK_TOKEN_ALREADY_REVEALED`.
Implements: FR-058-005
Legacy: apps/server/src/app/api/platform/integrations/notion/webhook-verification/reveal/route.js

### API-157
Owner: DOM-INT
POST /api/platform/integrations/notion/webhook-verification/reset
Purpose: delete verification material before recreating a subscription (operator, AAL2, audited `TOKEN_RESET`).
Implements: FR-058-005
Legacy: apps/server/src/app/api/platform/integrations/notion/webhook-verification/reset/route.js

### API-165
Owner: DOM-INT
GET /api/platform/sot/plan?businessId=
Purpose: plan phases with derived status and pending counts (feeds board and graph).
Errors: 404 outside visible scope.
Implements: FR-055-001, FR-055-002, FR-055-006
Legacy: apps/server/src/app/api/platform/sot/plan/route.js

### API-163
Owner: DOM-INT
GET /api/platform/sot/decisions?tenantId=&businessId=&status=&decisionType=&phaseId=&limit= · POST /api/platform/sot/decisions
Purpose: list (visibility-scoped) and submit (operator or Tenant data-plane bearer `sdpk_…`) decisions.
Errors: 403; 404; 400.
Implements: FR-055-003, FR-055-004
Legacy: apps/server/src/app/api/platform/sot/decisions/route.js

### API-162
Owner: DOM-INT
POST /api/platform/sot/decisions/{decisionId}/decide, body `{decision: APPROVED|REJECTED, reason?}`.
Errors: 400 (reject without reason); 403; 404; 409 already decided.
Implements: FR-055-004
Legacy: apps/server/src/app/api/platform/sot/decisions/[decisionId]/decide/route.js

### API-164
Owner: DOM-INT
GET /api/platform/sot/decisions/export?tenantId=&since=&limit=
Purpose: cursor pull of decided rows for the data plane.
Errors: 400 malformed cursor; 403.
Implements: FR-055-005
Legacy: apps/server/src/app/api/platform/sot/decisions/export/route.js
