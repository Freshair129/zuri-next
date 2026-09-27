---
id: FR-040-004
title: "The member roadmap redacts all Mission Control data"
delivery: building
legacy: [FR-263]
relations:
  specified_by: [SDD-040]
  decided_by: [ADR-030]
---

# FR-040-004 — The member roadmap redacts all Mission Control data

The server-side `/roadmap` projection SHALL preserve its existing signed-in
plan and redacted-usage boundary (FEAT-036) while excluding PORL
records, assignments, device/tool/model details and thread identifiers; the
operator-only `/control/**` boundary SHALL remain unchanged.

## Acceptance criteria

- AC-040-004-01 — Given the `/roadmap` member projection's own output, when it is inspected, then no PORL record, assignment, device/tool/model detail or thread identifier is present anywhere in it.

## Implementation

- `apps/server/src/modules/platform-control/programme-member-view.js`

## Verification

- TC-040-004 — Member view PORL redaction (see [verification.md](../verification.md))
