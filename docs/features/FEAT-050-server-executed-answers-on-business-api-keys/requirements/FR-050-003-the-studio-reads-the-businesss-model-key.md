---
id: FR-050-003
title: "The Studio reads the Business's model-key readiness, never its material"
delivery: building
legacy: [FR-266 (LOA half, split 1/1)]
relations:
  depends_on: [API-151]
  decided_by: [ADR-047]
---

# FR-050-003 — The Studio reads the Business's model-key readiness, never its material

The system SHALL read the Business's `MODEL_PROVIDER` credential status
(`provider`, `status`, `lastValidatedAt`, `lastValidationCode`) from
Integration to render the model-key readiness step, and SHALL treat a
credential ready only when its status is `ACTIVE`, it has been validated, and
`lastValidationCode` starts with `MODEL_KEY_VALIDATED` — never merely present.

## Acceptance criteria

- AC-050-003-01 — Given a credential whose last validation failed (`lastValidationCode: 'MODEL_KEY_REJECTED'`), when readiness is computed, then it is reported not ready, with that reason.
- AC-050-003-02 — Given the Studio's key card and readiness journey, when either reads the same credential, then both report the same ready/not-ready outcome (one shared function, `isModelCredentialReady`).

## Implementation

- `apps/server/src/modules/line-oa-studio/domain/line-oa-readiness-journey.js`, `apps/server/src/modules/line-oa-studio/ui/LineOaModelKeyCard.jsx`, `apps/server/src/modules/line-oa-studio/ui/credential-input-props.js`

## Verification

- TC-050-003 — Readiness read and shared readiness function (see [verification.md](../verification.md))
