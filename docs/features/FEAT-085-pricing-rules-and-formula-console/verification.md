# Verification — FEAT-085

### TC-085-001 — Rule-set lifecycle, revision CAS, cyclic-dependency rejection
Verifies: FR-085-001, AC-085-001-01, AC-085-001-02, AC-085-001-03, AC-085-001-05 ·
Test: `apps/server/tests/integration/fr253-pricing-rules.test.js`

### TC-085-002 — Deterministic evaluation and lineage pinning
Verifies: FR-085-002, AC-085-002-01, AC-085-002-02, AC-085-002-03 ·
Test: `apps/server/tests/integration/fr253-pricing-rules.test.js`, `apps/server/tests/unit/fr253-pricing-routes.test.js`

### TC-085-003 — Scoped catalog admission and fail-closed revocation
Verifies: FR-085-003, AC-085-003-01, AC-085-003-03 ·
Test: `apps/server/tests/integration/fr253-pricing-catalog.test.js`

### TC-085-004 — Console end-to-end pricing-rules flow
Verifies: FR-085-001, FR-085-002 · Test: `apps/server/tests/e2e/fr253-pricing-rules.spec.js`
