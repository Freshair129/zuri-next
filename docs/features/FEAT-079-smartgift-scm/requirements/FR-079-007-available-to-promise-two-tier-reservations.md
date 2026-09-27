---
id: FR-079-007
title: "Available-to-Promise, two-tier reservations"
delivery: building
legacy: [FR-180, BR-031]
relations:
  specified_by: [SDD-079]
  decided_by: [ADR-072]

---

# FR-079-007 — Available-to-Promise, two-tier reservations

The system SHALL hold `StockReservation` for one product/purpose — QUOTE (soft,
expiring, 7 days by default) or ORDER (committed) — computing
`ATP = onHand − Σ committed − Σ live quote reservations`. A reservation SHALL never
be deleted, only moved to RELEASED, CONVERTED or EXPIRED. Expiry SHALL be evaluated
on read against the clock, not by a sweeper. Reservations SHALL never write the
stock ledger; the maximum buildable set count SHALL be computed from ATP, not raw
on-hand.

## Acceptance criteria

- AC-079-007-01 — Given on-hand 500 and a live QUOTE reservation for 200, when ATP is read, then it shows 300, and a second quote for 300 succeeds while a second quote for 301 is refused (or flagged over-committed, per the domain's stated rule).
- AC-079-007-02 — Given a QUOTE reservation older than 7 days with no worker having run, when ATP is read, then it is treated as EXPIRED on that read alone.
- AC-079-007-03 — Given any reservation write, when checked against the ledger, then no `StockMovement` row was created by it.

## Implementation

- `apps/server/src/modules/inventory/application/inventory-atp-service.js`, `apps/server/src/app/api/inventory/reservations/**`, `.../atp/route.js`

## Verification

- TC-079-007 — ATP computation and reservation lifecycle (see [verification.md](../verification.md))
