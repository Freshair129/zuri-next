# Verification — FEAT-014

### TC-014-001 — Feature mutations, CAS, idempotency, audit
Verifies: FR-014-001, FR-014-002, FR-014-004, FR-014-005, AC-014-001-01..03, AC-014-002-01..03, AC-014-004-01, AC-014-005-01..03, NFR-014-001 · Test: apps/server/tests/integration/project-feature-mutations.test.js, apps/server/tests/integration/project-feature-graph.test.js, apps/server/tests/integration/api-write-csrf.test.js

### TC-014-002 — Governance snapshots
Verifies: FR-014-003, AC-014-003-01, AC-014-003-02 · Test: apps/server/tests/integration/governance-snapshot-capture.test.js, apps/server/tests/unit/governance-source-verifier.test.js

### TC-014-003 — Reads and view
Verifies: FR-014-006, AC-014-006-01, AC-014-006-02 · Test: apps/server/tests/integration/project-feature-read-routes.test.js, apps/server/tests/unit/project-feature-read-model.test.js, apps/server/tests/e2e/project-feature-view.spec.js

### TC-014-004 — Erasure and recovery
Verifies: FR-014-007, AC-014-007-01 · Test: apps/server/tests/integration/project-feature-erasure.test.js, apps/server/tests/integration/phase-b-recovery.test.js, apps/server/tests/unit/phase-b-backup.test.js

### TC-014-005 — Owner forms in the browser
Verifies: FR-014-001, FR-014-005 · Test: apps/server/tests/e2e/project-feature-mutations.spec.js, apps/server/tests/unit/project-feature-forms.test.js
