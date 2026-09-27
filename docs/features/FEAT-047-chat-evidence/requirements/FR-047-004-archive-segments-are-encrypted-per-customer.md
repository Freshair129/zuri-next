---
id: FR-047-004
title: "Archive segments are encrypted per Customer"
delivery: building
legacy: [FR-245 (split 2/4)]
relations:
  specified_by: [SDD-047]
  decided_by: [ADR-042]
  derived_from: [SEC-032]
---

# FR-047-004 — Archive segments are encrypted per Customer

The system SHALL encrypt each segment (gzip JSON Lines) with AES-256-GCM under a
per-Customer data key wrapped by a dedicated archive key-encryption key
(`ZURI_ARCHIVE_KEK`, distinct from the credential KEK), with authenticated data binding
Tenant, Customer and run, so a segment opened under another Customer's key fails
authentication; the archive base directory is `ZURI_ARCHIVE_DIR` (production: a
dedicated second-disk mount through its own compose overlay).

## Acceptance criteria

- AC-047-004-01 — Given a segment sealed for Customer A, when opened with Customer B's key, then decryption fails before any plaintext is produced.

## Implementation

- apps/server/src/modules/crm/chat-evidence-archive-service.js; apps/server/src/modules/crm/chat-evidence-archive-crypto.js; apps/server/src/modules/crm/retention-sweep-service.js; apps/server/docker-compose.cold-archive.yml

## Verification

- TC-047-002 — Archive before tombstone, chain and crypto (see [verification.md](../verification.md))
