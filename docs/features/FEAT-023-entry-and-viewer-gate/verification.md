# Verification — FEAT-023

### TC-023-001 — Viewer gate resolves role/visibility/DEV correctly
Verifies: FR-023-001, AC-023-001-01, AC-023-001-02, AC-023-001-03 · Test: tests/unit/viewer-gate.test.js, tests/unit/fr061-per-business-domain-visibility.test.js

### TC-023-002 — Entry routing shows only viewer-visible Businesses
Verifies: FR-023-002, AC-023-002-02, AC-023-002-03 · Test: tests/e2e/fr044-entry-routing.spec.js, tests/unit/business-routing.test.js, tests/unit/entry-routing-boundary.test.js

### TC-023-003 — API/UI entry contract stays in sync
Verifies: FR-023-001, FR-023-002 · Test: tests/e2e/fr046-entry-contract.spec.js, tests/unit/fr046-api-ui-contract.test.js, tests/unit/fr046-auth-route.test.js
