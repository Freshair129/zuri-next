---
id: FR-010-006
title: "Stable execution, domain and goal identities"
delivery: live
legacy: [FR-070]
relations:
  decided_by: [ADR-008]
  derived_from: [BR-047, BR-049]
---

# FR-010-006 — Stable execution, domain and goal identities

The system SHALL give each execution mode a stable `executionModeId` (`EXM-…`) and contract
id (`EXC-…-V1`) mapped one-to-one to the legacy mode alias, strategy, subtype and metric
allowlists; SHALL expose `planId` = Workstream UUID (no separate plan entity); SHALL bind each
committed plan to `primaryDomainId`, `supportingDomainIds[]` and `technicalOwnerDomainId =
TD-PROJECT-MANAGER` from a product-domain catalogue (stable ids mapped to route keys, never used
as foreign keys), defaulting per mode; SHALL resolve `project.goalIds[]` inside the target
Business (missing or cross-Business → conflict) and persist them as ProjectGoal links in the
commit transaction; and SHALL refuse, rather than store as free text, identity references whose
owner does not exist yet (risk ids, supporting identity refs). Unknown mode or domain ids SHALL
fail closed; a label can never create an identity.

## Acceptance criteria

- AC-010-006-01 — Given a 1.2 Workstream with `executionModeId: EXM-B2B-SALES` and mode SOFTWARE_SPRINT, then refused as mismatched.
- AC-010-006-02 — Given `goalIds` containing a goal of another Business, then the dry run lists a conflict and commit writes nothing.
- AC-010-006-03 — Given `project.riskIds` non-empty, then refused "no Project Manager Risk owner exists".

## Implementation

- apps/server/src/modules/project-manager/import/plan-schema.js; apps/server/src/modules/project-manager/project-domain-catalog.js; import/plan-import-service.js

## Verification

- TC-010-005 — Stable identities and goal links (see [verification.md](../verification.md))
