---
id: FR-063-002
title: "LINE ladder quotation tool (declared only)"
delivery: implemented
legacy: [FR-132]
relations:
  specified_by: [none]
  decided_by: [ADR-060]
---

# FR-063-002 — LINE ladder quotation tool (declared only)

The system SHALL, once intent recognition and pricing evidence exist,
register exactly one Gate E read-only tool descriptor
(`defaultReadOnlyTools`) that computes a tiered quotation from an existing
LINE conversation's already-verified, already-normalized turn — adding no
new route, converter, model, or credential, since the intake and turn path
are already complete (FR-062-001 lineage) — and SHALL price the quote
using the resolving Business's own rate card only
(`requireToolAuthorization`/`authorizeScope`), rounding the customer-visible
number up to the nearest 10 THB while never carrying the underlying margin
floor in the tool's response payload.

## Acceptance criteria

- AC-063-002-01 — Given a customer message containing "ขอใบเสนอราคา" or "คำนวณราคา <code> จำนวน <n> ชิ้น", when the (undeclared) intent layer recognizes it, then the tool computes a ladder quote and returns it as reply text — never as a LINE Flex Message, never through a `replyToken` (the transport owner renders it, per legacy BR-056/FR-050).
- AC-063-002-02 — Given a quote whose margin floor test fails on the cost side, when the tool responds, then the payload never includes the margin figure (FR-074-002 scope exclusion) — only the rounded customer price.

## Implementation

- *(none — declared only)*
