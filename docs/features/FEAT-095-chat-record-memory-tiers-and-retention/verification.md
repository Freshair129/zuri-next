# Verification — FEAT-095

### TC-095-001 — Non-text admission and events
Verifies: FR-095-001, FR-095-002, FR-095-003, AC-095-001-01, AC-095-001-02, AC-095-002-01, AC-095-002-02, AC-095-003-01 · Test: apps/server/tests/integration/line-non-text-admission.test.js, apps/server/tests/unit/crm-message-attachments-events-migration.test.js

### TC-095-002 — Retention overrides and sweep
Verifies: FR-095-004, FR-095-005, FR-095-006, NFR-095-001, AC-095-004-01, AC-095-005-01, AC-095-005-02, AC-095-006-01 · Test: apps/server/tests/integration/crm-retention-override-service.test.js, apps/server/tests/integration/crm-retention-sweep.test.js, apps/server/tests/unit/crm-retention-sweep-route.test.js

### TC-095-003 — Read models and search
Verifies: FR-095-007, FR-095-008, NFR-095-002, AC-095-007-01, AC-095-007-02, AC-095-008-01 · Test: apps/server/tests/integration/crm-conversation-search.test.js, apps/server/tests/integration/crm-conversation-inbox.test.js, apps/server/tests/unit/crm-conversation-retention-migration.test.js

### TC-095-004 — Context Composer and receipts
Verifies: FR-095-012, FR-095-013, NFR-095-003, AC-095-012-01, AC-095-012-02, AC-095-013-01 · Test: apps/server/tests/unit/context-composer.test.js, apps/server/tests/integration/execution-trace.test.js, apps/server/tests/unit/line-execution-trace.test.js

### TC-095-005 — Tier 1 erasure (partial proof of the declared FR)
Verifies: FR-095-011 (Tier 1 part only) · Test: apps/server/tests/integration/crm-customer-erasure.test.js, apps/server/tests/integration/identity-erase.test.js
