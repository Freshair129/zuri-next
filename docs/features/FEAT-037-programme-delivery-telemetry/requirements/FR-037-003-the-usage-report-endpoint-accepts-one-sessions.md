---
id: FR-037-003
title: "The usage-report endpoint accepts one session's usage under a deployment bearer"
delivery: live
legacy: [FR-218]
relations:
  specified_by: [SDD-037]
  decided_by: [ADR-034]
---

# FR-037-003 — The usage-report endpoint accepts one session's usage under a deployment bearer

`POST /api/platform/programme-usage-reports` SHALL let an agent without
local logs report one session's usage for one programme task, authenticated
by the deployment bearer `ZURI_PROGRAMME_USAGE_TOKEN` (≥32 characters,
constant-time compare). A report SHALL be stored once per `(source,
sessionId)`: an identical replay SHALL be idempotent; a differing payload
for the same key SHALL be refused `409`; an unknown task id or invalid body
SHALL be refused by name; a missing/wrong bearer SHALL answer `401` without
reading the body. `/control/roadmap` SHALL read reports and merge them with
the meter's figures on the server, skipping any report the meter already
counted.

## Acceptance criteria

- AC-037-003-01 — Given a report already stored for `(source, sessionId)`, when the identical payload is submitted again, then it is accepted as a no-op replay.
- AC-037-003-02 — Given a request with no bearer token, when it is submitted, then it is refused `401` without the body ever being parsed.

**Amendment (ADR-095, 2026-09-24):** this endpoint previously also accepted
an active `HarnessCredential` (identity-side pairing, `legacy:FR-221`),
attributing a report to a person/device/lane. That acceptance branch is
**retired** along with the harness pairing surfaces; the deployment-bearer
path described above is unaffected and remains the endpoint's sole
authentication mode today.

## Implementation

- `apps/server/src/app/api/platform/{programme-usage-reports/route.js,task-usage-ledger/route.js}`, `apps/server/src/modules/platform-control/application/{programme-usage-reports.js,task-usage-ledger.js}`

## Verification

- TC-037-003 — Usage-report endpoint idempotency and auth (see [verification.md](../verification.md))
