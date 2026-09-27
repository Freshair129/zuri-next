---
id: FEAT-093
title: Server-owned LINE conversation transport
type: cross-domain-feature
owner: DOM-LOA
runtime: SRV-002
participants:
  - domain: DOM-CRM
    part: FEAT-093-P01
    role: "Account-scoped CRM conversations"
  - domain: DOM-INT
    part: FEAT-093-P02
    role: "Evidence capture and LINE messaging port"
  - domain: DOM-LOA
    part: FEAT-093-P03
    role: "Webhook ingress, admission and reconciliation"
  - domain: DOM-LOA
    part: FEAT-093-P04
    role: "Job ledger, worker tick and truthful send"
  - domain: DOM-AGT
    part: FEAT-093-P05
    role: "Server answer execution"
status: draft
delivery: implemented
legacy: [FEAT-019, FR-148, FR-149, FR-150]
relations:
  depends_on: [API-132, API-131, API-147, API-146, API-116, API-117, FEAT-048]
  decided_by: [ADR-045, ADR-047, ADR-049]
---

# FEAT-093 — Server-owned LINE conversation transport

## Summary

LINE Official Accounts talk to customers through this server: LINE's signed webhook
reaches a per-account endpoint, every event is captured as Integration evidence before
LINE is acknowledged, admission records the CRM message and a uniquely keyed
conversation job in one transaction, a bounded worker answers waiting customers in
parallel and sends ready answers through the Integration-owned LINE port, and only
provider acceptance is recorded. Conversations are namespaced by LINE OA account.
Device-side (Edge) execution, the optional half of the source decision, is retired.

## Scope

**In:** account-scoped conversation identity; webhook ingress and durable capture;
admission and its crash reconciler; job ledger, leases, fencing, retries, send and
acceptance; the worker tick and its cadence; failure visibility; server answer
execution for claimed jobs.
**Out:** account lifecycle and ENABLE/DISABLE actions (FEAT-048, FEAT-094);
non-text content and memory (FEAT-095); sessions (FEAT-042); rich menu jobs
(FEAT-049); Edge execution (retired).

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-LOA |
| Runtime owner | SRV-002 (worker tick) · SRV-001 (webhook, admission) |

| Part | Title | Owner | Runtime | FRs |
|---|---|---|---|---|
| FEAT-093-P01 | Account-scoped CRM conversations | DOM-CRM | SRV-001 | FR-093-001, FR-093-002 |
| FEAT-093-P02 | Evidence capture and LINE messaging port | DOM-INT | SRV-001 | FR-093-003, FR-093-004 |
| FEAT-093-P03 | Webhook ingress, admission and reconciliation | DOM-LOA | SRV-001 | FR-093-005, FR-093-006, FR-093-007 |
| FEAT-093-P04 | Job ledger, worker tick and truthful send | DOM-LOA | SRV-002 | FR-093-008, FR-093-009, FR-093-010, FR-093-011 |
| FEAT-093-P05 | Server answer execution | DOM-AGT | SRV-002 | FR-093-012 |

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-093-001](requirements/FR-093-001-conversation-identity-includes-the-trusted-channel-account.md) | Conversation identity includes the trusted channel account | FEAT-093-P01 |
| [FR-093-002](requirements/FR-093-002-crm-writes-compose-into-the-callers-transaction.md) | CRM writes compose into the caller's transaction and enforce scope | FEAT-093-P01 |
| [FR-093-003](requirements/FR-093-003-every-webhook-event-is-recorded-as-integration.md) | Every webhook event is recorded as Integration evidence without its reply token | FEAT-093-P02 |
| [FR-093-004](requirements/FR-093-004-one-integration-owned-port-signs-sends-and.md) | One Integration-owned port signs, sends and classifies LINE calls | FEAT-093-P02 |
| [FR-093-005](requirements/FR-093-005-line-is-acknowledged-only-after-a-restart.md) | LINE is acknowledged only after a restart-recoverable capture | FEAT-093-P03 |
| [FR-093-006](requirements/FR-093-006-admission-writes-the-crm-message-and-one.md) | Admission writes the CRM message and one job atomically | FEAT-093-P03 |
| [FR-093-007](requirements/FR-093-007-abandoned-admissions-are-reconciled-from-stored-evidence.md) | Abandoned admissions are reconciled from stored evidence | FEAT-093-P03 |
| [FR-093-008](requirements/FR-093-008-jobs-are-leased-and-fenced-per-account.md) | Jobs are leased and fenced per account ownership | FEAT-093-P04 |
| [FR-093-009](requirements/FR-093-009-one-tick-answers-several-customers-and-sends.md) | One tick answers several customers and sends in order | FEAT-093-P04 |
| [FR-093-010](requirements/FR-093-010-sends-are-truthful-acceptance-retry-and-unknown.md) | Sends are truthful: acceptance, retry and UNKNOWN | FEAT-093-P04 |
| [FR-093-011](requirements/FR-093-011-unanswered-customers-are-visible-without-a-database.md) | Unanswered customers are visible without a database query | FEAT-093-P04 |
| [FR-093-012](requirements/FR-093-012-a-claimed-job-is-answered-in-scope.md) | A claimed job is answered in scope with a bounded reply | FEAT-093-P05 |
| [NFR-093-001](requirements/NFR-093-001-webhook-acknowledgement-latency.md) | Webhook acknowledgement latency | — |
| [NFR-093-002](requirements/NFR-093-002-bounded-work-per-tick.md) | Bounded work per tick | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
