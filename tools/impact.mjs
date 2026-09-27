#!/usr/bin/env node
// Impact analysis over the documentation graph: which documents must be reviewed when an
// artifact changes. Builds a reverse reference index from IDs (STD-002 R1) and walks
// `depends_on` between features (STD-004 Q3, in memory). Reads docs/ and registry/ only.
//
// Usage:
//   node tools/impact.mjs FEAT-042                 everything that references FEAT-042, plus transitive dependents
//   node tools/impact.mjs DOM-CRM DOM-LOA          several ids at once
//   node tools/impact.mjs DOM-CRM --types ARCH,PRD,STD,ADR,DOM   only files whose own artifact type is listed
//   node tools/impact.mjs --changed                ids declared in files changed vs HEAD (staged, unstaged, untracked)
//   node tools/impact.mjs --changed --base main    ... changed vs a branch or commit
//   node tools/impact.mjs FEAT-042 --json          machine-readable
//   node tools/impact.mjs FEAT-042 --depth 3       depends_on walk depth (default 5)
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
const flag = (n) => argv.includes(n);
const opt = (n, d) => { const i = argv.indexOf(n); return i >= 0 && argv[i + 1] ? argv[i + 1] : d; };
const TOKEN = /\b(?:FEAT|FR|NFR|AC|TC|SDD|BR|SEC|ADR|DOM|CAP|API|EVT|CMP|SRV|RB|ARCH|BRD|PRD|STD|PROC|PLAN)-[A-Za-z0-9][A-Za-z0-9-]*/g;
const clean = (id) => id.replace(/[-.]+$/, '');
const typeOf = (id) => id.split('-')[0];

// ---- index ---------------------------------------------------------------
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? (['templates', 'node_modules'].includes(e.name) ? [] : walk(path.join(d, e.name))) : [path.join(d, e.name)]));
const files = [...walk(path.join(REPO, 'docs')).filter((f) => /\.(md|yaml|json)$/.test(f)), ...walk(path.join(REPO, 'registry')).filter((f) => f.endsWith('.yaml'))];
const rel = (f) => path.relative(REPO, f).replace(/\\/g, '/');
const declaredIn = new Map();   // id -> file
const declRange = new Map();    // id -> { file, start, end }  lines that declare the artifact (frontmatter, or heading section)
const fileType = new Map();     // file -> artifact type of the file itself (from frontmatter id or path)
const refs = new Map();         // id -> Map(file -> [lines])
const dependsOn = new Map();    // FEAT -> Set(FEAT/part ids)

for (const f of files) {
  const file = rel(f); const txt = fs.readFileSync(f, 'utf8').replace(/\r\n/g, '\n'); const lines = txt.split('\n');
  const fm = (txt.match(/^---\n([\s\S]*?)\n---/) || [, ''])[1];
  const fmId = (fm.match(/^id:\s*(\S+)/m) || [])[1];
  if (fmId) { declaredIn.set(fmId, file); fileType.set(file, typeOf(fmId)); }
  else fileType.set(file, file.startsWith('registry/') ? 'REGISTRY' : file.includes('/decisions.md') ? 'ADR' : file.includes('/contracts.md') ? 'API' : file.includes('/requirements/') ? 'BR' : file.includes('verification.md') ? 'TC' : file.includes('/plans/') ? 'PLAN' : 'DOC');
  if (fmId && /^FEAT-\d+$/.test(fmId)) { const m = fm.match(/^\s*depends_on:\s*\[([^\]]*)\]/m); if (m) dependsOn.set(fmId, new Set(m[1].split(',').map((x) => x.trim()).filter(Boolean))); }
  let fence = false; const heads = [];
  if (fmId) declRange.set(fmId, { file, start: 1, end: fm.split('\n').length + 2 });
  lines.forEach((l, i) => {
    if (/^\s*```/.test(l)) { fence = !fence; return; }
    if (fence || /^\s*(legacy|Legacy):/i.test(l) || /^title:/.test(l)) return;
    const h = l.match(/^(#{1,6})\s+([A-Z]+-[A-Za-z0-9-]+?)(?=\s|$|\s*[—:–])/);
    if (/^#{1,6}\s/.test(l)) heads.push({ line: i + 1, level: l.match(/^#+/)[0].length, id: h ? clean(h[2]) : null });
    if (h) { const id = clean(h[2]); if (!declaredIn.has(id)) declaredIn.set(id, file); }
    for (const m of l.matchAll(TOKEN)) {
      const id = clean(m[0]); if (/legacy:$/i.test(l.slice(Math.max(0, m.index - 7), m.index))) continue;
      if (!refs.has(id)) refs.set(id, new Map()); const byFile = refs.get(id); if (!byFile.has(file)) byFile.set(file, []); byFile.get(file).push(i + 1);
    }
  });
  // a heading-declared artifact spans from its heading to the next heading of the same or a higher level
  heads.forEach((h, k) => { if (!h.id || declRange.has(h.id)) return; const next = heads.slice(k + 1).find((x) => x.level <= h.level); let end = next ? next.line - 1 : lines.length; while (end > h.line && !lines[end - 1].trim()) end--; declRange.set(h.id, { file, start: h.line, end }); });
}
const dependents = new Map(); // id -> Set(FEAT that depends on it)
for (const [feat, deps] of dependsOn) for (const d of deps) { const key = d.replace(/-P\d{2}$/, ''); if (!dependents.has(key)) dependents.set(key, new Set()); dependents.get(key).add(feat); }

// ---- targets -------------------------------------------------------------
let targets = argv.filter((a) => !a.startsWith('--') && a !== opt('--types') && a !== opt('--base') && a !== opt('--depth'));
if (flag('--changed')) {
  // Only ids whose declaring lines changed count (a regenerated view or an appended ADR must not flag every id in the file).
  const base = opt('--base', 'HEAD');
  const hunks = new Map(); // file -> [[start, end]] in the new file; [[1, Infinity]] for untracked files
  const diff = execSync(`git diff -U0 --no-color ${base} -- docs registry`, { cwd: REPO, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  let cur = null;
  for (const l of diff.split('\n')) {
    const f = l.match(/^\+\+\+ b\/(.+)$/); if (f) { cur = f[1]; if (!hunks.has(cur)) hunks.set(cur, []); continue; }
    const h = cur && l.match(/^@@ -\d+(?:,\d+)? \+(\d+)(?:,(\d+))? @@/); if (h) { const s = +h[1], n = h[2] === undefined ? 1 : +h[2]; hunks.get(cur).push([s, n ? s + n - 1 : s]); }
  }
  for (const f of execSync('git ls-files --others --exclude-standard -- docs registry', { cwd: REPO, encoding: 'utf8' }).split('\n').map((s) => s.trim()).filter(Boolean)) hunks.set(f, [[1, Infinity]]);
  const ids = new Set();
  for (const [id, r] of declRange) { const hs = hunks.get(r.file); if (hs && hs.some(([s, e]) => s <= r.end && e >= r.start)) ids.add(id); }
  targets = [...ids].filter((id) => /^(DOM-[A-Z]{3}|[A-Z]+-\d)/.test(id) && !/^AC-/.test(id)).sort();
  if (!targets.length) { console.log(`No artifact declarations changed vs ${base} (${hunks.size} changed file(s)).`); process.exit(0); }
  console.log(`Changed vs ${base}: ${hunks.size} file(s); ${targets.length} artifact declaration(s) touched: ${targets.slice(0, 30).join(', ')}${targets.length > 30 ? ' …' : ''}\n`);
}
if (!targets.length) { console.error('usage: node tools/impact.mjs <ID> [<ID>…] [--types A,B] [--depth n] [--json] | --changed [--base <rev>]'); process.exit(2); }
const typeFilter = opt('--types') ? new Set(opt('--types').split(',').map((s) => s.trim().toUpperCase())) : null;
const maxDepth = +opt('--depth', 5);

// ---- analyse -------------------------------------------------------------
const report = [];
for (const id of targets) {
  const direct = [...(refs.get(id) || new Map())].filter(([file]) => file !== declaredIn.get(id)).map(([file, lines]) => ({ file, type: fileType.get(file), lines }));
  // transitive dependents via depends_on (feature level)
  const trans = []; const seen = new Set([id]); let frontier = [id.replace(/^(FR|NFR|TC|SDD)-(\d+).*$/, 'FEAT-$2')];
  if (!/^FEAT-/.test(frontier[0])) frontier = [];
  for (let depth = 1; depth <= maxDepth && frontier.length; depth++) {
    const next = [];
    for (const f of frontier) for (const dep of dependents.get(f) || []) if (!seen.has(dep)) { seen.add(dep); next.push(dep); trans.push({ id: dep, depth, file: declaredIn.get(dep) }); }
    frontier = next;
  }
  const filtered = typeFilter ? direct.filter((d) => typeFilter.has(d.type)) : direct;
  report.push({ id, declared_in: declaredIn.get(id) || null, references: filtered, references_total: direct.length, dependents: trans });
}

if (flag('--json')) { console.log(JSON.stringify(report, null, 2)); process.exit(0); }
for (const r of report) {
  console.log(`${r.id}  (declared in ${r.declared_in || 'nowhere — unknown id'})`);
  const byType = {}; for (const d of r.references) (byType[d.type] ??= []).push(d);
  const order = ['ARCH', 'PRD', 'BRD', 'STD', 'ADR', 'DOM', 'FEAT', 'FR', 'NFR', 'SDD', 'TC', 'API', 'BR', 'SRV', 'RB', 'PLAN', 'REGISTRY', 'DOC'];
  const types = Object.keys(byType).sort((a, b) => (order.indexOf(a) + 1 || 99) - (order.indexOf(b) + 1 || 99));
  console.log(`  referenced by ${r.references.length}${typeFilter ? ` of ${r.references_total}` : ''} file(s)`);
  for (const t of types) { console.log(`  ${t} (${byType[t].length})`); for (const d of byType[t].sort((a, b) => a.file.localeCompare(b.file))) console.log(`    ${d.file}:${d.lines.slice(0, 6).join(',')}${d.lines.length > 6 ? ',…' : ''}`); }
  if (r.dependents.length) { console.log(`  transitive dependents via depends_on (${r.dependents.length})`); for (const d of r.dependents) console.log(`    ${'  '.repeat(d.depth - 1)}${d.id}  depth ${d.depth}  ${d.file}`); }
  console.log('');
}
