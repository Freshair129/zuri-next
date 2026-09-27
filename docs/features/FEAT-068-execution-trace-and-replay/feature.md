---
id: FEAT-068
title: Execution trace and replay
type: domain-feature
owner: DOM-AGT
runtime: SRV-001
status: proposed
delivery: implemented
legacy: [FR-171]
relations:
  depends_on: [FR-093-003, FR-093-004, FR-093-005, FR-093-006, FR-093-007, FR-093-008, FR-093-009, FR-093-010, FR-093-011, FR-093-012, legacy:FR-150, FR-092-001, FR-092-002, FR-092-003, FR-092-007, FR-092-004, FR-092-005, FR-092-006]
  decided_by: [ADR-061]
---

# FEAT-068 — Execution trace and replay

## Summary

The agent domain's one owned, append-only evidence journal
(`AgentTraceEvent`) for the native SERVER LINE path: one row per observable
turn occurrence (input received, model call, tool/action, retrieval,
memory reference, delivery attempt), a small closed event vocabulary, an
owner-only read-only playback route, and an explicit default of *no*
private-memory adapter unless a job opted in immutably at admission time.
This is the only lane through which the agent asserts what evidence a
LINE answer actually used — it never executes anything itself.

## Scope

**In:** the `AgentTraceEvent` schema and its write discipline
(idempotency, secret-field rejection, size limits, turn-open/tombstone
locking — FR-068-001); the owner-only read-only playback contract
(FR-068-002); native SERVER's default-excluded, opt-in-only memory
composition (FR-068-003).
**Out:** MSP Soul/session/memory authority, GKS retrieval authority, and
the optional Edge execution adapter — all external, separately gated
authorities this journal only *references*, never writes to directly.

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-AGT |
| Runtime owner | SRV-001 |

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-068-001](requirements/FR-068-001-append-only-execution-trace-journal.md) | Append-only execution trace journal | — |
| [FR-068-002](requirements/FR-068-002-owner-only-read-only-playback.md) | Owner-only read-only playback | — |
| [FR-068-003](requirements/FR-068-003-native-server-default-memory-exclusion.md) | Native SERVER default memory exclusion | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
