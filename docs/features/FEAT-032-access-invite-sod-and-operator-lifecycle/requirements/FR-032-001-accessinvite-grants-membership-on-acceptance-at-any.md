---
id: FR-032-001
title: "AccessInvite grants Membership on acceptance, at any of three scopes"
delivery: implemented
legacy: [FR-195]
relations:
  specified_by: [SDD-032]
  decided_by: [ADR-025]
---

# FR-032-001 — AccessInvite grants Membership on acceptance, at any of three scopes

`AccessInvite` SHALL generalise `WorkspaceInvite` to PORTFOLIO/TENANT/
BUSINESS scope. TENANT/BUSINESS acceptance SHALL create a `Membership`
**only** through `grantBusinessMembership`, binding to the accepting
session's `personId`, never resolved from the invited email. Minting
authority SHALL be scope-specific (`assertWorkspaceAdminAuthority`/
`ownsTenant`/`ownsBusiness`); every refusal SHALL be the same 404 an absent
scope produces. `role: 'OWNER'` SHALL be refused at every scope.

## Acceptance criteria

- AC-032-001-01 — Given a BUSINESS-scope invite accepted by a session whose `personId` differs from the invited email's account, when acceptance completes, then the Membership binds to the accepting session's Person, never the email's.
- AC-032-001-02 — Given a mint request with `role: 'OWNER'` at any scope, when it is submitted, then it is refused.

## Implementation

- `apps/server/src/modules/identity/access-invite-service.js`

## Verification

- TC-032-001 — Access invite scope authority and session-bound acceptance (see [verification.md](../verification.md))
