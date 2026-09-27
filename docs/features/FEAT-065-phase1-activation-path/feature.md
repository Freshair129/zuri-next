---
id: FEAT-065
title: Phase 1 activation path — golden evaluation, canary readiness, activation receipt
type: domain-feature
owner: DOM-AGT
runtime: SRV-001
status: proposed
delivery: building
legacy: [FR-053, FR-054, FR-055]
relations:
  depends_on: [ADR-050]
  decided_by: [ADR-060]
---

# FEAT-065 — Phase 1 activation path — golden evaluation, canary readiness, activation receipt

## Summary

The three dry-run-first gates a Business's LINE binding must clear before it
is ever allowed to answer a real customer: pass a golden corpus of ≥20
approved business questions, produce a secret-safe readiness/canary plan
naming the exact binding and provider to be activated, and only then let an
operator run a versioned, evidence-pinned compare-and-swap that flips
exactly one binding from PENDING to ACTIVE. None of the three steps can
send a LINE message or widen scope on their own; each is a fail-closed,
redacted, replay-safe check or transaction.

## Scope

**In:** golden-question corpus validation and evaluation
(`validateGoldenQuestionCorpus`, `parseGoldenQuestionCorpus`); the canary
dry-run plan and its exact prerequisite checks
(`createCanaryPreflightPlan`); the activation/rollback compare-and-swap and
its receipt states (`line-binding-activation.js`, `line-activation-contract.js`).
**Out:** the actual real-provider execution of a golden question, and any
signed LINE canary send — both are external, owner-approved gates this
feature validates readiness for, never performs.

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-AGT |
| Runtime owner | SRV-001 |

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-065-001](requirements/FR-065-001-phase-1-golden-question-evaluation.md) | Phase 1 golden question evaluation | — |
| [FR-065-002](requirements/FR-065-002-controlled-line-canary-readiness.md) | Controlled LINE canary readiness | — |
| [FR-065-003](requirements/FR-065-003-controlled-line-activation-and-receipt.md) | Controlled LINE activation and receipt | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
