---
id: FR-046-002
title: "Read analyses behind inbox visibility and consent"
delivery: building
legacy: [FR-127 (split 2/2)]
relations:
  specified_by: [SDD-046]
  derived_from: [BR-046]
---

# FR-046-002 — Read analyses behind inbox visibility and consent

The system SHALL return a conversation's analyses oldest-first only to a viewer who can
see the given Business, only for a conversation inside that scope (tenant-shared or
bound to a visible Business) whose Customer consent is `GRANTED`, and SHALL omit the raw
model output from the read DTO. Analyses SHALL be removed by the Customer's PDPA erasure
and SHALL be recomputable, so deleting and re-running is always safe.

## Acceptance criteria

- AC-046-002-01 — Given a viewer who cannot see the Business, when reading, then 403.
- AC-046-002-02 — Given a returned analysis, when inspected, then `rawOutputJson` is absent.

## Implementation

- apps/server/src/modules/crm/conversation-analysis-service.js; apps/server/src/lib/validation/enums.js; apps/server/src/modules/identity/erase-principal.js

## Verification

- TC-046-001 — Analysis write/read, consent gate, erasure and restore (see [verification.md](../verification.md))
