#!/usr/bin/env node
// Implementation-readiness check for a feature (PROC-001 step 1, STD-005 R2): can packets be issued?
// Reads the feature folder, the domain README, contracts and verification; prints one line per gate
// and a verdict. Exit 1 when a blocking gate fails.
//   node tools/readiness.mjs FEAT-001            one feature
//   node tools/readiness.mjs FEAT-001 FEAT-023   several
//   node tools/readiness.mjs --all               every feature, one line each (summary mode)
//   node tools/readiness.mjs FEAT-001 --code-root D:/workspace/zuri-next   where test paths are looked up
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { parseInterfaces } from './lib/interfaces.mjs';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DOCS = path.join(REPO, 'docs');
const argv = process.argv.slice(2);
const opt = (n, d) => { const i = argv.indexOf(n); return i >= 0 && argv[i + 1] ? argv[i + 1] : d; };
const CODE_ROOT = opt('--code-root', REPO);
const read = (f) => fs.readFileSync(f, 'utf8').replace(/\r\n/g, '\n');
const fmOf = (t) => (t.match(/^---\n([\s\S]*?)\n---/) || [, ''])[1];
const get = (fm, k) => ((fm.match(new RegExp(`^${k}:\\s*(.*)$`, 'm')) || [, ''])[1]).replace(/\s+#.*$/, '').replace(/^["']|["']$/g, '').trim();
const rel = (fm, k) => ((fm.match(new RegExp(`^\\s+${k}:\\s*(.*)$`, 'm')) || [, ''])[1] || '').replace(/^\[|\]$/g, '').split(',').map((x) => x.trim().replace(/\s*\(.*\)$/, '')).filter(Boolean);
const section = (t, h) => { const m = t.match(new RegExp(`^## ${h}\\s*\\n([\\s\\S]*?)(?=^## |(?![\\s\\S]))`, 'm')); return m ? m[1].trim() : ''; };
const domains = [...read(path.join(REPO, 'registry/domains.yaml')).matchAll(/code:\s*([A-Z]{3})\s*\n\s*slug:\s*([a-z-]+)/g)].map((m) => ({ id: 'DOM-' + m[1], slug: m[2] }));
const featureDirs = fs.readdirSync(path.join(DOCS, 'features')).map((d) => path.join(DOCS, 'features', d));
const dirOf = (featId) => featureDirs.find((d) => path.basename(d).startsWith(featId + '-'));
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? (['templates', 'plans'].includes(e.name) ? [] : walk(path.join(d, e.name))) : [path.join(d, e.name)]));
const mdFiles = walk(DOCS).filter((f) => f.endsWith('.md'));
const headingExists = (id) => mdFiles.some((f) => new RegExp(`^#{1,6}\\s+${id}\\b`, 'm').test(read(f)));

function check(featId) {
  const dir = dirOf(featId); if (!dir) return { featId, error: 'no feature folder' };
  const featTxt = read(path.join(dir, 'feature.md')); const fm = fmOf(featTxt);
  const owner = get(fm, 'owner'); const status = get(fm, 'status'); const delivery = get(fm, 'delivery');
  const dom = domains.find((d) => d.id === owner);
  const domReadme = dom ? read(path.join(DOCS, 'domains', dom.slug, 'README.md')) : ''; const domStatus = get(fmOf(domReadme), 'status');
  const frFiles = fs.existsSync(path.join(dir, 'requirements')) ? fs.readdirSync(path.join(dir, 'requirements')).filter((f) => /^FR-/.test(f)) : [];
  const frs = frFiles.map((f) => { const t = read(path.join(dir, 'requirements', f)); const id = f.match(/^(FR-\d{3}-\d{3})/)[1]; const acs = [...section(t, 'Acceptance criteria').matchAll(/^- (AC-\d{3}-\d{3}-\d{2})\s*[—–-]\s*(.+)$/gm)].map((m) => ({ id: m[1], text: m[2] })); return { id, delivery: get(fmOf(t), 'delivery'), acs, gwt: acs.filter((a) => /given/i.test(a.text) && /when/i.test(a.text) && /then/i.test(a.text)).length, specified_by: rel(fmOf(t), 'specified_by'), verificationEmpty: !/TC-\d{3}-\d{3}/.test(section(t, 'Verification')) }; });
  const sdd = fs.existsSync(path.join(dir, 'design.md')) ? read(path.join(dir, 'design.md')) : '';
  const sddBody = sdd.replace(/^---[\s\S]*?---\n/, '');
  const has = (re) => re.test(sddBody);
  const sddSections = { components: has(/\*\*Components|^## Components|^## Interfaces/im), data: has(/\*\*Data owned|^## Data/im), sequence: has(/\*\*Main sequence|^## Sequences?/im), failure: has(/\*\*Failure modes|^## Failure/im), contracts: has(/\*\*Contracts (exposed|consumed)|^## Contracts/im) };
  const cmps = [...new Set([...sddBody.matchAll(/\bCMP-\d{3,}\b/g)].map((m) => m[0]))];
  const ifc = parseInterfaces(sdd);
  const interfaceSection = ifc.present;
  const frsWithoutInterface = frs.filter((fr) => !(ifc.byFr[fr.id] || []).length).map((fr) => fr.id);
  const microCount = (ifc.micro || []).length;
  const frInSdd = frs.map((fr) => ({ id: fr.id, mentioned: sddBody.includes(fr.id) || new RegExp(fr.id.replace(/-(\d{3})$/, '-$1') + '|' + fr.id.replace(/-\d{3}$/, '-\\d{3}\\.\\.\\d{3}')).test(sddBody) }));
  const ver = fs.existsSync(path.join(dir, 'verification.md')) ? read(path.join(dir, 'verification.md')) : '';
  const tcs = [...ver.matchAll(/^#+\s*(TC-\d{3}-\d{3})[^\n]*\n([\s\S]*?)(?=^#+\s|(?![\s\S]))/gm)].map((m) => ({ id: m[1], body: m[2], tests: [...m[2].matchAll(/(?:^|[\s:,])((?:apps|packages|services|tests)\/[^\s,;)]+\.(?:m?js|jsx|ts|tsx))/g)].map((x) => x[1]) }));
  const frWithTc = frs.map((fr) => ({ id: fr.id, tcs: tcs.filter((t) => t.body.includes(fr.id)).map((t) => t.id) }));
  const testPaths = [...new Set(tcs.flatMap((t) => t.tests))]; const localTests = testPaths.filter((p) => fs.existsSync(path.join(CODE_ROOT, p)));
  const contractIds = [...new Set(frs.flatMap((f) => f.specified_by).filter((x) => /^(API|EVT)-/.test(x)))];
  const contractsMissing = contractIds.filter((id) => !headingExists(id));
  const deps = rel(fm, 'depends_on').filter((d) => /^(FEAT|FR)-/.test(d)).map((d) => 'FEAT-' + d.split('-')[1]).filter((v, i, a) => a.indexOf(v) === i && v !== featId);
  const depStatus = deps.map((d) => { const dd = dirOf(d); return { id: d, status: dd ? get(fmOf(read(path.join(dd, 'feature.md'))), 'status') : 'missing' }; });
  let tokens = null; try { const out = execFileSync(process.execPath, [path.join(REPO, 'tools/packet.mjs'), frs[0]?.id || 'FR-000-000', '--layer', 'service'], { encoding: 'utf8', cwd: REPO, stdio: ['ignore', 'pipe', 'ignore'] }); tokens = JSON.parse(out).token_estimate; } catch {}

  const gates = [];
  const gate = (id, level, ok, detail, fix) => gates.push({ id, level, ok, detail, fix });
  gate('G1 feature approved', 'block', status === 'approved', `status: ${status} · delivery: ${delivery}`, 'domain owner review (PLAN-001 P5-T1)');
  gate('G1b domain README approved', 'warn', domStatus === 'approved', `${owner} README status: ${domStatus || 'missing'}`, 'PLAN-001 P3-T3');
  const missingSecs = Object.entries(sddSections).filter(([, v]) => !v).map(([k]) => k);
  gate('G2 SDD minimum sections', 'block', missingSecs.length === 0, missingSecs.length ? `missing: ${missingSecs.join(', ')} (${sddBody.split('\n').length} lines)` : `components, data, sequence, failure modes, contracts present (${sddBody.split('\n').length} lines)`, 'PLAN-001 P3-T1/P3-T2');
  gate('G2b SDD names components', 'block', cmps.length > 0, cmps.length ? `CMP: ${cmps.join(', ')}` : 'no CMP id in the SDD', 'add Components with CMP ids to the SDD');
  gate('G3 interface lock (STD-005 R2)', 'block', interfaceSection && frsWithoutInterface.length === 0, !interfaceSection ? 'no "## Interfaces" section in the SDD' : frsWithoutInterface.length ? `FRs without an interface line: ${frsWithoutInterface.join(', ')}` : `${ifc.all.length} signature(s) over ${frs.length} FR · ${microCount} pure micro-task(s) declared for local models`, 'Architect adds "## Interfaces": per FR one `name(args) → result` line (CMP · `signature` — description), pure ones with rule/acceptance/holdout items');
  const notMentioned = frInSdd.filter((f) => !f.mentioned).map((f) => f.id);
  gate('G3b every FR mapped in the SDD', 'block', notMentioned.length === 0, notMentioned.length ? `not in SDD: ${notMentioned.join(', ')}` : `all ${frs.length} FRs appear in the SDD`, 'extend the implementation map');
  const noAc = frs.filter((f) => !f.acs.length).map((f) => f.id);
  gate('G4 every FR has AC', 'block', noAc.length === 0, noAc.length ? `without AC: ${noAc.join(', ')}` : `${frs.reduce((n, f) => n + f.acs.length, 0)} AC over ${frs.length} FR`, 'write ACs');
  const nonGwt = frs.reduce((n, f) => n + (f.acs.length - f.gwt), 0);
  gate('G4b ACs in Given/When/Then', 'warn', nonGwt === 0, nonGwt ? `${nonGwt} AC not in Given/When/Then form` : 'all ACs testable as written', 'PLAN-001 P2-T2');
  const declared = frs.filter((f) => f.delivery === 'declared').map((f) => f.id);
  gate('G4c no FR left "declared"', 'warn', declared.length === 0, declared.length ? `declared: ${declared.join(', ')}` : 'every FR has a delivery decision', 'PLAN-001 P2-T3');
  const noTc = frWithTc.filter((f) => !f.tcs.length).map((f) => f.id);
  gate('G5 every FR has a TC', 'block', noTc.length === 0, noTc.length ? `without TC: ${noTc.join(', ')}` : `${tcs.length} TC cover ${frs.length} FR`, 'PLAN-001 P2-T1');
  gate('G5b tests exist in this code root', 'warn', localTests.length === testPaths.length && testPaths.length > 0, `${localTests.length}/${testPaths.length} test paths exist under ${path.basename(CODE_ROOT)} (the rest are zuri-ai legacy paths)`, 'test packets will create them (PROC-001 step 4)');
  gate('G6 contracts resolve', 'block', contractsMissing.length === 0, contractsMissing.length ? `missing: ${contractsMissing.join(', ')}` : `${contractIds.length} API/EVT referenced, all declared`, 'declare the contract in the domain contracts.md');
  const depsNotApproved = depStatus.filter((d) => d.status !== 'approved');
  gate('G7 dependencies approved', 'warn', depsNotApproved.length === 0, deps.length ? depStatus.map((d) => `${d.id}:${d.status}`).join(' ') : 'no feature dependencies', 'implement or approve dependencies first (STD-005 R5)');
  gate('G8 packet fits a 16k context', 'warn', tokens != null && tokens < 12000, tokens != null ? `~${tokens} tokens for the first service packet` : 'packet could not be built', 'split the FR (STD-003 R7)');
  const blocking = gates.filter((g) => g.level === 'block' && !g.ok);
  return { featId, title: get(fm, 'title'), owner, status, frs: frs.length, gates, ready: blocking.length === 0, blocking: blocking.length, warnings: gates.filter((g) => g.level === 'warn' && !g.ok).length };
}

const targets = argv.includes('--all') ? featureDirs.map((d) => path.basename(d).match(/^FEAT-\d{3}/)[0]) : argv.filter((a) => /^FEAT-\d{3}$/.test(a));
if (!targets.length) { console.error('usage: node tools/readiness.mjs FEAT-001 [FEAT-002 …] | --all [--code-root dir]'); process.exit(2); }
let anyBlocked = false;
for (const f of targets) {
  const r = check(f);
  if (r.error) { console.log(`${f}: ${r.error}`); anyBlocked = true; continue; }
  if (argv.includes('--all')) { console.log(`${r.featId}  ${r.ready ? 'READY   ' : 'BLOCKED '} blocks=${r.blocking} warns=${r.warnings}  ${r.status.padEnd(8)} ${r.owner}  ${r.title}`); }
  else {
    console.log(`\n${r.featId} — ${r.title}  (${r.owner}, ${r.frs} FR)`);
    for (const g of r.gates) console.log(`  ${g.ok ? 'PASS ' : g.level === 'block' ? 'FAIL ' : 'WARN '} ${g.id.padEnd(36)} ${g.detail}${g.ok ? '' : `\n        → ${g.fix}`}`);
    console.log(`  ${r.ready ? 'READY for packets' : `NOT READY: ${r.blocking} blocking gate(s)`}${r.warnings ? `, ${r.warnings} warning(s)` : ''}`);
  }
  if (!r.ready) anyBlocked = true;
}
process.exit(anyBlocked ? 1 : 0);
