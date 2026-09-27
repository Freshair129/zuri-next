#!/usr/bin/env node
// One-time migration: domain-coded IDs (STD-002 v0.1: FEAT-CRM-004, FEAT-X-002, ADR-CRM-001,
// API-CRM-slug, BR-SYS-003 …) → opaque IDs (STD-002 v0.2: FEAT-042, ADR-017, API-031 …).
// The domain that the old ID carried is preserved as metadata (`owner:` / `Owner:` line).
// Step 0 marks bare legacy-shaped ids (FEAT-009, ADR-094, FR-252 …) as `legacy:` first, because
// after this migration those shapes belong to the new scheme.
// Usage: node blueprint/tools/renumber-to-opaque.mjs [--dry]   Writes tools/.renumber-map.json.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DRY = process.argv.includes('--dry');
const SKIP = new Set(['tools', 'templates', 'standards']);
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory()
  ? (SKIP.has(e.name) ? [] : walk(path.join(d, e.name))) : [path.join(d, e.name)]);
const files = walk(ROOT).filter((f) => /\.(md|csv|ya?ml)$/.test(f));
const domainOrder = [...fs.readFileSync(path.join(ROOT, 'registry/domains.yaml'), 'utf8').matchAll(/code:\s*([A-Z]{3})/g)].map((m) => m[1]);
const rank = (c) => { const i = domainOrder.indexOf(c); return i < 0 ? (c === 'X' ? 900 : c === 'SYS' ? 950 : 990) : i; };
const pad = (n) => String(n).padStart(3, '0');

// ---- step 0: mark bare legacy ids ------------------------------------------------------
const LEGACY_BARE = /(?<![\w:/-])((?:FEAT|FR|NFR|BR|SEC|SDD|ADR)-\d{3}(?:-P\d+)?)(?![\w-])/g;
function markLegacy(src, isCsv) {
  if (isCsv) return src; // crosswalk legacy_id column is legacy by definition
  const lines = src.split(/\r?\n/); let fm = lines[0] === '---', fence = false;
  return lines.map((l, i) => {
    if (i > 0 && fm && l === '---') { fm = false; return l; }
    if (/^\s*```/.test(l)) fence = !fence;
    if (fence || /^\s*legacy:\s*\[/.test(l) || /^\s*Legacy:/i.test(l) || (fm && /^\s*legacy:/.test(l))) return l;
    return l.replace(LEGACY_BARE, 'legacy:$1');
  }).join('\n');
}

// ---- step 1: collect declared old-style ids --------------------------------------------
const OLD = /\b(?:FEAT|FR|NFR|AC|TC|SDD|ADR|BR|SEC|API|EVT|CMP|CAP|SRV|RB|ARCH|PRD)-[A-Za-z0-9][A-Za-z0-9-]*/g;
const feats = new Map(), stand = { ADR: new Map(), BR: new Map(), SEC: new Map(), NFR: new Map(), API: new Map(), EVT: new Map(), CMP: new Map(), CAP: new Map(), SRV: new Map(), RB: new Map(), ARCH: new Map(), PRD: new Map() };
const owners = new Map(); // old standalone id -> DOM-CODE
const addStand = (type, id, code) => { if (!stand[type].has(id)) { stand[type].set(id, { code }); if (code && domainOrder.includes(code)) owners.set(id, `DOM-${code}`); } };
function consider(id) {
  let m;
  if ((m = id.match(/^FEAT-([A-Z]{3}|X)-(\d{3})$/))) feats.set(`${m[1]}-${m[2]}`, { code: m[1], n: +m[2] });
  else if ((m = id.match(/^(ADR|BR|SEC)-([A-Z]{3}|X)-(\d{3})$/))) addStand(m[1], id, m[2]);
  else if ((m = id.match(/^NFR-SYS-(\d{3})$/))) addStand('NFR', id, 'SYS');
  else if ((m = id.match(/^(API|EVT|CMP)-([A-Z]{3})-[a-z0-9][a-z0-9-]*$/))) addStand(m[1], id, m[2]);
  else if ((m = id.match(/^CAP-([A-Z]{3})-\d{2}$/))) addStand('CAP', id, m[1]);
  else if ((m = id.match(/^SRV-[a-z][a-z0-9-]*$/))) addStand('SRV', id, null);
  else if ((m = id.match(/^(RB|ARCH)-[A-Za-z][A-Za-z0-9-]*$/))) addStand(m[1], id, null);
  else if ((m = id.match(/^PRD-[A-Z]{2,4}$/))) addStand('PRD', id, null);
}
const texts = new Map(files.map((f) => [f, fs.readFileSync(f, 'utf8')]));
for (const [f, t] of texts) {
  const fm = t.match(/^---\r?\n([\s\S]*?)\r?\n---/); if (fm) { const id = (fm[1].match(/^id:\s*(\S+)/m) || [])[1]; if (id) consider(id); }
  for (const m of t.matchAll(/^#{1,6}\s+([A-Z]+-[A-Za-z0-9-]+?)(?=\s|$)/gm)) consider(m[1].replace(/[-.]+$/, ''));
  for (const m of t.matchAll(/^\s*-?\s*id:\s*(SRV-[a-z0-9-]+)/gm)) consider(m[1]);
  for (const m of t.matchAll(/CMP-[A-Z]{3}-[a-z0-9][a-z0-9-]*/g)) consider(m[0].replace(/-+$/, ''));
  const base = path.basename(f).match(/^(FEAT-(?:[A-Z]{3}|X)-\d{3})/); if (base) consider(base[1]);
}
for (const d of fs.readdirSync(path.join(ROOT, 'features'), { withFileTypes: true }).filter((e) => e.isDirectory())) { const m = d.name.match(/^(FEAT-(?:[A-Z]{3}|X)-\d{3})/); if (m) consider(m[1]); }

// ---- step 2: allocate ------------------------------------------------------------------
const featMap = new Map();
[...feats.entries()].sort(([, a], [, b]) => rank(a.code) - rank(b.code) || a.n - b.n).forEach(([k], i) => featMap.set(k, pad(i + 1)));
const standMap = new Map();
for (const [type, m] of Object.entries(stand)) {
  [...m.entries()].sort(([a, x], [b, y]) => rank(x.code) - rank(y.code) || a.localeCompare(b)).forEach(([id], i) => standMap.set(id, `${type}-${pad(i + 1)}`));
}
function mapId(id) {
  if (standMap.has(id)) return standMap.get(id);
  let m;
  if ((m = id.match(/^FEAT-([A-Z]{3}|X)-(\d{3})(-P\d{2})?$/)) && featMap.has(`${m[1]}-${m[2]}`)) return `FEAT-${featMap.get(`${m[1]}-${m[2]}`)}${m[3] || ''}`;
  if ((m = id.match(/^(FR|NFR|TC)-([A-Z]{3}|X)-(\d{3})-(\d{3})$/)) && featMap.has(`${m[2]}-${m[3]}`)) return `${m[1]}-${featMap.get(`${m[2]}-${m[3]}`)}-${m[4]}`;
  if ((m = id.match(/^AC-([A-Z]{3}|X)-(\d{3})-(\d{3})-(\d{2})$/)) && featMap.has(`${m[1]}-${m[2]}`)) return `AC-${featMap.get(`${m[1]}-${m[2]}`)}-${m[3]}-${m[4]}`;
  if ((m = id.match(/^SDD-([A-Z]{3}|X)-(\d{3})$/)) && featMap.has(`${m[1]}-${m[2]}`)) return `SDD-${featMap.get(`${m[1]}-${m[2]}`)}`;
  return null;
}
// A token may carry a slug (`FR-CRM-004-003-list-conversations.md`): map the longest id prefix.
const rewrite = (s) => s.replace(OLD, (tok) => {
  const trimmed = tok.replace(/[-.]+$/, ''), tail = tok.slice(trimmed.length);
  const parts = trimmed.split('-');
  for (let k = parts.length; k >= 2; k--) {
    const n = mapId(parts.slice(0, k).join('-'));
    if (n) return n + (k < parts.length ? '-' + parts.slice(k).join('-') : '') + tail;
  }
  return tok;
});

// ---- step 3: rewrite contents, add Owner lines under heading-declared standalone ids ----
let changed = 0;
for (const [f, t0] of texts) {
  let t = markLegacy(t0, f.endsWith('.csv'));
  if (f.endsWith('.md')) t = t.replace(/^(#{2,6}\s+)((?:ADR|BR|SEC|API|EVT|CAP)-[A-Z]{3}-[A-Za-z0-9-]+)(.*)$/gm, (all, h, id, rest) => {
    const clean = id.replace(/[-.]+$/, ''); const o = owners.get(clean);
    return o ? `${h}${id}${rest}\nOwner: ${o}` : all;
  });
  t = rewrite(t);
  if (t !== t0) { changed++; if (!DRY) fs.writeFileSync(f, t); }
}

// ---- step 4: rename files and folders (deepest first) ----------------------------------
const renames = [];
const allPaths = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => {
  const p = path.join(d, e.name); return e.isDirectory() && !SKIP.has(e.name) ? [...allPaths(p), p] : [p];
});
for (const p of allPaths(ROOT)) {
  const b = path.basename(p);
  const m = b.match(/^((?:FEAT|FR|NFR)-(?:[A-Z]{3}|X)-\d{3}(?:-\d{3}|-P\d{2})?)(.*)$/)
    || b.match(/^((?:SRV|RB|ARCH)-[a-z][a-z0-9-]*?|ARCH-[A-Z]{3}-[a-z0-9-]*?|PRD-[A-Z]{2,4})((?:\.md)?)$/);
  if (!m) continue; const n = mapId(m[1]); if (!n) continue;
  const name = /^(FEAT|FR|NFR)-/.test(m[1]) ? n + m[2] : `${n}-${m[1].replace(/^[A-Z]+-(?:[A-Z]{3}-)?/, '').toLowerCase()}${m[2]}`;
  renames.push([p, path.join(path.dirname(p), name)]);
}
if (!DRY) for (const [a, b] of renames) fs.renameSync(a, b);

const out = { features: Object.fromEntries([...featMap].map(([k, v]) => [`FEAT-${k}`, `FEAT-${v}`])), standalone: Object.fromEntries(standMap) };
if (!DRY) fs.writeFileSync(path.join(ROOT, 'tools/.renumber-map.json'), JSON.stringify(out, null, 1));
console.log(`${DRY ? '[dry] ' : ''}features: ${featMap.size}; standalone: ${standMap.size}; files rewritten: ${changed}; renamed: ${renames.length}`);
