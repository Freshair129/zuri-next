---
id: FR-035-001
title: "SCM groups Inventory, Warehouse, Procurement and Order Management under one bar slot"
delivery: live
legacy: [FR-167]
relations:
  specified_by: [SDD-035]
  decided_by: [ADR-032]
---

# FR-035-001 — SCM groups Inventory, Warehouse, Procurement and Order Management under one bar slot

`DOMAIN_GROUPS` SHALL declare `scm` over the existing `inventory`,
`warehouse`, `procurement` and `commerce` domain keys; the bar SHALL render
one slot for the group, and the sidebar SHALL list the whole group with each
child's label heading its own pages. The group SHALL NOT be present in the
permission registry — it SHALL NOT reach `Membership.domainKeysJson`, the
permission checkboxes or the route guard, which SHALL keep resolving a path
to the leaf domain key. `warehouse` SHALL be listed as a reserved, disabled
`soon` child until it is built.

## Acceptance criteria

- AC-035-001-01 — Given a viewer holding only the `inventory` key, when they open the SCM slot, then only Inventory's pages are reachable, never Procurement's or Commerce's.
- AC-035-001-02 — Given the SCM group entry, when the permission registry is inspected, then `scm` is absent from it entirely.

## Implementation

- `apps/server/src/config/domains.js`, `apps/server/src/components/layouts/{DomainBar,Sidebar}.jsx`

## Verification

- TC-035-001 — SCM group container, permission-registry absence, warehouse reserved (see [verification.md](../verification.md))
