# Verification — FEAT-074

### TC-074-001 — Graph projection refuses live facts and stays tenant-scoped
Verifies: FR-074-001, AC-074-001-01, AC-074-001-02, AC-074-001-03 ·
Test: apps/server/tests/integration/knowledge-project.test.js,
apps/server/tests/integration/knowledge-query.test.js,
apps/server/tests/integration/smartgift-webhook-e2e.test.js

### TC-074-002 — Business-knowledge packet verifies sensitivity rather than asserting it
Verifies: FR-074-002, AC-074-002-01, AC-074-002-02, AC-074-002-03 ·
Test: apps/server/tests/unit/business-knowledge-contract.test.js,
apps/server/tests/unit/supabase-business-knowledge.test.js,
apps/server/tests/unit/phase1-business-agent-runtime.test.js

### TC-074-003 — Shipping rate card (declared only — no test exists)
Verifies: FR-074-003 · Test: none — FR-074-003 is declared, not built; no
`knowledge_type` discriminator, migration or test exists.
