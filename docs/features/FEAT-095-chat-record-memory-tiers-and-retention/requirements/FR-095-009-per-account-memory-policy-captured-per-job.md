---
id: FR-095-009
title: "Per-account memory policy captured per job (declared)"
part: FEAT-095-P05
owner: DOM-LOA
delivery: building
legacy: [FR-231 (split 1/2)]
relations:
  specified_by: [SDD-095]
  decided_by: [ADR-041]
  derived_from: [SEC-029]
---

# FR-095-009 — Per-account memory policy captured per job (declared)

The system SHALL give each LINE OA account a publisher-set `memoryPolicy` defaulting to
OFF and SHALL capture immutably on each job whether the turn may reach MSP's session tier
(policy not OFF) and whether it may reach episodic, passport or cross-thread memory
(policy not OFF, Customer consent GRANTED, audience DIRECT); group and room turns never
reach private memory.

## Acceptance criteria

- AC-095-009-01 — Given policy ON and consent PENDING on a direct chat, when a job is admitted, then it may reach the session tier only.

## Implementation

- — (declared)
