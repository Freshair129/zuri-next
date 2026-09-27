---
id: FR-058-005
title: "Operator-only one-time reveal and reset"
delivery: building
legacy: [FR-274 (split 3/3)]
relations:
  specified_by: [SDD-058, API-158, API-157]
---

# FR-058-005 — Operator-only one-time reveal and reset

The system SHALL let only an installation operator with a logged-in Person, passing the
credential-write gate, reveal the stored verification token exactly once
(`POST /api/platform/integrations/notion/webhook-verification/reveal`; 404 when absent,
409 `NOTION_WEBHOOK_TOKEN_ALREADY_REVEALED` after) and reset it before recreating a
subscription (`…/reset`); both are audited without the token.

## Acceptance criteria

- AC-058-005-01 — Given a Business owner who is not an installation operator, when revealing, then 403.
- AC-058-005-02 — Given a token already revealed, when revealed again, then 409.
