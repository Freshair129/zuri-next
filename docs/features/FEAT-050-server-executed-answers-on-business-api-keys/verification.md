# Verification — FEAT-050

### TC-050-001 — Vocabulary retirement
Verifies: FR-050-001, AC-050-001-01, AC-050-001-02
Test: apps/server/tests/unit/line-oa-account-schema-contract.test.js, apps/server/tests/integration/fr149-line-server-configuration.test.js

### TC-050-002 — Real-model-only answer path
Verifies: FR-050-002, AC-050-002-01, AC-050-002-02
Test: apps/server/tests/unit/server-line-answer.test.js, apps/server/tests/unit/business-model-credential-resolution.test.js

### TC-050-003 — Readiness read and shared readiness function
Verifies: FR-050-003, AC-050-003-01, AC-050-003-02
Test: apps/server/tests/unit/line-oa-readiness-journey.test.js, apps/server/tests/unit/line-oa-model-key-card-render.test.js, apps/server/tests/integration/fr266-model-provider-credential.test.js

### TC-050-004 — Runtime-cohort snapshot and claim boundary
Verifies: FR-050-004, AC-050-004-01, AC-050-004-02
Test: apps/server/tests/integration/conversation-runtime-vertical-slice.test.js
