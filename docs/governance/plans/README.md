# Governance plans

A plan is a machine-readable file that says what changes, in what order, and how
each step is proven done. Plans are governance artifacts (STD-003 R1
`governance/plans/`); they are not specification and carry no STD-002 IDs
inside them.

| File | What it is |
|---|---|
| [PLAN-001.json](PLAN-001.json) | Documentation structure and content master plan: phases, tasks, checklists, acceptance criteria, metrics |
| [plan.schema.json](plan.schema.json) | JSON Schema every `PLAN-*.json` must satisfy |
| [dashboard.html](dashboard.html) | Interactive view of a plan. Open it over HTTP (`npx serve docs/governance/plans`) or through the published artifact; it fetches the JSON next to it |
| [spec-tree.json](spec-tree.json) | Generated view (STD-003 R6): domain › feature › FR / NFR with a traffic-light state per node. Written only by `node tools/spec-tree.mjs`; `--check` fails when stale |
| [spec-tree.html](spec-tree.html) | Interactive tree over `spec-tree.json`: expand by level, filter by state, search by ID or title, requirement detail with its ACs and TCs |
| [spec-orgchart.html](spec-orgchart.html) | Org-chart layout of the same data: connected boxes, top down, with pan, zoom, fold per node and find-by-ID; same state colours |
| [sitemap.json](sitemap.json) | Generated navigation map: surface › slot (domain bar) › module › page › view. Authored half is `registry/sitemap.yaml`; derived half is every console path the specification mentions. Written only by `node tools/sitemap.mjs` (after `spec-tree.mjs`); `--check` fails when stale or when an evidence id is unknown. Rendered by the Sitemap mode of `spec-graph.html` |
| [sitemap.layout.json](sitemap.layout.json) | Authored card positions for the Sitemap canvas (`{ "<card key>": { "x", "y" } }`). Empty means auto layout. The canvas's *Copy layout* button produces this file; a viewer's own drags stay in their browser |
| [pipeline.json](pipeline.json) | Generated data-flow map of the GenesisRAG17 knowledge pipeline (surfaces → admission → Tier 1 stages → ledgers → MSP relay → GKS / worker stages → published corpus → consumers), from `registry/pipeline.yaml`; written only by `node tools/pipeline-map.mjs`, which refuses unknown evidence, kinds, tiers or dangling edges |
| [spec-graph.html](spec-graph.html) | One page, four modes. **Pipeline**: the map above as lanes and typed edges (call · durable queue · MSP relay · evidence report/pull · publish · read) with a panel per node. **Graph**: domains on role rings (foundation · platform · business) with features, context-map links, FR / NFR unfolding; a click slides in a panel with the node's local graph and details, and can open a domain or feature as an **org chart**. **Sitemap**: surface › slot › module › page › view over `sitemap.json`, each page listing the features behind it; a feature's panel lists where it appears in the product, and the two modes link to each other |

`spec-tree.json` also carries each domain's subdomain type and role and the context
map from `registry/` (ADR-107); the graph view arranges domains by role (foundation
at the centre, platform next, business outside) and draws context-map links.

State rules for the tree (colour never carries meaning alone; every node also
prints its status word):

| Colour | Domain / feature | FR / NFR |
|---|---|---|
| green | `status: approved` | `delivery: live` or `implemented` |
| yellow | `status: draft` | `delivery: building` |
| grey | `status: proposed` | `delivery: declared` |
| red | `delivery: retired` | retired · FR with no AC · implemented/live FR with no TC |

## Rules

- **The JSON is canonical.** Task `status` and checklist `done` flags change only
  in the JSON, through a pull request, like any other document. Ticks made in the
  dashboard live in the viewer's browser; the dashboard's *Export JSON* button
  produces the file to paste back.
- **Every task has acceptance criteria** in Given / When / Then form and, where a
  command exists, a `verify` line. Run it before marking the task done.
- **A phase closes on its exit criteria**, and never while
  `node tools/validate-docs.mjs` reports an error or a warning.
- **Metrics are measured, not typed.** `baseline` was counted once at the plan's
  founding; `current` is written by `tools/plan-metrics.mjs --write` (PLAN-001 P0-T2)
  and never edited by hand.
- **Plan-local IDs** (`P1-T2`, `P1-T2-C1`, `P1-T2-A1`) name phases, tasks,
  checklist items and acceptance criteria inside a plan. They are never artifact
  IDs and never appear in a feature folder.

## Adding a plan

1. Copy the shape of `PLAN-001.json`; next number is `max + 1`.
2. Validate against `plan.schema.json` (any JSON Schema validator; no tool in this
   repository is required).
3. Add a row to the table above.
