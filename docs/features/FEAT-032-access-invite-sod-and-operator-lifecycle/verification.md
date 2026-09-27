# Verification — FEAT-032

### TC-032-001 — Access invite scope authority and session-bound acceptance
Verifies: FR-032-001, AC-032-001-01, AC-032-001-02 · Test: tests/integration/fr195-access-invite.test.js, tests/unit/workspace-invite-service.test.js

### TC-032-002 — Segregation of duties: assignment and transaction refusals
Verifies: FR-032-002, AC-032-002-01, AC-032-002-02, AC-032-002-03 · Test: tests/integration/{fr196-segregation-of-duties,fr196-sod-cannot-be-assembled,fr163-payment,fr165-goods-receipt}.test.js, tests/unit/{commerce-domain,procurement-domain}.test.js

### TC-032-003 — Operator grant expiry, renewal and use-recording
Verifies: FR-032-003, AC-032-003-01, AC-032-003-02 · Test: tests/integration/fr197-operator-grant-lifecycle.test.js, tests/unit/{audit-page,authorization-seam-routes,operator-bootstrap}.test.js

### TC-032-004 — Superadmin resolution, plugin exclusion, HR Remove amendment
Verifies: FR-032-004, AC-032-004-01, AC-032-004-02, AC-032-004-03 · Test: tests/integration/superadmin-access.test.js, tests/unit/manage-superadmin-cli.test.js
