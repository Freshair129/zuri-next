# Verification — FEAT-092

### TC-092-001 — Inbox scope and thread read
Verifies: FR-092-001, FR-092-002, NFR-092-001, AC-092-001-01, AC-092-001-02, AC-092-002-01 · Test: apps/server/tests/integration/crm-conversation-inbox.test.js, apps/server/tests/unit/conversation-read-model.test.js

### TC-092-002 — Inbox UI contract
Verifies: FR-092-003, AC-092-003-01 · Test: apps/server/tests/unit/fr091-inbox-ui-contract.test.js, apps/server/tests/unit/line-crm-live-chat-render.test.js

### TC-092-003 — Reply record scope, idempotency and acceptance
Verifies: FR-092-004, FR-092-005, AC-092-004-01, AC-092-004-02, AC-092-005-01 · Test: apps/server/tests/unit/reply-record-service.test.js, apps/server/tests/integration/line-account-isolation.test.js

### TC-092-004 — Job ledger records accepted answers
Verifies: FR-092-006, AC-092-006-01, AC-092-006-02 · Test: apps/server/tests/integration/server-line-jobs.test.js

### TC-092-005 — Navigation slot
Verifies: FR-092-007, AC-092-007-01 · Test: apps/server/tests/unit/crm-group-navigation.test.js, apps/server/tests/unit/domain-navigation.test.js
