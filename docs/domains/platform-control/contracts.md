# Platform Control — contracts

Routes enumerated from `docs/domains/platform-control/CHARTER.md`'s
`owns_routes` globs and the live worktree, not only the input slice.

### API-101 — Programme usage report ingestion
Owner: DOM-PLT
`POST /api/platform/programme-usage-reports`.

Auth: deployment bearer `ZURI_PROGRAMME_USAGE_TOKEN` (≥32 chars, constant-time
compare). Body: source, session id, task, model, four token counts, request
count, time span, active minutes, optional usage-detail block. Idempotent
replay on identical `(source, sessionId)`; `409` on a differing payload for
the same key; unknown task id refused by name.

Implements: FR-037-003
Legacy: FR-218

### API-099 — Task usage export (read)
Owner: DOM-PLT
`GET /api/platform/task-usage-ledger`.

Auth: installation operator. Read-only export of the ledger the delivery
board renders from.

Implements: FR-037-001, FR-037-002, FR-037-004
Legacy: FR-216, FR-217, FR-219

### API-097 — Deduplicated error log (read + resolve)
Owner: DOM-PLT
`GET /api/platform/error-events` · `PATCH /api/platform/error-events/[id]`
(marks `resolvedAt`/`resolvedByPersonId`).

Auth: installation operator only.

Implements: FR-039-001
Legacy: FR-247

### API-100 — Route/action usage capture and read
Owner: DOM-PLT
`POST /api/platform/usage-events` (any signed-in person — usage is a fact
about whoever is using the product) · `GET /api/platform/usage-events`
(installation operator only) · `POST /api/platform/usage-events/rollup`
(deployment bearer `ZURI_USAGE_ROLLUP_TOKEN`, same shape as the CRM
retention sweep — moves rows older than 90 days into `UsageEventRollup`).

Implements: FR-039-002, FR-039-003
Legacy: FR-248, FR-249

### API-098 — Deployment liveness probe
Owner: DOM-PLT
`GET /api/health`.

Auth: none — unauthenticated, read-only, one trivial query, states and
timings only. Infrastructure, not a Business capability; polled by Docker
Compose.

Implements: none (operational infrastructure, not a declared FR)
Legacy: FR-142

## Retired (ADR-095 D1, 2026-09-24 — routes removed from the tree; `ProgrammeUsageReport` historical rows preserved)

- Harness-credential acceptance branch of `POST
  /api/platform/programme-usage-reports` (person/device/lane attribution via
  a paired `HarnessCredential`, `legacy:FR-221`) — the deployment-bearer
  branch above is unaffected and remains live.

Legacy: FR-221 (crosswalked as `retired` — see `registry/crosswalk/PLT.csv`)

## Not owned by this domain, consumed read-only

- `program-domain-map.js`'s Domain map tab reads `DOM-PRJ`'s
  `getProductReadinessSnapshot()` (FR-022-001, FR-022-002, FR-022-003) — no route of its own; it is a
  server-side projection inside the `/control/roadmap` page.
