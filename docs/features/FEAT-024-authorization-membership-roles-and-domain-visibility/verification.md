# Verification — FEAT-024

### TC-024-001 — Users & Permissions authority and read scope
Verifies: FR-024-002, FR-024-004, AC-024-002-01, AC-024-002-02, AC-024-004-01 · Test: tests/integration/fr038-business-membership-add.test.js, tests/unit/{fr036-team-authorization,fr062-permissions-read-scope,platform-users-view,profile-permission-service}.test.js

### TC-024-002 — Per-Business domain visibility, client and server
Verifies: FR-024-003, AC-024-003-01, AC-024-003-02, AC-024-003-03 · Test: tests/unit/fr061-per-business-domain-visibility.test.js, tests/integration/domain-visibility-server.test.js, tests/unit/domain-visibility-server-enforcement.test.js

### TC-024-003 — Product Owner Business-scoped binding
Verifies: FR-024-005, AC-024-005-01, AC-024-005-02 · Test: tests/unit/fr076-product-owner-business-assignment.test.js

### TC-024-004 — My Profile reads the caller's own account
Verifies: FR-024-001 · Test: tests/unit/fr046-api-ui-contract.test.js, tests/unit/business-shell-guard.test.js
Source-level checks: the profile route passes the request's own identity to the profile service, and `/profile` is routed as a Platform identity page. AC-024-001-01 (another Person's fields are never shown) needs a request-level test before it is claimed here.
