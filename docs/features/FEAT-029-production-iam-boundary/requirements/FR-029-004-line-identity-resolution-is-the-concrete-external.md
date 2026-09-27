---
id: FR-029-004
title: "LINE identity resolution is the concrete external-binding primitive"
delivery: building
legacy: [FR-021]
relations:
  specified_by: [SDD-029]
  decided_by: [ADR-022]
---

# FR-029-004 — LINE identity resolution is the concrete external-binding primitive

`resolveLineIdentity` SHALL resolve a `(tenantId, LINE lineUserId)` pair to
exactly one `Person`, refusing to mint identity under an unresolved tenant,
creating `Person` + `ExternalIdentity` in one transaction on first contact,
returning the existing mapping idempotently on repeat contact, and refusing
to resolve a revoked mapping until it is re-linked. Every resolution SHALL be
audited. This is the LINE-specific instance of the canonical binding
contract (`FR-029-001`): the same namespaced-binding, one-Person,
no-authority-for-unknown-or-revoked rule, concretely for the `LINE` provider.

## Acceptance criteria

- AC-029-004-01 — Given a first-ever LINE user id for a tenant, when resolved, then one `Person` and one `ExternalIdentity` row are created in a single transaction and audited.
- AC-029-004-02 — Given a revoked `ExternalIdentity`/`ChannelIdentity` mapping, when the same LINE user id is presented again, then resolution refuses rather than silently re-minting or reactivating.
- AC-029-004-03 — Given no tenant row for the supplied `tenantId`, when resolution is attempted, then it refuses rather than minting identity under an unresolved tenant.

## Implementation

- `apps/server/src/modules/identity/resolve-line-identity.js`

## Verification

- TC-029-004 — LINE identity resolution primitive (see [verification.md](../verification.md))
