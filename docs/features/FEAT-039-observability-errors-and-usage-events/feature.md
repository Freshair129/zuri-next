---
id: FEAT-039
title: "Observability: Errors & Usage Events"
type: domain-feature
owner: DOM-PLT
runtime: SRV-001
status: approved
delivery: building
legacy: [FEAT-042, FR-247, FR-248, FR-249]
relations:
  depends_on: []
  decided_by: [ADR-037]
---

# FEAT-039 — Observability: Errors & Usage Events

## Summary

Operators read a deduplicated, resolvable error list and a per-person
breakdown of which pages and actions are actually used, both extending the
existing structured logger rather than adopting a third-party service.

## Scope

**In:** fingerprinted, deduplicated `ErrorEvent` capture and its operator
read/resolve surface; route- and action-level `UsageEvent` capture, per
person, and its operator read surface; the 90-day retention rollup.
**Out:** the programme delivery telemetry (FEAT-037/005); any consent
or opt-out UI (deliberately not built — see BR-018 and ADR-037 D4).

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-PLT |
| Runtime owner | SRV-001 |

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-039-001](requirements/FR-039-001-errors-are-fingerprinted-deduplicated-and-operator-resolvable.md) | Errors are fingerprinted, deduplicated and operator-resolvable | — |
| [FR-039-002](requirements/FR-039-002-page-view-usage-is-recorded-per-person.md) | Page-view usage is recorded per person on every route change | — |
| [FR-039-003](requirements/FR-039-003-action-level-usage-is-an-adoptable-primitive.md) | Action-level usage is an adoptable primitive, not complete coverage | — |
| [NFR-039-001](requirements/NFR-039-001-no-consent-gate-a-stated-privacy-note.md) | No consent gate; a stated privacy note instead | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
