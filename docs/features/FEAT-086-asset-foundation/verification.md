# Verification — FEAT-086

### TC-086-001 — Envelope validation and procurement-origin evidence gate
Verifies: FR-086-001, AC-086-001-02, AC-086-001-03 ·
Test: `apps/server/tests/unit/asset-management-contract.test.js`, `apps/server/tests/unit/asset-intake-adapters-contract.test.js`

### TC-086-002 — Domain visibility and cross-Business refusal
Verifies: FR-086-001, AC-086-001-01 ·
Test: `apps/server/tests/unit/asset-management-navigation.test.js`, `apps/server/tests/unit/asset-register-routes.test.js`

### TC-086-003 — Lot/expiry and PR/PO reference validation
Verifies: FR-086-002, AC-086-002-01 ·
Test: `apps/server/tests/unit/asset-management-schema-contract.test.js`

### TC-086-004 — Responsibility/location/allocation effective-interval history
Verifies: FR-086-003, AC-086-003-01, AC-086-003-02, AC-086-003-03 ·
Test: `apps/server/tests/unit/asset-lifecycle-service.test.js`, `apps/server/tests/unit/asset-lifecycle-routes.test.js`

### TC-086-005 — Depreciation calculator bounds and determinism
Verifies: FR-086-004, AC-086-004-01, AC-086-004-02 ·
Test: `apps/server/tests/unit/asset-depreciation.test.js`
