# Verification — FEAT-061

### TC-061-001 — Gate E registration refuses a non-read-only descriptor
Verifies: FR-061-001, AC-061-001-01 · Test: `apps/server/tests/integration/agent-tools.test.js`

### TC-061-002 — Context assembly, denied private recall and two-pass thread memory
Verifies: FR-061-001, AC-061-001-02, AC-061-001-03 · Test: `apps/server/tests/integration/agent-context.test.js`, `apps/server/tests/unit/agent-context-retrieval.test.js`

### TC-061-003 — Gate F step-up, denial and transactional audit
Verifies: FR-061-002, AC-061-002-01, AC-061-002-02, AC-061-002-03 · Test: `apps/server/tests/integration/agent-action-gate.test.js`

### TC-061-004 — End-to-end turn graceful degradation
Verifies: FR-061-003, AC-061-003-01, AC-061-003-02, AC-061-003-03 · Test: `apps/server/tests/integration/agent-turn.test.js`

### TC-061-005 — Tool/action authorization fails closed on scope-widening or unverified identity
Verifies: FR-061-004, AC-061-004-01, AC-061-004-02, AC-061-004-03 · Test: `apps/server/tests/unit/identity/agent-tool-authorizer.test.js`, `apps/server/tests/integration/iam-authorization.test.js`
