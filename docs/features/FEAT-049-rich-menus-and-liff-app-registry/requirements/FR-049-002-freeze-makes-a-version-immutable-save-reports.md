---
id: FR-049-002
title: "Freeze makes a version immutable; save reports every publish blocker"
delivery: implemented
legacy: [FR-151 (split 2/2)]
relations:
  specified_by: [API-133]
  decided_by: [ADR-044]
---

# FR-049-002 — Freeze makes a version immutable; save reports every publish blocker

The system SHALL make a `FREEZE`d version immutable and open the next numbered
draft, and SHALL refuse to freeze a draft that has any of: an unsupported
image size, a tap area outside the image, no tap areas, or no image — naming
every reason, not the first one found.

## Acceptance criteria

- AC-049-002-01 — Given a draft with no image, when `FREEZE` is applied, then the action is refused naming the missing image.
- AC-049-002-02 — Given a frozen version, when a further edit is attempted, then the write is refused because the version is immutable.

## Implementation

- `apps/server/src/modules/line-oa-studio/domain/line-oa-rich-menu.js`

## Verification

- TC-049-002 — Freeze validation and immutability (see [verification.md](../verification.md))
