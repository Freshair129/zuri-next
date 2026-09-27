---
id: SDD-032
title: "Access Invite, SoD & Operator Lifecycle — design"
---

# SDD-032 — Access Invite, SoD & Operator Lifecycle design

- **Components:** `CMP-035` (`access-invite-service.js`);
  `CMP-054` (`rbac.js`, `rbac-service.js`, and the payment/goods-receipt
  self-check hooks consumed from `DOM-COM`/`DOM-PRC`); `CMP-046`
  (`operator-bootstrap.js`, `operator-use.js`); `CMP-056`
  (`superadmin-grant.js`).
- **Data owned:** `AccessInvite`, `RoleBinding.sodOverrideReason`,
  `PlatformGrant` (`OPERATOR`, `SUPERADMIN`).
- **Contracts exposed:** consumed through `API-096`
  (PORTFOLIO scope) and `API-091` (lifecycle); TENANT/BUSINESS
  mint/accept routes are service-level only (see Open issues).
- **Contracts consumed:** `DOM-COM` `payment-service.js`, `DOM-PRC`
  `goods-receipt-service.js` (both call into `CMP-054`'s conflict/self-
  verify checks).
- **Main sequence:** 1. A scope owner mints an `AccessInvite`. 2. The
  invited person accepts from their own session; a `Membership` is granted
  through the one writer. 3. Elsewhere, an owner assigns a RoleBinding;
  `assignRoleBinding` checks `ROLE_CONFLICTS` before writing. 4. A payment
  recorder attempts to verify their own payment; `applyPaymentAction`
  refuses unless attested. 5. A standing operator issues a time-boxed grant
  to a new operator; every operator action records its own use.
- **Failure modes:** invite acceptance by the wrong session → binds to
  whoever actually authenticated, never the invited address; conflicting
  role assignment without override → 409; self-verification without
  attestation → 409, even for an OWNER; expired operator/superadmin grant →
  denied on the very next request.

## Implementation map

| Requirement | Current code (legacy repo path) |
|---|---|
| FR-032-001 | `apps/server/src/modules/identity/access-invite-service.js` |
| FR-032-002 | `apps/server/src/modules/identity/{rbac.js,rbac-service.js}`, `apps/server/src/modules/commerce/application/payment-service.js`, `apps/server/src/modules/procurement/application/goods-receipt-service.js` |
| FR-032-003 | `apps/server/src/modules/identity/{operator-bootstrap.js,operator-use.js}`, `apps/server/src/app/api/{audit/route.js,backup/export/route.js}` |
| FR-032-004 | `apps/server/src/modules/identity/{superadmin-grant.js,resolve-viewer.js,session-port.js}` |
