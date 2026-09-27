---
id: FR-096-003
title: "Unanswered LINE questions are reported as a per-Business knowledge gap, never entering the corpus"
part: FEAT-096-P03
owner: DOM-KNW
delivery: implemented
legacy: [FR-237]
relations:
  specified_by: [SDD-096]
  decided_by: [ADR-071]
---

# FR-096-003 — Unanswered LINE questions are reported as a per-Business knowledge gap, never entering the corpus

The system SHALL aggregate trace events recording no evidence found into a per-Business report of
counts, a product locator (only when the traced query named one) and the last-seen time, computed
on read from existing trace events rather than a new persisted model. The system SHALL never expose
the underlying question text in this report, and SHALL never admit anything from it into the
knowledge corpus.

## Acceptance criteria

- AC-096-003-01 — Given repeated no-evidence events for the same product locator, when the report is requested, then they aggregate into one entry with the correct count and the latest last-seen time.
- AC-096-003-02 — Given a no-evidence event whose only distinguishing field is the raw question term (no product code resolved), when the report is computed, then its entry has no locator and never carries the question text.
- AC-096-003-03 — Given two Businesses each with their own no-evidence events, when a viewer scoped to one Business requests the report (with or without naming a `businessId`), then only that Business's own gaps are ever returned.

## Implementation

- `apps/server/src/modules/knowledge/application/knowledge-gap-report-service.js`; `apps/server/src/app/api/knowledge/gap-report/route.js`; `apps/server/src/modules/knowledge/ui/KnowledgeGapReport.jsx`; `apps/server/src/app/(pm)/knowledge/gap-report/page.jsx`

## Verification

- TC-096-003 — Knowledge gap report: per-Business aggregation, locator-only, cross-Business isolation (see [verification.md](../verification.md))
