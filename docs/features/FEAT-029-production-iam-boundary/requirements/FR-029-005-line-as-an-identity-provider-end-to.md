---
id: FR-029-005
title: "LINE as an identity provider end-to-end: linking, staff/customer split and PDPA erasure"
delivery: building
legacy: [FR-022]
relations:
  specified_by: [SDD-029]
  decided_by: [ADR-022]
---

# FR-029-005 — LINE as an identity provider end-to-end: linking, staff/customer split and PDPA erasure

The system SHALL let a channel subject be bound to an **existing** Person
through a single-use, short-lived link token (never forking a second
principal for the same human — a prior auto-minted throwaway Person is
re-pointed, not left standing), SHALL classify a resolved Person as `STAFF`
(holds an active tenant `Membership`) or `CUSTOMER` (holds a `Customer`
record) or `UNKNOWN` (neither), with `STAFF` taking precedence when both
are true, and SHALL support PDPA erase-revoke of the principal's LINE
binding on an authorized trigger. `resolveLinePrincipal` is the single
seam (Gate P3) every LINE-facing surface calls for this identity/erasure
lifecycle.

## Acceptance criteria

- AC-029-005-01 — Given a LINE subject auto-minted to a throwaway Person, when a valid link token binds it to an existing Person, then the channel subject resolves to the existing Person afterward, never both.
- AC-029-005-02 — Given a Person holding both an active Membership and a Customer record, when classified, then the result is `STAFF`.
- AC-029-005-03 — Given an authorized erasure trigger (per-Business OWNER in the Customer's tenant, or the installation operator, with typed `confirmation: 'ERASE'`), when it runs, then the LINE binding is revoked and dependent message/record payloads are tombstoned in the same transaction; refusals are shaped as `404`, never leaking existence.

## Implementation

- `apps/server/src/modules/identity/{link-line-identity.js,classify-principal.js,erase-customer-principal.js}`, `apps/server/src/app/api/crm/customers/[customerId]/erasure/route.js`

## Verification

- TC-029-005 — Account linking, staff/customer classification and PDPA erasure (see [verification.md](../verification.md))
