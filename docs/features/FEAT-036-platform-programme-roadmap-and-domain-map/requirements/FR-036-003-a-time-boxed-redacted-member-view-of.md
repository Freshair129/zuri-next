---
id: FR-036-003
title: "A time-boxed, redacted member view of the plan"
delivery: live
legacy: [FR-241]
relations:
  specified_by: [SDD-036]
  decided_by: [ADR-036]
---

# FR-036-003 — A time-boxed, redacted member view of the plan

Until **2026-10-15 00:00 Asia/Bangkok** (a constant in code), `/roadmap`
SHALL show any signed-in person — no Business, role or grant consulted or
conferred — a read-only projection of the programme board (phases, sprints,
tasks, the Domain map tab, per-lane token totals, active time and headline
usage counts). The projection SHALL be reduced on the server before
rendering: no usage by person or device, no tool or model name, no Agent
devices tab, no report/credential row. A visitor with no session SHALL be
sent to `/login`; once the window closes the route SHALL be a
non-enumerating 404 for everyone, including operators. `/control/roadmap`
SHALL be unchanged and SHALL still admit only `isOperator`.

## Acceptance criteria

- AC-036-003-01 — Given the window is open, when any signed-in person requests `/roadmap`, then they see the plan and Domain map with no person/device/tool/model attribution anywhere in the payload.
- AC-036-003-02 — Given the window has closed, when anyone — including an operator — requests `/roadmap`, then it answers a non-enumerating 404.

## Implementation

- `apps/server/src/app/roadmap/page.jsx`, `apps/server/src/modules/platform-control/programme-member-view.js`

## Verification

- TC-036-003 — Member view redaction and window-close 404 (see [verification.md](../verification.md))
