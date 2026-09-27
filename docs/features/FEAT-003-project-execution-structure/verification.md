# Verification — FEAT-003

### TC-003-001 — Core model CRUD and invariants
Verifies: FR-003-001, FR-003-004, FR-003-005, FR-003-006, FR-003-007, AC-003-001-01, AC-003-004-01, AC-003-005-01 · Test: apps/server/tests/integration/project-core.test.js

### TC-003-002 — Project list contract
Verifies: FR-003-002, AC-003-002-01..03 · Test: apps/server/tests/integration/project-list-contract.test.js, apps/server/tests/unit/project-list-contract.test.js

### TC-003-003 — Business ownership binding
Verifies: FR-003-003, AC-003-003-01..03 · Test: apps/server/tests/integration/project-business-binding.test.js

### TC-003-004 — Work listing scope
Verifies: FR-003-006, AC-003-006-01, AC-003-006-03 · Test: apps/server/tests/integration/work-listing-scope.test.js, apps/server/tests/unit/global-view-scope-contract.test.js

### TC-003-005 — Dependencies
Verifies: FR-003-008, AC-003-008-01..03 · Test: apps/server/tests/unit/project-dependency-service.test.js, apps/server/tests/integration/fr072-dependency-authorization.test.js

### TC-003-006 — Governing-Business write authorization
Verifies: FR-003-009, AC-003-009-01..03, NFR-003-001 · Test: apps/server/tests/integration/fr072-project-service-authorization.test.js, apps/server/tests/integration/fr072-work-service-authorization.test.js, apps/server/tests/integration/fr072-refusal-disclosure.test.js

### TC-003-007 — Milestone/gate authorization and route seams
Verifies: FR-003-007, FR-003-009 · Test: apps/server/tests/integration/fr072-milestone-gate-authorization.test.js, apps/server/tests/unit/authorization-seam-routes.test.js, apps/server/tests/unit/authorization-seam-list-routes.test.js
