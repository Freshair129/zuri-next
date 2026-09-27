---
id: FR-017-005
title: "Reconcile, relink and disposable cache"
delivery: live
legacy: [FR-045 (split 4/7 — reconcile, relink, cache)]
relations:
  specified_by: [API-034, API-028, API-031]
  derived_from: [NFR-009, BR-055]
---

# FR-017-005 — Reconcile, relink and disposable cache

The system SHALL scan a mount and reconcile database assets with disk in a dry-run/confirm flow
(an externally moved or deleted file becomes MISSING; untracked files are reported), relink a MISSING
asset only to an explicitly confirmed contained path (never guessing among candidates), and rebuild
the Business file cache so that deleting `.zuri/cache` and rebuilding yields a DTO equal to a direct
database query. Remounting at another absolute root SHALL preserve asset ids, links and relative
paths.

## Acceptance criteria

- AC-017-005-01 — Given a file deleted on disk, when reconcile is confirmed, then the asset is MISSING with metadata intact.
- AC-017-005-02 — Given the cache folder deleted, when rebuilt, then the Business File Manager DTO is unchanged.

## Implementation

- application/file-reconcile-cache-service.js; api/files/reconcile/route.js; api/files/cache/rebuild/route.js; api/files/[id]/relink/route.js

## Verification

- TC-017-004 — Reconcile, cache and reveal (see [verification.md](../verification.md))
