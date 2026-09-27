---
id: SDD-025
title: "Onboarding & Account Creation — design"
---

# SDD-025 — Onboarding & Account Creation design

- **Components:** `CMP-044` (`onboarding-service.js`,
  `onboarding-steps.js`) — the state machine and Waiting Room; `CMP-053`
  (`signup-service.js`, `signup-copy.js`, `signup-rate-limit.js`) — account
  creation; `CMP-058`
  (`workspace-collaboration-view.js`, `workspace-membership-service.js`) —
  Portfolio-scoped invite/membership.
- **Data owned:** `Person` (profile fields, shared-write with crm — see
  DOMAIN.md), `WorkspaceMembership`, `AccessInvite` (PORTFOLIO scope).
- **Contracts exposed:** `API-090`, `API-096`.
- **Contracts consumed:** `API-087` (signup creates the
  credential the onboarding step then continues from).
- **Main sequence:** 1. Visitor submits `/signup`. 2. `signup-service`
  creates `Person` + `PersonCredential`, no grant. 3. Session established;
  `onboarding-service` routes to `PROFILE`. 4. Profile step collects given
  name/family name/phone; `onboarding-steps` advances state. 5. A
  Profile-only Person rests in Waiting Room; an owner may separately create a
  Workspace or issue an invite that a Person accepts into a
  `WorkspaceMembership`.
- **Failure modes:** duplicate signup email → 409, credential untouched;
  incomplete Profile submission → refused, state does not advance; expired/
  replayed invite token → one generic refusal; unverified Google email
  matching an existing account → refused, no silent link.

## Implementation map

| Requirement | Current code (legacy repo path) |
|---|---|
| FR-025-001 | `apps/server/src/app/(entry)/{waiting-room,workspace-home}/page.jsx`, `apps/server/src/app/api/onboarding/state/route.js`, `apps/server/src/modules/identity/{onboarding-service.js,onboarding-steps.js}` |
| FR-025-002 | `apps/server/src/app/api/workspace-invites/**`, `apps/server/src/app/api/workspace-memberships/route.js`, `apps/server/src/modules/identity/{workspace-membership-service.js,workspace-collaboration-view.js}` |
| FR-025-003 | `apps/server/src/app/api/auth/signup/route.js`, `apps/server/src/modules/identity/{signup-service.js,signup-copy.js,signup-rate-limit.js}` |
| FR-025-004 | none — declared and blocked (see delivery note) |
| FR-025-005 | `apps/server/src/app/(entry)/onboarding/profile/page.jsx`, `apps/server/src/app/api/onboarding/profile/route.js`, `apps/server/src/modules/identity/onboarding-service.js` |
