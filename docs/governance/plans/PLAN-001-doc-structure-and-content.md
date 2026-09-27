---
id: PLAN-001
title: Documentation structure and content master plan
status: proposed
version: 0.1.0
owner: governance
relations:
  depends_on: [STD-001, STD-002, STD-003, STD-004]
---

# PLAN-001 — Documentation structure and content master plan

The plan itself is the machine-readable file [PLAN-001.json](PLAN-001.json)
(shape: [plan.schema.json](plan.schema.json)); this page declares its ID and
records its scope. Read it through [dashboard.html](dashboard.html).

## Scope

Eight phases, in order:

| Phase | Outcome |
|---|---|
| P0 Measure and guard | STD-003 structure check in `validate-docs`, `tools/plan-metrics.mjs`, CI on every pull request |
| P1 Structural conformance | `SERVICE.md` carries `hosts:` / `implements:`, `registry/relations.yaml` exists, STD-003 corrected and approved, templates for every file type |
| P2 Requirements content | No empty Verification section, all ACs in Given / When / Then, legacy code pointers labelled, `declared` FRs decided, status × delivery reconciled |
| P3 Design content | SDD minimum defined and met by all 97 designs, domain READMEs complete |
| P4 Verification content | One TC form, legacy tests labelled, AC coverage tool at 100 % for implemented and live FRs |
| P5 Review and approval | Every feature approved by its domain owner, standards approved, private backlog triaged |
| P6 Views and dashboard | Trace matrix and feature map generated, plan metrics written by tool |
| P7 Ready for code | Code layout ADR, `@trace` lint, first implementation slice named in a follow-up implementation plan |

## Baseline (2026-09-27, `eb38090`)

97 features (31 approved, 54 draft, 12 proposed) · 411 FRs (55 with an empty
Verification section, 16 `declared`, 168 whose Implementation section is a
zuri-ai path) · 961 ACs (190 not in Given / When / Then form) · 349 TCs (none bound
to a test in this repository) · 38 design docs under 25 lines · 18 STD-003
structure findings (all in `docs/services/`) · validator 0 errors, 0 warnings.

## Status changes

Task status and checklist ticks change in the JSON only, by pull request
([README](README.md)). This page changes when the scope changes.
