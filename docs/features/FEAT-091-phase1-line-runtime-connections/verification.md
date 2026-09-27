# Verification — FEAT-091

### TC-091-001 — Provider catalog and port
Verifies: FR-091-001, FR-091-002, NFR-091-001, AC-091-001-01, AC-091-001-02, AC-091-002-01 · Test: apps/server/tests/unit/fr048-provider-catalog.test.js, apps/server/tests/unit/model-provider-port.test.js, apps/server/tests/unit/model-provider-trace.test.js

### TC-091-002 — Connection selection and secret resolution
Verifies: FR-091-003, FR-091-004, AC-091-003-01, AC-091-004-01, AC-091-004-02 · Test: apps/server/tests/unit/fr079-runtime-cutover.test.js, apps/server/tests/unit/fr079-credential-vault.test.js, apps/server/tests/unit/fr079-schema-contract.test.js

### TC-091-003 — Runtime selection order
Verifies: FR-091-005, AC-091-005-01, AC-091-005-02 · Test: apps/server/tests/unit/business-model-credential-resolution.test.js, apps/server/tests/unit/phase1-business-agent-runtime.test.js

### TC-091-004 — Integrations management and health
Verifies: FR-091-006, FR-091-007, NFR-091-002, AC-091-006-01, AC-091-006-02, AC-091-007-01 · Test: apps/server/tests/unit/fr080-integration-management.test.js, apps/server/tests/unit/connection-health.test.js, apps/server/tests/e2e/fr080-integration-scope-switch.spec.js
