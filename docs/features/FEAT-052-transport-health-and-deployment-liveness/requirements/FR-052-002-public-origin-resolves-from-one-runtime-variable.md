---
id: FR-052-002
title: "Public origin resolves from one runtime variable, never assumed"
delivery: live
legacy: [FR-142 (split 2/2)]
relations:
  specified_by: [API-125]
  decided_by: [ADR-044]
---

# FR-052-002 — Public origin resolves from one runtime variable, never assumed

The system SHALL resolve the deployment's public origin from
`PUBLIC_BASE_URL`, falling back to build-time `NEXT_PUBLIC_APP_URL`, falling
back to `http://localhost:3100`, reduced to an origin; a non-HTTP or
unparsable value SHALL be ignored rather than propagated, and no platform
hostname SHALL be assumed anywhere else in the deployment.

## Acceptance criteria

- AC-052-002-01 — Given `PUBLIC_BASE_URL` unset and `NEXT_PUBLIC_APP_URL` set to a valid https URL, when the origin is resolved, then that URL's origin is used.
- AC-052-002-02 — Given `PUBLIC_BASE_URL` set to a non-HTTP value, when resolved, then it is ignored and the next fallback is used.

## Implementation

- `apps/server/src/lib/public-base-url.js`, `apps/server/src/app/layout.jsx`

## Verification

- TC-052-002 — Public origin resolution and fallback order (see [verification.md](../verification.md))
