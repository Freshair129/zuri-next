---
id: FR-009-001
title: "Scope and schema before any sensitive parsing"
delivery: implemented
legacy: [FR-108 (split 1/4 — scope and schema)]
relations:
  specified_by: [SDD-009, API-005]
  decided_by: [ADR-013]
  derived_from: [BR-002]
---

# FR-009-001 — Scope and schema before any sensitive parsing

The system SHALL resolve the trusted viewer and the bundle's target scope (Business and
Workspace) before parsing any sensitive content, authorizing it with the import composition
(`ownsBusiness`, or a Tenant-bound API key for the Business's Tenant), and SHALL then validate
the bundle against its normative schema and bundle-level semantics (unique symbols, intra-bundle
dependency cycles, horizon cardinality 2–3 for a new Roadmap). A preview of another scope SHALL
be refused exactly as a write would be.

## Acceptance criteria

- AC-009-001-01 — Given a bundle naming a Business the viewer does not own, when dry-run is called, then the refusal carries no preview and equals the not-found refusal.
- AC-009-001-02 — Given two Projects in the bundle depending on each other, then the dry run reports a cycle.

## Implementation

- apps/server/src/modules/project-manager/import/bundle/bundle-schema.js; bundle-dry-run.js; apps/server/src/app/api/import/bundle/dry-run/route.js

## Verification

- TC-009-001 — Bundle schema (see [verification.md](../verification.md))
- TC-009-002 — Bundle orchestration end to end (see [verification.md](../verification.md))
- TC-009-003 — Bundle routes in the OpenAPI document and import authorization (see [verification.md](../verification.md))
