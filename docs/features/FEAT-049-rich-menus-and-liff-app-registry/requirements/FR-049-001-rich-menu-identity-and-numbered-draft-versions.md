---
id: FR-049-001
title: "Rich menu identity and numbered draft versions"
delivery: implemented
legacy: [FR-151 (split 1/2)]
relations:
  specified_by: [API-135]
  decided_by: [ADR-044]
---

# FR-049-001 — Rich menu identity and numbered draft versions

The system SHALL give a rich menu a Tenant-unique `code`, an optional
account-unique `alias`, a default flag, and a `DRAFT → READY → ARCHIVED`
status; every edit to its body SHALL be a numbered `LineOaRichMenuVersion`
carrying layout, chat-bar text (≤14 characters), tap areas and a validated
image reference.

## Acceptance criteria

- AC-049-001-01 — Given a new rich menu, when created, then its first version is `versionNumber: 1` in `DRAFT` status.
- AC-049-001-02 — Given a chat-bar text of 15 characters, when saved, then the write is refused.

## Implementation

- `apps/server/src/modules/line-oa-studio/domain/line-oa-rich-menu.js`, `application/line-oa-rich-menu-service.js`

## Verification

- TC-049-001 — Rich menu identity, versions and chat-bar bounds (see [verification.md](../verification.md))
