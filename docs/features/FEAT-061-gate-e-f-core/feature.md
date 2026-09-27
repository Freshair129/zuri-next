---
id: FEAT-061
title: Gate E/F core — read context, write/action gate, end-to-end turn, tool authorization
type: domain-feature
owner: DOM-AGT
runtime: SRV-001
status: proposed
delivery: implemented
legacy: [FR-025, FR-026, FR-027, FR-098]
relations:
  depends_on: [FR-003-009]
  decided_by: [ADR-060]
---

# FEAT-061 — Gate E/F core — read context, write/action gate, end-to-end turn, tool authorization

## Summary

The agent's own read/write authority ladder for a LINE turn: Gate E is the
read-only context+tool assembly a resolved principal always gets; Gate F is
the separate write/action registry a turn may additionally invoke, gated by
RBAC-or-ownership authorization and, for HIGH-sensitivity actions, a
single-use step-up token. `handleAgentTurn` composes both into one turn.
Used by whichever server-side seam admits a LINE (or equivalent) turn; today
that is exercised only by tests and by the native SERVER LINE answer path's
reuse of the read half (§9 — the write half currently has no live caller).

## Scope

**In:** the Gate E read-only tool registry and its registration guard; the
Gate F write-tool registry and its registration guard; `authorizeAgentAction`
(RBAC role match or resource ownership, HIGH ⇒ step-up); `executeAgentAction`
(resolve principal → authorize → step-up → one transaction → one audit
event); `handleAgentTurn`'s composition of ingest → context → optional action
→ response, with graceful degradation on denial/step-up; the shared
tool/action authorization boundary (`requireToolAuthorization`,
`authorizeAgentToolExecution`) that every handler and action must pass before
any read or write.
**Out:** identity/principal resolution itself (FR-067-001, owned by the
authorization seam `resolveAgentAuthorization`); the webhook route that used
to invoke this turn (FEAT-062); the concrete tool descriptors beyond the
three demonstration Gate E tools and five demonstration Gate F actions
shipped here (FR-063-003's SmartGift tools are FEAT-063; FR-061-002's LINE
project-work tools are documented under this feature's implementation map
but not restated as a separate FR here since they are additional Gate F
descriptors, not a new gate).

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-AGT |
| Runtime owner | SRV-001 |

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-061-001](requirements/FR-061-001-agent-read-only-context-contract-gate-e.md) | Agent read-only context contract (Gate E) | — |
| [FR-061-002](requirements/FR-061-002-agent-write-action-gate-gate-f.md) | Agent write/action gate (Gate F) | — |
| [FR-061-003](requirements/FR-061-003-end-to-end-agent-turn.md) | End-to-end agent turn | — |
| [FR-061-004](requirements/FR-061-004-agent-tool-msp-authorization.md) | Agent/tool/MSP authorization | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
