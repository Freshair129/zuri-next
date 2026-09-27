---
id: FR-086-002
title: "Multi-surface intake and evidence/reference validation"
delivery: building
legacy: [FR-134, FR-137]
relations:
  specified_by: [SDD-086]
  decided_by: [ADR-078]

---

# FR-086-002 — Multi-surface intake and evidence/reference validation

The system SHALL validate, for every intake surface, that: expiry-controlled
categories carry a Business-scoped `lotId` and expiry date; a `PROCUREMENT_PURCHASE`
origin carries at least one `PR` and one `PO` reference (optional `PR_LINE`/`PO_LINE`/
`GRN`/`INVOICE`/`SUPPLIER` references are preserved when supplied); evidence
references an existing, active, same-Business `FileAsset` by id and role, never raw
bytes. Duplicate evidence hashes or payment references SHALL be reported as conflicts,
never silently merged.

## Acceptance criteria

- AC-086-002-01 — Given an expiry-controlled category with no `lotId`, when the envelope is validated, then it is refused with a lot-required code.
- AC-086-002-02 — Given two envelopes referencing the same payment evidence reference, when the second is validated, then it is reported as a conflict rather than accepted as a second independent intake.
- AC-086-002-03 — Given an evidence reference to a `FileAsset` the viewer's Business does not own, when validated, then it is refused (cross-Business evidence is never attached).

## Implementation

- `apps/server/src/modules/asset-management/domain/asset-intake.js`, `domain/evidence-policy.js`, `apps/server/src/app/api/assets/intakes/validate/route.js`

## Verification

- TC-086-003 — Lot/expiry and PR/PO reference validation (see [verification.md](../verification.md))
