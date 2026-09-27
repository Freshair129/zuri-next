---
id: FEAT-051
title: Account conversation timing
type: domain-feature
owner: DOM-LOA
runtime: SRV-001
status: draft
delivery: building
legacy: [FEAT-040, FR-243, FR-244]
relations:
  depends_on: [API-111]
  decided_by: [ADR-044]
---

# FEAT-051 — Account conversation timing

## Summary

Two per-account timing settings this domain owns on `LineOaAccount`: the
conversation session idle-timeout (how long silence must pass before the next
message opens a new session — the session itself is CRM's) and declared
business hours with a fixed out-of-hours reply, answered without a model call.
The edge-side "keep a local model warm" half of the original business-hours
design is retired along with edge execution (`FEAT-050`) and is
crosswalked separately.

## Scope

**In:** the account's `sessionIdleTimeoutMinutes` setting and the
`CONFIGURE_SESSION_TIMEOUT` action; the `LineConversationJob.sessionId`
reference copied at admission; the account's `businessHoursOpen/Close` and
`outOfHoursReplyText` settings and the `CONFIGURE_BUSINESS_HOURS` action; the
admission-time rule that answers an out-of-hours message with the fixed reply
and no model call.
**Out:** session assignment logic, the inbox divider and session backfill
(CRM-owned, FR-042-001 CRM half, `FEAT-042`); the retired edge
model-residency directive (crosswalked `retired`, not specified).

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-LOA |
| Runtime owner | SRV-001 |

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-051-001](requirements/FR-051-001-session-idle-timeout-is-a-per-account.md) | Session idle-timeout is a per-account, bounded setting | — |
| [FR-051-002](requirements/FR-051-002-a-conversation-job-carries-its-session-id.md) | A conversation job carries its session id for filtering and trace | — |
| [FR-051-003](requirements/FR-051-003-business-hours-and-a-fixed-out-of.md) | Business hours and a fixed out-of-hours reply answer without a model call | — |
| [NFR-051-001](requirements/NFR-051-001-closing-a-session-never-loads-or-unloads.md) | Closing a session never loads or unloads a model | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
