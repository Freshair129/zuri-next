---
id: FR-035-003
title: "CRM groups Customer and Market Intelligence under one bar slot"
delivery: live
legacy: [FR-172]
relations:
  specified_by: [SDD-035]
  decided_by: [ADR-033]
---

# FR-035-003 — CRM groups Customer and Market Intelligence under one bar slot

`DOMAIN_GROUPS` SHALL gain a second entry, `crm`, over the existing
`customer` and `market` domain keys, using the identical container-only
semantics as FR-035-001. `customer`'s bar label SHALL change from "CRM"
to "Customer" to avoid a duplicate label with the new group; `market`'s
label and key SHALL be unchanged.

## Acceptance criteria

- AC-035-003-01 — Given the CRM group entry, when the bar renders, then exactly one "CRM" label appears (the group), never two.
- AC-035-003-02 — Given a viewer holding only the `market` key, when they open the CRM slot, then only Market Intelligence's pages are reachable.

## Implementation

- `apps/server/src/config/domains.js`

## Verification

- TC-035-003 — CRM group container and label collision resolution (see [verification.md](../verification.md))
