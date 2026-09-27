---
id: FR-002-005
title: "Business shell guard"
delivery: live
legacy: [FR-046 (Business-shell consumer side, the `/api/entry` contract is DOM-IAM)]
relations:
  specified_by: [SDD-002]
  depends_on: [FR-002-005, FR-024-003]
  derived_from: [SEC-007]
---

# FR-002-005 — Business shell guard

The system SHALL gate every Business-shell route with one decision function over (path,
viewer, selection, visible Businesses, Projects): entry paths (`/`, `/login`,
`/businesses`) bypass; a viewer failure classified as session-unavailable yields
SESSION_UNAVAILABLE, any other viewer failure or no viewer yields AUTH_REQUIRED → `/login`;
no selected Business yields BUSINESS_REQUIRED → `/businesses`; a selected Business not in
`viewer.visibleBusinessIds` yields FORBIDDEN → `/businesses`; a domain path not visible for
the viewer in that Business yields FORBIDDEN → `/overview`; a Project route whose Project is
unknown yields NOT_FOUND, and one owned by another Business yields FORBIDDEN → `/overview`.
Only a READY decision renders shell content. Identity, role and visible Businesses SHALL come
only from the server-resolved viewer (never client claims).

## Acceptance criteria

- AC-002-005-01 — Given no session, when `/projects` is opened, then the guard redirects to `/login`.
- AC-002-005-02 — Given a stored selection of a Business the viewer can no longer see, then FORBIDDEN → `/businesses`.
- AC-002-005-03 — Given `/projects/{id}` of a Project owned by Business C while B is selected, then FORBIDDEN (`PROJECT_BUSINESS_MISMATCH`).

## Implementation

- apps/server/src/lib/business-shell-guard.js; apps/server/src/components/layouts/BusinessShellGuard.jsx; apps/server/src/components/layouts/BusinessRoutingShell.jsx; apps/server/src/lib/viewer-failure.js

## Verification

- TC-002-003 — Business shell guard decisions (see [verification.md](../verification.md))
