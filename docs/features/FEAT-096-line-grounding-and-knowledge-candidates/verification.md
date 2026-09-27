# Verification — FEAT-096

### TC-096-001 — LINE answer grounding mode: default, publisher control, mode-gated fallback, no-evidence gate
Verifies: FR-096-001, AC-096-001-01..06 · Test: `apps/server/tests/integration/fr235-line-oa-knowledge-grounding-control.test.js`, `apps/server/tests/unit/line-knowledge-grounding.test.js`, `apps/server/tests/unit/grounded-business-answer.test.js`, `apps/server/tests/integration/line-gks-grounding.test.js`, `apps/server/tests/integration/server-line-trace.test.js`

### TC-096-002 — Knowledge candidate lifecycle: enablement gate, consent, Zero-PII, decision and admission
Verifies: FR-096-002, AC-096-002-01..06 · Test: `apps/server/tests/integration/fr236-knowledge-candidate.test.js`, `apps/server/tests/integration/fr236-stage5-zero-pii-agreement.test.js`, `apps/server/tests/integration/fr236-knowledge-candidates-business-toggle.test.js`, `apps/server/tests/unit/knowledge-candidate-zero-pii.test.js`, `apps/server/tests/unit/business-knowledge-candidates.test.js`, `apps/server/tests/unit/conversation-consent-reader.test.js`

### TC-096-003 — Knowledge gap report: per-Business aggregation, locator-only, cross-Business isolation
Verifies: FR-096-003, AC-096-003-01..03 · Test: `apps/server/tests/integration/fr237-knowledge-gap-report.test.js`, `apps/server/tests/unit/knowledge-gap-report-service.test.js`

### TC-096-004 — LINE Studio description admission and withdrawal, best-effort, idempotent
Verifies: FR-096-004, AC-096-004-01..04 · Test: `apps/server/tests/integration/fr238-line-studio-description-admission.test.js`, `apps/server/tests/unit/line-oa-studio-description-admission.test.js`
