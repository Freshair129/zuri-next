---
id: FR-017-003
title: "Mounts and managed local ingest"
delivery: live
legacy: [FR-045 (split 2/7 — mounts and ingest)]
relations:
  specified_by: [API-030, API-033]
  derived_from: [NFR-009]
---

# FR-017-003 — Mounts and managed local ingest

The system SHALL register per-Business local workspace mounts (device key, absolute root path,
status) and ingest a LOCAL_FILE by: authorize → verify declared size against decoded content →
compute SHA-256 → create the asset QUARANTINED with its OWNER link and audit in one transaction →
stage the bytes under `<root>/.zuri/temp` → atomically promote to the contained relative path →
mark ACTIVE (version +1); any filesystem failure SHALL leave the asset QUARANTINED and clean the
staged file.

## Acceptance criteria

- AC-017-003-01 — Given a size mismatch, then nothing is written.
- AC-017-003-02 — Given promotion fails, then the asset is QUARANTINED and no temp file remains.

## Verification

- TC-017-002 — Managed assets, ingest and migration (see [verification.md](../verification.md))
