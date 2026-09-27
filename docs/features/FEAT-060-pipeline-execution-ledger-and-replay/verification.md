# Verification — FEAT-060

### TC-060-001 — Run creation, idempotency and per-definition catalog
Verifies: FR-060-001, AC-060-001-01, AC-060-001-02, AC-060-001-03 · Test: apps/server/tests/unit/platform/pipeline-tracking-service.test.js, apps/server/tests/unit/platform/pipeline-tracking-migration.test.js, apps/server/tests/unit/pipeline-tracking-route.test.js

### TC-060-002 — Event recording, staleness and redacted error references
Verifies: FR-060-002, AC-060-002-01, AC-060-002-02, AC-060-002-03 · Test: apps/server/tests/integration/fr071-pipeline-step-count-aggregation.test.js, apps/server/tests/unit/platform/pipeline-tracking-contract.test.js

### TC-060-003 — Scope-filtered monitor read
Verifies: FR-060-003, AC-060-003-01, AC-060-003-02 · Test: apps/server/tests/unit/platform/pipeline-tracking-service.test.js, apps/server/tests/unit/data-pipeline-map.test.js

### TC-060-004 — Replay lineage and refusal rules
Verifies: FR-060-004, AC-060-004-01, AC-060-004-02 · Test: apps/server/tests/unit/platform/pipeline-tracking-service.test.js, apps/server/tests/e2e/fr213-data-pipeline-map.spec.js

### TC-060-005 — MCP worker bridge scope resolution and evidence-only bound
Verifies: FR-060-005, AC-060-005-01, AC-060-005-02, AC-060-005-03 · Test: apps/server/tests/unit/pipeline-mcp-transport.test.js
