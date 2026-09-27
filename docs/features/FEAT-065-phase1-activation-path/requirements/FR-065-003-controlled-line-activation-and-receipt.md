---
id: FR-065-003
title: "Controlled LINE activation and receipt"
delivery: building
legacy: [FR-055]
relations:
  specified_by: [none]
  decided_by: [ADR-060]
---

# FR-065-003 — Controlled LINE activation and receipt

The system SHALL activate exactly one binding through a single
compare-and-swap `UPDATE` that matches the binding's current
`(id, tenantId, businessId, code, provider, version, status='PENDING')`
tuple and requires the destination/credential hash columns to be currently
null before the swap, executed under the dedicated
`zuri_line_activation_operator` role. Before that swap the system SHALL
re-verify the SHA-256 of every evidence file (canary plan, golden report,
isolation report) named in the activation input against the hash the
caller asserts, refusing with `LINE_ACTIVATION_EVIDENCE_MISMATCH` on any
divergence, and SHALL append one redacted `line_activation_event` receipt
row per attempt whose `receiptState` distinguishes `EVIDENCE_VERIFIED` from
`ACCEPTED_BY_LINE`/`DISPLAYED_UNKNOWN`/`READ_UNKNOWN` — never conflating
"the database was updated" with "LINE accepted or a customer saw anything."
A rollback SHALL be routing-first (disable routing before clearing hashes).

## Acceptance criteria

- AC-065-003-01 — Given an evidence file whose live SHA-256 does not match the hash recorded in the activation input, when activation runs, then it fails closed with `LINE_ACTIVATION_EVIDENCE_MISMATCH` before any database write.
- AC-065-003-02 — Given a binding row whose `version` no longer matches the expected `bindingVersion` (a concurrent change), when the compare-and-swap `UPDATE` runs, then it affects zero rows and the caller observes a CAS failure rather than silently overwriting a newer state.
- AC-065-003-03 — Given a successful activation, when the receipt is recorded, then `receiptState` is `EVIDENCE_VERIFIED` (never `ACCEPTED_BY_LINE`) — this port never claims LINE accepted anything, only that its own evidence was verified and its own row was swapped.

## Implementation

- `apps/server/src/modules/agent/line-activation-contract.js`, `apps/server/src/modules/agent/line-binding-activation.js`, `apps/server/src/modules/agent/line-operator.js`, `apps/server/src/modules/agent/zuri-cli-canary-receipt.js`
