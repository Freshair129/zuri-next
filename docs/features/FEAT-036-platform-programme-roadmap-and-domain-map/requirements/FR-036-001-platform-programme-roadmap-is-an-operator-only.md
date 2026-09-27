---
id: FR-036-001
title: "Platform Programme Roadmap is an operator-only, read-only plan snapshot"
delivery: live
legacy: [FR-105]
relations:
  specified_by: [SDD-036]
  decided_by: [ADR-030]
---

# FR-036-001 — Platform Programme Roadmap is an operator-only, read-only plan snapshot

`/control/roadmap` SHALL be an installation-operator-only, read-only
projection of the submitted 24-week programme, mounted outside BusinessShell
and absent from `DOMAINS`. A missing viewer SHALL follow the entry boundary;
a trusted viewer SHALL be admitted only by `isOperator` — never by
`isPlatform`, role, Business/Tenant ownership or domain visibility. The
board SHALL be a static plan snapshot re-projected from the programme
document's own frontmatter and tables, carrying the document's own status.
It SHALL make no write, persist no progress, and SHALL NOT turn commit
activity into programme completion.

## Acceptance criteria

- AC-036-001-01 — Given a trusted viewer with no operator grant, when they request `/control/roadmap`, then they receive a non-enumerating 404.
- AC-036-001-02 — Given the board renders, when its data is inspected, then it exposes no API, database or audit write path.

## Implementation

- `apps/server/src/app/(control)/{control/roadmap/page.jsx,layout.jsx}`, `apps/server/src/components/layouts/{PlatformControlGuard,PlatformControlSessionRetry,PlatformControlShell}.jsx`, `apps/server/src/lib/platform-control-guard.js`, `apps/server/src/modules/platform-control/{roadmap-sot.js,program-roadmap-data.js,program-roadmap-containers.js}`

## Verification

- TC-036-001 — Operator-only admission and read-only plan snapshot (see [verification.md](../verification.md))
