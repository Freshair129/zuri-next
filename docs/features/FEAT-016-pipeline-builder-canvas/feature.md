---
id: FEAT-016
title: Pipeline builder canvas
type: domain-feature
owner: DOM-PRJ
runtime: SRV-001
status: draft
delivery: declared
legacy: [FEAT-007, FR-082, FR-083, FR-084, FR-085, ADR-035]
relations:
  depends_on: [FEAT-003, FEAT-006, FEAT-007]
  decided_by: [ADR-010]
---

# FEAT-016 — Pipeline builder canvas

## Summary

Turns the read-only Structure Plan and Dependency Map into one direct-manipulation canvas:
add and reparent nodes in place, draw dependency edges by dragging — and every edge must carry
a Handoff Contract (what the predecessor owes, and how acceptance is decided). The Board then
holds work whose declared contracts are unsatisfied. Design only: no code exists and
implementation is not authorized.

## Scope

**In:** in-place structure editing with keyboard equivalents; edge creation with a mandatory
contract dialog; Handoff Contract on `Dependency`; contract-gated release on the Board.
**Out:** persisted node positions (never); free-form layout; cross-project editing.

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-PRJ |
| Runtime owner | SRV-001 |

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-016-001](requirements/FR-016-001-structure-editing-by-direct-manipulation.md) | Structure editing by direct manipulation | — |
| [FR-016-002](requirements/FR-016-002-edge-creation-with-a-non-skippable-contract.md) | Edge creation with a non-skippable contract dialog | — |
| [FR-016-003](requirements/FR-016-003-handoff-contract-on-a-dependency-edge.md) | Handoff Contract on a dependency edge | — |
| [FR-016-004](requirements/FR-016-004-contract-gated-release-on-the-board.md) | Contract-gated release on the Board | — |
| [NFR-016-001](requirements/NFR-016-001-dragging-movements-have-equivalents.md) | Dragging movements have equivalents | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
