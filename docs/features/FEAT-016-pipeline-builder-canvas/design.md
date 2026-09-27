---
id: SDD-016
title: "Pipeline builder canvas — design"
---

# SDD-016 — Pipeline builder canvas design

- **Components (planned):** CMP-033 (`WbsCanvas`, `DependencyMap` become editable), CMP-010 (unchanged rules, contract field), CMP-020 (envelope deltas as the single write path).
- **Data owned (planned):** `Dependency.handoffContractJson` (nullable).
- **Main sequence (planned):** drop → client builds envelope delta → server validate/semantic/dry run → optimistic pending edge is the preview → commit with one audit event, or revert with the reason at the edge; undo via the audit event.
- **Failure modes:** refusal rendered in place; no toast-only errors.

## Implementation map

| Requirement | Current code (legacy repo path) |
|---|---|
| FR-016-001..004 | none — declared only (read-only precursors: apps/server/src/modules/project-manager/views/WbsCanvas.jsx, views/DependencyMap.jsx, views/KanbanBoard.jsx) |
