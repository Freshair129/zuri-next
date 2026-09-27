---
id: FR-056-002
title: "Publishes without prior approval are reported"
delivery: implemented
legacy: [FR-129 (split 2/2)]
relations:
  specified_by: [SDD-056]
---

# FR-056-002 — Publishes without prior approval are reported

The system SHALL, for runs of `DPL-SUPABASE-BUSINESS-KNOWLEDGE-V1` only, report a
`PUBLISH_WITHOUT_APPROVAL` violation for every SUCCEEDED `DPS-PUBLISH` step that has
no APPROVED gate decision created at or before the step finished — checking every
publish step, not only the latest; a WAIVED gate does not satisfy it; each finding
lists the observed gate statuses, whether ordering was possible, and approvals that
came after. The compliance block states `gated` (does this rule apply) separately from
the violation list and always `enforced: false`.

## Acceptance criteria

- AC-056-002-01 — Given a publish step followed later by an APPROVED decision, when compliance is computed, then one violation with `approvalsAfterPublish: 1` is reported.
- AC-056-002-02 — Given a knowledge-ingest run (`DPL-KNOWLEDGE-INGEST-V1`), when compliance is computed, then `gated: false` and no violations.
- AC-056-002-03 — Given only a WAIVED gate before publish, when computed, then a violation is reported listing `WAIVED`.

## Implementation

- apps/server/src/platform/integrations/core/pipeline-gate-compliance.js; apps/server/src/platform/integrations/core/pipeline-tracking-service.js

## Verification

- TC-056-001 — Gate evidence and violation detection (see [verification.md](../verification.md))
