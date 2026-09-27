# Verification — FEAT-042

### TC-042-001 — Idle rule, code format and timeout bounds (pure)
Verifies: FR-042-001, FR-042-004, NFR-042-001, AC-042-001-01, AC-042-001-02, AC-042-004-01 · Test: apps/server/tests/unit/conversation-session-service.test.js

### TC-042-002 — Assignment on admission, replies, events and backfill
Verifies: FR-042-002, FR-042-003, FR-042-005, AC-042-002-01, AC-042-003-01, AC-042-005-02 · Test: apps/server/tests/integration/crm-conversation-sessions.test.js, apps/server/tests/unit/crm-conversation-sessions-migration.test.js

### TC-042-003 — Session surfaces in thread and inbox
Verifies: FR-042-006, AC-042-006-01 · Test: apps/server/tests/integration/crm-conversation-session-surfaces.test.js, apps/server/tests/unit/conversation-session-ui.test.js
