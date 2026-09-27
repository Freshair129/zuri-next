# Verification — FEAT-002

### TC-002-001 — Shell-mode derivation
Verifies: FR-002-001, AC-002-001-01..03 · Test: apps/server/tests/unit/shell-mode.test.js, apps/server/tests/integration/adaptive-shell.test.js

### TC-002-002 — Context bar, topbar and breadcrumb contracts
Verifies: FR-002-002, FR-002-003, FR-002-004, AC-002-002-01, AC-002-003-01, AC-002-004-01 · Test: apps/server/tests/unit/topbar-no-dropdown.test.js, apps/server/tests/unit/scope-view-context.test.js, apps/server/tests/unit/breadcrumb-switcher.test.js

### TC-002-003 — Business shell guard decisions
Verifies: FR-002-005, AC-002-005-01..03 · Test: apps/server/tests/unit/business-shell-guard.test.js, apps/server/tests/e2e/fr046-entry-contract.spec.js

### TC-002-004 — Landing page
Verifies: FR-002-006, AC-002-006-01..03 · Test: apps/server/tests/unit/fr056-landing.test.js, apps/server/tests/unit/entry-surfaces.test.js

### TC-002-005 — Hierarchical navigation
Verifies: FR-002-007, AC-002-007-01..04, NFR-002-001 · Test: apps/server/tests/unit/fr250-navigation.test.js, apps/server/tests/e2e/fr250-navigation.spec.js, apps/server/tests/e2e/navigation-reachability.spec.js
