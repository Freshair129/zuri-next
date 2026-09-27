---
id: FR-047-003
title: "No verified archive, no tombstone"
delivery: building
legacy: [FR-245 (split 1/4)]
relations:
  specified_by: [SDD-047]
  decided_by: [ADR-042]
  derived_from: [SEC-032]
---

# FR-047-003 — No verified archive, no tombstone

The system SHALL, in the retention sweep, archive every `MESSAGE_BODY_AND_ATTACHMENTS`
candidate of a Tenant before tombstoning it: one sealed segment per Customer written
under a temporary name, fsynced, renamed, read back and SHA-256-verified; only then, in
one transaction, insert the Tenant's next chained `ArchiveManifest` and tombstone
exactly the archived messages. If any archive step fails for a Tenant, nothing of that
Tenant is tombstoned in the run and the run's audit counts the failure; other Tenants
continue. Each run writes new files and never rewrites one.

## Acceptance criteria

- AC-047-003-01 — Given an unwritable archive directory, when the sweep runs, then no message of that Tenant is tombstoned and the audit reports `archiveFailures`.
- AC-047-003-02 — Given a successful run, when the manifest chain is verified, then each `manifestHash` covers the previous manifest's hash and the file hash matches the file on disk.

## Implementation

- apps/server/src/modules/crm/chat-evidence-archive-service.js; apps/server/src/modules/crm/chat-evidence-archive-crypto.js; apps/server/src/modules/crm/retention-sweep-service.js; apps/server/docker-compose.cold-archive.yml

## Verification

- TC-047-002 — Archive before tombstone, chain and crypto (see [verification.md](../verification.md))
