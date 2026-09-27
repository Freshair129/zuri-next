# Agent — Contracts

Internal function-level seams (`handleAgentTurn`, `assembleAgentContext`,
`executeAgentAction`, the Gate E/F tool registries) are documented as
components in each feature's §6 Design, not restated here — STD-001 R1
reserves `API-`/`EVT-` for externally callable interfaces (HTTP, RPC, CLI).
Everything below is either an HTTP route, an operator-invoked CLI/library
entrypoint, or a library contract another domain calls in-process.

### API-173
Owner: DOM-AGT
Method+path: `POST /api/agent/line-webhook`
Purpose: Normalize an inbound LINE message-event batch and call
`handleAgentTurn` for Gate E read/answer (and optional Gate F action).
Auth/scope: LINE signature verification at the transport; tenant scope
resolved server-side, never client-selected; refuses an unresolved tenant.
Request: a LINE webhook event batch (forwarded by the legacy zuri-cli
LINE bot).
Response: per-event turn `response` (kind `ANSWER`/`ACTION_DONE`/
`ACTION_DENIED`/`STEP_UP_REQUIRED`/`DUPLICATE`).
Errors: unresolved tenant refused outright; unauthorized/step-up-needed
degrades to a graceful response, never a 5xx.
Implements: FR-062-001, FR-064-001
Legacy: `POST /api/agent/line-webhook` — **removed from the tree** (commit
`fd5e19e33d`, 2026-09-25, ADR-095). Documented for traceability; see
FEAT-062 §9 and FEAT-064 §9.

### API-168
Owner: DOM-AGT
Method+path: `GET` / `POST` / `DELETE /api/agent/heartbeat`
Purpose: Business-scoped Edge Device liveness cache for the console.
Auth/scope: trusted session viewer on every method; `businessId` must be a
Business the viewer owns.
Request (`POST`): `{ businessId, deviceId, status, contractVersion,
registeredQueries, approvedTemplates, engine?, model? }`.
Response: device list / registration result.
Errors: `401` missing/invalid session; `400` failed payload parse; `403`
Business not owned.
Implements: FR-069-002
Legacy: `GET/POST/DELETE /api/agent/heartbeat` — **retired** (ADR-110 D5,
2026-09-25). Route and `edge-device-registry.js` removed from the tree.

### API-170
Owner: DOM-AGT
Method+path: `POST /api/agent/line-asset-handoff`
Purpose: Accept a trusted, transport-bound LINE asset handoff (opaque
active `FileAsset` ids) and write idempotently through the canonical Asset
intake service.
Auth/scope: server-bound transport identity (zuri-cli/Edge); Tenant/Business
derived from the binding, never from the request body.
Request: `{ sourceCorrelation, fileAssetIds[], ... }` (historical shape).
Response: intake result per asset.
Errors: body-supplied identity/token/URL rejected; file scope/status
mismatch refused.
Implements: FR-069-001
Legacy: `POST /api/agent/line-asset-handoff` — **implementation removed**
(commit `fd5e19e33d`, 2026-09-25, ADR-095). Re-implementation or formal
retirement is an open owner decision (FEAT-069 §9).

### API-166
Owner: DOM-AGT
Method+path: `GET /api/line-oa/jobs/{id}/trace`
Purpose: Owner-only, read-only reconstruction of one native SERVER LINE
job's execution trace (contexts, model calls, memory/delivery evidence),
never re-executing anything.
Auth/scope: `resolveRequestViewer` + Business ownership of the job; hosted
by `DOM-LOA`'s route file, but the underlying read/playback contract
(`readExecutionTrace`, `playbackTrace`) is owned by this domain.
Request: `id` (the `LineConversationJob` id, reused as `turnId`).
Response: `{ status, executions[], modelCalls[], memoryWrites[],
deliveries[], reasons[] }` (see `execution-trace.js` `playbackTrace`).
Errors: `401`/`403`/`404` per viewer/ownership; `503 TRACE_UNAVAILABLE` on
an unexpected read failure.
Implements: FR-068-002
Legacy: same route path; unchanged by ADR-110.

### API-171
Owner: DOM-AGT
Method+path: in-process library call (`createLineBindingStatusReaderFromEnv`,
`readLineBindingStatusLabel`), consumed by `DOM-LOA`'s account service —
not an HTTP route of its own.
Purpose: Answer `ACTIVE` / `NOT_ACTIVE` / `NO_BINDING` / `UNKNOWN` for one
`(tenantId, businessId, code)` binding, reading only state columns through
the `zuri_line_smartgift_ro` role.
Auth/scope: same forced-RLS read role as the Phase 1 runtime; mutates
nothing.
Request: `{ tenantId, businessId, code }`.
Response: one of the four labels above.
Errors: none thrown for a normal miss — a missing/inactive row and an
unconfigured reader both resolve to a label, never an exception.
Implements: FR-064-004
Legacy: `src/modules/agent/line-binding-status.js`.

### API-167
Owner: DOM-AGT
Method+path: operator-invoked library/CLI entrypoint
(`validateGoldenQuestionCorpus`, the evaluator in `golden-evaluation.js`).
Purpose: Validate and evaluate the ≥20-question golden corpus against
injected fake ports (default) or an environment-gated real provider.
Auth/scope: operator-run, not a viewer-authenticated HTTP surface;
real-provider mode requires `ZURI_GOLDEN_PROVIDER`/`ZURI_GOLDEN_MODEL`/
`ZURI_GOLDEN_PROVIDER_API_KEY`.
Request: a golden-question corpus document.
Response: a redacted per-case report + pass/fail summary.
Errors: `GOLDEN_CORPUS_FORBIDDEN_DATA`, Zod validation failures,
`REAL_PROVIDER_ENV_REQUIRED`.
Implements: FR-065-001
Legacy: `src/modules/agent/golden-evaluation.js`.

### API-172
Owner: DOM-AGT
Method+path: operator-invoked library entrypoint
(`createCanaryPreflightPlan`, `canary-preflight.js`).
Purpose: Produce a `DRY_RUN` readiness plan checking binding identity,
provider approval and both evidence reports before any activation may run.
Auth/scope: operator-run; read-only by construction (never activates a
binding or calls LINE).
Request: `{ expected, binding, provider, goldenReport, isolationReport }`.
Response: `{ checks[], status }`.
Errors: none thrown for a failing check — each named check reports
`PASS`/`FAIL` with a `failureCode`.
Implements: FR-065-002
Legacy: `src/modules/agent/canary-preflight.js`.

### API-169
Owner: DOM-AGT
Method+path: operator-invoked CLI entrypoint (`line-operator.js`,
`line-binding-activation.js`).
Purpose: Activate (or roll back) exactly one LINE binding through a
versioned compare-and-swap, re-verifying evidence file hashes first, under
the dedicated `zuri_line_activation_operator` role.
Auth/scope: dedicated least-privilege database role; evidence-pinned CAS;
`mode: 'DRY_RUN'` by default.
Request: `{ scope, expectation, evidence, approval, correlationId }`.
Response: `parseLineCanaryReceipt` — `receiptState` one of `GENERATED` /
`EVIDENCE_VERIFIED` / `ACCEPTED_BY_LINE` / `DISPLAYED_UNKNOWN` /
`READ_UNKNOWN`.
Errors: `LINE_ACTIVATION_EVIDENCE_PATH_REQUIRED`,
`LINE_ACTIVATION_EVIDENCE_MISMATCH`, CAS affecting zero rows.
Implements: FR-065-003
Legacy: `src/modules/agent/line-activation-contract.js`,
`src/modules/agent/line-binding-activation.js`.
