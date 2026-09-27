# Verification — FEAT-080

### TC-080-001 — Nature inheritance, mismatch refusal, migration backfill
Verifies: FR-080-001, AC-080-001-01, AC-080-001-02, AC-080-001-03 · Test: `apps/server/tests/integration/fr201-inventory-sku-governance.test.js`, `apps/server/tests/unit/inventory-governance.test.js`

### TC-080-002 — Variant key uniqueness and lookalike guard
Verifies: FR-080-002, AC-080-002-01, AC-080-002-03 · Test: `apps/server/tests/integration/fr201-inventory-sku-governance.test.js`, `apps/server/tests/unit/inventory-governance.test.js`

### TC-080-003 — Identifier validation, retirement, resolve-through-merge
Verifies: FR-080-003, AC-080-003-01, AC-080-003-02, AC-080-003-03 · Test: `apps/server/tests/integration/fr201-inventory-sku-governance.test.js`, `apps/server/tests/unit/inventory-sku-console.test.js`, `apps/server/tests/e2e/fr203-sku-identifiers-console.spec.js`

### TC-080-004 — Unit conversion base-quantity conversion
Verifies: FR-080-004, AC-080-004-01, AC-080-004-02 · Test: `apps/server/tests/unit/inventory-sku-console.test.js`, `apps/server/tests/integration/fr201-inventory-sku-governance.test.js`

### TC-080-005 — Lifecycle guards and merge re-pointing
Verifies: FR-080-005, AC-080-005-01, AC-080-005-02, AC-080-005-03, AC-080-005-04 · Test: `apps/server/tests/integration/fr201-inventory-sku-governance.test.js`, `apps/server/tests/unit/inventory-governance.test.js`

### TC-080-006 — Hygiene report findings
Verifies: FR-080-006, AC-080-006-01, AC-080-006-02 · Test: `apps/server/tests/unit/inventory-governance.test.js`, `apps/server/tests/unit/inventory-hygiene-page.test.js`

### TC-080-007 — Replenishment suggestion and phase-out exclusion
Verifies: FR-080-007, AC-080-007-01, AC-080-007-02 · Test: `apps/server/tests/integration/fr201-inventory-sku-governance.test.js`, `apps/server/tests/unit/inventory-governance.test.js`
