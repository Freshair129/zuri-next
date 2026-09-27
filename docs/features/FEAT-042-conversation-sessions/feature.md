---
id: FEAT-042
title: Conversation sessions
type: domain-feature
owner: DOM-CRM
runtime: SRV-001
status: draft
delivery: implemented
legacy: [FEAT-040, FR-243]
relations:
  depends_on: [FEAT-041, FEAT-051]
  decided_by: [ADR-043]
---

# FEAT-042 — Conversation sessions

## Summary

A long-lived LINE conversation reads as separate sittings. Every Message and
ConversationEvent belongs to a `ConversationSession` that closes after an idle
period (default 30 minutes, per-account 10–120). Staff see a divider per session in
the web inbox; the LINE job and trace carry the session id (FEAT-051).

## Scope

**In:** session assignment for inbound messages, replies and events; session record;
backfill of existing rows; session fields in the thread read model and the inbox divider.
**Out:** the per-account timeout setting and the job's session column (FEAT-051);
MSP memory sessions (their id is stored beside, never instead of, this one).

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-CRM |
| Runtime owner | SRV-001 |

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-042-001](requirements/FR-042-001-an-inbound-message-joins-or-opens-a.md) | An inbound message joins or opens a session by the idle rule | — |
| [FR-042-002](requirements/FR-042-002-assignment-is-serialized-per-conversation-inside-the.md) | Assignment is serialized per conversation inside the writer's transaction | — |
| [FR-042-003](requirements/FR-042-003-replies-and-events-never-open-a-session.md) | Replies and events never open a session | — |
| [FR-042-004](requirements/FR-042-004-a-session-is-a-first-class-record.md) | A session is a first-class record | — |
| [FR-042-005](requirements/FR-042-005-existing-rows-are-backfilled-by-the-same.md) | Existing rows are backfilled by the same rule | — |
| [FR-042-006](requirements/FR-042-006-the-inbox-shows-a-divider-per-session.md) | The inbox shows a divider per session | — |
| [NFR-042-001](requirements/NFR-042-001-idle-timeout-bounds.md) | Idle timeout bounds | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
