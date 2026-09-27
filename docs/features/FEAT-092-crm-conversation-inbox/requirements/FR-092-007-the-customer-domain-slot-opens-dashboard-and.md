---
id: FR-092-007
title: "The customer domain slot opens Dashboard and Inbox"
part: FEAT-092-P04
owner: DOM-PRJ
delivery: live
legacy: [FR-091 (navigation, part of split 1/3)]
relations:
  specified_by: [SDD-092]
---

# FR-092-007 — The customer domain slot opens Dashboard and Inbox

The system SHALL list, in the Business navigation registry, the `customer` domain slot
as available with entries Dashboard (`/customer`) and Inbox (`/customer/conversations`)
(plus Sales Tasks, FEAT-045), grouped under the CRM parent group.

## Acceptance criteria

- AC-092-007-01 — Given a viewer with the CRM domain, when the navigation renders, then Inbox links to `/customer/conversations`.

## Implementation

- apps/server/src/config/domains.js

## Verification

- TC-092-005 — Navigation slot (see [verification.md](../verification.md))
