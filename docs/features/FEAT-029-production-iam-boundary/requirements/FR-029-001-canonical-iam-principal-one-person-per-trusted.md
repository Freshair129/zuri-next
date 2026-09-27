---
id: FR-029-001
title: "Canonical IAM principal: one Person per trusted external binding"
delivery: building
legacy: [FR-094]
relations:
  specified_by: [SDD-029]
  decided_by: [ADR-022]
---

# FR-029-001 — Canonical IAM principal: one Person per trusted external binding

Every trusted provider, credential or channel identity SHALL resolve to
exactly one internal `Person` through a namespaced external binding. Unknown,
revoked, ambiguous or duplicate subjects SHALL NEVER receive private
authority. Only active `Membership`/`RoleBinding` records SHALL contribute to
scope or permission.

## Acceptance criteria

- AC-029-001-01 — Given two different external bindings for the same channel subject presented in sequence, when both resolve, then both map to the same `Person`, never two.
- AC-029-001-02 — Given a revoked `ExternalIdentity`/`ChannelIdentity` row, when it is presented, then it resolves to no Person and no authority.

## Implementation

- `apps/server/src/modules/identity/{resolve-line-identity.js,link-line-identity.js,channel-identity.js,classify-principal.js}`

## Verification

- TC-029-001 — Canonical principal resolution and revocation (see [verification.md](../verification.md))
