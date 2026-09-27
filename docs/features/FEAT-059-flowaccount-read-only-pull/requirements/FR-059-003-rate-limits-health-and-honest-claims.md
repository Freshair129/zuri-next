---
id: FR-059-003
title: "Rate limits, health and honest claims"
delivery: declared
legacy: [FR-125 (split 3/3)]
relations:
  specified_by: [SDD-059]
---

# FR-059-003 — Rate limits, health and honest claims

The system SHALL keep headroom under the provider's published rate limit (recorded as
Sandbox 20 and Production 100 requests/minute, to be re-verified), retry 429/transient
failures with bounded exponential backoff and jitter, show computed health
(CONNECTED/DEGRADED/ERROR/DISABLED/MISCONFIGURED) from credential, company test, latest
run and cursor evidence, and SHALL state that the data is raw external evidence — never
GL, trial balance, P&L or reconciled revenue.

## Acceptance criteria

- AC-059-003-01 — Given the integration page, when a FlowAccount connection is shown, then no accounting-completeness claim appears.
