---
id: FR-079-009
title: "Physical stocktake reconciliation (NONE/LOT)"
delivery: building
legacy: [FR-184]
relations:
  specified_by: [SDD-079]
  decided_by: [ADR-072]
---

# FR-079-009 — Physical stocktake reconciliation (NONE/LOT)

The system SHALL let `POST /api/inventory/stocktakes/preview` accept only
normalized TRACKED `NONE` or `LOT` lines (explicit location/lot identity, integer
non-negative counts, no duplicate keys) and persist a read-only `InventoryStocktake`
preview (expected snapshot version/hash, expected/count/variance) without writing
movements. `POST .../stocktakes/commit` SHALL revalidate the stored preview and
current scope, acquire the shared lock-only `InventoryLedgerFence` before its ledger
read, refuse a changed snapshot (`409 INVENTORY_STOCKTAKE_SNAPSHOT_STALE`), and
atomically append every signed ADJUSTMENT through `appendMovement` plus one audit
event, or write nothing. A Business-scoped idempotency key SHALL return the same
saved result for an identical retry and refuse a different payload; zero variance
SHALL be a durable no-op; SERIAL lines and untracked/service products SHALL be
explicitly refused.

## Acceptance criteria

- AC-079-009-01 — Given a preview whose snapshot has since changed (another movement posted), when commit is attempted, then it is refused with `409 INVENTORY_STOCKTAKE_SNAPSHOT_STALE` and nothing is written.
- AC-079-009-02 — Given the identical idempotency key retried with the identical payload, when commit is called again, then the same saved result is returned, not a second set of ADJUSTMENTs.
- AC-079-009-03 — Given a count line naming a SERIAL-tracked or untracked/ service product, when preview is attempted, then it is refused.
- AC-079-009-04 — Given a preview with zero variance on every line, when committed, then it is a durable no-op (recorded, but no ADJUSTMENT rows appended).

## Implementation

- `apps/server/src/modules/inventory/application/inventory-stocktake-service.js`, `domain/inventory-stocktake.js`, `apps/server/src/app/api/inventory/stocktakes/**`

## Verification

- TC-079-009 — Stocktake stale-snapshot refusal and idempotent commit (see [verification.md](../verification.md))
- TC-079-010 — Stocktake backup/recovery manifest ordering (see [verification.md](../verification.md))
- TC-079-011 — Console end-to-end stocktake flow (see [verification.md](../verification.md))
