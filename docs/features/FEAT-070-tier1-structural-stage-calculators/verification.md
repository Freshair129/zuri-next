# Verification — FEAT-070

### TC-070-001 — Document parsing refuses invented structure
Verifies: FR-070-001, AC-070-001-01, AC-070-001-02, AC-070-001-03,
AC-070-001-04 · Test: apps/server/tests/unit/knowledge-parsing.test.js (24 tests)

### TC-070-002 — Provenance requires ten fields and refuses unresolvable derivation
Verifies: FR-070-002, AC-070-002-01, AC-070-002-02, AC-070-002-03,
AC-070-002-04 · Test: apps/server/tests/unit/knowledge-provenance.test.js (23 tests)

### TC-070-003 — Normalization never guesses an undecidable value
Verifies: FR-070-003, AC-070-003-01, AC-070-003-02, AC-070-003-03,
AC-070-003-04 · Test: apps/server/tests/unit/knowledge-normalization.test.js (29 tests)

### TC-070-004 — Dedup identity folds the tenant in rather than checking it
Verifies: FR-070-004, AC-070-004-01, AC-070-004-02, AC-070-004-03 ·
Test: apps/server/tests/unit/knowledge-dedup.test.js (18 tests)

### TC-070-005 — Structural chunking with fallback windows
Verifies: FR-070-005, AC-070-005-01, AC-070-005-02, AC-070-005-03,
AC-070-005-04 · Test: apps/server/tests/unit/knowledge-chunking.test.js (12 tests)

### TC-070-006 — Entity candidates never carry canonical identity
Verifies: FR-070-006, AC-070-006-01, AC-070-006-02, AC-070-006-03,
AC-070-006-04 · Test: apps/server/tests/unit/knowledge-entity-extraction.test.js
(17 tests)
