# Verification — FEAT-036

### TC-036-001 — Operator-only admission and read-only plan snapshot
Verifies: FR-036-001, AC-036-001-01, AC-036-001-02 · Test: tests/e2e/smoke.spec.js, tests/integration/adaptive-shell.test.js, tests/unit/{platform-control-guard,platform-control-route-contract}.test.js

### TC-036-002 — Domain map is a pure projection of the FR-022-001, FR-022-002, FR-022-003 snapshot
Verifies: FR-036-002, AC-036-002-01 · Test: tests/e2e/fr211-control-domain-map.spec.js, tests/unit/platform-control-domain-map.test.js

### TC-036-003 — Member view redaction and window-close 404
Verifies: FR-036-003, AC-036-003-01, AC-036-003-02 · Test: tests/unit/programme-member-view.test.js, tests/e2e/fr241-roadmap-member-view.spec.js, tests/unit/{program-roadmap-mobile,sign-out}.test.js
