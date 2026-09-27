# Contracts — DOM-LOA
### API-123
Owner: DOM-LOA
Method + path: `GET/POST /api/line-oa/accounts`
Purpose: list the LINE OA accounts of one Business the viewer may see, each
with computed health; connect an existing `LINE_OA` integration connection as
a new DRAFT account.
Auth/scope: GET — Business visibility + domain grant `line-oa` (`FR-024-003`).
POST — Business OWNER or `LINE_OA_PUBLISHER`. `businessId` is a selector
validated against the trusted viewer, never trusted as scope.
Request essentials: GET query `businessId`, `includeArchived`. POST body
`{businessId, integrationConnectionId, code, displayName, basicId?,
bindingCode?, transportMode? ('CLOUD' only), isDefaultForBusiness?, botProfile?}`.
Response essentials: GET — array of accounts with computed health. POST — the
created DRAFT account.
Errors: an unauthorized or unknown Business answers the same 404
(`FR-003-009`); validation errors are 400.
Implements: FR-048-001, FR-048-002, FR-048-003
Legacy: `apps/server/src/app/api/line-oa/accounts/route.js` (FR-146)

### API-121
Owner: DOM-LOA
Method + path: `GET/PATCH /api/line-oa/accounts/{id}`
Purpose: read one account with computed health; apply one versioned action —
`PAUSE`, `RESUME`, `ARCHIVE`, `SET_DEFAULT`, `CONFIGURE_EXECUTION`,
`ENABLE_SERVER`, `DISABLE_SERVER`, `CONFIGURE_KNOWLEDGE_GROUNDING`,
`REGISTER_WEBHOOK`, `CONFIGURE_SESSION_TIMEOUT`, `CONFIGURE_BUSINESS_HOURS`.
Auth/scope: GET — Business visibility + domain grant. PATCH — Business OWNER
or `LINE_OA_PUBLISHER`.
Request essentials: PATCH body `{action, version, ...action-specific fields}`
(`allowDelayedPush`, `runtimeOwner`, `knowledgeGrounding`,
`sessionIdleTimeoutMinutes`, `businessHoursOpen/Close`, `outOfHoursReplyText`,
`clearBusinessHours`, `legacyQuiesced`). `version` is the compare-and-swap.
Response essentials: the updated account with computed health.
Errors: stale `version` is a conflict (409); an unknown id or an account in a
Business the viewer may not see answers the same 404 (`FR-003-009`); no
DELETE — archiving keeps the row and its history.
Implements: FR-048-002, FR-048-003, FR-048-004, FR-051-001,
FR-051-003; FR-094-009, FR-094-010, `FR-096-001` (actions this
route carries but does not itself specify — see `FEAT-094`)
Legacy: `apps/server/src/app/api/line-oa/accounts/[id]/route.js` (FR-146)

### API-132
Owner: DOM-LOA
Method + path: `POST /api/line-oa/accounts/{id}/webhook`
Purpose: LINE's signed webhook delivery for one account. Verifies the raw
signature before parsing (including an empty verification request), records
every event as sanitized evidence, marks it `ADMITTING` as the durable
handoff, and returns before conversation admission completes.
Auth/scope: LINE channel signature (`x-line-signature`), not a session; the
account id in the path is a locator, not authorization — the resolved
account's `destination` must match the signed body.
Request essentials: raw body ≤ 1 MiB; `x-line-signature` header.
Response essentials: `{accepted: true, correlationId, captured: <count>}`.
Errors: `400/401/403/404/409/413` for malformed/unsigned/mismatched/oversized
bodies; `503 LINE_WEBHOOK_NOT_ACCEPTED` when any event could not be durably
captured (LINE redelivers).
Implements: FR-050-001 (server-only ingress); FR-053-001 (evidence
capture, Integration-owned)
Legacy: `apps/server/src/app/api/line-oa/accounts/[id]/webhook/route.js`
(FR-093-003, FR-093-004, FR-093-005, FR-093-006, FR-093-007, FR-093-008, FR-093-009, FR-093-010, FR-093-011, FR-093-012; superseded the legacy `POST /api/agent/line-webhook` path named in
older PRD text — verified absent from `src/app/api`)

### API-122
Owner: DOM-LOA
Method + path: `GET /api/line-oa/accounts/{id}/jobs`
Purpose: scoped operational state of one account's durable conversation jobs
— no tokens, recipients or message bodies — optionally narrowed to one
conversation session (`?session=S-YYYYMMDD-XXXXXX`).
Auth/scope: Business visibility + domain grant.
Request essentials: path `id`; query `session?`.
Response essentials: array of job summaries (status, timestamps, error code,
session id).
Errors: unknown/unauthorized account → 404.
Implements: FR-051-002
Legacy: `apps/server/src/app/api/line-oa/accounts/[id]/jobs/route.js` (FR-149, FR-243)

### API-137
Owner: DOM-LOA
Method + path: `GET /api/line-oa/accounts/{id}/transport-health`
Purpose: read-only reachability report — inbound-silence state (OK/QUIET/
SILENT) and webhook-endpoint match (MATCHED/MISMATCHED/DISABLED/UNKNOWN) —
states, timestamps and durations only, never channel credentials or the other
endpoint's contents.
Auth/scope: Business visibility + domain grant.
Request essentials: path `id`.
Response essentials: `{silence: {state, lastInboundAt, ageMs}, endpoint:
{state, ...}}`.
Errors: unknown/unauthorized account → 404.
Implements: FR-052-003, FR-052-004, FR-052-005
Legacy: `apps/server/src/app/api/line-oa/accounts/[id]/transport-health/route.js` (FR-190)

### API-127
Owner: DOM-LOA
Method + path: `GET /api/line-oa/jobs/failures`
Purpose: the honest, red count of terminal `FAILED` conversation jobs for one
Business — a read model, never a retry or acknowledgement endpoint.
Auth/scope: Business visibility + domain grant; `businessId` is a validated
selector.
Request essentials: query `businessId`.
Response essentials: count plus breakdown by `errorCode`.
Errors: unauthorized/unknown Business → 404.
Implements: FR-050-001 (visible EDGE-cutover expiry), FR-051-003
Legacy: `apps/server/src/app/api/line-oa/jobs/failures/route.js` (FR-149)

### API-126
Owner: DOM-LOA
Method + path: `POST /api/line-oa/jobs/{id}/acknowledge-unknown`
Purpose: audited closure of an `UNKNOWN` job outcome — no delivery assertion,
no resend.
Auth/scope: Business OWNER or `LINE_OA_PUBLISHER`.
Request essentials: path `id`; body (acknowledgement reason/note).
Response essentials: the updated job record.
Errors: job not `UNKNOWN` → conflict; unauthorized/unknown → 404.
Implements: FR-093-011 (BR-028)
Legacy: `apps/server/src/app/api/line-oa/jobs/[id]/acknowledge-unknown/route.js` (FR-149)

### API-128
Owner: DOM-LOA
Method + path: `GET /api/line-oa/jobs/{id}/trace`
Purpose: authenticated, read-only inspection of a durable job's execution
trace.
Auth/scope: derives scope from the job; requires Business ownership.
Request essentials: path `id`.
Response essentials: ordered trace events; `Cache-Control: private, no-store`.
Errors: `401/403/404` pass through; anything else is `503 TRACE_UNAVAILABLE`.
Implements: FR-093-011
Legacy: `apps/server/src/app/api/line-oa/jobs/[id]/trace/route.js` (`FR-068-001, FR-068-002, FR-068-003`)

### EVT-002
Owner: DOM-LOA
Method + path: `POST /api/line-oa/worker` (+ `scripts/server-line-worker.mjs`,
`scripts/worker-cadence.mjs` supervisor)
Purpose: one deployment-authenticated bounded tick: reconciles abandoned
admissions, runs the hourly transport-health sweep, then claims and answers a
bounded number of `SERVER`-cohort conversation jobs (model call via the
Inventory `#sku` command wrapper or the agent's server answer adapter) and
sends up to a bounded number of ready answers in order.
Auth/scope: `Authorization: Bearer <ZURI_LINE_WORKER_TOKEN>` (timing-safe
compare, ≥32 chars); not a session.
Request essentials: none (POST, no body fields consumed).
Response essentials: `{...tick result, reconciled}`.
Errors: `401 WORKER_CREDENTIAL_REQUIRED`; `503 LINE_WORKER_UNAVAILABLE` on an
unexpected failure (the reconciler and health sweep never fail the tick).
Implements: FR-050-002, FR-051-003, FR-052-005
Legacy: `apps/server/src/app/api/line-oa/worker/route.js` (FR-149, FR-150, FR-190)

### EVT-003
Owner: DOM-LOA
Method + path: `POST /api/line-oa/rich-menu-worker`
Purpose: one deployment-authenticated tick of the rich-menu publish worker —
at most one job per call, nothing kept in RAM; walks a claimed job through the
Integration rich-menu port (create → upload image → done, or apply).
Auth/scope: same bearer contract as the conversation worker.
Request essentials: none.
Response essentials: tick result (claimed/attempted job outcome).
Errors: `401 WORKER_CREDENTIAL_REQUIRED`; `503 LINE_WORKER_UNAVAILABLE`.
Implements: FR-049-003, FR-049-004
Legacy: `apps/server/src/app/api/line-oa/rich-menu-worker/route.js` (FR-152)

### API-135
Owner: DOM-LOA
Method + path: `GET/POST /api/line-oa/rich-menus`
Purpose: list an account's rich menus with their versions; create a menu with
its first draft.
Auth/scope: GET — Business visibility + domain grant. POST — Business OWNER
or `LINE_OA_PUBLISHER`.
Request essentials: GET query `accountId`, `includeArchived`. POST body (menu
identity + first draft fields).
Response essentials: menu(s) with version summaries.
Errors: unauthorized/unknown account → 404 (`FR-003-009`).
Implements: FR-049-001
Legacy: `apps/server/src/app/api/line-oa/rich-menus/route.js` (FR-151)

### API-133
Owner: DOM-LOA
Method + path: `GET/PATCH /api/line-oa/rich-menus/{id}`
Purpose: read one rich menu with its versions; apply one versioned action —
`SAVE_DRAFT`, `FREEZE`, `ARCHIVE`.
Auth/scope: GET — Business visibility + domain grant. PATCH — publisher
authority, `version` compare-and-swap.
Request essentials: PATCH body `{action, version, ...draft fields}`.
Response essentials: the updated menu.
Errors: stale version → conflict; unknown/unauthorized → 404; no DELETE.
Implements: FR-049-001, FR-049-002
Legacy: `apps/server/src/app/api/line-oa/rich-menus/[id]/route.js` (FR-151)

### API-134
Owner: DOM-LOA
Method + path: `GET/POST/PATCH /api/line-oa/rich-menus/{id}/jobs`
Purpose: read a menu's job ledger; queue one job (`PUBLISH` the newest
FROZEN version, `SET_DEFAULT`/`SET_ALIAS` a PUBLISHED one) with the menu's
`version` as compare-and-swap; acknowledge an `UNKNOWN` job. Nothing here
calls LINE — the worker does, on its own tick.
Auth/scope: GET — Business visibility + domain grant. POST/PATCH — publisher
authority.
Request essentials: POST body `{kind, version}`; PATCH body (acknowledgement).
Response essentials: job list / created job / updated job.
Errors: at most one open job per menu (conflict on a second); unauthorized/
unknown → 404 (`FR-003-009`).
Implements: FR-049-003, FR-049-004
Legacy: `apps/server/src/app/api/line-oa/rich-menus/[id]/jobs/route.js` (FR-152)

### API-130
Owner: DOM-LOA
Method + path: `GET/POST /api/line-oa/liff-apps`
Purpose: list an account's LIFF app registry; register a new app (DRAFT until
its `liffId` is recorded).
Auth/scope: GET — Business visibility + domain grant. POST — publisher
authority.
Request essentials: GET query `accountId`, `includeArchived`. POST body (name,
description, viewSize, endpointUrl, scopes, botPrompt).
Response essentials: app(s).
Errors: unauthorized/unknown account → 404.
Implements: FR-049-005
Legacy: `apps/server/src/app/api/line-oa/liff-apps/route.js` (FR-153)

### API-129
Owner: DOM-LOA
Method + path: `GET/PATCH /api/line-oa/liff-apps/{id}`
Purpose: read one app; apply one versioned action — `UPDATE`,
`RECORD_LIFF_ID`, `ARCHIVE`.
Auth/scope: GET — Business visibility + domain grant. PATCH — publisher
authority, `version` compare-and-swap.
Request essentials: PATCH body `{action, version, ...fields}`.
Response essentials: the updated app.
Errors: stale version → conflict; unauthorized/unknown → 404; no DELETE.
Implements: FR-049-005, FR-049-006
Legacy: `apps/server/src/app/api/line-oa/liff-apps/[id]/route.js` (FR-153)

### API-125
Owner: DOM-LOA
Method + path: `GET /api/health`
Purpose: deployment liveness probe with no session: runs exactly one trivial
`SELECT 1` and answers `{status:'ok', db:'ok'}` (200) or
`{status:'degraded', db:'unreachable'}` (503) — states only, never an error
message, host or credential.
Auth/scope: none (used by Docker Compose to gate container health and ngrok
start).
Request essentials: none.
Response essentials: `{status, db}`.
Errors: 503 on an unreachable database; never a stack trace or credential.
Implements: FR-052-001
Legacy: `apps/server/src/app/api/health/route.js` (FR-142)

### API-124
Owner: DOM-LOA
Method + path: `GET /api/internal/conversation-runtime/v1/health`,
`POST /api/internal/conversation-runtime/v1/{operation}`
Purpose: the private, versioned boundary (`conversation-runtime.v1`) the
extracted Conversation Runtime service calls to claim, renew, resolve
authority, run a bounded work-tool step, resolve a model credential grant,
complete, fail, send and trace a durable conversation job. Never public; never
accepts an LLM-supplied viewer or scope.
Auth/scope: internal service-to-service only (not a public/browser route);
every operation revalidates the claim (claimant, execution id, lease, version,
transport epoch) and current account/consent authority.
Request essentials: envelope `{contractVersion: 'conversation-runtime.v1',
operation, correlationId, idempotencyKey, deadlineAt, payload}`; payload ≤ 64
KiB, ≤ 32 top-level keys.
Response essentials: bounded JSON ≤ 64 KiB; typed errors.
Errors: strict envelope validation (400-class); stale/invalid claim refused.
Implements: FR-093-008, FR-050-004 (runtime boundary for FR-050-001, FR-050-002)
Legacy: `apps/server/src/app/api/internal/conversation-runtime/v1/[operation]/route.js`
(FR-093-005, `FR-068-001, FR-068-002, FR-068-003`; `ADR-049`)

### API-136
Owner: DOM-LOA
In-process: `server-line-runtime.js#serverLinePorts(env, db)`
Purpose: composition root for the `SERVER`-cohort worker: resolves an
account's LINE identity and secret-manager-backed reply/push transports, and
the optional MSP thread-memory port. Throws `LINE_SERVER_DISABLED` (503) if
`ZURI_LINE_SERVER_ENABLED !== 'true'`. Reached from outside this domain
exactly once, by CRM's `sendStaffReply` (FR-047-001).
Auth/scope: server-process composition only, never a browser input.
Request essentials: n/a (function call).
Response essentials: `{resolveAccount, replyTransport, pushTransport,
threadMemory}`.
Errors: `LINE_SERVER_DISABLED` when the deployment flag is off.
Implements: FR-050-001
Legacy: `apps/server/src/modules/line-oa-studio/application/server-line-runtime.js` (FR-149)

### API-131
Owner: DOM-LOA
In-process: `line-conversation-jobs.js#admitLineConversation(...)` (+
`markLineAdmissionIntent`, `admitCapturedLineEvents`)
Purpose: the durable admission seam that turns captured webhook evidence into
a CRM conversation/message row and a uniquely keyed `LineConversationJob`, in
one transaction, serialized per conversation. Applies the account's
session-idle-timeout and business-hours rules at admission time (FR-051-001,
FR-051-003).
Auth/scope: called only from the webhook route and the admission reconciler,
never from a public route.
Request essentials: captured evidence entries, resolved account, correlation id.
Response essentials: created/updated job(s).
Errors: idempotent on `(accountId, eventId)`; a stranded `ADMITTING` row is
re-admitted by the bounded reconciler.
Implements: FR-051-001, FR-051-002, FR-051-003
Legacy: `apps/server/src/modules/line-oa-studio/application/line-conversation-jobs.js`
(FR-093-003, FR-093-004, FR-093-005, FR-093-006, FR-093-007, FR-093-008, FR-093-009, FR-093-010, FR-093-011, FR-093-012; legacy PRD text names this `admitLineTextMessage` — the current
export is `admitLineConversation`, spec follows the code)
