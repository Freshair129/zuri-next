---
id: FR-022-002
title: "Complete projection"
delivery: live
legacy: [FR-124 (split 2/3 — projection completeness)]
relations:
  derived_from: [BR-004]
---

# FR-022-002 — Complete projection

The system SHALL project every explicit feature bundle once and every unbundled requirement once, each
with exactly one primary domain and one non-empty human use case; missing, duplicate, unknown or
use-case-less metadata (including an empty metadata list) SHALL abort projection generation rather than
produce a partial list.

## Acceptance criteria

- AC-022-002-01 — Given a requirement with no use-case metadata, then generation fails naming it.

## Verification

- TC-022-001 — Readiness read model and projection (see [verification.md](../verification.md))
