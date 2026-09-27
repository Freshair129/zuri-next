# Verification — FEAT-029

### TC-029-001 — Canonical principal resolution and revocation
Verifies: FR-029-001, AC-029-001-01, AC-029-001-02 · Test: tests/unit/canonical-iam-migration.test.js, tests/unit/canonical-iam-runtime-role-cutover.test.js, tests/integration/iam-authorization.test.js

### TC-029-002 — Session lifecycle, MFA and passkey step-up
Verifies: FR-029-002, AC-029-002-01, AC-029-002-02, AC-029-002-03 · Test: tests/integration/{mfa-totp-lifecycle,passkey-lifecycle}.test.js, tests/unit/identity/{mfa-secret-seal,session-assurance,totp,webauthn,webauthn-cbor}.test.js, tests/unit/identity/seal-mfa-factor-secrets-cli.test.js

### TC-029-003 — Shared policy enforcement over web/agent/tool paths
Verifies: FR-029-003, AC-029-003-01, AC-029-003-02 · Test: tests/integration/{agent-action-gate,agent-context,agent-multi-principal,agent-request-envelope,agent-tools}.test.js, tests/unit/{authorization-context,identity/agent-tool-authorizer}.test.js

### TC-029-004 — LINE identity resolution primitive
Verifies: FR-029-004, AC-029-004-01, AC-029-004-02, AC-029-004-03 · Test: tests/integration/identity-resolve.test.js

### TC-029-005 — Account linking, staff/customer classification and PDPA erasure
Verifies: FR-029-005, AC-029-005-01, AC-029-005-02, AC-029-005-03 · Test: tests/integration/{identity-link,identity-classify,crm-customer-erasure,phase-b-identity-erasure}.test.js, tests/unit/customer-erasure-confirmation.test.js
