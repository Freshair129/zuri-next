---
id: FR-002-006
title: "Branded public landing"
delivery: live
legacy: [FR-056]
relations:
  derived_from: [NFR-001, NFR-008]
  decided_by: [ADR-084]
---

# FR-002-006 — Branded public landing

The system SHALL serve `/` as a full-viewport, responsive Zuri-branded landing with exactly
one route-bearing action, to `/login`; it SHALL render outside the Business shell (no domain
bar, sidebar, Business picker or shell data loading), use only local/code-native assets,
honour reduced-motion (static composition for reduced-motion, coarse-pointer and mobile), and
carry no third-party, fashion, retail or commerce semantics.

## Acceptance criteria

- AC-002-006-01 — Given `/`, then exactly one link exists and it targets `/login`.
- AC-002-006-02 — Given `prefers-reduced-motion`, then no animated reveal runs.
- AC-002-006-03 — Given the page source, then no external image/font URL is referenced.

## Implementation

- apps/server/src/app/page.jsx; apps/server/src/components/landing/ZuriLanding.jsx; apps/server/src/components/layouts/EntryShell.jsx

## Verification

- TC-002-004 — Landing page (see [verification.md](../verification.md))
