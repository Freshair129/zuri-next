---
id: FR-059-001
title: "Write-only onboarding with company verification"
delivery: declared
legacy: [FR-125 (split 1/3)]
relations:
  specified_by: [SDD-059, API-161]
  depends_on: [FR-094-004]
  derived_from: [BR-047]
---

# FR-059-001 — Write-only onboarding with company verification

The system SHALL let a Business owner (re-resolved on every operation; client-supplied
scope ignored) create one FlowAccount connection per Business using
`client_credentials` with the fixed Sandbox or Production endpoint, sending the Client
Secret once to the server, storing the bundle only in the vault (`OAUTH_CLIENT` kind)
and showing only a masked Client ID fingerprint, credential version and state. The
connection SHALL start DRAFT and become ACTIVE only after a token exchange and a
successful `GET /company/info`, whose `companyId` is stored as the external account id
(never a key).

## Acceptance criteria

- AC-059-001-01 — Given a wrong Client Secret, when testing the connection, then it stays DRAFT and nothing but a safe error code is returned.

## Implementation

- — (declared; design in ADR-056)
