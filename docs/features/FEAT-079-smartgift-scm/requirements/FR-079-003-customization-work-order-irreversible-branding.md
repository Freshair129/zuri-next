---
id: FR-079-003
title: "Customization work order, irreversible branding"
delivery: building
legacy: [FR-176]
relations:
  specified_by: [SDD-079]
  decided_by: [ADR-072]
---

# FR-079-003 — Customization work order, irreversible branding

The system SHALL let a manager open a `CustomizationWorkOrder` binding one raw SKU,
one technique, one customer and one sales order, driving DRAFT → RELEASED →
IN_PROGRESS → COMPLETED | CANCELLED (plus BLOCKED_SHORTAGE). RELEASE SHALL transfer
the gross quantity into `TH_WIP_CUSTOMIZATION`; COMPLETE SHALL consume raw units,
issue scrap to `TH_QUARANTINE_SCRAP`, and receive a new `CUSTOM_COMPONENT` item
dedicated to that customer/order — which the domain SHALL then refuse to issue to
another customer, transfer to generic raw stock, or consume for another order. The
only exit SHALL be an explicit ADJUSTMENT write-off with a stated reason.

## Acceptance criteria

- AC-079-003-01 — Given a COMPLETED work order's dedicated `CUSTOM_COMPONENT`, when an issue names a different customer/sales order, then it is refused.
- AC-079-003-02 — Given a RELEASED work order, when COMPLETE runs, then raw units are consumed, scrap moves to `TH_QUARANTINE_SCRAP`, and the dedicated component is received — all in one transaction.

## Implementation

- `apps/server/src/modules/inventory/application/customization-work-order-service.js`, `domain/inventory-wip.js`, `apps/server/src/app/api/inventory/customization-work-orders/**`

## Verification

- TC-079-003 — Customization irreversibility (see [verification.md](../verification.md))
