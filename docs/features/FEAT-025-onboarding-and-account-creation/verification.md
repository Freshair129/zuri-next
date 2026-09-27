# Verification — FEAT-025

### TC-025-001 — Profile-first onboarding and Waiting Room
Verifies: FR-025-001, AC-025-001-01, AC-025-001-02 · Test: tests/e2e/fr066-waiting-room.spec.js, tests/unit/{onboarding-service,waiting-room-page}.test.js

### TC-025-002 — Workspace invite acceptance and replay refusal
Verifies: FR-025-002, AC-025-002-01, AC-025-002-02 · Test: tests/unit/workspace-invite-service.test.js, tests/integration/workspace-collaboration-roster.test.js

### TC-025-003 — Self-serve signup grants nothing and refuses duplicates
Verifies: FR-025-003, AC-025-003-01, AC-025-003-02 · Test: tests/e2e/fr120-signup.spec.js, tests/unit/{fr120-signup-service,fr120-signup-route}.test.js

### TC-025-004 — Profile identity fields required at the boundary, nullable at rest
Verifies: FR-025-005, AC-025-005-01, AC-025-005-02 · Test: tests/unit/{profile-identity-fields-migration,onboarding-service}.test.js, tests/integration/workspace-onboarding-flow.test.js
