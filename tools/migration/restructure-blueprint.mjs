#!/usr/bin/env node
// One-time migration: single-file features (STD-003 v0.1 layout) → STD-003 v0.2 layout.
//   domains/<slug>/features/FEAT-*.md  and  features/FEAT-X-*.md
//   → features/<FEAT-ID>-<slug>/{feature.md, requirements/FR-*.md, requirements/NFR-*.md,
//                               parts/Pnn-<domain>.md, design.md, verification.md}
//   domains/<slug>/DOMAIN.md → domains/<slug>/README.md
// Then run generate-views.mjs. Usage: node blueprint/tools/restructure-blueprint.mjs [--dry]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DRY = process.argv.includes('--dry');
const domainsYaml = fs.readFileSync(path.join(ROOT, 'registry/domains.yaml'), 'utf8');
const codeToSlug = Object.fromEntries([...domainsYaml.matchAll(/code:\s*([A-Z]{3})\s*\n\s*slug:\s*([a-z-]+)/g)].map((m) => [m[1], m[2]]));

const log = [];
const write = (p, s) => { log.push(path.relative(ROOT, p)); if (!DRY) { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, s); } };
const slugify = (s) => s.toLowerCase().replace(/[`'"()]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').split('-').slice(0, 7).join('-');

function splitFrontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  return m ? { fm: m[1], body: text.slice(m[0].length) } : { fm: '', body: text };
}
const fmGet = (fm, k) => { const m = fm.match(new RegExp(`^${k}:\\s*(.*)$`, 'm')); return m ? m[1].replace(/\s+#.*$/, '').trim() : ''; };

// Split body into level-2 sections keyed by a normalized name.
function sections(body) {
  const out = { _pre: [] }; let cur = '_pre';
  for (const line of body.split(/\r?\n/)) {
    const h = line.match(/^##\s+(?:\d+\.\s*)?(.+?)\s*$/);
    if (h && !line.startsWith('###')) {
      const n = h[1].toLowerCase();
      cur = /summary/.test(n) ? 'summary' : /^scope/.test(n) ? 'scope' : /owner/.test(n) ? 'ownership'
        : /non-functional|nfr/.test(n) ? 'nfr' : /requirement/.test(n) ? 'requirements' : /design|sdd/.test(n) ? 'design'
        : /implementation/.test(n) ? 'implementation' : /verification|test/.test(n) ? 'verification' : /open|issue|gap/.test(n) ? 'open' : 'other:' + n;
      out[cur] = out[cur] || []; out[cur].heading = line; continue;
    }
    (out[cur] = out[cur] || []).push(line);
  }
  return out;
}
const text = (lines) => (lines || []).join('\n').trim();

// Parse "rel: A, B; rel2: C" into {rel:[A,B]}
function parseRelations(s) {
  const r = {};
  for (const part of s.split(';')) {
    const m = part.trim().match(/^([a-z_]+)\s*:\s*(.+)$/); if (!m) continue;
    r[m[1]] = m[2].split(',').map((x) => x.trim()).filter(Boolean);
  }
  return r;
}
const yamlList = (a) => `[${a.join(', ')}]`;
function relYaml(rel) {
  const keys = Object.keys(rel); if (!keys.length) return '';
  return 'relations:\n' + keys.map((k) => `  ${k}: ${yamlList(rel[k])}`).join('\n') + '\n';
}

// Split a section into requirement blocks by ### ID headings; tracks #### part headings.
function requirementBlocks(lines, kind) {
  const blocks = []; let cur = null, part = null;
  for (const line of lines || []) {
    const ph = line.match(/^####\s+(FEAT-[A-Z]+-\d{3}-P\d{2})\b\s*[—–:-]?\s*(.*)$/) || line.match(/^###\s+(?:Part\s+)?(FEAT-[A-Z]+-\d{3}-P\d{2})\b\s*[—–:-]?\s*(.*)$/);
    if (ph) { if (cur) blocks.push(cur); cur = null; part = ph[1]; continue; }
    const h = line.match(new RegExp(`^#{3,4}\\s+(${kind}-[A-Z]+-\\d{3}-\\d{3}|${kind}-SYS-\\d{3})\\b\\s*[—–:-]?\\s*(.*)$`));
    if (h) { if (cur) blocks.push(cur); cur = { id: h[1], title: h[2].trim(), part, lines: [] }; continue; }
    if (/^#{2,3}\s/.test(line) && cur) { blocks.push(cur); cur = null; continue; }
    if (cur) cur.lines.push(line);
  }
  if (cur) blocks.push(cur);
  return blocks;
}

function renderRequirement(b, feat, implRows, tcBlocks) {
  const rel = {}, legacy = [], statement = [], acs = [], notes = [];
  for (const l of b.lines) {
    const t = l.trim();
    let m;
    if ((m = t.match(/^Relations:\s*(.*)$/i))) Object.assign(rel, parseRelations(m[1]));
    else if ((m = t.match(/^Legacy:\s*(.*)$/i))) legacy.push(...m[1].split(/[,;]\s*/).map((x) => x.trim()).filter(Boolean));
    else if (/^[-*]\s+\**AC-/.test(t)) acs.push(t.replace(/^[-*]\s+/, '- '));
    else if (acs.length && /^\s{2,}\S/.test(l)) acs[acs.length - 1] += ' ' + t;
    else if (acs.length && t) notes.push(t);
    else statement.push(l);
  }
  const owner = (rel.owned_by || [])[0] || '';
  delete rel.owned_by;
  const impl = implRows.filter((r) => r.includes(b.id));
  const tcs = tcBlocks.filter((t) => t.body.includes(b.id));
  const fm = [`id: ${b.id}`, `title: ${JSON.stringify(b.title)}`,
    b.part ? `part: ${b.part}` : null, b.part && owner ? `owner: ${owner}` : null,
    `delivery: ${feat.delivery || 'declared'}`, `legacy: ${yamlList(legacy.map((x) => x.replace(/^legacy:/, '')))}`].filter(Boolean).join('\n');
  return `---\n${fm}\n${relYaml(rel)}---\n\n# ${b.id} — ${b.title}\n\n${text(statement)}\n` +
    (acs.length ? `\n## Acceptance criteria\n\n${acs.join('\n')}\n` : '') +
    (notes.length ? `\n${notes.join('\n')}\n` : '') +
    (impl.length ? `\n## Implementation\n\n${impl.map((r) => '- ' + r.split('|').map((c) => c.trim()).filter(Boolean).slice(1).join(' — ')).join('\n')}\n` : '') +
    (tcs.length ? `\n## Verification\n\n${tcs.map((t) => `- ${t.id} — ${t.title} (see [verification.md](../verification.md))`).join('\n')}\n` : '');
}

function tcBlocksOf(lines) {
  const out = []; let cur = null;
  for (const l of lines || []) {
    const h = l.match(/^###\s+(TC-[A-Z]+-\d{3}-\d{3})\b\s*[—–:-]?\s*(.*)$/);
    if (h) { cur = { id: h[1], title: h[2].trim(), body: '' }; out.push(cur); continue; }
    if (cur) cur.body += l + '\n';
  }
  return out;
}

function convertFeature(file) {
  const raw = fs.readFileSync(file, 'utf8');
  const { fm, body } = splitFrontmatter(raw);
  const id = fmGet(fm, 'id') || path.basename(file).match(/^FEAT-[A-Z]+-\d{3}/)[0];
  const title = fmGet(fm, 'title').replace(/^["']|["']$/g, '') || (body.match(/^#\s+\S+\s+[—–-]\s+(.+)$/m) || [])[1] || id;
  const feat = { id, title, delivery: fmGet(fm, 'delivery'), owner: fmGet(fm, 'owner') };
  const S = sections(body);
  const cross = id.startsWith('FEAT-X-');
  const dirName = `${id}-${slugify(path.basename(file, '.md').replace(/^FEAT-[A-Z]+-\d{3}-?/, '') || title)}`;
  const dir = path.join(ROOT, 'features', dirName);

  // parts table → participants + part files
  const parts = [];
  for (const l of S.ownership || []) {
    const c = l.split('|').map((x) => x.trim());
    if (c.length > 4 && /^FEAT-[A-Z]+-\d{3}-P\d{2}$/.test(c[1])) parts.push({ id: c[1], title: c[2], owner: c[3], runtime: c[4], frs: c[5] || '' });
  }
  const implRows = (S.implementation || []).filter((l) => /^\|\s*(FR|NFR)-/.test(l));
  const tcs = tcBlocksOf(S.verification);
  const frs = requirementBlocks(S.requirements, 'FR');
  const nfrs = requirementBlocks(S.nfr, 'NFR');

  // feature.md
  let fmOut = fm.replace(/^id:.*$/m, `id: ${id}`);
  if (!/^type:/m.test(fmOut)) fmOut = fmOut.replace(/^(title:.*)$/m, `$1\ntype: ${cross || parts.length ? 'cross-domain-feature' : 'domain-feature'}`);
  if (parts.length && !/^participants:/m.test(fmOut)) {
    const p = parts.map((x) => `  - domain: ${x.owner}\n    part: ${x.id}\n    role: ${JSON.stringify(x.title)}`).join('\n');
    fmOut = fmOut.replace(/^(runtime:.*)$/m, `$1\nparticipants:\n${p}`);
    if (!/^participants:/m.test(fmOut)) fmOut += `\nparticipants:\n${p}`;
  }
  const reqIndex = [
    '| ID | Requirement | Part |', '|---|---|---|',
    ...frs.map((b) => `| [${b.id}](requirements/${b.id}-${slugify(b.title)}.md) | ${b.title} | ${b.part || '—'} |`),
    ...nfrs.map((b) => `| [${b.id}](requirements/${b.id}-${slugify(b.title)}.md) | ${b.title} | ${b.part || '—'} |`),
  ].join('\n');
  const keep = (k, h) => (S[k] && text(S[k]) ? `\n## ${h}\n\n${text(S[k])}\n` : '');
  const other = Object.keys(S).filter((k) => k.startsWith('other:')).map((k) => `\n${S[k].heading}\n\n${text(S[k])}\n`).join('');
  write(path.join(dir, 'feature.md'),
    `---\n${fmOut.trim()}\n---\n\n# ${id} — ${title}\n` + keep('summary', 'Summary') + keep('scope', 'Scope') + keep('ownership', 'Ownership') +
    `\n## Requirements\n\n${reqIndex}\n\nDesign: [design.md](design.md) · Verification: [verification.md](verification.md)\n` + other + keep('open', 'Open issues'));

  for (const b of frs) write(path.join(dir, 'requirements', `${b.id}-${slugify(b.title)}.md`), renderRequirement(b, feat, implRows, tcs));
  for (const b of nfrs) write(path.join(dir, 'requirements', `${b.id}-${slugify(b.title)}.md`), renderRequirement(b, feat, implRows, tcs));
  parts.forEach((p, i) => {
    const code = (p.owner.match(/DOM-([A-Z]{3})/) || [])[1];
    const pfrs = frs.filter((b) => b.part === p.id);
    write(path.join(dir, 'parts', `P${String(i + 1).padStart(2, '0')}-${codeToSlug[code] || slugify(p.owner)}.md`),
      `---\nid: ${p.id}\ntitle: ${JSON.stringify(p.title)}\nowner: ${p.owner}\nruntime: ${p.runtime}\n---\n\n# ${p.id} — ${p.title}\n\n` +
      `Owner: ${p.owner} · Runtime: ${p.runtime}\n\n## Requirements\n\n${(pfrs.length ? pfrs : []).map((b) => `- [${b.id}](../requirements/${b.id}-${slugify(b.title)}.md) — ${b.title}`).join('\n') || p.frs}\n`);
  });
  const sdd = 'SDD-' + id.slice(5);
  write(path.join(dir, 'design.md'), `---\nid: ${sdd}\ntitle: ${JSON.stringify(title + ' — design')}\n---\n\n# ${sdd} — ${title} design\n\n${text(S.design)}\n` +
    (implRows.length ? `\n## Implementation map\n\n${text(S.implementation)}\n` : ''));
  write(path.join(dir, 'verification.md'), `# Verification — ${id}\n\n${text(S.verification)}\n`);
  if (!DRY) fs.rmSync(file);
  return { id, dir: dirName, frs: frs.length, nfrs: nfrs.length, parts: parts.length };
}

const results = [];
const domainsDir = path.join(ROOT, 'domains');
for (const slug of fs.existsSync(domainsDir) ? fs.readdirSync(domainsDir) : []) {
  const fdir = path.join(domainsDir, slug, 'features');
  if (fs.existsSync(fdir)) {
    for (const f of fs.readdirSync(fdir)) {
      const p = path.join(fdir, f);
      if (f.endsWith('.md')) results.push(convertFeature(p));
      else if (fs.statSync(p).isDirectory()) console.warn(`SKIP folder-form feature (convert by hand): ${path.relative(ROOT, p)}`);
    }
    if (!DRY && !fs.readdirSync(fdir).length) fs.rmdirSync(fdir);
  }
  const dm = path.join(domainsDir, slug, 'DOMAIN.md');
  if (fs.existsSync(dm)) { write(path.join(domainsDir, slug, 'README.md'), fs.readFileSync(dm, 'utf8')); if (!DRY) fs.rmSync(dm); }
}
const xdir = path.join(ROOT, 'features');
if (fs.existsSync(xdir)) for (const f of fs.readdirSync(xdir)) if (/^FEAT-.*\.md$/.test(f)) results.push(convertFeature(path.join(xdir, f)));

console.log(`${DRY ? '[dry] ' : ''}features converted: ${results.length}; FR files: ${results.reduce((s, r) => s + r.frs, 0)}; NFR files: ${results.reduce((s, r) => s + r.nfrs, 0)}; parts: ${results.reduce((s, r) => s + r.parts, 0)}; files written: ${log.length}`);
for (const r of results) if (!r.frs) console.warn(`WARN ${r.id}: no FR headings found`);
