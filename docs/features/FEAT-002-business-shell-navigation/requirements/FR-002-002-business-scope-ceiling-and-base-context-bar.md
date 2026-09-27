---
id: FR-002-002
title: "Business scope ceiling and Base Context Bar"
delivery: live
legacy: [FR-039]
relations:
  decided_by: [ADR-002]
---

# FR-002-002 — Business scope ceiling and Base Context Bar

The system SHALL render a read-only Base Context Bar with the levels Group › Organization ›
Business, mapped to schema Portfolio › Tenant › Business, and SHALL stop global shell
scope at Business. "Organization" is only a UI label for Tenant (UUID and isolation
semantics unchanged). Schema Workspace ("Space") and Project SHALL be Development
resources, never shell scope levels or sidebar parents.

## Acceptance criteria

- AC-002-002-01 — Given a selected Business, then the context bar shows its Group, Organization and Business names and no Workspace or Project level.
- AC-002-002-02 — Given the Organization element, when activated, then it navigates to the Business chooser (`/businesses`).

## Implementation

- apps/server/src/config/scope-views.js; apps/server/src/components/layouts/Topbar.jsx; apps/server/src/config/domains.js

## Verification

- TC-002-002 — Context bar, topbar and breadcrumb contracts (see [verification.md](../verification.md))
