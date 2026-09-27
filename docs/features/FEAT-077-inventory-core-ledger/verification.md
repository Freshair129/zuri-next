# Verification — FEAT-077

### TC-077-001 — Catalogue identity and cross-Business refusal
Verifies: FR-077-001, AC-077-001-01, AC-077-001-02 ·
Test: `apps/server/tests/integration/fr154-inventory-catalog.test.js`, `apps/server/tests/e2e/fr154-inventory-dashboard.spec.js`, `apps/server/tests/unit/inventory-domain.test.js`

### TC-077-002 — Ledger append-only, FEFO, over-issue refusal
Verifies: FR-077-002, AC-077-002-01, AC-077-002-02, AC-077-002-03, AC-077-002-04 ·
Test: `apps/server/tests/integration/fr155-inventory-stock.test.js`, `apps/server/tests/unit/inventory-domain.test.js`

### TC-077-003 — Recipe explosion and atomic build shortage handling
Verifies: FR-077-003, AC-077-003-01, AC-077-003-02, AC-077-003-03 ·
Test: `apps/server/tests/integration/fr156-inventory-recipe.test.js`, `apps/server/tests/unit/inventory-domain.test.js`
