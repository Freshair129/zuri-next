---
id: FR-049-004
title: "Acceptance is truthful; ambiguity ends UNKNOWN, never a silent retry"
delivery: implemented
legacy: [FR-152 (split 2/2)]
relations:
  specified_by: [API-134]
  decided_by: [ADR-045]
---

# FR-049-004 — Acceptance is truthful; ambiguity ends UNKNOWN, never a silent retry

The system SHALL record only the provider's HTTP acceptance as success —
never a delivery claim — and SHALL end an unconfirmed create as `UNKNOWN` for
a publisher to acknowledge, never retried automatically (a second create would
duplicate the menu).

## Acceptance criteria

- AC-049-004-01 — Given a create call that times out with an unreadable response, when the worker records the outcome, then the job ends `UNKNOWN` and is never auto-retried.
- AC-049-004-02 — Given a successful `PUBLISH`, when it completes, then the version becomes `PUBLISHED` with its `richMenuId` and the previously `PUBLISHED` version becomes `RETIRED`.

## Implementation

- `apps/server/src/modules/line-oa-studio/domain/line-oa-rich-menu-publish.js`, `apps/server/src/platform/integrations/providers/line/server-line-rich-menu-transport.js`

## Verification

- TC-049-004 — Acceptance truthfulness and UNKNOWN handling (see [verification.md](../verification.md))
