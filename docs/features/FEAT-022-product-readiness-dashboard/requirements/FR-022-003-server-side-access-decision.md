---
id: FR-022-003
title: "Server-side access decision"
delivery: live
legacy: [FR-124 (split 3/3 — access and rendering)]
relations:
  depends_on: [FR-024-003]
  derived_from: [SEC-007]
---

# FR-022-003 — Server-side access decision

The system SHALL resolve the viewer on the server before rendering: no viewer or a viewer error →
redirect to `/login`; a viewer for whom the `platform` domain is not visible → not found; the snapshot
SHALL never be serialized to an unauthorized browser. The page SHALL render only the committed
projection (no database read, no write, no poll).

## Acceptance criteria

- AC-022-003-01 — Given a viewer without `platform` visibility, then the page returns not found and the payload contains no snapshot data.

## Implementation

- apps/server/src/modules/project-manager/application/product-readiness-access.js; apps/server/src/app/(pm)/platform/product-readiness/page.jsx; apps/server/src/app/(pm)/platform/product-readiness/[domain]/page.jsx; components/ProductReadinessDashboard.jsx

## Verification

- TC-022-002 — UI and access (see [verification.md](../verification.md))
