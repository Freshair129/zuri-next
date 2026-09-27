---
id: FR-007-006
title: "Standalone tasks land in a visible inbox"
delivery: live
legacy: [FR-017 (split 2/2 — standalone task inbox)]
relations:
  specified_by: [API-039, API-038]
---

# FR-007-006 — Standalone tasks land in a visible inbox

The system SHALL create a task from "All Work → New Task" as a PlanEnvelope: with no Project
chosen it SHALL target the Business's inbox Project `PRJ-<BUSINESS>-INBOX` with its OPERATIONS
Workstream `WST-<BUSINESS>-INBOX` (created on first use), with a Project chosen it SHALL target
that Project and a chosen Workstream (or a new `WST-<PROJECT>-GENERAL`), carrying Project and
Workstream fields as fetched so the update is a no-op; the preview SHALL name the destination
before confirmation, and an inbox envelope aimed at another Business's Space SHALL be a
conflict.

## Acceptance criteria

- AC-007-006-01 — Given a Business `ACME` with no inbox, when a standalone task is confirmed, then `PRJ-ACME-INBOX`, `WST-ACME-INBOX` and the item are created in one commit.
- AC-007-006-02 — Given a second standalone task, then only the item is inserted.

## Implementation

- components/StandaloneTaskModal.jsx; import/task-envelope.js

## Verification

- TC-007-004 — Human intake and standalone task (see [verification.md](../verification.md))
