---
id: FEAT-011
title: Approval gateway for effectful agent steps
type: domain-feature
owner: DOM-PRJ
runtime: SRV-001
status: draft
delivery: implemented
legacy: [FR-272, ADR-103]
relations:
  depends_on: [FEAT-010, FR-024-003]
  decided_by: [ADR-018, ADR-017]
---

# FEAT-011 — Approval gateway for effectful agent steps

## Summary

Before an Agent or Fleet executes an effectful step of a Project run (project write,
external message, spend, credential change, merge, deploy, destructive action), the exact
intent is frozen into an approval request that a different, currently-eligible human must
approve; the executor may then be admitted exactly once, under a short lease, only if nothing
changed. Read-only steps need no approval. Reviewers use the web console / API scoped to one
Project run.

## Scope

**In:** approval request creation (in-process contract for executors), canonical digest,
listing per run, approve/reject decisions, expiry, revocation/supersession, one-time
admission, append-only audit of every transition.
**Out:** the executors themselves and their effect receipts; Identity capability grants
(DOM-IAM); provider-specific approval records; production activation.

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-PRJ |
| Runtime owner | SRV-001 |

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-011-001](requirements/FR-011-001-immutable-approval-request-per-effectful-step.md) | Immutable approval request per effectful step | — |
| [FR-011-002](requirements/FR-011-002-decisions-by-an-eligible-different-reviewer.md) | Decisions by an eligible, different reviewer | — |
| [FR-011-003](requirements/FR-011-003-one-time-admission-with-re-verification.md) | One-time admission with re-verification | — |
| [NFR-011-001](requirements/NFR-011-001-race-safety.md) | Race safety | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
