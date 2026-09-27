# Verification — FEAT-015

### TC-015-001 — Dashboard read model and UI
Verifies: FR-015-001, FR-015-002, AC-015-001-01, AC-015-001-02, AC-015-002-01 · Test: apps/server/tests/unit/projects-dashboard-read-model.test.js, apps/server/tests/unit/projects-dashboard-ui.test.js, apps/server/tests/integration/projects-dashboard.test.js

### TC-015-002 — Priority and PIC
Verifies: FR-015-003, FR-015-004, AC-015-003-01 · Test: apps/server/tests/unit/project-status-options.test.js, apps/server/tests/unit/projects-dashboard-schema-migration.test.js, apps/server/tests/integration/project-core.test.js

### TC-015-003 — Teams scope and grants-nothing
Verifies: FR-015-005, AC-015-005-01..03 · Test: apps/server/tests/integration/fr089-team-scope.test.js, apps/server/tests/unit/fr089-br018-team-grants-nothing.test.js

### TC-015-004 — Dashboard load
Verifies: NFR-015-001, AC-015-001-03 · Test: apps/server/tests/integration/projects-dashboard-stall.test.js
