---
id: FR-042-002
title: "Assignment is serialized per conversation inside the writer's transaction"
delivery: implemented
legacy: [FR-243 (split 2/6)]
relations:
  specified_by: [SDD-042]
---

# FR-042-002 — Assignment is serialized per conversation inside the writer's transaction

The system SHALL decide the session inside the same transaction that writes the
message, after taking a row lock on the Conversation, so concurrent deliveries to one
conversation open at most one new session.

## Acceptance criteria

- AC-042-002-01 — Given two messages for a quiet conversation admitted concurrently, when both commit, then exactly one new session exists and both messages reference it.

## Verification

- TC-042-002 — Assignment on admission, replies, events and backfill (see [verification.md](../verification.md))
