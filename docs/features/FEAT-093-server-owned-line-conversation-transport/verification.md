# Verification — FEAT-093

### TC-093-001 — Account-scoped conversations
Verifies: FR-093-001, FR-093-002, AC-093-001-01, AC-093-001-02, AC-093-002-01 · Test: apps/server/tests/integration/line-account-isolation.test.js, apps/server/tests/unit/conversation-channel-account-migration.test.js, apps/server/tests/integration/identity-resolve.test.js

### TC-093-002 — Evidence and messaging port
Verifies: FR-093-003, FR-093-004, AC-093-003-01, AC-093-004-01 · Test: apps/server/tests/unit/platform/line-oa-webhook.test.js, apps/server/tests/unit/platform/server-line-transport.test.js

### TC-093-003 — Webhook ingress and after-ack admission
Verifies: FR-093-005, FR-093-006, NFR-093-001, AC-093-005-01, AC-093-006-01, AC-093-006-02 · Test: apps/server/tests/integration/server-line-webhook.test.js, apps/server/tests/unit/line-admission-after-ack.test.js

### TC-093-004 — Reconciler
Verifies: FR-093-007, AC-093-005-02, AC-093-007-01 · Test: apps/server/tests/integration/line-admission-reconciler.test.js

### TC-093-005 — Job ledger, fencing, send outcomes and cadence
Verifies: FR-093-008, FR-093-009, FR-093-010, NFR-093-002, AC-093-008-01, AC-093-008-02, AC-093-009-01, AC-093-009-02, AC-093-010-01, AC-093-010-02 · Test: apps/server/tests/integration/server-line-jobs.test.js, apps/server/tests/unit/server-line-worker-cadence.test.js, apps/server/tests/integration/conversation-runtime-vertical-slice.test.js

### TC-093-006 — Failure visibility
Verifies: FR-093-011, AC-093-011-01 · Test: apps/server/tests/unit/line-job-failures.test.js, apps/server/tests/unit/line-job-failures-route.test.js

### TC-093-007 — Server answer adapter
Verifies: FR-093-012, AC-093-012-01, AC-093-012-02, AC-093-012-03 · Test: apps/server/tests/unit/server-line-answer.test.js, apps/server/tests/unit/grounded-business-answer.test.js
