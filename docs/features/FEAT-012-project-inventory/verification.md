# Verification — FEAT-012

### TC-012-001 — Inventory read model
Verifies: FR-012-001, FR-012-002, AC-012-001-01..03, AC-012-002-01 · Test: apps/server/tests/unit/project-inventory-read-model.test.js, apps/server/tests/integration/project-inventory.test.js

### TC-012-002 — Inventory UI and isolation end to end
Verifies: FR-012-002, AC-012-002-02 · Test: apps/server/tests/e2e/fr077-project-inventory.spec.js, apps/server/tests/unit/project-inventory-ui.test.js

### TC-012-003 — Inventory under load
Verifies: NFR-012-001 · Test: apps/server/tests/integration/project-inventory-stall.test.js
