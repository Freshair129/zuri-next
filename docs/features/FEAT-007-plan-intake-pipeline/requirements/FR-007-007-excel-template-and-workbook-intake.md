---
id: FR-007-007
title: "Excel template and workbook intake"
delivery: live
legacy: [FR-018]
relations:
  specified_by: [API-040, API-041]
  derived_from: [BR-005]
---

# FR-007-007 — Excel template and workbook intake

The system SHALL serve an authenticated `.xlsx` template generated from the envelope schema
and enum source (dropdowns derived, never hand-copied), and SHALL convert an uploaded
workbook into a PlanEnvelope reporting errors per sheet row; a workbook with conversion
errors SHALL return them without a dry run, otherwise the converted envelope SHALL be
dry-run against the authorized target and returned with the preview for confirmation.

## Acceptance criteria

- AC-007-007-01 — Given a row with an unknown status, then the response lists that row number and field and `envelope: null`.
- AC-007-007-02 — Given a clean workbook, then the response carries `valid`, the preview and the envelope, and nothing is written until commit.
- AC-007-007-03 — Given no session, then the template download returns 401.

## Implementation

- import/xlsx-template.js; import/xlsx-convert.js; apps/server/src/app/api/import/template/route.js; apps/server/src/app/api/import/xlsx/route.js; components/UploadPlanModal.jsx

## Verification

- TC-007-005 — Excel intake (see [verification.md](../verification.md))
