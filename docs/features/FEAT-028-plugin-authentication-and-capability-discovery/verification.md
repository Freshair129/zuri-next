# Verification — FEAT-028

### TC-028-001 — Consent gate: GET never mints, POST does
Verifies: FR-028-001, AC-028-001-01, AC-028-001-02 · Test: tests/integration/fr123-plugin-consent-gate.test.js, tests/e2e/fr123-plugin-consent.spec.js

### TC-028-002 — Replay revokes the minted session
Verifies: FR-028-001, AC-028-001-03 · Test: tests/unit/fr123-plugin-auth-service.test.js, tests/integration/fr123-plugin-auth-reaper.test.js

### TC-028-003 — Capability discovery never carries a platform grant
Verifies: FR-028-001, AC-028-001-04 · Test: tests/unit/fr123-plugin-consent.test.js, tests/unit/fr123-plugin-auth-route.test.js
