---
id: FR-086-004
title: "Deterministic depreciation candidate"
delivery: building
legacy: [FR-136]
relations:
  specified_by: [SDD-086]
  decided_by: [ADR-078]
---

# FR-086-004 — Deterministic depreciation candidate

The system SHALL let an authorized user produce a deterministic straight-line
depreciation preview from acquisition amount, residual value, start date and useful
life, storing calculation version, period rows, bounded accumulated depreciation and a
reviewer state. The candidate SHALL never create capitalization, a tax book, an
accounting journal or a posting, and no candidate status may imply Finance approval
without a separate, explicit Finance contract.

## Acceptance criteria

- AC-086-004-01 — Given valid acquisition inputs, when a preview is requested, then period rows are generated whose accumulated depreciation never exceeds depreciable basis and whose book value never drops below residual value.
- AC-086-004-02 — Given a generated candidate, when it is read back, then its calculation version and inputs are reconstructable byte-for-byte (deterministic, not re-derived differently on a second run).
- AC-086-004-03 — Given a candidate in any review state, when any caller checks whether it has posted to Finance, then the answer is always no — no code path in this feature writes a journal or capitalization record.

## Implementation

- `apps/server/src/modules/asset-management/application/asset-depreciation-service.js`, `domain/depreciation.js`, `apps/server/src/app/api/assets/register/[id]/depreciation/route.js`

## Verification

- TC-086-005 — Depreciation calculator bounds and determinism (see [verification.md](../verification.md))
