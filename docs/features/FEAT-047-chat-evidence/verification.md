# Verification — FEAT-047

### TC-047-001 — Staff reply authority, send and record
Verifies: FR-047-001, FR-047-002, NFR-047-002, AC-047-001-01, AC-047-001-02, AC-047-002-01, AC-047-002-02 · Test: apps/server/tests/integration/crm-staff-reply.test.js, apps/server/tests/unit/reply-record-service.test.js, apps/server/tests/unit/fr091-inbox-ui-contract.test.js

### TC-047-002 — Archive before tombstone, chain and crypto
Verifies: FR-047-003, FR-047-004, AC-047-003-01, AC-047-003-02, AC-047-004-01 · Test: apps/server/tests/integration/crm-chat-evidence-archive.test.js, apps/server/tests/unit/crm-chat-evidence-archive-crypto.test.js, apps/server/tests/unit/archive-storage-readiness.test.js

### TC-047-003 — Retrieval
Verifies: FR-047-005, AC-047-005-01, AC-047-005-02 · Test: apps/server/tests/integration/crm-chat-evidence-retrieval.test.js

### TC-047-004 — Legal hold and expiry
Verifies: FR-047-006, NFR-047-001, AC-047-006-01, AC-047-006-02 · Test: apps/server/tests/integration/crm-archive-legal-hold.test.js, apps/server/tests/unit/crm-legal-hold-migration.test.js
