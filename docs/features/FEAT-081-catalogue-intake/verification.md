# Verification — FEAT-081

### TC-081-001 — Resolve-before-create planning and conflict detection
Verifies: FR-081-001, AC-081-001-01, AC-081-001-04 · Test: `apps/server/tests/unit/inventory-catalog-intake.test.js`

### TC-081-002 — Idempotent preview/commit and stale-plan refusal
Verifies: FR-081-001, AC-081-001-02, AC-081-001-03 · Test: `apps/server/tests/integration/fr208-inventory-catalog-intake.test.js`, `apps/server/tests/integration/fr208-inventory-catalog-intake-rollback.test.js`

### TC-081-003 — Excel conversion, per-row INVALID, contract-shape refusal
Verifies: FR-081-002, AC-081-002-01, AC-081-002-02, AC-081-002-03 · Test: `apps/server/tests/unit/inventory-catalog-workbook.test.js`, `apps/server/tests/unit/inventory-catalog-intake-page.test.js`

### TC-081-004 — LINE #sku parsing, authority fall-through, confirm/cancel ownership
Verifies: FR-081-003, AC-081-003-01, AC-081-003-02, AC-081-003-03, AC-081-003-04 · Test: `apps/server/tests/unit/inventory-catalog-line-command.test.js`, `apps/server/tests/unit/agent-line-catalog-command.test.js`, `apps/server/tests/integration/fr210-line-catalog-command.test.js`

### TC-081-005 — Console Import tab end-to-end
Verifies: FR-081-002 · Test: `apps/server/tests/e2e/fr209-catalog-intake.spec.js`
