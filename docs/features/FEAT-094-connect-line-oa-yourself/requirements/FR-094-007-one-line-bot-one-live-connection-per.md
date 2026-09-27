---
id: FR-094-007
title: "One LINE bot, one live connection per installation"
part: FEAT-094-P03
owner: DOM-INT
delivery: implemented
legacy: [FR-226]
relations:
  specified_by: [SDD-094, API-138]
---

# FR-094-007 — One LINE bot, one live connection per installation

The system SHALL identify a bot by SHA-256 of its destination and bind it to at most one
live connection across the installation, taking the claim before any secret is stored
(so a refused claim leaves no orphan secret): a bot already claimed in the same Tenant
answers 409 `LINE_CHANNEL_ALREADY_CONNECTED` (naming the sibling only when the viewer may
see it); one claimed in another Tenant answers 409 `LINE_CHANNEL_CLAIMED_ELSEWHERE` with a
Thai message naming no Tenant or Business, only after the caller proved possession of
the secret.

## Acceptance criteria

- AC-094-007-01 — Given a bot connected in Tenant A, when a Tenant B owner connects it with the right secret, then 409 `LINE_CHANNEL_CLAIMED_ELSEWHERE` and no credential exists for B.

## Implementation

- apps/server/src/modules/integration/application/line-channel-connection-service.js; apps/server/src/platform/integrations/core/channel-account-claim.js; apps/server/src/platform/integrations/providers/line/line-channel-admin-port.js; apps/server/src/app/api/line-oa/connections/route.js

## Verification

- TC-094-003 — Channel validation, claim and credential routes (see [verification.md](../verification.md))
