# Verification — FEAT-083

### TC-083-001 — Order lifecycle, Conversation-forced origin, line locking
Verifies: FR-083-001, AC-083-001-01, AC-083-001-02, AC-083-001-03 ·
Test: `apps/server/tests/integration/fr166-sales-order.test.js`

### TC-083-002 — Fulfilment stock issue, shortage and SERIAL refusal
Verifies: FR-083-002, AC-083-002-01, AC-083-002-02, AC-083-002-03 ·
Test: `apps/server/tests/integration/fr166-sales-order.test.js`

### TC-083-003 — Payment record/verify/reject and two-ladder authority
Verifies: FR-083-003, AC-083-003-01, AC-083-003-02, AC-083-003-03, AC-083-003-04 ·
Test: `apps/server/tests/integration/fr163-payment.test.js`

### TC-083-004 — Revenue by origin/day, verified-only
Verifies: FR-083-004, AC-083-004-01, AC-083-004-02 ·
Test: `apps/server/tests/integration/fr163-payment.test.js`, `apps/server/tests/unit/commerce-domain.test.js`

### TC-083-005 — Route wiring and calculators (unit)
Verifies: FR-083-001, FR-083-003 · Test: `apps/server/tests/unit/commerce-routes.test.js`, `apps/server/tests/unit/commerce-domain.test.js`

### TC-083-006 — Console end-to-end order/payment flow
Verifies: FR-083-001, FR-083-003 · Test: `apps/server/tests/e2e/fr166-commerce-orders.spec.js`
