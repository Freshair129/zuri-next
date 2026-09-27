---
id: SDD-034
title: "Console Shell: Scope, Navigation & Seed Data — design"
---

# SDD-034 — Console Shell: Scope, Navigation & Seed Data design

- **Components:** `CMP-071` (`src/context/ScopeContext.jsx`);
  `CMP-059` (`src/components/layouts/CommandPalette.jsx`);
  `CMP-072` (`prisma/seed.js`).
- **Data owned:** none (client view state; seed writes rows owned by other
  domains' models).
- **Contracts exposed:** none.
- **Contracts consumed:** the command palette index reads the same
  `DOMAINS` registry FEAT-035 extends.
- **Main sequence:** 1. Viewer selects a scope; `ScopeContext` persists it
  client-side. 2. Viewer opens the palette; it filters the route index by
  the viewer's own visibility (server-enforced elsewhere, `DOM-IAM`). 3. An
  operator runs `prisma/seed.js` against a fresh or existing database;
  idempotent upserts produce the same end state either way.
- **Failure modes:** none beyond ordinary render/query failures; the seed
  script's idempotency is its only correctness contract.

## Implementation map

| Requirement | Current code (legacy repo path) |
|---|---|
| FR-034-001 | `apps/server/src/context/ScopeContext.jsx` |
| FR-034-002 | `apps/server/src/components/layouts/CommandPalette.jsx` |
| FR-034-003 | `apps/server/prisma/seed.js` |
