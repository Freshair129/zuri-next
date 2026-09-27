# Verification — FEAT-065

### TC-065-001 — Golden corpus validation, forbidden-field rejection, real-provider env gate
Verifies: FR-065-001, AC-065-001-01, AC-065-001-02, AC-065-001-03 · Test: `apps/server/tests/unit/golden-evaluation.test.js`, `apps/server/tests/unit/activation-readiness-contract.test.js`

### TC-065-002 — Canary preflight named checks and read-only guarantee
Verifies: FR-065-002, AC-065-002-01, AC-065-002-02, AC-065-002-03 · Test: `apps/server/tests/unit/line-canary-preflight.test.js`, `apps/server/tests/integration/runtime-isolation-probe.postgres.test.js`

### TC-065-003 — Activation CAS, evidence re-verification and receipt truthfulness
Verifies: FR-065-003, AC-065-003-01, AC-065-003-02, AC-065-003-03 · Test: `apps/server/tests/integration/controlled-line-activation.postgres.test.js`, `apps/server/tests/unit/line-binding-activation.test.js`, `apps/server/tests/unit/line-activation-contract.test.js`, `apps/server/tests/unit/fr055-postgres-target-guard.test.js`
