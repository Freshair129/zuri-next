# Verification — FEAT-064

### TC-064-001 — Tenant-isolated business-knowledge query shape
Verifies: FR-064-002, AC-064-002-01, AC-064-002-02 · Test: `apps/server/tests/unit/postgres-business-knowledge.test.js`, `apps/server/tests/unit/supabase-production-isolation.test.js`

### TC-064-002 — Binding resolver rejects a bad bearer/destination and forces the read role
Verifies: FR-064-003, AC-064-003-01, AC-064-003-02, AC-064-003-03 · Test: `apps/server/tests/unit/line-binding-resolver.test.js`, `apps/server/tests/unit/line-channel-binding.test.js`, `apps/server/tests/unit/line-webhook-scope-fail-closed.test.js`

### TC-064-003 — Binding status read: four labels, no mutation
Verifies: FR-064-004, AC-064-004-01, AC-064-004-02, AC-064-004-03 · Test: `apps/server/tests/unit/line-binding-status.test.js`, `apps/server/tests/integration/fr146-line-oa-account.test.js`
