---
id: FR-064-004
title: "LINE binding status read contract"
delivery: building
legacy: [FR-147]
relations:
  specified_by: [none]
  decided_by: [ADR-060]
---

# FR-064-004 — LINE binding status read contract

The system SHALL answer exactly one question for a caller-supplied
`(tenantId, businessId, code)` — "is there a currently valid ACTIVE binding
here" — by selecting only state columns (`code, status, valid_from,
expires_at, rotated_at, version`, never a hash or credential column) through
the same `zuri_line_smartgift_ro` read role as FR-064-003, and SHALL
answer with exactly one of four labels: `ACTIVE`, `NOT_ACTIVE` (configured
reader, row not visible), `NO_BINDING` (no code on the account), or
`UNKNOWN` (no reader configured). The contract SHALL mutate nothing —
activation stays the operator path (legacy ADR-050).

## Acceptance criteria

- AC-064-004-01 — Given no binding code on the calling account, when `readLineBindingStatusLabel` runs, then it returns `NO_BINDING` without querying the database.
- AC-064-004-02 — Given `ZURI_LINE_DB_URL` unset, when `createLineBindingStatusReaderFromEnv` is called, then it returns `null` and the label resolves to `UNKNOWN`.
- AC-064-004-03 — Given a visible row whose `status` is not exactly `'ACTIVE'` (pending, inactive, expired, rotated), when the label is read, then it resolves to `NOT_ACTIVE` — the four read policies the role itself enforces (pending/inactive/expired/rotated/absent/out-of-policy) are indistinguishable by design.

## Implementation

- `apps/server/src/modules/agent/line-binding-status.js`, `apps/server/src/modules/agent/phase1-runtime.js`
