# Verification — FEAT-017

### TC-017-001 — Project file references
Verifies: FR-017-001, AC-017-001-01, AC-017-001-02 · Test: apps/server/tests/unit/project-file-service.test.js, apps/server/tests/integration/fr072-project-file-authorization.test.js

### TC-017-002 — Managed assets, ingest and migration
Verifies: FR-017-002, FR-017-003, FR-017-007, AC-017-002-01, AC-017-003-01, AC-017-003-02, AC-017-007-01, AC-017-007-02 · Test: apps/server/tests/integration/fr045-managed-files.test.js, apps/server/tests/unit/fr045-file-asset-service.test.js, apps/server/tests/integration/fr072-files-migrate-authorization.test.js

### TC-017-003 — Path security and filesystem port
Verifies: FR-017-004, AC-017-004-01..03 · Test: apps/server/tests/unit/fr045-path-security.test.js, apps/server/tests/unit/fr045-filesystem-port.test.js

### TC-017-004 — Reconcile, cache and reveal
Verifies: FR-017-005, FR-017-006, AC-017-005-01, AC-017-005-02, AC-017-006-01, NFR-017-001 · Test: apps/server/tests/unit/fr045-reconcile-cache.test.js, apps/server/tests/unit/fr045-reveal.test.js

### TC-017-005 — Aggregation and authorization
Verifies: FR-017-008, FR-017-002, AC-017-008-01, AC-017-002-02 · Test: apps/server/tests/unit/fr045-file-manager-read-model.test.js, apps/server/tests/integration/fr072-file-asset-authorization.test.js, apps/server/tests/e2e/fr045-files.spec.js

### TC-017-006 — File Manager views
Verifies: FR-017-009, AC-017-009-01 · Test: apps/server/tests/unit/fr058-file-manager-views-model.test.js, apps/server/tests/unit/fr058-file-manager-views-ui.test.js, apps/server/tests/e2e/fr058-file-views.spec.js
