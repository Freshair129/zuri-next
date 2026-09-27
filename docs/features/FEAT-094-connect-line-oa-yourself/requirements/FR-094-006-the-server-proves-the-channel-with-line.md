---
id: FR-094-006
title: "The server proves the channel with LINE before storing anything"
part: FEAT-094-P03
owner: DOM-INT
delivery: implemented
legacy: [FR-225 (split 1/2)]
relations:
  specified_by: [SDD-094, API-142, API-141]
---

# FR-094-006 — The server proves the channel with LINE before storing anything

The system SHALL, on `POST /api/line-oa/connections` with a Channel ID and secret (and
a long-lived access token only as a deliberate override), mint a stateless token and call
LINE's bot-information endpoint to prove the pair and fill destination, basic id and
display name; a wrong Channel ID and a wrong secret SHALL answer the same 422
`LINE_CREDENTIALS_REJECTED`, a LINE outage 503 with nothing stored; the response
carries connection, masked credential and bot metadata only.

## Acceptance criteria

- AC-094-006-01 — Given a correct Channel ID with a wrong secret, when connecting, then 422 `LINE_CREDENTIALS_REJECTED`, identical to a wrong Channel ID.

## Implementation

- apps/server/src/modules/integration/application/line-channel-connection-service.js; apps/server/src/platform/integrations/core/channel-account-claim.js; apps/server/src/platform/integrations/providers/line/line-channel-admin-port.js; apps/server/src/app/api/line-oa/connections/route.js

## Verification

- TC-094-003 — Channel validation, claim and credential routes (see [verification.md](../verification.md))
