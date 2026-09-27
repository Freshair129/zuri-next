---
id: FR-094-002
title: "Versioned lifecycle with validation before activation"
part: FEAT-094-P01
owner: DOM-INT
delivery: implemented
legacy: [FR-223 (split 2/3)]
relations:
  specified_by: [SDD-094, API-143]
---

# FR-094-002 — Versioned lifecycle with validation before activation

The system SHALL create every write as a new credential version in `PENDING_VALIDATION`
that becomes `ACTIVE` only after live validation; a rotation SHALL keep the previous
version resolvable until the new one validates and then purge it, while a failed
validation purges the new one; a store write whose database transaction fails SHALL be
purged by compensation and recorded.

## Acceptance criteria

- AC-094-002-01 — Given a rotation whose new secret LINE rejects, when it completes, then the previous version is still ACTIVE and the new one is purged.

## Verification

- TC-094-001 — Vault stores and lifecycle (see [verification.md](../verification.md))
- TC-094-003 — Channel validation, claim and credential routes (see [verification.md](../verification.md))
