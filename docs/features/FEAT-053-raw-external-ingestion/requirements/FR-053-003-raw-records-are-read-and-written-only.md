---
id: FR-053-003
title: "Raw records are read and written only inside one scope"
delivery: implemented
legacy: [FR-081 (split 3/4)]
relations:
  specified_by: [SDD-053]
  derived_from: [SEC-001]
---

# FR-053-003 — Raw records are read and written only inside one scope

The system SHALL access raw records only through a repository bound to one
`(tenantId, connectionId)` scope (optionally Business, run and provider), which SHALL
refuse — not filter — any row outside that scope, and SHALL verify that a referenced
Business and IngestionRun themselves resolve inside the scope.

## Acceptance criteria

- AC-053-003-01 — Given a repository scoped to connection A, when asked to insert a row naming connection B, then it throws and nothing is written.
- AC-053-003-02 — Given an ingestion run of another tenant, when referenced, then the insert is refused.

## Implementation

- apps/server/src/platform/integrations/core/raw-record-repository.js

## Verification

- TC-053-002 — Scope-bound repository (see [verification.md](../verification.md))
