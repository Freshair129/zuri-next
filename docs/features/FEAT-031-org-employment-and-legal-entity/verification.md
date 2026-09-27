# Verification — FEAT-031

### TC-031-001 — Employment roster derivation and identity-module isolation
Verifies: FR-031-001, AC-031-001-01, AC-031-001-02, AC-031-001-03 · Test: tests/integration/{fr193-employment-lifecycle,fr193-employment-write-path}.test.js, tests/unit/{fr193-employment-not-authorization,people-service,people-directory}.test.js

### TC-031-002 — LegalEntity Tenant ancestry and tax branch split
Verifies: FR-031-002, AC-031-002-01, AC-031-002-02 · Test: tests/integration/fr194-legal-entity-tax-branch.test.js, tests/unit/commerce-billing-domain.test.js

### TC-031-003 — People Directory is a peer domain, distinct from Project Team
Verifies: FR-031-003, AC-031-003-01, AC-031-003-02 · Test: tests/unit/people-directory.test.js
