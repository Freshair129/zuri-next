# Verification — FEAT-089

### TC-089-001 — Strategy revision/review/decision compare-and-swap
Verifies: FR-089-001, AC-089-001-01, AC-089-001-02, AC-089-001-03 ·
Test: `apps/server/tests/integration/marketing-plan.test.js`, `apps/server/tests/unit/marketing/marketing-plan-contract.test.js`

### TC-089-002 — PM handoff generation, replay reconciliation, refusal states
Verifies: FR-089-002, AC-089-002-01, AC-089-002-02, AC-089-002-03 ·
Test: `apps/server/tests/integration/marketing-pm-handoff.test.js`

### TC-089-003 — Campaign initiative lifecycle and same-plan binding
Verifies: FR-089-003, AC-089-003-01, AC-089-003-02 ·
Test: `apps/server/tests/integration/marketing-campaign.test.js`, `apps/server/tests/integration/marketing-campaign-execution.test.js`

### TC-089-004 — Content brief/version/review/rights revocation
Verifies: FR-089-004, AC-089-004-01, AC-089-004-02 ·
Test: `apps/server/tests/integration/marketing-content.test.js`, `apps/server/tests/integration/marketing-content-references.test.js`

### TC-089-005 — Operations composed DTO and staleness surfacing
Verifies: FR-089-005, AC-089-005-01, AC-089-005-02 ·
Test: `apps/server/tests/integration/marketing-operations.test.js`, `apps/server/tests/unit/marketing/marketing-operations-service.test.js`

### TC-089-006 — Broadcast intent schema refusal and append-only revisions
Verifies: FR-089-006, AC-089-006-01, AC-089-006-02, AC-089-006-03 ·
Test: `apps/server/tests/integration/marketing-broadcast-intent.test.js`, `apps/server/tests/unit/marketing/marketing-broadcast-contract.test.js`

### TC-089-007 — Console end-to-end flows
Verifies: FR-089-001, FR-089-003, FR-089-004 ·
Test: `apps/server/tests/e2e/marketing-strategy.spec.js`, `apps/server/tests/e2e/marketing-campaigns.spec.js`, `apps/server/tests/e2e/marketing-content.spec.js`, `apps/server/tests/e2e/marketing-p5.spec.js`
