---
id: FR-019-003
title: "Business goals"
delivery: implemented
legacy: [FR-059 (split 2/3 — goals)]
relations:
  specified_by: [API-012, API-008]
  derived_from: [BR-089]
---

# FR-019-003 — Business goals

The system SHALL let an owner create a Goal under a horizon (horizon required; its roadmap derived
from the horizon; a `horizonId` not belonging to the given `roadmapId` is refused) with title,
description, status, priority, progress (0–100), optional perspective and start/target dates, and
update those fields (a Goal may move to another horizon but never be detached). A manual `progress`
patch SHALL be refused (409) while the Goal holds any non-archived Key Result.

## Acceptance criteria

- AC-019-003-01 — Given a Goal with one active Key Result, when PATCH `{progress: 50}`, then 409 citing BR-089.
- AC-019-003-02 — Given no `horizonId`, then 400.

Delivery: live

## Verification

- TC-019-002 — Strategy mutations (see [verification.md](../verification.md))
