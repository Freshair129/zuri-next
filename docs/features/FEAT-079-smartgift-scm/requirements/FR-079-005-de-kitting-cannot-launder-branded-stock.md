---
id: FR-079-005
title: "De-kitting cannot launder branded stock"
delivery: building
legacy: [FR-178]
relations:
  specified_by: [SDD-079]
  decided_by: [ADR-072]
---

# FR-079-005 — De-kitting cannot launder branded stock

The system SHALL let de-kitting issue a finished set and receive its constituent
components in one transaction at a stated location. A component that was branded
(`CUSTOM_COMPONENT`) SHALL return with its customer lock intact, or move to
`TH_QUARANTINE_SCRAP` — never as generic raw stock. Packaging the disassembly
destroys SHALL be written off in the same transaction, named by the caller.

## Acceptance criteria

- AC-079-005-01 — Given a finished set containing a customer-dedicated component, when de-kitted, then that component returns still dedicated to the same customer/order, never as generic stock.
- AC-079-005-02 — Given packaging named as destroyed by the caller, when de-kitting completes, then that packaging is written off in the same transaction, not optimistically returned.

## Implementation

- `apps/server/src/modules/inventory/application/de-kitting-service.js`, `apps/server/src/app/api/inventory/de-kitting/route.js`

## Verification

- TC-079-005 — De-kitting preserves customer lock, writes off packaging (see [verification.md](../verification.md))
