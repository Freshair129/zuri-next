---
id: FR-076-003
title: "Knowledge (GKS) navigation slot"
delivery: implemented
legacy: [FR-214]
relations:
  specified_by: [SDD-076]
  decided_by: [ADR-070]
---

# FR-076-003 — Knowledge (GKS) navigation slot

The system SHALL add one flat domain key, `knowledge`, labelled **Knowledge (GKS)**,
base path `/knowledge`, to `DOMAINS`, owned by this charter and belonging to no
`DOMAIN_GROUPS` container. Its Dashboard at `/knowledge` SHALL show the map's summary
figures and link to the Data Pipeline Map, under the same server-side admission as
FR-076-002. The key SHALL be grantable exactly like any other domain: a Business
OWNER sees it by default through `VIEWER_DOMAINS`, a member only when their Membership
names it, and the route guard SHALL resolve every `/knowledge/**` path to it.

## Acceptance criteria

- AC-076-003-01 — Given a Business OWNER with no explicit grant, when they view their domain bar, then `knowledge` appears by default (owner-default visibility).
- AC-076-003-02 — Given a non-owner member whose Membership does not name `knowledge`, when they view their domain bar, then it does not appear.
- AC-076-003-03 — Given a request to any `/knowledge/**` path, when the route guard resolves it, then it resolves to the `knowledge` domain key for authorization.

## Implementation

- apps/server/src/config/domains.js; apps/server/src/app/(pm)/knowledge/page.jsx; apps/server/src/modules/knowledge/pipeline-map/KnowledgeDashboard.jsx

## Verification

- TC-076-003 — Knowledge domain key grant and navigation (see [verification.md](../verification.md))
