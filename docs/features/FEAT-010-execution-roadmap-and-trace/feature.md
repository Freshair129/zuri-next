---
id: FEAT-010
title: Execution roadmap, agent/meeting intake, stable identities & trace
type: domain-feature
owner: DOM-PRJ
runtime: SRV-001
status: draft
delivery: live
legacy: [FEAT-003, FR-068, FR-069, FR-070, ADR-028, ADR-029, ADR-102]
relations:
  depends_on: [FEAT-007, FEAT-009, FR-029-004]
  decided_by: [ADR-007, ADR-008, ADR-017]
---

# FEAT-010 — Execution roadmap, agent/meeting intake, stable identities & trace

## Summary

Humans and agents see and drive the same Project execution structure. Humans get an
Execution Roadmap view of phases/sprints/items, goals, blockers and closure gates; agents
plan through MCP tools and meeting products hand over action items — all through the one
PlanEnvelope pipeline. Every committed plan carries stable, owner-resolved identities
(execution mode, contract, plan = Workstream, domain bindings, goal links) and every intake
is recorded in an append-only run/step/attempt trace that can be replayed.

## Scope

**In:** Execution Roadmap read model and view; MCP transport for PM tools; meeting-action
intake adapter; stable identity catalogue and validation; ProjectExecutionRun/Step ledger;
append-only full/partial replay.
**Out:** approval of effectful agent steps (FEAT-011); Risk, Tag, Artifact, Meeting and
other supporting-identity owners (not yet existing — refused); provider-subject binding
provisioning (`/api/identity/meeting-bindings`, DOM-IAM); knowledge and data-pipeline MCP
tools (FR-073-001, FR-060-001, FR-060-002, FR-060-003, FR-060-004, FR-060-005 — DOM-KNW/DOM-INT), which share this transport.

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-PRJ |
| Runtime owner | SRV-001 |

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-010-001](requirements/FR-010-001-execution-roadmap-read-model.md) | Execution Roadmap read model | — |
| [FR-010-002](requirements/FR-010-002-agent-intake-over-mcp.md) | Agent intake over MCP | — |
| [FR-010-003](requirements/FR-010-003-meeting-action-intake.md) | Meeting-action intake | — |
| [FR-010-004](requirements/FR-010-004-execution-trace-ledger.md) | Execution trace ledger | — |
| [FR-010-005](requirements/FR-010-005-append-only-replay.md) | Append-only replay | — |
| [FR-010-006](requirements/FR-010-006-stable-execution-domain-and-goal-identities.md) | Stable execution, domain and goal identities | — |
| [NFR-010-001](requirements/NFR-010-001-trace-is-evidence-never-a-blocker.md) | Trace is evidence, never a blocker | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
