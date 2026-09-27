---
id: SDD-022
title: "Product readiness dashboard — design"
---

# SDD-022 — Product readiness dashboard design

- **Components:** CMP-021 (`getProductReadinessSnapshot`, `getProductReadinessDomain`, `resolveProductReadinessDecision`, `requireProductReadinessViewer`), UI `ProductReadinessDashboard`; projection generator `scripts/domain-state.mjs` (`PROGRESS_METHODOLOGY`) writing `runtime/domain-state.json`.
- **Data owned:** none at runtime (a committed JSON projection).
- **Contracts consumed:** IAM viewer (`visibleDomains`), domain visibility predicate `isDomainVisible`.

## Implementation map

| Requirement | Current code (legacy repo path) |
|---|---|
| FR-022-001/002 | apps/server/scripts/domain-state.mjs; apps/server/runtime/domain-state.json; apps/server/src/modules/project-manager/application/product-readiness-read-model.js |
| FR-022-003 | apps/server/src/modules/project-manager/application/product-readiness-access.js; apps/server/src/app/(pm)/platform/product-readiness/page.jsx; apps/server/src/app/(pm)/platform/product-readiness/[domain]/page.jsx; components/ProductReadinessDashboard.jsx |
