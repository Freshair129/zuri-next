# Verification — FEAT-026

### TC-026-001 — Password reset mint, redeem, session revocation
Verifies: FR-026-001, AC-026-001-01, AC-026-001-02 · Test: tests/e2e/fr104-password-reset-redemption.spec.js, tests/integration/password-reset-flow.test.js, tests/unit/{auth-service,password-reset-service,password-reset-routes}.test.js

### TC-026-002 — Operator bootstrap refuses a second attempt
Verifies: FR-026-002, AC-026-002-01, AC-026-002-02 · Test: tests/unit/{bootstrap-operator-cli,operator-bootstrap}.test.js, tests/integration/platform-grant-revoke.test.js

### TC-026-003 — Issue/list/revoke operator grants
Verifies: FR-026-002, AC-026-002-03 · Test: tests/unit/{list-operator-grants-cli,revoke-operator-grant-cli,platform-grant-migration}.test.js
