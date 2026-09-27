---
id: FR-025-004
title: "Google is a second way to prove the same account"
delivery: declared
legacy: [FR-121]
relations:
  specified_by: [SDD-025]
  decided_by: [ADR-020]
---

# FR-025-004 — Google is a second way to prove the same account

The system SHALL let a visitor present a Google account at `/signup` and
`/login`, resolving the provider `sub` to exactly one internal `Person`
through a namespaced external binding — a second proof of identity, never a
second account path. Google SHALL be accepted at both signup and login (a
Google-only Person set no password). An address matching an existing local
account SHALL bind to that Person only when Google asserts `email_verified`;
an unverified assertion SHALL be refused rather than linked. The account
Google produces SHALL grant nothing beyond FR-025-003's own grant-free
signup.

## Acceptance criteria

- AC-025-004-01 — Given a Google login for a `sub` never seen before, when it resolves, then a new Person is created with the same zero-authority guarantee as FR-025-003.
- AC-025-004-02 — Given a Google account whose email matches an existing local Person but is not `email_verified`, when the callback runs, then linking is refused rather than silently binding to that Person.

**Delivery note:** declared and blocked, not merely unbuilt — this
installation holds no OAuth client credential, and `ExternalIdentity` is
keyed `(tenantId, provider, providerSubject)` with `tenantId` a required
foreign key, which a Tenant-less self-serve signup does not have. No code
implements this FR today.

## Implementation

- none — declared and blocked (see delivery note)
