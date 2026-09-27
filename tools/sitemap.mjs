#!/usr/bin/env node
// Build the product navigation map: surface → slot (domain bar) → module → page → view.
// Authored half: registry/sitemap.yaml (pages, views, surfaces, shell controls, each with evidence).
// Derived half: every console path the specification mentions as a backticked `/…` in
// docs/features, docs/domains and docs/product — matched onto the authored pages (adds the
// features behind them) or appended as derived pages when the registry does not name them.
// Needs docs/governance/plans/spec-tree.json (run tools/spec-tree.mjs first) for feature states.
// Writes docs/governance/plans/sitemap.json (rendered by sitemap.html).
// Usage: node tools/sitemap.mjs [--check]     exit 1 when stale (--check) or when an evidence id is unknown
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseYaml } from './lib/yaml.mjs';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DOCS = path.join(REPO, 'docs');
const OUT = path.join(DOCS, 'governance/plans/sitemap.json');
const CHECK = process.argv.includes('--check');
const read = (f) => fs.readFileSync(f, 'utf8').replace(/\r\n/g, '\n');

const overlay = parseYaml(read(path.join(REPO, 'registry/sitemap.yaml')));
const tree = JSON.parse(read(path.join(DOCS, 'governance/plans/spec-tree.json')));
const index = {}; for (const d of tree.domains) { index[d.id] = d; for (const f of d.features) { index[f.id] = f; for (const r of f.requirements) { index[r.id] = r; for (const a of r.acs) index[a.id] = a; } } }
const known = (id) => !!index[id] || /^(PRD|BRD|ARCH|ADR|STD|BR|API|EVT|SRV)-\d+$/.test(id);
const warn = []; const ev = (o, where) => { const e = Array.isArray(o?.evidence) ? o.evidence : []; e.forEach((id) => { if (!known(id)) warn.push(`${where}: unknown evidence ${id}`); }); return e; };
const featOfId = (id) => (id.startsWith('FEAT-') ? id : /^(N?FR|AC)-(\d{3})/.test(id) ? 'FEAT-' + id.match(/^(?:N?FR|AC)-(\d{3})/)[1] : null);
const feat = (id) => (index[id] ? { id, title: index[id].title, state: index[id].state, owner: index[id].owner } : null);
const uniq = (fs) => [...new Map(fs.filter(Boolean).map((f) => [f.id, f])).values()];
const counts = (fs) => { const c = { green: 0, yellow: 0, red: 0, grey: 0 }; fs.forEach((f) => c[f.state]++); return c; };

// ---- derived paths ----
const SKIP = /^\/(api|v1|healthz|readyz|token|harness|plugin|oauth|_next)\b/;
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
const pathHits = new Map(); // path -> Map(citing id -> count)
for (const dir of ['features', 'domains', 'product']) for (const f of walk(path.join(DOCS, dir)).filter((x) => x.endsWith('.md'))) {
  const rel = path.relative(DOCS, f).replace(/\\/g, '/');
  const fid = (rel.match(/^features\/(FEAT-\d{3})/) || [])[1] || (rel.match(/^domains\/([a-z-]+)\//) ? tree.domains.find((d) => d.slug === rel.match(/^domains\/([a-z-]+)\//)[1])?.id : null) || 'PRD-001';
  for (const m of read(f).matchAll(/`(\/(?:[a-z][a-z0-9/_-]*)?)`/g)) {
    const p = m[1].replace(/\/$/, '') || '/'; if (SKIP.test(p)) continue;
    if (!pathHits.has(p)) pathHits.set(p, new Map()); const h = pathHits.get(p); h.set(fid, (h.get(fid) || 0) + 1);
  }
}
const segs = (p) => p.split('/').filter(Boolean);
const label = (s) => s.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
const featuresOfPath = (p) => [...(pathHits.get(p) || new Map())].filter(([id]) => /^FEAT-/.test(id)).sort((a, b) => b[1] - a[1]).map(([id]) => feat(id)).filter(Boolean);
const citedBy = (p) => [...(pathHits.get(p) || new Map()).keys()];
const featuresOfEvidence = (e) => uniq(e.map(featOfId).filter(Boolean).map(feat));

// ---- slots (authored first) ----
const slotDefs = [{ key: '__entry', ...(overlay.entry || {}), label: overlay.entry?.label || 'Entry' }, ...(overlay.slots || [])];
const slots = new Map();
const mkView = (v, where) => (typeof v === 'string' ? { label: v.replace(/ \(planned\)$/, ''), planned: / \(planned\)$/.test(v), path: null, evidence: [], features: [], derived: false } : { label: v.label, path: v.path || null, planned: !!v.planned, evidence: ev(v, where), features: uniq([...(v.path ? featuresOfPath(v.path) : []), ...featuresOfEvidence(ev(v, where))]), derived: false });
for (const s of slotDefs) {
  const where = 'slot ' + s.key;
  const slot = { key: s.key, label: s.label || label(s.key), domain: s.domain || null, group: s.group || null, note: s.note || null, evidence: ev(s, where), modules: [], pages: [], authored: true };
  slot.modules = (s.modules || []).map((m) => ({ label: m.label, views: (m.views || []).map((v) => mkView(v, 'module ' + m.label)), entered_at: m.entered_at || null, evidence: ev(m, 'module ' + m.label) }));
  for (const p of s.pages || []) {
    const w = `page ${p.label}`; const e = ev(p, w);
    slot.pages.push({ path: p.path || null, label: p.label, note: p.note || null, planned: !!p.planned, evidence: e, features: uniq([...(p.path ? featuresOfPath(p.path) : []), ...featuresOfEvidence(e)]), cited_by: p.path ? citedBy(p.path) : [], views: (p.views || []).map((v) => mkView(v, w)), derived: false });
  }
  slots.set(s.key, slot);
}
mkSlotDerived('__unassigned');
function mkSlotDerived(key) { if (!slots.has(key)) slots.set(key, { key, label: key === '__unassigned' ? 'Unassigned paths (no slot in registry/sitemap.yaml)' : label(key), domain: null, group: null, note: null, evidence: [], modules: [], pages: [], authored: false }); return slots.get(key); }

// ---- merge derived paths ----
const rootOwner = new Map();
for (const s of slotDefs) for (const p of s.paths || []) rootOwner.set(p, s.key);
const pathIndex = new Map(); // path -> { slot, page, view? }
for (const slot of slots.values()) for (const pg of slot.pages) { if (pg.path) pathIndex.set(pg.path, { slot, page: pg }); for (const v of pg.views) if (v.path) pathIndex.set(v.path, { slot, page: pg, view: v }); }
function slotOf(p) { if (rootOwner.has(p)) return rootOwner.get(p); const s = segs(p); if (!s.length) return '__entry'; if (slots.has(s[0]) && s[0] !== '__entry') return s[0]; return '__unassigned'; }
for (const p of [...pathHits.keys()].sort()) {
  const hit = pathIndex.get(p);
  if (hit) { const t = hit.view || hit.page; t.features = uniq([...t.features, ...featuresOfPath(p)]); t.cited_by = citedBy(p); continue; }
  const s = segs(p); const slot = slots.get(slotOf(p)) || mkSlotDerived(slotOf(p));
  const parentPath = s.length > 2 ? '/' + s.slice(0, 2).join('/') : null;
  const parent = parentPath ? pathIndex.get(parentPath)?.page : null;
  if (parent) { const v = { label: label(s.slice(-1)[0]), path: p, planned: false, evidence: [], features: featuresOfPath(p), cited_by: citedBy(p), derived: true }; parent.views.push(v); pathIndex.set(p, { slot, page: parent, view: v }); continue; }
  const pg = { path: p, label: p === '/' ? 'Landing' : label(s.slice(-1)[0]), note: null, planned: false, evidence: [], features: featuresOfPath(p), cited_by: citedBy(p), views: [], derived: true };
  slot.pages.push(pg); pathIndex.set(p, { slot, page: pg });
}

// ---- finalize ----
const out = {
  generated: new Date().toISOString().slice(0, 10),
  source: 'registry/sitemap.yaml + backticked console paths in docs/',
  surfaces: (overlay.surfaces || []).map((s) => ({ id: s.id, label: s.label, role: s.role, users: s.users, evidence: ev(s, 'surface ' + s.id), entries: (s.entries || []).map((e) => ({ label: e.label, evidence: ev(e, 'surface entry ' + e.label), features: featuresOfEvidence(ev(e, 'surface entry ' + e.label)) })) })),
  shell: (overlay.shell || []).map((e) => ({ label: e.label, evidence: ev(e, 'shell ' + e.label) })),
  console: { slots: [] },
};
for (const slot of slots.values()) {
  for (const pg of slot.pages) {
    const all = uniq([...pg.features, ...pg.views.flatMap((v) => v.features)]);
    const owners = {}; for (const f of all) owners[f.owner] = (owners[f.owner] || 0) + 1;
    pg.domain = Object.entries(owners).sort((a, b) => b[1] - a[1])[0]?.[0] || slot.domain;
    pg.counts = counts(all);
  }
  const all = uniq(slot.pages.flatMap((p) => [...p.features, ...p.views.flatMap((v) => v.features)]));
  out.console.slots.push({ ...slot, counts: counts(all) });
}
const order = slotDefs.map((s) => s.key).concat(['__unassigned']);
out.console.slots.sort((a, b) => order.indexOf(a.key) - order.indexOf(b.key));
out.totals = {
  slots: out.console.slots.filter((s) => !s.key.startsWith('__')).length,
  pages: out.console.slots.reduce((n, s) => n + s.pages.length, 0),
  views: out.console.slots.reduce((n, s) => n + s.pages.reduce((m, p) => m + p.views.length, 0) + s.modules.reduce((m, x) => m + x.views.length, 0), 0),
  paths: pathHits.size,
  derived_pages: out.console.slots.reduce((n, s) => n + s.pages.filter((p) => p.derived).length, 0),
  unassigned: (out.console.slots.find((s) => s.key === '__unassigned')?.pages || []).map((p) => p.path),
};

const json = JSON.stringify(out, null, 1) + '\n';
const cur = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : '';
const strip = (s) => s.replace(/"generated": "[^"]+"/, '');
const stale = strip(cur) !== strip(json);
for (const w of warn) console.warn('warning: ' + w);
if (CHECK) { console.log(stale ? 'sitemap.json is stale' : 'sitemap.json is current'); process.exit(stale || warn.length ? 1 : 0); }
if (stale) fs.writeFileSync(OUT, json);
console.log(`${stale ? 'wrote' : 'unchanged'} ${path.relative(REPO, OUT)}: ${out.totals.slots} slots, ${out.totals.pages} pages (${out.totals.derived_pages} derived only), ${out.totals.views} views, from ${out.totals.paths} paths; unassigned: ${out.totals.unassigned.join(', ') || 'none'}${warn.length ? `; ${warn.length} warning(s)` : ''}`);
process.exit(warn.length ? 1 : 0);
