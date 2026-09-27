---
id: FR-017-002
title: "Database-authoritative file assets"
delivery: live
legacy: [FR-045 (split 1/7 — identity and ownership)]
relations:
  specified_by: [API-030, API-026]
  decided_by: [ADR-006]
  derived_from: [BR-055]
---

# FR-017-002 — Database-authoritative file assets

The system SHALL record every file as a FileAsset (code, Tenant, Business, optional Project and
WorkItem, `storageKind` ∈ LOCAL_FILE | MANAGED_BLOB | EXTERNAL_URL, relative path / external URL /
blob ref, name, mime, size, sha256, `status` ∈ ACTIVE | MISSING | QUARANTINED, version) owned by its
Business or Project through an OWNER FileLink, authorized by `ownsBusiness` for writes and visible
Business ids for reads. An EXTERNAL_URL SHALL never cause filesystem I/O. No file SHALL be copied
because it appears in several views; deletion SHALL be soft and audited.

## Acceptance criteria

- AC-017-002-01 — Given an EXTERNAL_URL asset, when content is requested, then it is refused (link-out only).
- AC-017-002-02 — Given an asset of an invisible Business, then every read answers not found.

## Implementation

- application/file-asset-service.js; apps/server/src/app/api/files/route.js; api/files/[id]/route.js; api/files/mounts/route.js; api/files/migrate/route.js

## Verification

- TC-017-002 — Managed assets, ingest and migration (see [verification.md](../verification.md))
- TC-017-005 — Aggregation and authorization (see [verification.md](../verification.md))
