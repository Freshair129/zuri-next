---
id: SDD-018
title: "Business Home dashboard — design"
---

# SDD-018 — Business Home dashboard design

- **Components:** CMP-006 (`buildBusinessHomeReadModel`, `DOMAIN_STATE`, `SEVERITY`; pure), page `(pm)/overview` composing it client-side; CMP-008 (domain registry `soon` flags, capabilities).
- **Data owned:** none.
- **Contracts consumed:** API-069 (`view=overview`), API-017, API-049, IAM `GET /api/people` (FR-031-003) and `GET /api/viewer`.
- **Failure modes:** a source failing → its slot shows NO_SIGNAL/error, never a zero.

## Implementation map

| Requirement | Current code (legacy repo path) |
|---|---|
| FR-018-001 | apps/server/src/app/(pm)/overview/page.jsx |
| FR-018-002/003 | apps/server/src/modules/business/application/business-home-read-model.js; apps/server/src/config/domains.js |
