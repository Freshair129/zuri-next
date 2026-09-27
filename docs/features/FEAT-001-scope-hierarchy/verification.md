# Verification — FEAT-001

### TC-001-001 — Scope CRUD, codes and isolation
Verifies: FR-001-001, AC-001-001-01, AC-001-001-02, FR-001-002 · Test: apps/server/tests/integration/scope-and-isolation.test.js, apps/server/tests/integration/adaptive-shell.test.js

### TC-001-002 — Workspace mutation authorization
Verifies: FR-001-003, AC-001-003-01, AC-001-003-02, AC-001-003-03 · Test: apps/server/tests/integration/fr072-workspace-mutation-authorization.test.js

### TC-001-003 — Three-tier creation authority and self-service binding
Verifies: FR-001-004, FR-001-005, FR-001-006, AC-001-004-01, AC-001-005-01, AC-001-006-01 · Test: apps/server/tests/integration/fr074-scope-creation-authorization.test.js, apps/server/tests/integration/workspace-onboarding-flow.test.js

### TC-001-004 — Operator capability for installation primitives
Verifies: FR-001-007, AC-001-007-01, AC-001-007-02 · Test: apps/server/tests/integration/fr074-scope-creation-authorization.test.js, apps/server/tests/unit/viewer-authority.test.js

### TC-001-005 — Business capability writer and shell hiding
Verifies: FR-001-008, AC-001-008-01..04 · Test: apps/server/tests/integration/fr169-business-capability.test.js, apps/server/tests/unit/business-capabilities.test.js, apps/server/tests/unit/business-capability-navigation.test.js
