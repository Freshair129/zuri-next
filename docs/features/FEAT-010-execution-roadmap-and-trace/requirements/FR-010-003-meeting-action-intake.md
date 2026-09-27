---
id: FR-010-003
title: "Meeting-action intake"
delivery: live
legacy: [FR-069 (split 2/4 — meeting-action intake)]
relations:
  specified_by: [API-044, API-043]
  depends_on: [FR-029-004]
---

# FR-010-003 — Meeting-action intake

The system SHALL accept normalized meeting action candidates (`meeting-action-intake.v1`,
`source.app` ∈ FUNG | LALIN_AI) targeting a Business-scoped Workspace/Project, convert them into
a PlanEnvelope 1.2 and run the standard dry run/commit (trace source `MEETING_ACTION`). An action
SHALL set `WorkItem.assigneeRef` only when the source-app user has a verified, active
provider-subject binding to a Person with an active Membership in the target Business (or
tenant-wide); otherwise the proposed assignee SHALL remain visible in item metadata for review
and never be resolved by display name. Recording bytes and transcription stay with the producer.

## Acceptance criteria

- AC-010-003-01 — Given a binding for `LALIN_AI:u1` to Person P with Membership in B, then the committed item has `assigneeRef = P`.
- AC-010-003-02 — Given no binding, then the item is committed unassigned with the proposal in metadata and a warning.

## Implementation

- apps/server/src/modules/project-manager/import/meeting-action-intake.js; import/meeting-contracts.js; apps/server/src/app/api/import/meeting-actions/{dry-run,commit}/route.js

## Verification

- TC-010-003 — Meeting-action intake (see [verification.md](../verification.md))
