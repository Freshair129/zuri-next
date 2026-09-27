---
id: FR-011-003
title: "One-time admission with re-verification"
delivery: implemented
legacy: [FR-272 (split 3/3 — admission)]
relations:
  decided_by: [ADR-018]
  derived_from: [SEC-003]
---

# FR-011-003 — One-time admission with re-verification

The system SHALL admit an executor for an APPROVED request only once (state → CONSUMED, with a
lease epoch and a 60 s admission receipt), after recomputing the current input identity and
refusing a changed digest (request → SUPERSEDED, 409 `INPUT_CHANGED`), an expired request, a
reviewer whose capability has since been revoked (request → REVOKED, 409 `APPROVAL_REVOKED`),
foreign scope, or a stale lease. A replay run SHALL never inherit the source run's approval.
Every transition (request, decision, expiry, supersession, revocation, admission) SHALL append an
AuditEvent linked from the request.

## Acceptance criteria

- AC-011-003-01 — Given the input hash changed from H to H2 after approval, then admission is refused and the request is SUPERSEDED.
- AC-011-003-02 — Given a replay of an approved run, then its step requires a new approval.
