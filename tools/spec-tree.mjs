#!/usr/bin/env node
// Build the specification tree (domain > feature > FR/NFR) with a traffic-light state per node.
// Reads docs/ and registry/ only; writes docs/governance/plans/spec-tree.json (rendered by spec-tree.html).
// Usage: node tools/spec-tree.mjs [--check]   (--check: exit 1 when the JSON on disk is stale)
//
// State rules (colour never carries meaning alone — every node also prints its status word):
//   domain   README status:  approved → green · draft → yellow · proposed → grey
//   feature  delivery retired → red; else status: approved → green · draft → yellow · proposed → grey
//   FR/NFR   delivery retired → red; FR without an AC, or implemented/live FR whose Verification names no TC → red (unproven);
//            live/implemented → green · building → yellow · declared → grey
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DOCS = path.join(REPO, 'docs');
const OUT = path.join(DOCS, 'governance/plans/spec-tree.json');
const CHECK = process.argv.includes('--check');

const read = (f) => fs.readFileSync(f, 'utf8').replace(/\r\n/g, '\n');
const fmOf = (txt) => (txt.match(/^---\n([\s\S]*?)\n---/) || [, ''])[1];
const get = (fm, k) => ((fm.match(new RegExp(`^${k}:\\s*(.*)$`, 'm')) || [, ''])[1]).replace(/\s+#.*$/, '').replace(/^["']|["']$/g, '').trim();
const section = (txt, heading) => { const m = txt.match(new RegExp(`^## ${heading}\\s*\\n([\\s\\S]*?)(?=^## |(?![\\s\\S]))`, 'm')); return m ? m[1] : ''; };

const domainsYaml = read(path.join(REPO, 'registry/domains.yaml'));
const domains = [...domainsYaml.matchAll(/code:\s*([A-Z]{3})\s*\n\s*slug:\s*([a-z-]+)\s*\n\s*name:\s*(.+)\s*\n\s*subdomain:\s*(\w+)\s*\n\s*role:\s*(\w+)/g)].map((m) => {
  const readme = path.join(DOCS, 'domains', m[2], 'README.md');
  const status = fs.existsSync(readme) ? get(fmOf(read(readme)), 'status') : '';
  return { id: `DOM-${m[1]}`, slug: m[2], title: m[3].trim(), subdomain: m[4], role: m[5], status, state: { approved: 'green', draft: 'yellow' }[status] || 'grey', path: `docs/domains/${m[2]}/README.md`, features: [], participates: [] };
});
// Context map and external systems (ADR-107) from registry/relations.yaml
const relTxt = fs.existsSync(path.join(REPO, 'registry/relations.yaml')) ? read(path.join(REPO, 'registry/relations.yaml')) : '';
const list = (s) => (s || '').trim().replace(/^\[|\]$/g, '').split(',').map((x) => x.trim()).filter(Boolean);
const external = [...relTxt.split(/^context_map:/m)[0].matchAll(/^\s*-\s+id:\s*([a-z0-9-]+)\s*\n\s*name:\s*(.+)$/gm)].map((m) => ({ id: 'ext:' + m[1], title: m[2].trim() }));
const contextMap = (relTxt.split(/^context_map:\s*$/m)[1] || '').split(/\n\s*-\s+upstream:/).slice(1).map((blk) => {
  const g = (k) => (blk.match(new RegExp(`^\\s*${k}:\\s*(.+)$`, 'm')) || [, ''])[1].trim();
  return { upstream: list(blk.split('\n')[0]), downstream: list(g('downstream')), pattern: g('pattern'), evidence: list(g('evidence')), note: g('note') };
});
const byDom = Object.fromEntries(domains.map((d) => [d.id, d]));

const fdir = path.join(DOCS, 'features');
for (const dir of fs.readdirSync(fdir).sort()) {
  const ffile = path.join(fdir, dir, 'feature.md');
  if (!fs.existsSync(ffile)) continue;
  const fm = fmOf(read(ffile));
  const feat = {
    id: get(fm, 'id'), title: get(fm, 'title'), type: get(fm, 'type'), owner: get(fm, 'owner'), runtime: get(fm, 'runtime'),
    status: get(fm, 'status'), delivery: get(fm, 'delivery'), path: `docs/features/${dir}/feature.md`,
    participants: [...fm.matchAll(/-\s*domain:\s*(DOM-[A-Z]{3})\s*\n\s*part:\s*(\S+)\s*\n\s*role:\s*(.+)/g)].map((m) => ({ domain: m[1], part: m[2], role: m[3].replace(/^["']|["']$/g, '').trim() })),
    requirements: [],
  };
  feat.state = feat.delivery === 'retired' ? 'red' : ({ approved: 'green', draft: 'yellow' }[feat.status] || 'grey');
  feat.reason = feat.delivery === 'retired' ? 'retired' : feat.status;

  // TC coverage from verification.md: which FR ids are named by a TC
  const vfile = path.join(fdir, dir, 'verification.md');
  const tcByFr = {};
  if (fs.existsSync(vfile)) for (const m of read(vfile).matchAll(/^#+\s*(TC-\d{3}-\d{3})[^\n]*\n([\s\S]*?)(?=^#+\s|(?![\s\S]))/gm)) {
    for (const fr of new Set([...m[2].matchAll(/\b(N?FR-\d{3}-\d{3})\b/g)].map((x) => x[1]))) (tcByFr[fr] ??= []).push(m[1]);
  }

  const rdir = path.join(fdir, dir, 'requirements');
  for (const rf of fs.existsSync(rdir) ? fs.readdirSync(rdir).sort() : []) {
    const txt = read(path.join(rdir, rf)); const rfm = fmOf(txt);
    const id = get(rfm, 'id'); if (!id) continue;
    const delivery = get(rfm, 'delivery');
    const acs = [...section(txt, 'Acceptance criteria').matchAll(/^- (AC-\d{3}-\d{3}-\d{2})\s*[—–-]\s*(.+)$/gm)].map((m) => ({ id: m[1], text: m[2].trim() }));
    const tcsInFile = [...new Set([...section(txt, 'Verification').matchAll(/\bTC-\d{3}-\d{3}\b/g)].map((m) => m[0]))];
    const tcs = [...new Set([...tcsInFile, ...(tcByFr[id] || [])])].sort();
    const isFR = id.startsWith('FR-');
    const statement = (txt.split(/^## /m)[0].split(/\n# [^\n]+\n/)[1] || '').trim().split('\n\n')[0].replace(/\s+/g, ' ').slice(0, 400);
    let state, reason;
    if (delivery === 'retired') { state = 'red'; reason = 'retired'; }
    else if (isFR && acs.length === 0) { state = 'red'; reason = 'no acceptance criteria'; }
    else if (isFR && ['implemented', 'live'].includes(delivery) && tcs.length === 0) { state = 'red'; reason = 'unproven: no TC'; }
    else if (['live', 'implemented'].includes(delivery)) { state = 'green'; reason = delivery; }
    else if (delivery === 'building') { state = 'yellow'; reason = delivery; }
    else { state = 'grey'; reason = delivery || 'declared'; }
    feat.requirements.push({ id, kind: isFR ? 'FR' : 'NFR', title: get(rfm, 'title'), delivery, part: get(rfm, 'part') || null, owner: get(rfm, 'owner') || null, statement, acs, tcs, state, reason, path: `docs/features/${dir}/requirements/${rf}` });
  }
  const dom = byDom[feat.owner];
  if (dom) dom.features.push(feat); else (byDom.__orphan ??= { id: 'DOM-???', title: 'Unowned', state: 'red', features: [], participates: [] }).features.push(feat);
  for (const p of feat.participants) if (p.domain !== feat.owner && byDom[p.domain]) byDom[p.domain].participates.push({ feature: feat.id, part: p.part, role: p.role });
}

const zero = () => ({ green: 0, yellow: 0, red: 0, grey: 0 });
const rollup = (feat) => { const c = zero(); for (const r of feat.requirements) c[r.state]++; feat.counts = c; return c; };
for (const d of domains) { d.counts = zero(); for (const f of d.features) { const c = rollup(f); for (const k in c) d.counts[k] += c[k]; } }
const total = zero(); for (const d of domains) for (const k in total) total[k] += d.counts[k];
const featTotal = zero(); for (const d of domains) for (const f of d.features) featTotal[f.state]++;

const tree = {
  generated: new Date().toISOString().slice(0, 10),
  legend: {
    green: 'approved (domain, feature) · live or implemented (requirement)',
    yellow: 'draft (domain, feature) · building (requirement)',
    grey: 'proposed (domain, feature) · declared (requirement)',
    red: 'retired · FR without acceptance criteria · implemented/live FR with no TC',
  },
  totals: { domains: domains.length, features: domains.reduce((n, d) => n + d.features.length, 0), requirements: total, featuresByState: featTotal },
  classification: {
    subdomain: { core: 'differentiates the product; built in-house with the most care', supporting: 'business-specific, not a differentiator', generic: 'a solved problem; kept thin and replaceable' },
    role: { foundation: 'every other context depends on it; depends on none', business: 'owns business truth for one capability', platform: 'supplies capabilities; owns no business truth' },
    decided_by: 'ADR-107',
  },
  external,
  contextMap,
  domains: domains.sort((a, b) => a.id.localeCompare(b.id)),
};
const json = JSON.stringify(tree, null, 1) + '\n';
const cur = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : '';
const stale = cur.replace(/"generated": "[^"]+"/, '') !== json.replace(/"generated": "[^"]+"/, '');
if (CHECK) { console.log(stale ? 'spec-tree.json is stale' : 'spec-tree.json is current'); process.exit(stale ? 1 : 0); }
if (stale) fs.writeFileSync(OUT, json);
console.log(`${stale ? 'wrote' : 'unchanged'} ${path.relative(REPO, OUT)}: ${tree.totals.domains} domains, ${tree.totals.features} features, requirements ${JSON.stringify(total)}`);
