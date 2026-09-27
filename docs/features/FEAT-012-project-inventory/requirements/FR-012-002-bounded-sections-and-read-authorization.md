---
id: FR-012-002
title: "Bounded sections and read authorization"
delivery: live
legacy: [FR-077 (split 2/2 — authorization and pagination)]
relations:
  specified_by: [API-064]
  derived_from: [BR-002, SEC-001]
---

# FR-012-002 — Bounded sections and read authorization

The system SHALL resolve the viewer before loading children and authorize a Business-owned
Project with `seesBusiness`, an ownerless Project only when its TENANT/PORTFOLIO Space lies inside
a visible Business scope (never granting mutation); unknown or unauthorized Projects SHALL return
the same 404 as a fabricated id. Every repeated section SHALL expose `status` (READY, PARTIAL,
EMPTY, UNAVAILABLE), `items`, `page`, `limit` (default 100, max 500), `truncated`, `nextPage` and
`reasonCode`, so empty, partial, unavailable and error states are distinguishable. Managed files
SHALL match the Project's Business and Tenant.

## Acceptance criteria

- AC-012-002-01 — Given 150 WorkItems and `limit=100`, then items has 100 entries, `truncated: true`, `nextPage: 2`, `status: PARTIAL`.
- AC-012-002-02 — Given a viewer of another Business, then 404 identical to a random id.

## Verification

- TC-012-001 — Inventory read model (see [verification.md](../verification.md))
- TC-012-002 — Inventory UI and isolation end to end (see [verification.md](../verification.md))
