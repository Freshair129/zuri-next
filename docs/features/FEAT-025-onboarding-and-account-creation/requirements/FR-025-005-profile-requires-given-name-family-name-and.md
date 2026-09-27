---
id: FR-025-005
title: "Profile requires given name, family name and telephone number"
delivery: live
legacy: [FR-122]
relations:
  specified_by: [SDD-025]
  decided_by: [ADR-020]
---

# FR-025-005 — Profile requires given name, family name and telephone number

The Profile-first onboarding step SHALL require given name, family name and
telephone number, beyond the display name and optional email it already
collects. Display name SHALL be supplied by the person or defaulted
server-side from given + family name, never left empty. These three fields
SHALL be stored **nullable on `Person`** and required only at the profile
boundary, because Person rows created by the seed, operator bootstrap, or
LINE-first ingest (`lineUserId`-only) can never satisfy a database-level
requirement.

## Acceptance criteria

- AC-025-005-01 — Given a Person submitting the Profile step with a missing telephone number, when the step is submitted, then it is refused.
- AC-025-005-02 — Given a Person created by LINE-first ingest with no name or phone, when that row is read anywhere outside the Profile step, then the read succeeds (the fields are nullable at the database).

## Implementation

- `apps/server/src/app/(entry)/onboarding/profile/page.jsx`, `apps/server/src/app/api/onboarding/profile/route.js`, `apps/server/src/modules/identity/onboarding-service.js`

## Verification

- TC-025-004 — Profile identity fields required at the boundary, nullable at rest (see [verification.md](../verification.md))
