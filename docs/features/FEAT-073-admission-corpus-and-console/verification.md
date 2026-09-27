# Verification — FEAT-073

### TC-073-001 — Isolated end-to-end admission through native publication
Verifies: FR-073-001, AC-073-001-01, AC-073-001-02, AC-073-001-03,
AC-073-001-04 · Test: apps/server/tests/acceptance/knowledge-admission-native.test.js,
apps/server/tests/integration/knowledge-admission.integration.test.js,
apps/server/tests/integration/knowledge-corpus.test.js

### TC-073-002 — Admission service unit contract
Verifies: FR-073-001 · Test: apps/server/tests/unit/knowledge-admission-service.test.js,
apps/server/tests/unit/knowledge-admission-transaction.test.js,
apps/server/tests/unit/knowledge-corpus-routes.test.js

### TC-073-003 — Knowledge console — pagination, authorization and citation resolution
Verifies: FR-073-002, AC-073-002-01, AC-073-002-02, AC-073-002-03,
AC-073-002-04 · Test: apps/server/tests/e2e/fr254-knowledge-console.spec.js,
apps/server/tests/integration/fr254-knowledge-console.test.js,
apps/server/tests/integration/fr254-citation-artifact.test.js,
apps/server/tests/unit/fr254-knowledge-console-routes.test.js
