---
id: FEAT-038
title: Agent Usage Detail
type: domain-feature
owner: DOM-PLT
runtime: SRV-001
status: approved
delivery: live
legacy: [FEAT-039, FR-239, FR-240]
relations:
  depends_on: []
  decided_by: [ADR-034]
---

# FEAT-038 — Agent Usage Detail

## Summary

For every measured lane, the programme board shows how tokens split into
input/output/thinking/cache, which tools were called and how often they
failed or were denied, and how many prompts and compactions a session took —
counted from operator-local logs and deployment-bearer reports, names and
numbers only. Historical person/device attribution (from the now-retired
harness plugin) remains readable where it already exists, but nothing new
attributes usage to a person or device any longer.

## Scope

**In:** usage-detail capture (thinking tokens, cache lifetimes, web search/
fetch, tool calls + errors + denials, prompts, compactions, API errors,
requests per model); the board's per-lane detail breakdown.
**Out:** the headline four-token-count figures (FEAT-037); new person/
device attribution (retired, `legacy:FR-221`).

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-PLT |
| Runtime owner | SRV-001 |

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-038-001](requirements/FR-038-001-the-usage-meter-and-reports-count-usage.md) | The usage meter and reports count usage detail, names and numbers only | — |
| [FR-038-002](requirements/FR-038-002-the-board-shows-usage-detail-per-lane.md) | The board shows usage detail per lane, never estimating an absent figure | — |
| [NFR-038-001](requirements/NFR-038-001-meter-report-counting-rules-match-field-for.md) | Meter/report counting rules match field-for-field | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
