---
id: FR-087-001
title: "Verified private cloud evidence upload"
delivery: live
legacy: [FR-137, FR-134]
relations:
  specified_by: [SDD-087]
  decided_by: [ADR-079]

---

# FR-087-001 — Verified private cloud evidence upload

The system SHALL let an authorized Business owner or `ASSET_RECEIVER` upload
JPEG/PNG/WebP/PDF evidence up to 20 MiB through a bounded content-policy gate that
authorizes scope before reading the body, verifies magic bytes against the declared
MIME, computes a server-side SHA-256, and writes to a private, provider-neutral
object port creating exactly one `MANAGED_BLOB` `FileAsset` with an explicit evidence
role — never a public URL or storage credential in the response. A storage or
metadata failure SHALL never report success or leave an untracked authoritative
record.

## Acceptance criteria

- AC-087-001-01 — Given a valid JPEG under 20 MiB whose magic bytes match its declared MIME, when uploaded with role `ASSET_PHOTO`, then one `FileAsset` is created and the response contains hash and metadata but no object credential or public URL.
- AC-087-001-02 — Given a file whose magic bytes do not match its declared MIME (spoofed content), when uploaded, then it is rejected before any storage write.
- AC-087-001-03 — Given the storage adapter is unavailable (unconfigured/failing), when an upload is attempted, then the result is an explicit `UNAVAILABLE` outcome and no `FileAsset` metadata row is created.

## Implementation

- `apps/server/src/modules/asset-management/application/asset-evidence-service.js`, `domain/evidence-policy.js`, `apps/server/src/app/api/assets/evidence/route.js`

## Verification

- TC-087-001 — Upload verification, hashing and private storage (see [verification.md](../verification.md))
- TC-087-003 — End-to-end evidence intake execution (see [verification.md](../verification.md))
- TC-087-005 — Production activation contract (env/bucket/migration presence) (see [verification.md](../verification.md))
