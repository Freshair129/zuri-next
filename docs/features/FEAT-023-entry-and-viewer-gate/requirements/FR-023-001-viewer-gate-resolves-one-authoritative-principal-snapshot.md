---
id: FR-023-001
title: "Viewer gate resolves one authoritative principal snapshot"
delivery: live
legacy: [FR-031]
relations:
  specified_by: [SDD-023]
  decided_by: [ADR-019]
---

# FR-023-001 — Viewer gate resolves one authoritative principal snapshot

The system SHALL resolve the current authenticated principal, via
`resolveViewer()`, into exactly one role (`OWNER`, `MEMBER`, or platform
`DEV`), `visibleBusinessIds` and `visibleDomains` before any Home journey is
reached. `DEV` SHALL be an explicit platform grant, never a widened
Membership. Missing or invalid authentication SHALL fail closed and SHALL
NOT derive `OWNER`-of-all.

## Acceptance criteria

- AC-023-001-01 — Given no trusted session, when any protected route resolves the viewer, then the result is `UNAUTHENTICATED` and no Business data is disclosed.
- AC-023-001-02 — Given a live Session for a Person holding one ACTIVE Membership, when the viewer resolves, then `role`, `visibleBusinessIds` and `visibleDomains` reflect exactly that Membership, never more.
- AC-023-001-03 — Given a Person with no platform `PlatformGrant`, when the viewer resolves, then `isPlatform`/DEV is false regardless of any Membership held.

## Implementation

- `apps/server/src/app/api/viewer/route.js`, `apps/server/src/modules/identity/resolve-viewer.js`

## Verification

- TC-023-001 — Viewer gate resolves role/visibility/DEV correctly (see [verification.md](../verification.md))
- TC-023-003 — API/UI entry contract stays in sync (see [verification.md](../verification.md))
