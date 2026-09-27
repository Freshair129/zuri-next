# Verification — FEAT-082

### TC-082-001 — Purchase order lifecycle and supplier authority
Verifies: FR-082-001, AC-082-001-01, AC-082-001-02, AC-082-001-04 · Test: `apps/server/tests/integration/fr164-procurement.test.js`

### TC-082-002 — Cancel refused once a receipt exists
Verifies: FR-082-001, AC-082-001-03 · Test: `apps/server/tests/integration/fr164-procurement.test.js`

### TC-082-003 — Purchase order calculators and status machine (unit)
Verifies: FR-082-001 · Test: `apps/server/tests/unit/procurement-domain.test.js`

### TC-082-004 — Purchase order and supplier route wiring (unit)
Verifies: FR-082-001 · Test: `apps/server/tests/unit/procurement-routes.test.js`

### TC-082-005 — Goods receipt posting, ledger call and completion
Verifies: FR-082-002, AC-082-002-01, AC-082-002-03 · Test: `apps/server/tests/integration/fr165-goods-receipt.test.js`

### TC-082-006 — Receipt requires Inventory authority for counted lines
Verifies: FR-082-002, AC-082-002-02 · Test: `apps/server/tests/integration/fr165-goods-receipt.test.js`

### TC-082-007 — Procurement end-to-end console flow
Verifies: FR-082-001, FR-082-002 · Test: `apps/server/tests/e2e/fr164-procurement.spec.js`

### TC-082-008 — Receipt workstation browser flow (intake, pagination, stale-response isolation)
Verifies: FR-082-002 · Test: `apps/server/tests/e2e/fr165-receipt-workstation.spec.js`
