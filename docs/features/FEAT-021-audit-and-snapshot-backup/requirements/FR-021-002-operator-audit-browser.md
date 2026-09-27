---
id: FR-021-002
title: "Operator audit browser"
delivery: live
legacy: [FR-014 (split 2/2 — browser)]
relations:
  specified_by: [API-001]
  depends_on: [FR-032-003]
---

# FR-021-002 — Operator audit browser

The system SHALL list audit events newest first, filterable by entity type and entity id, with limit
default 100 and max 500 plus a `truncated` flag and the list of known entity types, only for an
installation operator, recording that operator read as its own audited use.

## Acceptance criteria

- AC-021-002-01 — Given a non-operator, then 403 "Audit events are an installation-wide read…".
- AC-021-002-02 — Given 600 matching events and `limit=1000`, then 500 events and `truncated: true`.

## Verification

- TC-021-001 — Audit browser (see [verification.md](../verification.md))
