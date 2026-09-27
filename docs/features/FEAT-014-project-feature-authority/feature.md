---
id: FEAT-014
title: Project feature authority
type: domain-feature
owner: DOM-PRJ
runtime: SRV-001
status: draft
delivery: building
legacy: [FR-252, ADR-097]
relations:
  depends_on: [FEAT-013, FEAT-004, legacy:FR-252-P2, FR-029-005]
  decided_by: [ADR-015]
---

# FEAT-014 — Project feature authority

## Summary

Lets a Business owner declare explicit Features for a Project — the problem, outcome and
primary domain — and bind them to supporting domains, the WorkItems that deliver them (with
optional allocation) and requirement revisions pinned to verified governance snapshots of a
linked repository. Readers of the Project discover Features and their evidence under
Delivery Design → Features. Every write is CSRF-protected, idempotent, version-checked and
atomically audited; deletion is recoverable by cohort.

## Scope

**In:** six records (ProjectFeature, FeatureContribution, FeatureWorkLink, RequirementBinding,
GovernanceSnapshot, ProjectFeatureMutationReceipt); nine mutation operations and five read
operations; governance snapshot capture; soft delete/restore; reviewed erasure of Feature text;
protected backup/recovery of these tables; Feature view UI.
**Out:** session CSRF token issuance and verification (DOM-IAM, legacy:FR-252-P2); inferring
Features from Workstream bindings (never — FEAT-013 stays separate); production activation.

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-PRJ |
| Runtime owner | SRV-001 |

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-014-001](requirements/FR-014-001-feature-records.md) | Feature records | — |
| [FR-014-002](requirements/FR-014-002-domain-contributions-work-links-and-requirement-bindings.md) | Domain contributions, work links and requirement bindings | — |
| [FR-014-003](requirements/FR-014-003-verified-governance-snapshots.md) | Verified governance snapshots | — |
| [FR-014-004](requirements/FR-014-004-soft-delete-and-cohort-restore.md) | Soft delete and cohort restore | — |
| [FR-014-005](requirements/FR-014-005-mutation-admission-contract.md) | Mutation admission contract | — |
| [FR-014-006](requirements/FR-014-006-scope-first-reads.md) | Scope-first reads | — |
| [FR-014-007](requirements/FR-014-007-reviewed-erasure-and-protected-recovery.md) | Reviewed erasure and protected recovery | — |
| [NFR-014-001](requirements/NFR-014-001-serializable-graph-writes.md) | Serializable graph writes | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
