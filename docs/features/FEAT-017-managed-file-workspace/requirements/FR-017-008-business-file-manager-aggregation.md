---
id: FR-017-008
title: "Business File Manager aggregation"
delivery: live
legacy: [FR-045 (split 7/7 — aggregation)]
relations:
  specified_by: [API-007, API-063]
---

# FR-017-008 — Business File Manager aggregation

The system SHALL present, for a visible Business, one File Manager aggregating Business-owned assets
and assets of the Business's own Projects (groups BUSINESS/PROJECT), and for a Project only that
Project's assets merged with its legacy ProjectFiles, without copying content.

## Acceptance criteria

- AC-017-008-01 — Given a Project of another Business, then its assets never appear in this Business's File Manager.

## Implementation

- application/file-manager-read-model.js; apps/server/src/app/api/business/files/route.js; apps/server/src/app/(pm)/files/page.jsx

## Verification

- TC-017-005 — Aggregation and authorization (see [verification.md](../verification.md))
