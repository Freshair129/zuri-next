#!/usr/bin/env node
// Validate registry/pipeline.yaml (the GenesisRAG17 data-flow map) and write
// docs/governance/plans/pipeline.json for the Pipeline mode of spec-graph.html.
// Checks: every node id unique; every edge joins known nodes; kinds, tiers, lanes from the fixed
// vocabularies; every evidence id resolves (needs docs/governance/plans/spec-tree.json for FEAT/FR ids).
// Usage: node tools/pipeline-map.mjs [--check]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseYaml } from './lib/yaml.mjs';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DOCS = path.join(REPO, 'docs');
const OUT = path.join(DOCS, 'governance/plans/pipeline.json');
const CHECK = process.argv.includes('--check');
const read = (f) => fs.readFileSync(f, 'utf8');

const y = parseYaml(read(path.join(REPO, 'registry/pipeline.yaml')));
const tree = JSON.parse(read(path.join(DOCS, 'governance/plans/spec-tree.json')));
const index = {}; for (const d of tree.domains) { index[d.id] = d; for (const f of d.features) { index[f.id] = f; for (const r of f.requirements) index[r.id] = r; } }
// ids declared outside the tree (contracts, rules, services, decisions) are checked against the docs text
const docIds = new Set();
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
for (const f of walk(DOCS).filter((x) => x.endsWith('.md') && !x.includes('/plans/'))) { const t = read(f); for (const m of t.matchAll(/^(?:id:\s*|#{1,6}\s+)((?:ADR|API|EVT|BR|SEC|SRV|ARCH|PRD|BRD|STD|NFR|RB)-\d{3,})\b/gm)) docIds.add(m[1]); }
const known = (id) => !!index[id] || docIds.has(id);

const KINDS = new Set(['surface', 'entry', 'process', 'store', 'transport', 'recipient']);
const TIERS = new Set(['t1', 't2', 't3', 't4', 'db', 'ext']);
const EDGE = new Set(['call', 'queue', 'relay', 'report', 'pull', 'publish', 'read', 'mcp']);
const lanes = new Set((y.lanes || []).map((l) => l.id));
const errors = [];
const ev = (o, where) => { const e = Array.isArray(o?.evidence) ? o.evidence : []; for (const id of e) if (!known(id)) errors.push(`${where}: unknown evidence ${id}`); return e; };
const nodes = new Map();
for (const n of y.nodes || []) {
  if (nodes.has(n.id)) errors.push(`node ${n.id}: duplicate id`);
  if (!KINDS.has(n.kind)) errors.push(`node ${n.id}: kind "${n.kind}" not in ${[...KINDS].join('|')}`);
  if (!TIERS.has(n.tier)) errors.push(`node ${n.id}: tier "${n.tier}" not in ${[...TIERS].join('|')}`);
  if (!lanes.has(n.lane)) errors.push(`node ${n.id}: lane "${n.lane}" not declared`);
  if (!n.label) errors.push(`node ${n.id}: label missing`);
  const e = ev(n, 'node ' + n.id); if (!e.length) errors.push(`node ${n.id}: no evidence`);
  nodes.set(n.id, { id: n.id, lane: n.lane, kind: n.kind, tier: n.tier, label: String(n.label), detail: n.detail || null, evidence: e });
}
const edges = [];
for (const [i, e] of (y.edges || []).entries()) {
  if (!nodes.has(e.from)) errors.push(`edge ${i}: unknown from "${e.from}"`);
  if (!nodes.has(e.to)) errors.push(`edge ${i}: unknown to "${e.to}"`);
  if (!EDGE.has(e.kind)) errors.push(`edge ${i} (${e.from} → ${e.to}): kind "${e.kind}" not in ${[...EDGE].join('|')}`);
  edges.push({ from: e.from, to: e.to, kind: e.kind, label: e.label ? String(e.label) : null });
}
ev(y.meta, 'meta');
// every node touched by at least one edge
for (const n of nodes.values()) if (!edges.some((e) => e.from === n.id || e.to === n.id)) errors.push(`node ${n.id}: not connected`);

const out = {
  generated: new Date().toISOString().slice(0, 10),
  source: 'registry/pipeline.yaml',
  meta: { title: y.meta?.title || 'Pipeline', event_bus: String(y.meta?.event_bus || '').trim(), evidence: y.meta?.evidence || [] },
  lanes: (y.lanes || []).map((l) => ({ id: l.id, label: l.label })),
  nodes: [...nodes.values()],
  edges,
  totals: { nodes: nodes.size, edges: edges.length, surfaces: [...nodes.values()].filter((n) => n.kind === 'surface').length, stores: [...nodes.values()].filter((n) => n.kind === 'store').length },
};
for (const e of errors) console.error('error: ' + e);
if (errors.length) { console.error(`${errors.length} error(s) in registry/pipeline.yaml`); process.exit(1); }
const json = JSON.stringify(out, null, 1) + '\n';
const cur = fs.existsSync(OUT) ? read(OUT) : '';
const strip = (s) => s.replace(/"generated": "[^"]+"/, '');
const stale = strip(cur) !== strip(json);
if (CHECK) { console.log(stale ? 'pipeline.json is stale' : 'pipeline.json is current'); process.exit(stale ? 1 : 0); }
if (stale) fs.writeFileSync(OUT, json);
console.log(`${stale ? 'wrote' : 'unchanged'} ${path.relative(REPO, OUT)}: ${out.totals.nodes} nodes (${out.totals.surfaces} surfaces, ${out.totals.stores} stores), ${out.totals.edges} edges`);
