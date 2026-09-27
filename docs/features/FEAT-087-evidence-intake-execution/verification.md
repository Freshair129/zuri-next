# Verification — FEAT-087

### TC-087-001 — Upload verification, hashing and private storage
Verifies: FR-087-001, AC-087-001-01, AC-087-001-02, AC-087-001-03 ·
Test: `apps/server/tests/unit/asset-evidence-storage-contract.test.js`, `apps/server/tests/unit/asset-evidence-route-schema-contract.test.js`

### TC-087-002 — Extraction candidate and independent review decision
Verifies: FR-087-002, AC-087-002-01, AC-087-002-02, AC-087-002-03 ·
Test: `apps/server/tests/unit/asset-evidence-extractor-contract.test.js`, `apps/server/tests/unit/asset-evidence-intake-service-contract.test.js`

### TC-087-003 — End-to-end evidence intake execution
Verifies: FR-087-001, FR-087-002 ·
Test: `apps/server/tests/integration/asset-evidence-intake-execution.test.js`

### TC-087-004 — Workbook/Sheet snapshot convergence
Verifies: FR-087-003, AC-087-003-01, AC-087-003-02 ·
Test: `apps/server/tests/unit/asset-management-pipeline-contract.test.js`

### TC-087-005 — Production activation contract (env/bucket/migration presence)
Verifies: FR-087-001 (NFR-087-002) ·
Test: `apps/server/tests/unit/asset-production-activation-contract.test.js`
