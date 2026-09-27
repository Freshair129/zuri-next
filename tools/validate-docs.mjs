#!/usr/bin/env node
// Documentation validator — STD-002 R8 checks over docs/ and registry/.
// Usage: node tools/validate-docs.mjs [--scope <ID|path>]... [--resolve] [--json]
//   --scope    report only findings in the files an ID or path covers: FEAT-042 / FR-042-003 →
//              that feature folder; DOM-CRM → the domain folder plus every feature it owns or
//              participates in; a path → that file or folder under docs/. The whole tree is
//              still read, so references out of the scope resolve. Repeatable.
//   --resolve  rewrite `legacy:<ID>` references to new IDs using registry/crosswalk/*.csv
//              when the crosswalk maps the legacy ID to exactly one resolvable new ID.
// Exit code 1 when any ERROR is found (in scope, when --scope is given).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolveScope } from './lib/scope.mjs';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ROOT = path.join(REPO, 'docs'); // documents live in docs/, metadata in registry/
const argv = process.argv.slice(2);
const args = new Set(argv.filter((a) => a.startsWith('--')));
const scopes = argv.flatMap((a, i) => (a === '--scope' && argv[i + 1] ? [argv[i + 1]] : []))
  .map((s) => resolveScope(s, { repoRoot: REPO, docsRoot: ROOT }));
const inScope = (file) => !scopes.length || scopes.some((s) => s.prefixes.some((p) => file === p || file.startsWith(p)));
// STD-002 R1: an ID is type + number (+ container number) only; the domain code appears only in DOM-<CODE>.
const N = '\\d{3,}';
const GRAMMAR = [
  ['DOM', /^DOM-[A-Z]{3}$/],
  ['PART', new RegExp(`^FEAT-${N}-P\\d{2}$`)], ['FEAT', new RegExp(`^FEAT-${N}$`)],
  ['FR', new RegExp(`^FR-${N}-\\d{3}$`)], ['NFR', new RegExp(`^NFR-(?:${N}-\\d{3}|${N})$`)],
  ['AC', new RegExp(`^AC-${N}-\\d{3}-\\d{2}$`)], ['TC', new RegExp(`^TC-${N}-\\d{3}$`)], ['SDD', new RegExp(`^SDD-${N}$`)],
  ...['CAP', 'ADR', 'BR', 'SEC', 'API', 'EVT', 'CMP', 'SRV', 'RB', 'ARCH', 'BRD', 'PRD', 'STD', 'PROC', 'PLAN'].map((t) => [t, new RegExp(`^${t}-${N}$`)]),
];
const RELATIONS = new Set(['part_of', 'owned_by', 'runtime', 'participates_in', 'derived_from', 'depends_on', 'decided_by',
  'specified_by', 'implements', 'verifies', 'exposes', 'consumes', 'supersedes', 'relates_to']);
// Domain-coded ids from STD-002 v0.1 (FEAT-CRM-004, ADR-SYS-002, API-CRM-slug) — must not survive migration.
const LEGACY_OLD = /^(?:FEAT|FR|NFR|AC|TC|SDD|ADR|BR|SEC|API|EVT|CMP|CAP)-(?:[A-Z]{3}|X)-/;
const TOKEN = /\b(?:FEAT|FR|NFR|AC|TC|SDD|BR|SEC|ADR|DOM|CAP|API|EVT|CMP|SRV|RB|ARCH|BRD|PRD|STD|PROC|PLAN)-[A-Za-z0-9][A-Za-z0-9-]*/g;

const typeOf = (id) => (GRAMMAR.find(([, re]) => re.test(id)) || [null])[0];
const codes = new Set([...fs.readFileSync(path.join(REPO, 'registry/domains.yaml'), 'utf8').matchAll(/code:\s*([A-Z]{3})/g)].map((m) => m[1]).concat(['X', 'SYS', 'GOV']));

const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) =>
  e.isDirectory() ? (['templates', 'tools'].includes(e.name) ? [] : walk(path.join(d, e.name))) : [path.join(d, e.name)]);
const files = walk(ROOT).filter((f) => f.endsWith('.md'));
const rel = (f) => path.relative(ROOT, f).replace(/\\/g, '/');

const findings = [];
const err = (file, line, msg) => findings.push({ level: 'ERROR', file, line, msg });
const warn = (file, line, msg) => findings.push({ level: 'WARN', file, line, msg });
const decl = new Map();          // id -> [{file,line}]
const refs = [];                 // {id,file,line}
const feats = new Map();         // FEAT id -> {owner, delivery, file}
const frAC = new Map(), frTC = new Map();
const frDelivery = new Map();    // FR id -> its own `delivery` (AGENTS §4: delivery is per requirement)

function declare(id, file, line) {
  const t = typeOf(id);
  if (!t) return err(file, line, `declared id "${id}" does not match STD-002 R1 grammar`);
  if (t === 'DOM' && !codes.has(id.slice(4))) err(file, line, `unregistered domain code in ${id}`);
  (decl.get(id) || decl.set(id, []).get(id)).push({ file, line });
}

// Services are declared by services/SRV-*/SERVICE.md; the registry declares only those with no such file.
const registrySrv = [...fs.readFileSync(path.join(REPO, 'registry/services.yaml'), 'utf8').matchAll(/id:\s*(SRV-\d{3,})/g)].map((m) => m[1]);

for (const f of files) {
  const file = rel(f);
  // Components are declared by the design (SDD) that names them; first mention wins.
  if (path.basename(f) === 'design.md' || /\/design\.md$/.test(file)) for (const m of fs.readFileSync(f, 'utf8').matchAll(/\bCMP-\d{3,}\b/g)) {
    const id = m[0]; if (!decl.has(id)) declare(id, file, 0);
  }
  const text = fs.readFileSync(f, 'utf8');
  const lines = text.split(/\r?\n/);
  let fm = null, i = 0, fmId = '';
  if (lines[0] === '---') { const end = lines.indexOf('---', 1); if (end > 0) { fm = lines.slice(1, end); i = end + 1; } }
  const base = path.basename(f, '.md');
  const fileId = (base.match(/^[A-Z]+-[A-Za-z0-9-]+?(?=-[a-z]|$)/) || [])[0];
  if (fm) {
    const id = (fm.find((l) => /^id:/.test(l)) || '').replace(/^id:\s*/, '').replace(/\s*#.*$/, '').trim();
    fmId = id;
    if (id) {
      declare(id, file, 2);
      if (typeOf(id) === 'FR') {
        frAC.set(id, 0);
        const d = (fm.find((l) => /^delivery:/.test(l)) || '').replace(/^delivery:\s*/, '').replace(/\s*#.*$/, '').trim();
        if (d) frDelivery.set(id, d);
      }
    }
    else if (fileId && typeOf(fileId)) declare(fileId, file, 1);
    if (id && (typeOf(id) === 'FEAT' || typeOf(id) === 'PART')) {
      const get = (k) => (fm.find((l) => l.startsWith(k + ':')) || '').split(':').slice(1).join(':').replace(/#.*$/, '').trim();
      feats.set(id, { owner: get('owner'), delivery: get('delivery'), file });
      if (typeOf(id) === 'FEAT' && path.basename(f) === 'feature.md') {
        const cross = get('type') === 'cross-domain-feature';
        const nParts = fm.filter((l) => /^\s*-\s*domain:/.test(l)).length;
        if (cross && nParts < 2) err(file, 2, `${id} is cross-domain but declares ${nParts} participant(s)`);
        if (!cross && nParts) err(file, 2, `${id} declares participants but type is not cross-domain-feature`);
      }
    }
    let inRel = false;
    fm.forEach((l, k) => {
      if (/^relations:\s*$/.test(l)) { inRel = true; return; }
      if (inRel && /^\S/.test(l)) inRel = false;
      if (inRel) { const m = l.match(/^\s+([a-z_]+):/); if (m && !RELATIONS.has(m[1])) err(file, k + 2, `unknown relation "${m[1]}"`); }
      if (/^(legacy|title):/.test(l)) return;
      for (const m of l.matchAll(TOKEN)) refs.push({ id: m[0].replace(/[-.]+$/, ''), file, line: k + 2 });
    });
  } else if (fileId && typeOf(fileId)) declare(fileId, file, 1);

  let fence = false, currentFR = typeOf(fmId) === 'FR' ? fmId : null;
  for (; i < lines.length; i++) {
    const l = lines[i], n = i + 1;
    if (/^\s*```/.test(l)) { fence = !fence; continue; }
    if (fence) continue;
    const h = l.match(/^#{1,6}\s+([A-Z]+-[A-Za-z0-9-]+?)(?=\s|$|\s*[—:–])/);
    if (h && typeOf(h[1].replace(/[-.]+$/, ''))) {
      const id = h[1].replace(/[-.]+$/, '');
      if (id === fmId) continue; // title heading repeats the file's own id
      declare(id, file, n);
      currentFR = typeOf(id) === 'FR' ? id : (typeOf(id) === 'TC' || /^#{1,3}\s/.test(l) ? null : currentFR);
      if (currentFR === id) { frAC.set(id, 0); }
      continue;
    } else if (/^#{1,3}\s/.test(l) && typeOf(fmId) !== 'FR') currentFR = null;
    const rl = l.match(/^\s*Relations:\s*(.*)$/);
    if (rl) for (const part of rl[1].split(';')) { const m = part.trim().match(/^([a-z_-]+)\s*:/); if (m && !RELATIONS.has(m[1])) err(file, n, `unknown relation "${m[1]}"`); }
    if (/^\s*Legacy:/i.test(l)) continue;
    for (const m of l.matchAll(TOKEN)) {
      const id = m[0].replace(/[-.]+$/, '');
      const before = l.slice(Math.max(0, m.index - 7), m.index);
      if (/legacy:$/i.test(before) || /pending:$/.test(before)) continue;
      if (typeOf(id) === 'AC' && currentFR && id.startsWith('AC-' + currentFR.slice(3) + '-')) { frAC.set(currentFR, (frAC.get(currentFR) || 0) + 1); declare(id, file, n); continue; }
      refs.push({ id, file, line: n });
    }
    const v = l.match(/^\s*Verifies:\s*([^·]*)/);
    // A TC verifies an FR directly or through one of its ACs (AC-042-003-01 → FR-042-003).
    if (v) for (const m of v[1].matchAll(TOKEN)) {
      const fr = typeOf(m[0]) === 'FR' ? m[0] : typeOf(m[0]) === 'AC' ? `FR-${m[0].split('-').slice(1, 3).join('-')}` : null;
      if (fr) frTC.set(fr, (frTC.get(fr) || 0) + 1);
    }
  }
}

for (const id of registrySrv) if (!decl.has(id)) declare(id, 'registry/services.yaml', 0);
for (const [id, sites] of decl) if (sites.length > 1) err(sites[1].file, sites[1].line, `${id} declared ${sites.length}× (first: ${sites[0].file}:${sites[0].line})`);
const seen = new Set();
for (const r of refs) {
  if (decl.has(r.id)) continue;
  if (r.file.startsWith('governance/standards/')) continue; // standards cite illustrative ids
  if (!typeOf(r.id)) { if (LEGACY_OLD.test(r.id)) warn(r.file, r.line, `pre-opaque id ${r.id} left in text`); continue; }
  const key = r.id + r.file;
  if (!seen.has(key)) { seen.add(key); err(r.file, r.line, `dangling reference ${r.id}`); }
}
for (const [id, fd] of feats) {
  if (!/^DOM-[A-Z]{3}$/.test(fd.owner)) err(fd.file, 2, `${id} has no valid owner (${fd.owner || 'missing'})`);
}
for (const [fr, n] of frAC) if (!n) err(decl.get(fr)[0].file, decl.get(fr)[0].line, `${fr} has no acceptance criterion`);
for (const [fid, fd] of feats) {
  if (!['implemented', 'live'].includes(fd.delivery)) continue;
  for (const [fr] of frAC) {
    if (!fr.startsWith('FR-' + fid.slice(5) + '-') || frTC.get(fr)) continue;
    // A requirement that is itself only declared or building needs no proof yet.
    const own = frDelivery.get(fr) || fd.delivery;
    if (!['implemented', 'live'].includes(own)) continue;
    warn(decl.get(fr)[0].file, decl.get(fr)[0].line, `${fr} (${own}) has no TC "Verifies:" line`);
  }
}

// crosswalk
const cwDir = path.join(REPO, 'registry/crosswalk');
const cw = new Map();
if (fs.existsSync(cwDir)) for (const f of fs.readdirSync(cwDir).filter((x) => x.endsWith('.csv'))) {
  const rows = fs.readFileSync(path.join(cwDir, f), 'utf8').split(/\r?\n/).filter(Boolean).slice(1);
  rows.forEach((row, k) => {
    const [legacy, next, disp] = row.split(',');
    if (!['migrated', 'split', 'merged', 'retired', 'dropped'].includes(disp)) err(`registry/crosswalk/${f}`, k + 2, `bad disposition "${disp}"`);
    if (next && !next.startsWith('pending:') && !decl.has(next) && ['migrated', 'split', 'merged'].includes(disp)) err(`registry/crosswalk/${f}`, k + 2, `crosswalk target ${next} is not declared`);
    (cw.get(legacy) || cw.set(legacy, []).get(legacy)).push({ next, disp, file: f });
  });
}

if (args.has('--resolve')) {
  let changed = 0, unresolved = new Map();
  for (const f of files) {
    const src = fs.readFileSync(f, 'utf8');
    const out = src.replace(/legacy:((?:FR|NFR|BR|SEC|SDD|FEAT|ADR)-\d+(?:-P\d+)?)/g, (m, id) => {
      const t = (cw.get(id) || []).filter((x) => x.next && decl.has(x.next));
      if (t.length === 1) { changed++; return t[0].next; }
      if (t.length > 1) { changed++; return t.map((x) => x.next).join(', '); }
      unresolved.set(id, (unresolved.get(id) || 0) + 1); return m;
    });
    if (out !== src) fs.writeFileSync(f, out);
  }
  console.log(`resolved ${changed} legacy references; unresolved ids: ${unresolved.size}`);
  if (unresolved.size) console.log([...unresolved].map(([k, v]) => `${k}×${v}`).join(' '));
}

const byType = {}; for (const id of decl.keys()) byType[typeOf(id)] = (byType[typeOf(id)] || 0) + 1;
const scoped = findings.filter((x) => inScope(x.file));
const e = scoped.filter((x) => x.level === 'ERROR'), w = scoped.filter((x) => x.level === 'WARN');
if (args.has('--json')) console.log(JSON.stringify({ byType, scope: scopes.map((s) => s.label), findings: scoped }, null, 1));
else {
  if (scopes.length) console.log(`scope: ${scopes.map((s) => `${s.label} (${s.prefixes.length} path${s.prefixes.length > 1 ? 's' : ''})`).join(', ')} — run without --scope before merging`);
  console.log('declared:', JSON.stringify(byType));
  console.log(`crosswalk legacy ids: ${cw.size}`);
  const group = (list) => { const m = {}; for (const x of list) { const k = x.msg.replace(/[A-Z]+-[A-Za-z0-9-]+/g, '<id>').replace(/"[^"]*"/g, '"…"'); m[k] = (m[k] || 0) + 1; } return m; };
  console.log(`ERRORS ${e.length}`, JSON.stringify(group(e), null, 1));
  console.log(`WARNINGS ${w.length}`, JSON.stringify(group(w), null, 1));
  for (const x of e.slice(0, 40)) console.log(`  ${x.file}:${x.line} ${x.msg}`);
}
process.exit(e.length ? 1 : 0);
