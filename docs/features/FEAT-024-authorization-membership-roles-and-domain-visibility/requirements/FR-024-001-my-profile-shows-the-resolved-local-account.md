---
id: FR-024-001
title: "My Profile shows the resolved local account"
delivery: live
legacy: [FR-038]
relations:
  specified_by: [SDD-024]
---

# FR-024-001 — My Profile shows the resolved local account

The system SHALL show, at `/profile`, the caller's own resolved local
account, language preference, LINE-link state and local session — read only,
scoped to self.

## Acceptance criteria

- AC-024-001-01 — Given any authenticated Person, when `/profile` loads, then it shows only that Person's own account fields, never another Person's.

## Implementation

- `apps/server/src/app/(pm)/profile/page.jsx`, `apps/server/src/app/api/profile/route.js`
