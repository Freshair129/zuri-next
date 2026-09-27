---
id: FEAT-012
title: Project inventory snapshot
type: domain-feature
owner: DOM-PRJ
runtime: SRV-001
status: draft
delivery: live
legacy: [FEAT-005, FR-077, ADR-034]
relations:
  depends_on: [FEAT-003, FEAT-004, FEAT-005, FEAT-017]
  decided_by: [ADR-009]
---

# FEAT-012 — Project inventory snapshot

## Summary

One authorized, read-only, versioned snapshot of everything a Project contains — structure,
milestones and gates, project-contained dependencies, file metadata, repository links, team,
progress with evidence and redacted recent activity — for people and agents who need the whole
operational picture of one Project in a single call. Shown under Project Management →
Inventory.

## Scope

**In:** `PROJECT_INVENTORY` DTO v1.0; per-section pagination and truncation metadata; read
authorization; redaction; Inventory tab UI.
**Out:** any mutation or external sync; changes to the Project list or compatibility views;
binary file content.

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-PRJ |
| Runtime owner | SRV-001 |

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-012-001](requirements/FR-012-001-project-inventory-dto.md) | Project inventory DTO | — |
| [FR-012-002](requirements/FR-012-002-bounded-sections-and-read-authorization.md) | Bounded sections and read authorization | — |
| [NFR-012-001](requirements/NFR-012-001-inventory-latency-under-load.md) | Inventory latency under load | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
