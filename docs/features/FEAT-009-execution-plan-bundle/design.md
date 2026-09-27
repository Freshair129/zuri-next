---
id: SDD-009
title: "ExecutionPlanBundle import — design"
---

# SDD-009 — ExecutionPlanBundle import design

- **Components:** CMP-004 — `bundle-schema` (Zod mirror of `contracts/execution-plan-bundle.schema.json`), `bundle-resolver` (symbols → UUIDs in scope), `bundle-dry-run` (strategy + per-Project + dependency preview), `bundle-commit-service` (atomic mode), `bundle-receipt`; reuses CMP-020 (`dryRunPlan`/`commitPlan` with an injected `db` seam) and CMP-009 (create/update services, extended with declared `code`).
- **Data owned:** no new table. The bundle receipt reuses `PlanImportReceipt` with `stepKey = 'bundle.import.commit'` anchored on the first committed Project; full lineage lives in the `BUNDLE_IMPORTED` AuditEvent payload.
- **Contracts exposed:** API-005, API-004; normative schema `contracts/execution-plan-bundle.schema.json`.
- **Contracts consumed:** IAM viewer / API key.
- **Main sequence:** 1. viewer + scope 2. schema/semantics 3. resolve symbols 4. strategy dry run 5. per-Project dry runs 6. dependency validation 7. combined preview → (commit) 8. re-run 1–6 9. one transaction: strategy → Projects → goal links → edges → receipt + audit.
- **Failure modes:** any conflict → not committable; declared code taken → 409; transaction failure → full rollback; key reused across bundle/plan kinds → hash mismatch refusal.

## Implementation map

| Requirement | Current code (legacy repo path) |
|---|---|
| FR-009-001 | apps/server/src/modules/project-manager/import/bundle/bundle-schema.js; bundle-dry-run.js; apps/server/src/app/api/import/bundle/dry-run/route.js |
| FR-009-002 | import/bundle/bundle-resolver.js |
| FR-009-003 | import/bundle/bundle-dry-run.js; import/plan-import-service.js |
| FR-009-004 | import/bundle/bundle-commit-service.js; import/bundle/bundle-receipt.js; apps/server/src/app/api/import/bundle/commit/route.js |
