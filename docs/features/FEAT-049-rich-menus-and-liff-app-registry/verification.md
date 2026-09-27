# Verification — FEAT-049

### TC-049-001 — Rich menu identity, versions and chat-bar bounds
Verifies: FR-049-001, AC-049-001-01, AC-049-001-02
Test: apps/server/tests/unit/line-oa-rich-menu-domain.test.js, apps/server/tests/integration/fr151-line-oa-rich-menu.test.js

### TC-049-002 — Freeze validation and immutability
Verifies: FR-049-002, AC-049-002-01, AC-049-002-02
Test: apps/server/tests/unit/line-oa-rich-menu-domain.test.js, apps/server/tests/unit/line-oa-rich-menu-routes.test.js

### TC-049-003 — Job queueing, fencing and lease
Verifies: FR-049-003, AC-049-003-01, AC-049-003-02
Test: apps/server/tests/integration/fr152-line-oa-rich-menu-jobs.test.js, apps/server/tests/unit/line-oa-rich-menu-jobs-routes.test.js

### TC-049-004 — Acceptance truthfulness and UNKNOWN handling
Verifies: FR-049-004, AC-049-004-01, AC-049-004-02
Test: apps/server/tests/unit/line-oa-rich-menu-publish.test.js, apps/server/tests/unit/platform/server-line-rich-menu-transport.test.js

### TC-049-005 — LIFF app lifecycle
Verifies: FR-049-005, AC-049-005-01, AC-049-005-02
Test: apps/server/tests/unit/line-oa-liff-app-domain.test.js, apps/server/tests/integration/fr153-line-oa-liff-app.test.js

### TC-049-006 — LIFF action resolution refusals
Verifies: FR-049-006, AC-049-006-01, AC-049-006-02
Test: apps/server/tests/unit/line-oa-liff-app-routes.test.js, apps/server/tests/e2e/fr151-line-oa-rich-menu-console.spec.js
