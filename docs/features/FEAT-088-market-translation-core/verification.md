# Verification — FEAT-088

### TC-088-001 — Translation + persistence idempotency
Verifies: FR-088-001, AC-088-001-01, AC-088-001-02, AC-088-001-03 ·
Test: `apps/server/tests/unit/market-intelligence/translate-raw-record.test.js`,
`apps/server/tests/unit/market-intelligence/market-observation-service.test.js`,
`apps/server/tests/integration/market-intelligence-persistence.test.js`

### TC-088-002 — Business-scoped feed and access refusal
Verifies: FR-088-002, AC-088-002-01, AC-088-002-02 ·
Test: `apps/server/tests/unit/market-intelligence/market-observations-route.test.js`,
`apps/server/tests/integration/market-intelligence-observation-feed.test.js`

### TC-088-003 — Owner-triggered translation run and audit
Verifies: FR-088-003, AC-088-003-01, AC-088-003-02, AC-088-003-03 ·
Test: `apps/server/tests/unit/market-intelligence/market-translation-run.test.js`,
`apps/server/tests/unit/market-intelligence/market-translations-route.test.js`,
`apps/server/tests/integration/market-intelligence-translation-run.test.js`
