#!/usr/bin/env node
// Generate the domain views (STD-003 R2) from feature metadata — the only writer of
// the block between <!-- BEGIN GENERATED: feature-index --> and <!-- END GENERATED -->.
// Usage: node tools/generate-views.mjs [--check]   (--check: exit 1 when a view is stale)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ROOT = path.join(REPO, 'docs'); // documents live in docs/, metadata in registry/
const CHECK = process.argv.includes('--check');
const BEGIN = '<!-- BEGIN GENERATED: feature-index -->', END = '<!-- END GENERATED -->';
const domainsYaml = fs.readFileSync(path.join(REPO, 'registry/domains.yaml'), 'utf8');
const domains = [...domainsYaml.matchAll(/code:\s*([A-Z]{3})\s*\n\s*slug:\s*([a-z-]+)\s*\n\s*name:\s*(.+)/g)].map((m) => ({ code: m[1], slug: m[2], name: m[3].trim() }));

const fmOf = (file) => (fs.readFileSync(file, 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---/) || [, ''])[1];
const get = (fm, k) => ((fm.match(new RegExp(`^${k}:\\s*(.*)$`, 'm')) || [, ''])[1]).replace(/\s+#.*$/, '').replace(/^["']|["']$/g, '').trim();

const features = [];
const fdir = path.join(ROOT, 'features');
for (const d of fs.existsSync(fdir) ? fs.readdirSync(fdir) : []) {
  const f = path.join(fdir, d, 'feature.md');
  if (!fs.existsSync(f)) continue;
  const fm = fmOf(f);
  const participants = [...fm.matchAll(/-\s*domain:\s*(DOM-[A-Z]{3})\s*\n\s*part:\s*(\S+)\s*\n\s*role:\s*(.+)/g)].map((m) => ({ domain: m[1], part: m[2], role: m[3].replace(/^["']|["']$/g, '') }));
  const reqs = fs.existsSync(path.join(fdir, d, 'requirements')) ? fs.readdirSync(path.join(fdir, d, 'requirements')).length : 0;
  features.push({ id: get(fm, 'id'), title: get(fm, 'title'), owner: get(fm, 'owner'), delivery: get(fm, 'delivery'), dir: d, participants, reqs });
}
const services = [];
const sdir = path.join(ROOT, 'services');
for (const d of fs.existsSync(sdir) ? fs.readdirSync(sdir) : []) {
  const f = path.join(sdir, d, 'SERVICE.md');
  if (!fs.existsSync(f)) continue;
  const txt = fs.readFileSync(f, 'utf8');
  services.push({ id: (txt.match(/^id:\s*(\S+)/m) || [, d])[1], dir: d, text: txt });
}

let stale = 0;
for (const dom of domains) {
  const readme = path.join(ROOT, 'domains', dom.slug, 'README.md');
  if (!fs.existsSync(readme)) continue;
  const id = `DOM-${dom.code}`;
  const owned = features.filter((f) => f.owner === id).sort((a, b) => a.id.localeCompare(b.id));
  const part = features.flatMap((f) => f.participants.filter((p) => p.domain === id && f.owner !== id).map((p) => ({ f, p })));
  const hosted = services.filter((s) => s.text.includes(id));
  const link = (f) => `[${f.id}](../../features/${f.dir}/feature.md)`;
  const block = [BEGIN, '', '## Feature index (generated)', '',
    `### Owned features (${owned.length})`, '',
    owned.length ? ['| Feature | Title | Delivery | Requirements |', '|---|---|---|---|', ...owned.map((f) => `| ${link(f)} | ${f.title} | ${f.delivery} | ${f.reqs} |`)].join('\n') : '_None._',
    '', `### Participating in cross-domain features (${part.length})`, '',
    part.length ? ['| Feature | Part | Role | Feature owner |', '|---|---|---|---|', ...part.map(({ f, p }) => `| ${link(f)} | ${p.part} | ${p.role} | ${f.owner} |`)].join('\n') : '_None._',
    '', `### Hosted by services (${hosted.length})`, '',
    hosted.length ? hosted.map((s) => `- [${s.id}](../../services/${s.dir}/SERVICE.md)`).join('\n') : '_None declared._',
    '', END].join('\n');
  const cur = fs.readFileSync(readme, 'utf8');
  let next;
  if (cur.includes(BEGIN)) next = cur.replace(new RegExp(`${BEGIN}[\\s\\S]*?${END}`), block);
  else {
    // First run: drop hand-maintained feature lists — the generated block replaces them.
    const stripped = cur.replace(/^##\s+(?:\d+\.\s*)?(Features|Participates in|Owned features|Participating[^\n]*)\s*\n[\s\S]*?(?=^##\s|(?![\s\S]))/gim, '');
    next = stripped.trimEnd() + '\n\n' + block + '\n';
  }
  if (next !== cur) { stale++; if (!CHECK) fs.writeFileSync(readme, next); }
}
console.log(`${CHECK ? 'stale' : 'updated'} domain views: ${stale}; features: ${features.length}; cross-domain: ${features.filter((f) => f.participants.length).length}`);
if (CHECK && stale) process.exit(1);
