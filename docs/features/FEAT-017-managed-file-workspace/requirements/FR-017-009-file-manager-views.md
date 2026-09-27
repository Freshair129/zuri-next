---
id: FR-017-009
title: "File Manager views"
delivery: live
legacy: [FR-058]
relations:
  derived_from: [BR-004]
---

# FR-017-009 — File Manager views

The system SHALL render the same asset set in four client-side views — grid, timeline (ordered by
`updatedAt`/`createdAt`, which the read model exposes), by-project (BUSINESS/PROJECT groups) and preview
(inline for authorized LOCAL_FILE content, mime-gated; link-out for EXTERNAL_URL) — with the choice held
in client state only (no new route, persistence or write path).

## Acceptance criteria

- AC-017-009-01 — Given an image LOCAL_FILE, when preview is chosen, then it renders inline from the content endpoint; given a PDF external URL, then a link-out is shown.

## Implementation

- components/FileManagerViews.jsx; components/ManagedFilesPanel.jsx

## Verification

- TC-017-006 — File Manager views (see [verification.md](../verification.md))
