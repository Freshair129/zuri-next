# Verification — FEAT-094

### TC-094-001 — Vault stores and lifecycle
Verifies: FR-094-001, FR-094-002, FR-094-003, AC-094-001-01, AC-094-001-02, AC-094-002-01, AC-094-003-01 · Test: apps/server/tests/integration/credential-vault-lifecycle.test.js, apps/server/tests/unit/integration/envelope-secret-store.test.js, apps/server/tests/unit/integration/dispatching-secret-manager.test.js

### TC-094-002 — Step-up gate and rate limits
Verifies: FR-094-004, FR-094-005, NFR-094-001, AC-094-004-01, AC-094-004-02, AC-094-005-01 · Test: apps/server/tests/integration/credential-rate-limit.test.js, apps/server/tests/integration/credential-step-up-switch.test.js

### TC-094-003 — Channel validation, claim and credential routes
Verifies: FR-094-006, FR-094-007, NFR-094-002, AC-094-006-01, AC-094-007-01 · Test: apps/server/tests/integration/channel-account-claim.test.js, apps/server/tests/integration/line-channel-credential-routes.test.js, apps/server/tests/unit/platform/line-channel-admin-port.test.js

### TC-094-004 — Self-serve onboarding and wizard
Verifies: FR-094-008, AC-094-008-01, AC-094-008-02 · Test: apps/server/tests/integration/fr225-line-oa-self-serve-onboarding.test.js, apps/server/tests/unit/line-oa-connect-wizard-render.test.js, apps/server/tests/e2e/fr225-line-oa-self-serve-wizard.spec.js

### TC-094-005 — Webhook registration and derived quiescence
Verifies: FR-094-009, FR-094-010, NFR-094-003, AC-094-009-01, AC-094-010-01, AC-094-010-02 · Test: apps/server/tests/integration/fr227-line-oa-webhook-registration.test.js, apps/server/tests/integration/fr228-line-oa-legacy-quiescence.test.js, apps/server/tests/unit/line-oa-webhook-copy.test.js
