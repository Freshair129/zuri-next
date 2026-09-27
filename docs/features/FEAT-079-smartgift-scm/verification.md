# Verification — FEAT-079

### TC-079-001 — Located transfer and Business-wide invariance
Verifies: FR-079-001, AC-079-001-01, AC-079-001-02 · Test: `apps/server/tests/integration/fr174-warehouse-locations.test.js`

### TC-079-002 — Landed cost rounding and single-drop default
Verifies: FR-079-002, AC-079-002-01, AC-079-002-02 · Test: `apps/server/tests/unit/inventory-costing.test.js`

### TC-079-003 — Customization irreversibility
Verifies: FR-079-003, AC-079-003-01, AC-079-003-02 · Test: `apps/server/tests/integration/fr176-customization-work-order.test.js`

### TC-079-004 — Kitting scrap allowance and FlowAccount code guard
Verifies: FR-079-004, AC-079-004-01, AC-079-004-02, AC-079-004-03 · Test: `apps/server/tests/integration/fr177-kitting-work-order.test.js`

### TC-079-005 — De-kitting preserves customer lock, writes off packaging
Verifies: FR-079-005, AC-079-005-01, AC-079-005-02 · Test: `apps/server/tests/integration/fr178-de-kitting.test.js`

### TC-079-006 — Shelf-life due vs. refused, maintenance reset
Verifies: FR-079-006, AC-079-006-01, AC-079-006-02, AC-079-006-03 · Test: `apps/server/tests/integration/fr179-shelf-life-guard.test.js`

### TC-079-007 — ATP computation and reservation lifecycle
Verifies: FR-079-007, AC-079-007-01, AC-079-007-02, AC-079-007-03 · Test: `apps/server/tests/integration/fr180-atp-reservations.test.js`

### TC-079-008 — Route thinness and action-vocabulary validation
Verifies: FR-079-008, AC-079-008-01, AC-079-008-02 · Test: `apps/server/tests/unit/scm-console-routes.test.js`, `apps/server/tests/integration/fr182-scm-console-actions.test.js`

### TC-079-009 — Stocktake stale-snapshot refusal and idempotent commit
Verifies: FR-079-009, AC-079-009-01, AC-079-009-02, AC-079-009-03, AC-079-009-04 · Test: `apps/server/tests/integration/fr184-inventory-stocktake.test.js`, `apps/server/tests/unit/inventory-stocktake-domain.test.js`

### TC-079-010 — Stocktake backup/recovery manifest ordering
Verifies: FR-079-009 · Test: `apps/server/tests/integration/fr184-inventory-stocktake-backup.test.js`

### TC-079-011 — Console end-to-end stocktake flow
Verifies: FR-079-009 · Test: `apps/server/tests/e2e/fr184-stocktake.spec.js`
