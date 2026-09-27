# Verification — FEAT-068

### TC-068-001 — Trace journal: secret rejection, idempotency, tombstone lock
Verifies: FR-068-001, AC-068-001-01, AC-068-001-02, AC-068-001-03 · Test: `apps/server/tests/integration/execution-trace.test.js`

### TC-068-002 — Playback withholds unverifiable output and honors tombstones
Verifies: FR-068-002, AC-068-002-01, AC-068-002-02 · Test: `apps/server/tests/unit/line-execution-trace.test.js`, `apps/server/tests/integration/server-line-trace.test.js`

### TC-068-003 — Owner-only trace route authorization
Verifies: FR-068-002, AC-068-002-03 · Test: `apps/server/tests/unit/line-trace-route.test.js`, `apps/server/tests/unit/line-trace-summary.test.js`

### TC-068-004 — Native SERVER memory default exclusion and admission-time opt-in
Verifies: FR-068-003, AC-068-003-01, AC-068-003-02 · Test: `apps/server/tests/unit/server-line-answer.test.js`, `apps/server/tests/integration/line-worker-memory.test.js`, `apps/server/tests/integration/memory-trace-linkage.test.js`

### TC-068-005 — Model provider trace and lineage capture
Verifies: FR-068-001, FR-068-003 · Test: `apps/server/tests/unit/model-provider-port.test.js`, `apps/server/tests/unit/model-provider-trace.test.js`, `apps/server/tests/unit/agent-runtime-lineage.test.js`
