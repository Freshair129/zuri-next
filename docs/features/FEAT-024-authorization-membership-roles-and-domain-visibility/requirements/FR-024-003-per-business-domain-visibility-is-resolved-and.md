---
id: FR-024-003
title: "Per-Business domain visibility is resolved and enforced per Business"
delivery: live
legacy: [FR-061]
relations:
  specified_by: [SDD-024]
  decided_by: [ADR-021]
---

# FR-024-003 — Per-Business domain visibility is resolved and enforced per Business

The system SHALL resolve which domains a principal may see **per Business**,
not once per principal. Each Membership's grant SHALL apply only to the
Businesses it covers: an OWNER Membership confers all domains on the
Businesses it owns and SHALL NOT widen what the same principal sees in a
Business where they hold only a `MEMBER` Membership. `domainsByBusinessId`
SHALL deny by default (absent or `[]`), and `domainsForBusiness(viewer,
businessId)` SHALL be the only way a Business-scoped consumer asks the
question. The flat `visibleDomains` SHALL remain the union across visible
Businesses — "may this principal see this domain anywhere" — and SHALL NEVER
be an authorization input for a Business-scoped decision.
`assertDomainVisible(viewer, businessId, domainKey)` SHALL be enforced
server-side by the crm, market and people read models, refusing 404-shaped
identically to an unknown Business.

## Acceptance criteria

- AC-024-003-01 — Given a MEMBER Membership on Business A granting only `crm`, when the viewer asks `domainsForBusiness(viewer, A)`, then only `crm` is returned.
- AC-024-003-02 — Given the same principal has no Membership on Business B, when a crm read model checks `assertDomainVisible(viewer, B, 'crm')`, then it refuses with the same 404 shape a nonexistent Business would produce.
- AC-024-003-03 — Given a principal visible in `crm` on Business A only, when the client reads the flat `visibleDomains`, then `crm` appears (union semantics) but a Business B `crm` read is still refused server-side.

## Implementation

- `apps/server/src/modules/identity/{resolve-viewer.js,viewer-domains.js}`, `apps/server/src/modules/crm/{conversation-read-model.js,customer-consent-service.js}`, `apps/server/src/modules/people/application/{employment-service.js,people-service.js}`, `apps/server/src/modules/market-intelligence/application/market-observation-service.js`

## Verification

- TC-024-002 — Per-Business domain visibility, client and server (see [verification.md](../verification.md))
