---
id: FR-001-008
title: "Business capabilities"
delivery: live
legacy: [FR-169]
relations:
  specified_by: [API-006]
  derived_from: [BR-007]
  decided_by: [ADR-032]
---

# FR-001-008 — Business capabilities

The system SHALL store per-Business capability flags (`capabilitiesJson`) distinct from
Membership grants, with known keys and defaults declared in one registry (first key:
`physicalStock`, default true). A single writer SHALL toggle one capability per request,
only for an OWNER who owns the Business, with an expected-`version` compare-and-set and one
AuditEvent `CAPABILITY_CHANGED` per effective toggle; a no-op toggle writes nothing.
Readers SHALL obtain capabilities from the Business object already returned by the scope
inventory; when `physicalStock` is off the reserved Warehouse slot is hidden from the domain
bar and sidebar (FEAT-002).

## Acceptance criteria

- AC-001-008-01 — Given `version` 3 on the server and 2 in the request, when PATCH is sent, then 409 is returned and nothing changes.
- AC-001-008-02 — Given `physicalStock` already true, when enabling it, then the response is the current state and no AuditEvent is written.
- AC-001-008-03 — Given an unknown capability key, then 400 (strict schema).
- AC-001-008-04 — Given `physicalStock` false, when the shell renders, then no Warehouse slot appears in the domain bar or SCM sidebar.

Delivery: implemented

## Implementation

- apps/server/src/lib/business-capabilities.js; apps/server/src/modules/business/application/business-capability-service.js; apps/server/src/app/api/businesses/[id]/capabilities/route.js; apps/server/src/app/(pm)/settings/page.jsx

## Verification

- TC-001-005 — Business capability writer and shell hiding (see [verification.md](../verification.md))
