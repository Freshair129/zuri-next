---
id: FR-095-001
title: "Stickers, locations and media become Messages with fixed placeholders"
part: FEAT-095-P01
owner: DOM-CRM
delivery: building
legacy: [FR-229 (split 1/3)]
relations:
  specified_by: [SDD-095, API-116]
  decided_by: [ADR-041]
---

# FR-095-001 — Stickers, locations and media become Messages with fixed placeholders

The system SHALL record a LINE sticker, location, image, video, audio or file message as a
CRM Message with `contentKind` `STICKER`, `LOCATION` or `MEDIA_REF` and a fixed Thai
placeholder body (`[สติกเกอร์]`, `[ตำแหน่ง]`, `[รูปภาพ]`, `[วิดีโอ]`, `[ไฟล์เสียง]`,
`[ไฟล์แนบ]`) into which no provider value is interpolated; a media message SHALL also get
a `MessageAttachment` (kind, provider content id, `fetchState = PENDING`) recorded without
bytes. None creates an answer job.

## Acceptance criteria

- AC-095-001-01 — Given a location message, when admitted, then the Message body is `[ตำแหน่ง]` and contains no coordinates.
- AC-095-001-02 — Given an image message, when admitted, then one attachment with `fetchState = PENDING` exists and no file bytes are stored.

## Implementation

- apps/server/src/modules/crm/line-ingest-service.js; apps/server/src/modules/crm/conversation-redaction-service.js

## Verification

- TC-095-001 — Non-text admission and events (see [verification.md](../verification.md))
- TC-095-002 — Retention overrides and sweep (see [verification.md](../verification.md))
