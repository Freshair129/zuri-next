# Verification — FEAT-048

### TC-048-001 — Account creation, scope derivation and refusal shape
Verifies: FR-048-001, AC-048-001-01, AC-048-001-02
Test: apps/server/tests/unit/line-oa-account-routes.test.js, apps/server/tests/integration/fr146-line-oa-account.test.js

### TC-048-002 — Status machine and derived LIVE
Verifies: FR-048-002, AC-048-002-01, AC-048-002-02
Test: apps/server/tests/unit/line-oa-account-domain.test.js, apps/server/tests/integration/fr146-line-oa-account.test.js

### TC-048-003 — Transport mode and action vocabulary
Verifies: FR-048-003, AC-048-003-01, AC-048-003-02
Test: apps/server/tests/unit/line-oa-account-schema-contract.test.js

### TC-048-004 — Default exclusivity and version compare-and-swap
Verifies: FR-048-004, AC-048-004-01, AC-048-004-02
Test: apps/server/tests/unit/line-oa-account-domain.test.js, apps/server/tests/unit/line-oa-account-routes.test.js
