# Verification — FEAT-044

### TC-044-001 — Contract envelope, resolution and exclusions
Verifies: FR-044-001, FR-044-002, FR-044-003, AC-044-002-01, AC-044-003-01 · Test: apps/server/tests/unit/customer-data-contract.test.js, apps/server/tests/unit/customer-profile-contract-receipt.test.js

### TC-044-002 — Target schema and batch migration
Verifies: FR-044-004, AC-044-004-01 · Test: apps/server/tests/unit/customer-profile-backfill-migration.test.js, apps/server/tests/unit/customer-profile-target-verification.test.js

### TC-044-003 — Review queue service, API and UI
Verifies: FR-044-005, NFR-044-001, AC-044-005-01..04 · Test: apps/server/tests/unit/customer-import-review-service.test.js, apps/server/tests/unit/customer-import-review-api.test.js, apps/server/tests/unit/customer-import-review-ui.test.js
