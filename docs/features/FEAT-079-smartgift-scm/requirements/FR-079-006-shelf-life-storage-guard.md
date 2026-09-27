---
id: FR-079-006
title: "Shelf-life storage guard"
delivery: building
legacy: [FR-179, BR-030]
relations:
  specified_by: [SDD-079]
  decided_by: [ADR-072]

---

# FR-079-006 — Shelf-life storage guard

The system SHALL compute a lot's storage age as
`now − (lastMaintainedAt ?? manufacturedAt)` from nullable
`Product.maintenanceIntervalDays`/`maxStorageDays`. At the maintenance interval the
lot SHALL be surfaced as **due** (never blocked); past `maxStorageDays` it SHALL be
**refused** for issue and for kitting until a maintenance is recorded (which resets
the clock). FEFO SHALL still choose which eligible lot goes first; this guard says
which lots may go at all.

## Acceptance criteria

- AC-079-006-01 — Given a lot past `maxStorageDays` with no maintenance recorded, when an issue attempts to draw from it, then it is refused.
- AC-079-006-02 — Given that same lot, when a maintenance is recorded, then its storage-age clock resets and it becomes issuable again.
- AC-079-006-03 — Given a lot at exactly the maintenance interval (not yet past `maxStorageDays`), when read, then it shows as due, not refused.

## Implementation

- `apps/server/src/modules/inventory/application/inventory-shelf-life-service.js`, `domain/inventory-wip.js`, `apps/server/src/app/api/inventory/shelf-life/route.js`

## Verification

- TC-079-006 — Shelf-life due vs. refused, maintenance reset (see [verification.md](../verification.md))
