---
id: FR-069-001
title: "Trusted LINE asset handoff (implementation removed, gap)"
delivery: retired
legacy: [FR-140]
relations:
  specified_by: [none]
  decided_by: [ADR-060]
---

# FR-069-001 — Trusted LINE asset handoff (implementation removed, gap)

The system SHALL, once re-implemented or explicitly retired by owner
decision, accept from a server-bound transport identity a source
correlation and opaque, already-active `FileAsset` ids; derive Tenant/Business
from the calling binding rather than trusting any body-supplied identity,
token or URL; verify file scope/status; and write idempotently through the
canonical Asset intake service — the transport (zuri-cli/Edge) SHALL retain
LINE signature, secret and byte-fetch authority, never this side.

## Acceptance criteria

- AC-069-001-01 — Given a handoff request naming a tenantId/businessId in its body, when the (re-implemented) route runs, then the body-supplied identity is rejected in favor of the identity derived from the trusted transport binding.
- AC-069-001-02 — Given the same source-correlated handoff submitted twice, when processed, then the second submission is idempotent (no duplicate Asset intake write).

## Implementation

- *(removed — historically `apps/server/src/app/api/agent/line-asset-handoff/route.js`, `apps/server/src/modules/asset-management/import/line-asset-handoff.js`)*
