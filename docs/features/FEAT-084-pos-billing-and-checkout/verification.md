# Verification — FEAT-084

### TC-084-001 — Atomic checkout, rollback and change calculation
Verifies: FR-084-001, AC-084-001-01, AC-084-001-02, AC-084-001-03, AC-084-001-04 ·
Test: `apps/server/tests/integration/fr183-pos.test.js`

### TC-084-002 — Billing config, preview non-persistence, issuance idempotency
Verifies: FR-084-003, FR-084-004, FR-084-005, AC-084-004-01, AC-084-005-01, AC-084-005-02, AC-084-005-03, AC-084-005-04 ·
Test: `apps/server/tests/integration/fr186-billing.test.js`

### TC-084-003 — Domain calculators (unit)
Verifies: FR-084-001, FR-084-005 · Test: `apps/server/tests/unit/commerce-billing-domain.test.js`

### TC-084-004 — Console end-to-end billing/POS flow
Verifies: FR-084-001, FR-084-005 · Test: `apps/server/tests/e2e/fr186-billing-pos.spec.js`
