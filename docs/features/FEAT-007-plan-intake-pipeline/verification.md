# Verification — FEAT-007

### TC-007-001 — Schema and semantic validation
Verifies: FR-007-001, AC-007-001-01..03 · Test: apps/server/tests/unit/plan-schema.test.js, apps/server/tests/unit/plan-status-vocabulary.test.js

### TC-007-002 — Dry run, commit, rollback and idempotency
Verifies: FR-007-002, FR-007-003, AC-007-002-01..03, AC-007-003-01..03, NFR-007-001 · Test: apps/server/tests/integration/plan-import.test.js, apps/server/tests/integration/plan-import-scope.test.js, apps/server/tests/unit/plan-import-commit-transaction.test.js

### TC-007-003 — Import target authorization
Verifies: FR-007-004, AC-007-004-01, AC-007-004-02 · Test: apps/server/tests/integration/import-target-authorization.test.js, apps/server/tests/unit/import-authorization.test.js

### TC-007-004 — Human intake and standalone task
Verifies: FR-007-005, FR-007-006, AC-007-005-01, AC-007-005-02, AC-007-006-01, AC-007-006-02 · Test: apps/server/tests/unit/human-plan-builder.test.js, apps/server/tests/integration/plan-mode-modal-intake.test.js, apps/server/tests/integration/task-modal-intake.test.js

### TC-007-005 — Excel intake
Verifies: FR-007-007, AC-007-007-01..03 · Test: apps/server/tests/integration/xlsx-intake.test.js, apps/server/tests/unit/public-read-route-auth.test.js
