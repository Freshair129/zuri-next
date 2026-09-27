---
id: FR-025-001
title: "Profile-first onboarding: Waiting Room before operating scope"
delivery: live
legacy: [FR-066]
relations:
  specified_by: [SDD-025]
  decided_by: [ADR-020]
---

# FR-025-001 — Profile-first onboarding: Waiting Room before operating scope

The system SHALL require every new person to complete a Profile before being
asked to create or select operating scope, once a provider-neutral local
identity/session exists. A Profile-only member SHALL be able to remain in
Waiting Room without creating Organization/Tenant, Business, Space or
Project; an owner path SHALL be able to create a top-level Workspace and add
further scope only when needed. Profile SHALL confer no authorization.
Waiting Room SHALL render only the current person's completed Profile
summary and SHALL provide an accessible action back to public Home.

## Acceptance criteria

- AC-025-001-01 — Given a Person who has completed only the Profile step, when they load their Home surface, then they see the Waiting Room, not a Business Home or BusinessShell.
- AC-025-001-02 — Given a Profile-only Person, when any authorization check runs, then it grants nothing on the strength of the completed Profile alone.

## Implementation

- `apps/server/src/app/(entry)/{waiting-room,workspace-home}/page.jsx`, `apps/server/src/app/api/onboarding/state/route.js`, `apps/server/src/modules/identity/{onboarding-service.js,onboarding-steps.js}`

## Verification

- TC-025-001 — Profile-first onboarding and Waiting Room (see [verification.md](../verification.md))
