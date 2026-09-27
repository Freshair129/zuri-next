---
id: FR-072-003
title: "Knowledge sensitivity lattice and processing policy"
delivery: building
legacy: [FR-111]
relations:
  specified_by: [SDD-072]
  derived_from: [SEC-001, SEC-008, SEC-020]
  decided_by: [ADR-063]
---

# FR-072-003 — Knowledge sensitivity lattice and processing policy

The system SHALL widen business-knowledge classification from a single hard-coded
`PUBLIC` literal to a four-level lattice — `PUBLIC`, `INTERNAL`, `CONFIDENTIAL`,
`RESTRICTED` — and SHALL require, with no default, four per-object processing-policy
fields (`retention_policy`, `export_policy`, `cloud_processing_allowed`,
`embedding_allowed`) before an object may be classified at all; `false` SHALL be
accepted and preserved as a stated value, never mistaken for absence. Classification
SHALL happen at Stage 5, strictly before chunking, embedding or indexing — the system
SHALL provide a gate (`assertIndexable`) that **re-validates** a classification in
full at the index boundary rather than trusting that a `classification` field is
present. `resolveExecutionLocation` SHALL return `LOCAL` whenever
`cloud_processing_allowed` is false, taking no deployment-preference parameter that
could widen it. This lattice SHALL extend, never replace, the existing cross-tenant
guard and deny-by-default public read boundary; the query filter that decides what is
**served** to a public surface SHALL remain fixed at `PUBLIC` regardless of how many
levels the storage schema admits.

## Acceptance criteria

- AC-072-003-01 — Given the widened four-level enum, when an existing public read surface is queried, then it returns exactly the rows it returned before — no existing surface serves a wider set merely because the enum grew.
- AC-072-003-02 — Given an object missing `export_policy`, when classified, then it is refused naming that field, not silently classified with a default.
- AC-072-003-03 — Given `cloud_processing_allowed: false`, when execution location is resolved with a caller-supplied `{ preferred: 'CLOUD', force: true }`, then the object still resolves to `LOCAL`.
- AC-072-003-04 — Given a classification object that lost its `tenantId` between classification and the index boundary, when `assertIndexable` runs, then it is refused — the check re-validates rather than trusting the field's mere presence.

## Implementation

- apps/server/src/lib/validation/enums.js; apps/server/src/modules/knowledge/classification.js

## Verification

- TC-072-003 — Sensitivity lattice, no-default policy fields and re-validated gate (see [verification.md](../verification.md))
