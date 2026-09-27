---
id: FR-079-001
title: "Located ledger and atomic transfer"
delivery: building
legacy: [FR-174, BR-026]
relations:
  specified_by: [SDD-079]
  decided_by: [ADR-072]

---

# FR-079-001 — Located ledger and atomic transfer

The system SHALL let `StockMovement` name a `sourceLocationId`/`targetLocationId`
(both nullable, so pre-existing rows stay valid) among nine typed
`WarehouseLocation` buckets (`CN_FACTORY`, `INTL_SEA_TRANSIT`, `TH_PORT_CUSTOMS`,
`TH_CENTRAL_RAW`, `TH_WIP_CUSTOMIZATION`, `TH_WIP_ASSEMBLY`, `TH_FINISHED_GOODS`,
`TH_QUARANTINE_SCRAP`, `CUSTOMER_SITE`), with `isVirtual` for places the Business
does not hold. `transferStock` SHALL issue at the source and receive at the target
in one transaction through `appendMovement`, so Business-wide on-hand is unchanged
by construction; there SHALL be no fourth movement kind. Located on-hand SHALL be
reported beside the Business-wide total, never instead of it.

## Acceptance criteria

- AC-079-001-01 — Given 10 units at `TH_CENTRAL_RAW`, when 4 are transferred to `TH_WIP_CUSTOMIZATION`, then Business-wide on-hand is unchanged (still 10) and located on-hand reads 6/4 at the two locations.
- AC-079-001-02 — Given a Business with movements written before this requirement (no location columns), when located on-hand is read, then those rows are simply excluded from the located sum rather than causing an error.

## Implementation

- `apps/server/src/modules/inventory/application/warehouse-location-service.js`, `location-transfer-service.js`, `domain/warehouse-location.js`, `apps/server/src/app/api/inventory/locations/**`, `.../location-stock/route.js`, `.../transfers/route.js`

## Verification

- TC-079-001 — Located transfer and Business-wide invariance (see [verification.md](../verification.md))
