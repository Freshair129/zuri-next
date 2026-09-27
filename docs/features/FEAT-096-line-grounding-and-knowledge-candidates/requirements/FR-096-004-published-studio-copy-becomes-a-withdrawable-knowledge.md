---
id: FR-096-004
title: "Published Studio copy becomes a withdrawable knowledge source"
part: FEAT-096-P04
owner: DOM-LOA
delivery: implemented
legacy: [FR-238]
relations:
  specified_by: [SDD-096]
  decided_by: [ADR-071]
---

# FR-096-004 — Published Studio copy becomes a withdrawable knowledge source

The system SHALL admit the human-readable description of a published rich menu, LIFF app or bot
profile as one TEXT source of kind `LINE_STUDIO_DESCRIPTION` on the corresponding publisher action,
composing only the label, message, purpose and greeting copy a customer would read — never the
underlying Flex/rich-menu JSON, image, layout coordinates, URL, postback data or LIFF app code. The
system SHALL withdraw that source when the corresponding item is unpublished or archived, and SHALL
treat every admission or withdrawal call as best-effort: a knowledge-runtime failure SHALL never
block or reverse the publisher's own action.

## Acceptance criteria

- AC-096-004-01 — Given a rich menu's PUBLISH worker completion, when the menu becomes live, then its chat-bar text and each area's visible label/message text are admitted as one `LINE_STUDIO_DESCRIPTION` source.
- AC-096-004-02 — Given a Business whose knowledge runtime is not configured, when a publish action attempts admission, then the admission call fails silently and the publish action itself still succeeds.
- AC-096-004-03 — Given a previously admitted description, when its item is archived or unpublished, then the source is withdrawn; given nothing was ever admitted under that item's source key, then withdrawal is a no-op, not an error.
- AC-096-004-04 — Given the same publish event delivered twice (a retry), when admission runs again, then the result is unchanged (idempotent on `(sourceKey, version)`), and a previously withdrawn source under the same key is un-revoked by a republish rather than needing a separate reactivate step.

## Implementation

- `apps/server/src/modules/line-oa-studio/application/line-oa-studio-description-admission.js`; `apps/server/src/modules/line-oa-studio/application/line-oa-rich-menu-jobs.js`; `apps/server/src/modules/line-oa-studio/application/line-oa-liff-app-service.js`; `apps/server/src/modules/line-oa-studio/application/line-oa-account-service.js`; `apps/server/src/modules/knowledge/knowledge-admission-service.js`

## Verification

- TC-096-004 — LINE Studio description admission and withdrawal, best-effort, idempotent (see [verification.md](../verification.md))
