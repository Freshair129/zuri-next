---
id: FR-014-003
title: "Verified governance snapshots"
delivery: building
legacy: [FR-252 (split 3/7 — governance snapshots)]
relations:
  specified_by: [API-037]
---

# FR-014-003 — Verified governance snapshots

The system SHALL capture, for a Project repository link, an immutable GovernanceSnapshot of a
Git checkout (commit SHA, manifest hash, bounded source manifest, verifier id `zuri.git-registry`
and version, proof id and verification proof, validation status) only when the evidence port
verifies the bound checkout; unavailable source SHALL be reported explicitly, never fabricated.
Snapshots SHALL be listable by Business owners with signed pagination.

## Acceptance criteria

- AC-014-003-01 — Given a checkout whose manifest hash does not match, then capture is refused and no snapshot row exists.
- AC-014-003-02 — Given a reader who is not an owner, when listing snapshots, then 403 `CAPABILITY_DENIED`.

## Implementation

- application/governance-snapshot-service.js; application/governance-source-verifier.js; apps/server/src/app/api/projects/[id]/governance-snapshots/route.js

## Verification

- TC-014-002 — Governance snapshots (see [verification.md](../verification.md))
