# Verification — FEAT-072

### TC-072-001 — Stage catalog, run identity and quarantine on the real database
Verifies: FR-072-001, AC-072-001-01, AC-072-001-02, AC-072-001-03,
AC-072-001-04 · Test: apps/server/tests/integration/fr109-ingestion-run-identity.test.js,
apps/server/tests/integration/fr119-knowledge-ingestion-quarantine.test.js,
apps/server/tests/unit/platform/knowledge-ingestion-catalog.test.js

### TC-072-002 — External-tier reporter, run close and live cross-repo evidence pull
Verifies: FR-072-002, AC-072-002-01, AC-072-002-02, AC-072-002-03,
AC-072-002-04 · Test: apps/server/tests/integration/fr110-knowledge-reporter-receiver.test.js,
apps/server/tests/integration/fr110-knowledge-reporter-routes.test.js,
apps/server/tests/integration/fr110-knowledge-evidence-chain.test.js,
apps/server/tests/integration/fr110-knowledge-evidence-importer.test.js

### TC-072-003 — Sensitivity lattice, no-default policy fields and re-validated gate
Verifies: FR-072-003, AC-072-003-01, AC-072-003-02, AC-072-003-03,
AC-072-003-04 · Test: apps/server/tests/unit/knowledge-classification.test.js
(24 tests)

### TC-072-004 — Snapshot contract, atomic publication and receipt-gated finish
Verifies: FR-072-004, AC-072-004-01, AC-072-004-02, AC-072-004-03,
AC-072-004-04 · Test: apps/server/tests/unit/knowledge-published-snapshot-contract.test.js,
apps/server/tests/acceptance/genesisrag17-e2e.test.js,
apps/server/tests/integration/genesisrag17-tier1.test.js

### TC-072-005 — Isolated end-to-end acceptance (fixed corpus thresholds)
Verifies: FR-072-001, FR-072-004 · Test:
apps/server/tests/acceptance/genesisrag17-e2e.test.js,
apps/server/tests/unit/ki17-acceptance-harness.test.js — Recall@5 ≥ .80, MRR ≥ .65,
citation correctness 1.00, cross-tenant leakage 0 (test-corpus results, not a
production quality claim, per ADR-068).
