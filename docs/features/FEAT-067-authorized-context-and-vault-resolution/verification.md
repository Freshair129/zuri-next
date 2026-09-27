# Verification — FEAT-067

### TC-067-001 — API-010 resolver enforces ALLOW policy and exactly-one-scope
Verifies: FR-067-001, AC-067-001-01, AC-067-001-02 · Test: `apps/server/tests/unit/msp-vault-resolver.test.js`

### TC-067-002 — API-010 response shape validation and permission enforcement
Verifies: FR-067-001, AC-067-001-03, AC-067-001-04 · Test: `apps/server/tests/unit/msp-vault-resolver.test.js`, `apps/server/tests/integration/msp-vault-memory-port.test.js`

### TC-067-003 — Multi-principal scope isolation and stdio transport wiring
Verifies: FR-067-001 · Test: `apps/server/tests/integration/agent-multi-principal.test.js`, `apps/server/tests/unit/msp-stdio-transport.test.js`
