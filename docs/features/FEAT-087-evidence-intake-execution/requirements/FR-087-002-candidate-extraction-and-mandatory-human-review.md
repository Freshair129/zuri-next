---
id: FR-087-002
title: "Candidate extraction and mandatory human review"
delivery: live
legacy: [FR-138]
relations:
  specified_by: [SDD-087]
  decided_by: [ADR-079]

---

# FR-087-002 — Candidate extraction and mandatory human review

The system SHALL let authorized extraction submit active, same-Business evidence to
an injected provider adapter and persist strict field-level candidates carrying
provider/model/response identity, confidence and provenance; candidate output SHALL
never review or approve itself. A separate `ASSET_REVIEWER` decision (ACCEPT / CORRECT
/ REJECT) with immutable correction evidence SHALL be required before an intake can
reach `READY_FOR_REGISTRATION`.

## Acceptance criteria

- AC-087-002-01 — Given active evidence and a configured extraction provider, when extraction is requested, then a candidate is persisted with provider, model and confidence, and the intake's own status does not advance past `NEEDS_REVIEW` from this call alone.
- AC-087-002-02 — Given a persisted candidate, when a reviewer without `ASSET_REVIEWER`/OWNER authority attempts ACCEPT/CORRECT/REJECT, then it is refused.
- AC-087-002-03 — Given a reviewer CORRECTs one field, when the correction is saved, then the original candidate value remains reconstructable (correction is appended evidence, not an overwrite).

## Implementation

- `apps/server/src/modules/asset-management/application/asset-extraction-job-service.js`, `apps/server/src/app/api/assets/evidence/[id]/extract/route.js`, `.../review/route.js`

## Verification

- TC-087-002 — Extraction candidate and independent review decision (see [verification.md](../verification.md))
- TC-087-003 — End-to-end evidence intake execution (see [verification.md](../verification.md))
- TC-087-005 — Production activation contract (env/bucket/migration presence) (see [verification.md](../verification.md))
