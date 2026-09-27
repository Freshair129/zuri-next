---
id: FR-013-002
title: "Authorization, refusal shape and no side effects"
delivery: live
legacy: [FR-251 (split 2/2 — authorization and UI activation)]
relations:
  specified_by: [API-053]
  derived_from: [BR-002]
---

# FR-013-002 — Authorization, refusal shape and no side effects

The system SHALL authorize the Project hierarchy before reading any aggregate (existing
shared TENANT/PORTFOLIO Workspace policy retained), answer 401 `AUTH_REQUIRED` without a
session, and answer missing, deleted, foreign and invalid-hierarchy Projects with one redacted
404 `RESOURCE_NOT_FOUND` carrying no counts or identifiers; the read SHALL perform no write,
audit append, cache mutation or grant creation. The Execution Domains tab SHALL be the only
Delivery Design capability activated by this feature, in Project context only.

## Acceptance criteria

- AC-013-002-01 — Given a Project of another Tenant, then the 404 body equals that of a random id.
- AC-013-002-02 — Given a read, then AuditEvent count and `progressCache` are unchanged.

## Implementation

- apps/server/src/app/api/projects/[id]/domain-view/route.js; apps/server/src/app/(pm)/projects/[projectId]/domain-view/page.jsx; components/ProjectDomainView.jsx; navigation.js; components/ProjectTabs.jsx

## Verification

- TC-013-002 — Route authorization and no side effects (see [verification.md](../verification.md))
- TC-013-003 — Browser behaviour (see [verification.md](../verification.md))
