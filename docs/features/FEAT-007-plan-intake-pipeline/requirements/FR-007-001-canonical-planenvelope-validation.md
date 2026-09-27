---
id: FR-007-001
title: "Canonical PlanEnvelope validation"
delivery: live
legacy: [FR-012 (split 1/3 — schema and semantic check)]
relations:
  specified_by: [SDD-007, API-039]
  derived_from: [BR-052, BR-054, SEC-002]
---

# FR-007-001 — Canonical PlanEnvelope validation

The system SHALL accept a plan only as a strict `PlanEnvelope` (`schemaVersion` 1.0, 1.1 or
1.2; unknown properties rejected) carrying `project{code,name,…}`, `workstreams[]` (code,
name, `executionMode`, `progressStrategy`, optional weight, containers, items, milestones,
gates, tag refs), optional `repositories[]`, `dependencies[]` (by code refs), `scope`
codes, `trace`, `domainBinding` and `identityRefs`, and SHALL then run semantic checks:
unique codes across the envelope, each external id claimed once, containers/items reference
containers of the same Workstream (no self-parent), dependency refs resolve to codes in the
envelope (never to repositories, never to themselves), and the seven-mode contract per
Workstream — `progressStrategy` equals the mode's strategy, container and item subtypes and
metric keys are in the mode's allowlists, `executionModeId`/`executionContractId` (when given)
match the mode — plus, for 1.2, the presence of `trace.correlationId`, `trace.idempotencyKey`,
per-Workstream `executionModeId`/`executionContractId`/`contractVersion`,
`domainBinding.primaryDomainId` matching the mode's default binding and
`technicalOwnerDomainId = TD-PROJECT-MANAGER`. Any
failure SHALL return `{ valid: false, errors[] }` with path-qualified messages and write
nothing. No field of a plan SHALL ever be executed.

## Acceptance criteria

- AC-007-001-01 — Given an envelope with an extra property `script`, then validation fails and nothing is written.
- AC-007-001-02 — Given two items with the same code, then the error names the duplicate code and both kinds.
- AC-007-001-03 — Given schemaVersion 1.2 without `trace.idempotencyKey`, then it is refused.
- AC-007-001-04 — Given a SOFTWARE_SPRINT Workstream with item subtype DEAL or strategy KPI_ATTAINMENT, then the plan is refused naming the allowed values.

## Implementation

- apps/server/src/modules/project-manager/import/plan-schema.js; contracts/plan-envelope.schema.json

## Verification

- TC-007-001 — Schema and semantic validation (see [verification.md](../verification.md))
- TC-007-002 — Dry run, commit, rollback and idempotency (see [verification.md](../verification.md))
