---
id: FR-086-001
title: "Domain foundation and one canonical intake envelope"
delivery: building
legacy: [FR-133]
relations:
  specified_by: [SDD-086]
  decided_by: [ADR-078]
---

# FR-086-001 — Domain foundation and one canonical intake envelope

The system SHALL register Asset Management as a Business-visible domain (route key
`assets`) and SHALL require every intake surface to converge on one strict
`AssetIntakeEnvelope` validated by one canonical service — no adapter may write Asset
tables directly. A procurement-origin submission SHALL be rejected unless it carries
both an active `ASSET_PHOTO` and an active `PAYMENT_PROOF` evidence reference.
Registration mutations beyond a validated preview SHALL require the role/approval
policy declared by later requirements in this feature (responsibility/location/
allocation) or FEAT-087 (evidence review).

## Acceptance criteria

- AC-086-001-01 — Given a Business without the `assets` domain granted, when a viewer requests any `/api/assets/**` route, then the request is refused with the same 404 shape used for a nonexistent Business (no domain existence disclosed).
- AC-086-001-02 — Given a `PROCUREMENT_PURCHASE`-origin envelope missing `PAYMENT_PROOF` evidence, when Submit is attempted, then it is refused with a field-level validation code and no `AssetIntake` row reaches an approved status.
- AC-086-001-03 — Given an envelope with an unknown top-level key, when it is validated, then it is rejected rather than silently dropping the extra field.

## Implementation

- `apps/server/src/modules/asset-management/application/asset-intake-service.js`, `application/asset-authority.js`, `application/asset-request-scope.js`, `apps/server/src/app/api/assets/intakes/route.js`, `apps/server/src/app/(pm)/assets/page.jsx`

## Verification

- TC-086-001 — Envelope validation and procurement-origin evidence gate (see [verification.md](../verification.md))
- TC-086-002 — Domain visibility and cross-Business refusal (see [verification.md](../verification.md))
