# Verification — FEAT-052

### TC-052-001 — Health route states
Verifies: FR-052-001, AC-052-001-01, AC-052-001-02
Test: apps/server/tests/unit/fr142-health-route.test.js

### TC-052-002 — Public origin resolution and fallback order
Verifies: FR-052-002, AC-052-002-01, AC-052-002-02
Test: apps/server/tests/unit/public-base-url.test.js

### TC-052-003 — Silence classification thresholds
Verifies: FR-052-003, AC-052-003-01, AC-052-003-02
Test: apps/server/tests/unit/fr190-line-transport-health.test.js

### TC-052-004 — Endpoint match classification
Verifies: FR-052-004, AC-052-004-01, AC-052-004-02
Test: apps/server/tests/unit/fr190-line-transport-health.test.js, apps/server/tests/unit/fr190-transport-health-presentation.test.js

### TC-052-005 — Non-fatal sweep on the shared worker tick
Verifies: FR-052-005, AC-052-005-01, AC-052-005-02
Test: apps/server/tests/unit/line-transport-health-schedule.test.js, apps/server/tests/unit/fr190-settings-chip-render.test.js
