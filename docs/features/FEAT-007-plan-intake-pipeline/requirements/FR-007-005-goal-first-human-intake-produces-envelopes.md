---
id: FR-007-005
title: "Goal-first human intake produces envelopes"
delivery: live
legacy: [FR-017 (split 1/2 — wizard and edit-only modals)]
relations:
  specified_by: [API-039, API-038]
  derived_from: [BR-048, BR-049, BR-054]
---

# FR-007-005 — Goal-first human intake produces envelopes

The system SHALL let a user start a Project from an objective ("เริ่มจากเป้าหมาย") and
shape its Workstreams per execution mode in a builder/customizer whose output is a
PlanEnvelope sent through dry run, preview and confirmation; there SHALL be no first-step
template picker, and direct create modals for Projects/Workstreams/Items SHALL be edit-only
(creation of planned structure goes through the envelope).

## Acceptance criteria

- AC-007-005-01 — Given the wizard with objective "เปิดสาขาเชียงใหม่" and one OPERATIONS Workstream, when confirmed, then the Project and Workstream exist and the preview was shown first.
- AC-007-005-02 — Given the plan-mode customizer, then only subtypes allowed by the chosen mode are offered.

## Implementation

- apps/server/src/app/(pm)/projects/new/page.jsx; components/HumanPlanBuilderModal.jsx; components/PlanModeCustomizerModal.jsx; import/human-plan-builder.js; import/plan-mode-envelope.js

## Verification

- TC-007-004 — Human intake and standalone task (see [verification.md](../verification.md))
