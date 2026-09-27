# Verification — FEAT-040

### TC-040-001 — Operator-only admission, no mutation surface
Verifies: FR-040-001, AC-040-001-01, AC-040-001-02 · Test: tests/e2e/fr260-mission-control.spec.js, tests/unit/mission-control-route-contract.test.js

### TC-040-002 — PORL provenance vocabulary and never-infer-liveness rule
Verifies: FR-040-002, AC-040-002-01, AC-040-002-02 · Test: tests/unit/mission-control-read-model.test.js

### TC-040-003 — Candidate-parallel gates never imply merge approval
Verifies: FR-040-003, AC-040-003-01 · Test: tests/unit/mission-control-contract.test.js

### TC-040-004 — Member view PORL redaction
Verifies: FR-040-004, AC-040-004-01 · Test: tests/unit/programme-member-view.test.js

### TC-040-005 — Responsive, accessible evidence view
Verifies: FR-040-005, AC-040-005-01 · Test: tests/e2e/fr260-mission-control.spec.js
