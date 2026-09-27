---
id: FR-091-003
title: "Exactly one binding-scoped Phase-1 connection is selected"
part: FEAT-091-P02
owner: DOM-INT
delivery: building
legacy: [FR-079 (split 1/3)]
relations:
  specified_by: [SDD-091]
  decided_by: [ADR-052]
---

# FR-091-003 — Exactly one binding-scoped Phase-1 connection is selected

The system SHALL, after the server-owned LINE binding resolved the trusted
Tenant/Business, select the connection with `purpose = PHASE1_LINE_LLM`,
`status = ACTIVE`, `role = PRIMARY` in exactly that scope; zero candidates SHALL fail
`PHASE1_CONNECTION_NOT_FOUND`, several `PHASE1_CONNECTION_AMBIGUOUS`, and a connection
outside the Business `CONNECTION_OUTSIDE_BUSINESS`. Promotion to PRIMARY uses
compare-and-swap under a database uniqueness invariant.

## Acceptance criteria

- AC-091-003-01 — Given two ACTIVE PRIMARY Phase-1 connections for one Business, when resolved, then it fails `PHASE1_CONNECTION_AMBIGUOUS` before any knowledge or model work.

## Implementation

- apps/server/src/platform/integrations/core/integration-registry.js

## Verification

- TC-091-002 — Connection selection and secret resolution (see [verification.md](../verification.md))
