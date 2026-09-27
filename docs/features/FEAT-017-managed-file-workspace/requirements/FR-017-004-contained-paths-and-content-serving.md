---
id: FR-017-004
title: "Contained paths and content serving"
delivery: live
legacy: [FR-045 (split 3/7 — containment and content)]
relations:
  specified_by: [API-027]
  derived_from: [SEC-006]
---

# FR-017-004 — Contained paths and content serving

The system SHALL accept only relative paths that are non-empty, contain no null byte, are not
absolute or drive-relative, contain no `..` segment or `:` inside a segment, and whose real path
(after symlink/junction resolution) stays inside the mount root; SHALL serve content only for ACTIVE
LOCAL_FILE (through the Business's active mount) or MANAGED_BLOB (through the object-storage port)
assets visible to the viewer, with mime-gated inline preview.

## Acceptance criteria

- AC-017-004-01 — Given `relativePath: "..\\secret.txt"` or `C:/x`, then refused before any I/O.
- AC-017-004-02 — Given a symlink inside the root pointing outside it, then content is refused.
- AC-017-004-03 — Given a MISSING asset, then content explains the missing path and offers relink.

## Implementation

- local-files/path-security.js; local-files/filesystem-port.js; apps/server/src/app/api/files/[id]/content/route.js

## Verification

- TC-017-003 — Path security and filesystem port (see [verification.md](../verification.md))
