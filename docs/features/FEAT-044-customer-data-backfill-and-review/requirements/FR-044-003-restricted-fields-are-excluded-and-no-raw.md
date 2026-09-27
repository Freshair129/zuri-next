---
id: FR-044-003
title: "Restricted fields are excluded and no raw PII leaks"
delivery: live
legacy: [FR-078 (split 3/5)]
relations:
  specified_by: [SDD-044]
  derived_from: [SEC-004]
---

# FR-044-003 — Restricted fields are excluded and no raw PII leaks

The system SHALL exclude financial fields, raw documents/paths, LINE identifiers and
secrets from the contract, SHALL publish only the approved profile fields, and SHALL
emit no raw PII (name, tax id, email, phone, postcode, source key) in logs, audit
payloads, browser responses or committed fixtures; evidence is referenced by hash.
Historical rows SHALL NOT be replayed through LINE or activate a LINE binding.

## Acceptance criteria

- AC-044-003-01 — Given a staged record containing `amount` or a LINE user id, when validated, then those fields are rejected.

## Verification

- TC-044-001 — Contract envelope, resolution and exclusions (see [verification.md](../verification.md))
