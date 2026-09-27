# Verification — FEAT-051

### TC-051-001 — Session timeout bounds and default
Verifies: FR-051-001, AC-051-001-01, AC-051-001-02
Test: apps/server/tests/unit/line-oa-account-domain.test.js, apps/server/tests/integration/fr146-line-oa-account.test.js

### TC-051-002 — Job session-id copy and session filter
Verifies: FR-051-002, AC-051-002-01, AC-051-002-02
Test: apps/server/tests/unit/conversation-session-service.test.js, apps/server/tests/integration/server-line-jobs.test.js

### TC-051-003 — Business hours validation and out-of-hours short-circuit
Verifies: FR-051-003, AC-051-003-01, AC-051-003-02, AC-051-003-03
Test: apps/server/tests/integration/fr244-line-oa-business-hours.test.js, apps/server/tests/unit/line-oa-account-domain.test.js
