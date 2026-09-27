#!/usr/bin/env node
// Build an implementation packet (STD-005): one FR × one layer, self-contained enough for a small
// local model to implement without reading the repository. The packet is JSON; the runner that turns
// it into code and tests is a separate tool (rwang-local-assistant `forge.mjs`, PROC-001).
//
// Usage:
//   node tools/packet.mjs FR-042-003                         packet for the service layer, to stdout
//   node tools/packet.mjs FR-042-003 --layer test --out p.json
//   node tools/packet.mjs FR-042-003 --paths apps/server/src/modules/crm,apps/server/tests
//   node tools/packet.mjs --queue FEAT-042 --layers test,service --out-dir .packets/
//        one packet per FR × layer of the feature, in FR order, plus queue.json listing them
//   node tools/packet.mjs FR-042-003 --code-root D:/workspace/zuri-next   where existing code is read from
// Layers: schema · service · contract · ui · test  (STD-005 R1)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DOCS = path.join(REPO, 'docs');
const argv = process.argv.slice(2);
const opt = (n, d) => { const i = argv.indexOf(n); return i >= 0 && argv[i + 1] ? argv[i + 1] : d; };
const flag = (n) => argv.includes(n);
const LAYERS = ['schema', 'service', 'contract', 'ui', 'test'];
const read = (f) => fs.readFileSync(f, 'utf8').replace(/\r\n/g, '\n');
const fmOf = (t) => (t.match(/^---\n([\s\S]*?)\n---/) || [, ''])[1];
const get = (fm, k) => ((fm.match(new RegExp(`^${k}:\\s*(.*)$`, 'm')) || [, ''])[1]).replace(/\s+#.*$/, '').replace(/^["']|["']$/g, '').trim();
const list = (s) => (s || '').replace(/^\[|\]$/g, '').split(',').map((x) => x.trim().replace(/\s*\(.*\)$/, '')).filter(Boolean);
const rel = (fm, k) => list((fm.match(new RegExp(`^\\s+${k}:\\s*(.*)$`, 'm')) || [, ''])[1]);
const section = (t, h) => { const m = t.match(new RegExp(`^## ${h}\\s*\\n([\\s\\S]*?)(?=^## |(?![\\s\\S]))`, 'm')); return m ? m[1].trim() : ''; };
const estimateTokens = (s) => Math.ceil(s.length / 3.6);

// ---- locate artifacts by id (heading or frontmatter) across docs ----
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? (['templates', 'plans'].includes(e.name) ? [] : walk(path.join(d, e.name))) : [path.join(d, e.name)]));
const mdFiles = walk(DOCS).filter((f) => f.endsWith('.md'));
function headingBlock(id) {
  for (const f of mdFiles) {
    const t = read(f); const m = t.match(new RegExp(`^(#{1,6})\\s+${id}\\b[^\\n]*\\n([\\s\\S]*?)(?=^#{1,6}\\s|(?![\\s\\S]))`, 'm'));
    if (m) return { id, file: path.relative(REPO, f).replace(/\\/g, '/'), title: (t.match(new RegExp(`^#{1,6}\\s+${id}\\s*[—:–-]?\\s*(.*)$`, 'm')) || [, ''])[1].trim(), text: m[2].trim().slice(0, 2500) };
  }
  return null;
}
const domains = [...read(path.join(REPO, 'registry/domains.yaml')).matchAll(/code:\s*([A-Z]{3})\s*\n\s*slug:\s*([a-z-]+)/g)].map((m) => ({ id: 'DOM-' + m[1], slug: m[2] }));
const slugOf = (dom) => domains.find((d) => d.id === dom)?.slug || 'unknown';

function featureDir(featId) { return fs.readdirSync(path.join(DOCS, 'features')).map((d) => path.join(DOCS, 'features', d)).find((d) => path.basename(d).startsWith(featId + '-')); }

function buildPacket(frId, layer, o = {}) {
  if (!LAYERS.includes(layer)) throw new Error(`layer must be one of ${LAYERS.join('|')}`);
  const featId = 'FEAT-' + frId.split('-')[1]; const fdir = featureDir(featId); if (!fdir) throw new Error(`no feature folder for ${featId}`);
  const frFile = fs.readdirSync(path.join(fdir, 'requirements')).find((f) => f.startsWith(frId + '-')); if (!frFile) throw new Error(`no requirement file for ${frId}`);
  const frTxt = read(path.join(fdir, 'requirements', frFile)); const frFm = fmOf(frTxt);
  const featTxt = read(path.join(fdir, 'feature.md')); const featFm = fmOf(featTxt);
  const owner = get(frFm, 'owner') || get(featFm, 'owner');
  const statement = (frTxt.split(/^## /m)[0].split(/\n# [^\n]+\n/)[1] || '').trim();
  const acs = [...section(frTxt, 'Acceptance criteria').matchAll(/^- (AC-\d{3}-\d{3}-\d{2})\s*[—–-]\s*(.+)$/gm)].map((m) => ({ id: m[1], text: m[2].trim() }));
  const design = fs.existsSync(path.join(fdir, 'design.md')) ? read(path.join(fdir, 'design.md')) : '';
  const designBody = design.replace(/^---[\s\S]*?---\n/, '').trim();
  const designExcerpt = designBody.length <= 6000 ? designBody : (() => { // keep sections that mention this FR plus the structural ones
    const secs = designBody.split(/^(?=## )/m); return secs.filter((s, i) => i === 0 || s.includes(frId) || /^## (Components|Data|Sequences?|Failure|Contracts|Interfaces?)/i.test(s)).join('\n').slice(0, 8000);
  })();
  const contracts = [...new Set([...rel(frFm, 'specified_by'), ...rel(featFm, 'depends_on')])].filter((x) => /^(API|EVT)-/.test(x)).map(headingBlock).filter(Boolean);
  const rules = [...new Set([...rel(frFm, 'derived_from'), ...rel(featFm, 'decided_by'), ...rel(frFm, 'decided_by')])].filter((x) => /^(BR|SEC|ADR)-/.test(x)).map(headingBlock).filter(Boolean);
  const verification = fs.existsSync(path.join(fdir, 'verification.md')) ? read(path.join(fdir, 'verification.md')) : '';
  const tcs = [...verification.matchAll(/^#+\s*(TC-\d{3}-\d{3})[^\n]*\n([\s\S]*?)(?=^#+\s|(?![\s\S]))/gm)].filter((m) => m[2].includes(frId)).map((m) => ({ id: m[1], title: (verification.match(new RegExp(`^#+\\s*${m[1]}\\s*[—–-]\\s*(.*)$`, 'm')) || [, ''])[1].trim(), verifies: [...new Set([...m[2].matchAll(/\b(?:AC|FR|NFR)-\d{3}-\d{3}(?:-\d{2})?\b/g)].map((x) => x[0]))] }));
  const slug = slugOf(owner);
  const allowed = o.paths || { schema: [`apps/server/prisma/`, `apps/server/src/modules/${slug}/domain/`], service: [`apps/server/src/modules/${slug}/application/`, `apps/server/src/modules/${slug}/domain/`], contract: [`apps/server/src/app/api/`, `apps/server/src/modules/${slug}/contracts/`], ui: [`apps/server/src/modules/${slug}/views/`, `apps/server/src/app/`], test: [`apps/server/tests/${slug}/`] }[layer];
  const codeRoot = o.codeRoot || REPO;
  const code = [];
  for (const p of allowed) { const abs = path.join(codeRoot, p); if (!fs.existsSync(abs)) continue; const files = fs.statSync(abs).isDirectory() ? walk(abs).filter((f) => /\.(m?js|jsx|ts|tsx|prisma|sql)$/.test(f)) : [abs]; for (const f of files.slice(0, 12)) { const t = read(f); if (t.length > 12000) continue; code.push({ path: path.relative(codeRoot, f).replace(/\\/g, '/'), content: t }); } }
  const guardrails = [
    'ADR-100: an application service is the only writer; a route, page or tool is a thin adapter over the exported service and never touches the database directly.',
    'ARCH-001 §4 layering: domain → application → interface; a lower layer never imports a higher one; cross-domain writes go only through a declared API or EVT contract.',
    'STD-002 R6: every new file starts with a comment `@trace implements <FR id>` (and `@trace verifies <AC id>` in tests).',
    'Write only inside the allowed paths of this packet. If the design (SDD) does not give a signature you need, stop and report DESIGN_GAP instead of inventing one.',
    'Never add secrets, hostnames, personal data or example credentials. Configuration is read by name from the environment.',
    'Prefer the smallest change that makes every acceptance criterion true; do not refactor code outside the packet.',
  ];
  const task = {
    schema: 'Add or change the persistence schema and domain types this requirement needs, exactly as the SDD names them.',
    service: 'Implement the application-service behaviour the requirement states, inside the component the SDD names, with the signature the SDD gives.',
    contract: 'Expose the behaviour through the declared API/EVT contract as a thin adapter over the application service (validation, auth resolution, status codes).',
    ui: 'Render the console view the requirement describes over the existing read model; no business logic in the view.',
    test: 'Write one automated test per acceptance criterion, named by the AC id, against the application service or route the SDD names. Tests must fail until the behaviour exists.',
  }[layer];
  const packet = {
    id: `PKT-${frId}-${layer}`, standard: 'STD-005', layer, fr: frId, task,
    feature: { id: featId, title: get(featFm, 'title'), owner, runtime: get(featFm, 'runtime'), type: get(featFm, 'type') },
    requirement: { id: frId, title: get(frFm, 'title'), delivery: get(frFm, 'delivery'), statement, acceptance: acs },
    design: { sdd: `SDD-${frId.split('-')[1]}`, excerpt: designExcerpt },
    contracts, rules, guardrails,
    tests: tcs,
    allowed_paths: allowed,
    code,
    output_contract: 'Respond with files only. Each file is one fenced block whose info string is `path=<relative path inside an allowed path>` (the word path= goes inside the opening fence, not on a separate line); the block body is the complete file content, and every @trace line is a code comment. No prose outside the blocks. If something needed is missing from the packet, respond with a single block `path=DESIGN_GAP.md` explaining what the SDD must add.',
    verify: o.verify || (layer === 'test' ? [] : [`node --test apps/server/tests/${slug}/`]),
  };
  const promptText = JSON.stringify({ ...packet, code: packet.code.map((c) => c.content).join('\n') });
  packet.token_estimate = estimateTokens(promptText);
  return packet;
}

// ---- CLI ----
const layer = opt('--layer', 'service');
const paths = opt('--paths') ? opt('--paths').split(',').map((s) => s.trim()) : null;
const verify = opt('--verify') ? opt('--verify').split(';').map((s) => s.trim()) : null;
const codeRoot = opt('--code-root');
if (opt('--queue')) {
  const featId = opt('--queue'); const fdir = featureDir(featId); if (!fdir) { console.error(`no feature folder for ${featId}`); process.exit(2); }
  const layers = (opt('--layers', 'test,service')).split(',').map((s) => s.trim()).filter((l) => LAYERS.includes(l));
  const outDir = opt('--out-dir', path.join(REPO, '.packets', featId)); fs.mkdirSync(outDir, { recursive: true });
  const frs = fs.readdirSync(path.join(fdir, 'requirements')).filter((f) => /^FR-/.test(f)).map((f) => f.match(/^(FR-\d{3}-\d{3})/)[1]).sort();
  const queue = [];
  for (const fr of frs) for (const l of layers) { const p = buildPacket(fr, l, { paths, verify, codeRoot }); const file = path.join(outDir, `${p.id}.json`); fs.writeFileSync(file, JSON.stringify(p, null, 1) + '\n'); queue.push({ id: p.id, fr, layer: l, file: path.relative(process.cwd(), file).replace(/\\/g, '/'), token_estimate: p.token_estimate }); }
  fs.writeFileSync(path.join(outDir, 'queue.json'), JSON.stringify({ feature: featId, generated: new Date().toISOString().slice(0, 10), order: 'FR ascending; layers in the order given (test-first by default); stop on the first failed packet (STD-005 R5)', packets: queue }, null, 1) + '\n');
  console.log(`${queue.length} packet(s) → ${path.relative(process.cwd(), outDir)}/queue.json · tokens: ${queue.map((q) => q.token_estimate).join(', ')}`);
} else {
  const fr = argv.find((a) => /^FR-\d{3}-\d{3}$/.test(a));
  if (!fr) { console.error('usage: node tools/packet.mjs <FR-id> [--layer schema|service|contract|ui|test] [--out file] [--paths a,b] [--verify "cmd;cmd"] [--code-root dir] | --queue FEAT-id [--layers test,service] [--out-dir dir]'); process.exit(2); }
  const p = buildPacket(fr, layer, { paths, verify, codeRoot });
  const json = JSON.stringify(p, null, 1) + '\n';
  if (opt('--out')) { fs.mkdirSync(path.dirname(opt('--out')), { recursive: true }); fs.writeFileSync(opt('--out'), json); console.log(`${p.id} → ${opt('--out')} (~${p.token_estimate} tokens, ${p.requirement.acceptance.length} AC, ${p.tests.length} TC, ${p.code.length} code file(s))`); }
  else process.stdout.write(json);
}
