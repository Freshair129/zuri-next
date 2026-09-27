---
id: FR-097-005
title: "Self-hosted inference policy and cutover"
part: FEAT-097-P05
owner: DOM-LOA
delivery: declared
legacy: [FR-259]
relations:
  decided_by: [ADR-062]
  depends_on: [FEAT-097-P02, FEAT-097-P03, FEAT-097-P04]
---

# FR-097-005 — Self-hosted inference policy and cutover

The system SHALL allow explicit, account-level selection of an authorized
self-hosted inference pool with an immutable per-job policy/profile
snapshot, preserved Server-owned LINE delivery ownership, and a quiescent,
reversible, inference-only cutover procedure.

## Acceptance criteria

- AC-097-005-01 — Given an account has not opted in, when this capability ships, then that account's existing execution/provider/Edge configuration SHALL remain unchanged until an explicit per-account opt-in.
- AC-097-005-02 — Given an account is activated onto a self-hosted pool, when a job is admitted, then the job SHALL snapshot execution placement, processing policy, pool id/version and profile hash immutably, and a later policy or profile change SHALL NOT silently retarget an already-admitted job.
- AC-097-005-03 — Given the cutover procedure is invoked, when it runs, then it SHALL quiesce and drain the account's outstanding work, require an explicit owner-authorized live canary, and remain rollback-capable without ever enabling a second LINE sender or deleting Edge data/secrets.
- AC-097-005-04 — Given both nodes are unavailable or the reply deadline is exhausted, when this occurs, then the system SHALL produce a distinct, honest failure/UNKNOWN state rather than a hidden fallback to a hosted provider.

## Implementation

- Not implemented — approved design only (legacy `FR-097-005`, `code: []`, `tests: []`)
