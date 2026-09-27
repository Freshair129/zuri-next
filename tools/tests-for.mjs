#!/usr/bin/env node
// Which tests prove a requirement? Lists the test cases and test files that verify the
// given IDs, and prints the command that runs only those tests.
//
// Usage: node tools/tests-for.mjs <ID|path>... [--json]
//   FR-042-003 / NFR-042-001  → test cases that verify it (or one of its ACs)
//   AC-042-003-01             → test cases that verify that AC; falls back to its FR
//   TC-042-012                → that test case
//   FEAT-042 / path           → every test case of the feature(s)
//   DOM-CRM                   → every test case of the features it owns or participates in
//
// Sources: each feature's verification.md (`Verifies:` + `Test:` lines, STD-003 R3) and
// `@trace verifies <IDs>` tags in code (STD-002 R6). Test paths that exist in this
// repository run here; paths that do not (bound to the zuri-ai tree the specification was
// derived from) are listed separately with the command for a zuri-ai checkout.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { featureNumberOf, resolveScope } from './lib/scope.mjs';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DOCS = path.join(REPO, 'docs');
const argv = process.argv.slice(2);
const json = argv.includes('--json');
const targets = argv.filter((a) => !a.startsWith('--'));
if (!targets.length) { console.error('usage: node tools/tests-for.mjs <ID|path>... [--json]'); process.exit(2); }

const IDS = /\b(?:FR|NFR|AC|TC)-[0-9][0-9-]*[0-9]\b/g;
const TEST_PATH = /[\w./@-]+\.(?:test|spec)\.[cm]?[jt]sx?\b/g;

function testCases(featureDir) {
  const file = path.join(DOCS, featureDir, 'verification.md');
  if (!fs.existsSync(file)) return [];
  const cases = []; let cur = null;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const h = line.match(/^###\s+(TC-\d{3,}-\d{3})\b\s*[—–:-]?\s*(.*)$/);
    if (h) { cur = { tc: h[1], title: h[2].trim(), verifies: [], tests: [], source: `docs/${featureDir}/verification.md` }; cases.push(cur); continue; }
    if (!cur) continue;
    if (/^#{1,3}\s/.test(line)) { cur = null; continue; }
    const v = line.match(/Verifies:\s*([^·]*)/);
    if (v) cur.verifies.push(...(v[1].match(IDS) || []));
    const t = line.match(/Tests?:\s*(.*)$/);
    if (t) cur.tests.push(...(t[1].match(TEST_PATH) || []));
  }
  return cases;
}

// `@trace verifies …` tags in code outside the documentation tree.
function traceTags() {
  const skip = new Set(['docs', 'registry', 'tools', 'node_modules', '.git', '.next', 'dist', 'build', 'coverage']);
  const out = [];
  const walk = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      if (e.isDirectory()) { if (!skip.has(e.name)) walk(path.join(d, e.name)); continue; }
      if (!/\.[cm]?[jt]sx?$/.test(e.name)) continue;
      const p = path.join(d, e.name);
      for (const m of fs.readFileSync(p, 'utf8').matchAll(/@trace\s+verifies\s+([^\n*]+)/g)) {
        out.push({ tc: '@trace', title: '', verifies: m[1].match(IDS) || [], tests: [path.relative(REPO, p).replace(/\\/g, '/')], source: 'code annotation' });
      }
    }
  };
  walk(REPO);
  return out;
}

function matches(target, c) {
  if (/^TC-/.test(target)) return c.tc === target;
  if (/^AC-/.test(target)) return c.verifies.includes(target);
  if (/^(FR|NFR)-\d{3,}-\d{3}$/.test(target)) return c.verifies.some((id) => id === target || id.startsWith(`AC-${target.split('-').slice(1).join('-')}-`));
  return true; // feature, domain or path scope: every case of the covered features
}

const tags = traceTags();
const selected = new Map();
for (const target of targets) {
  const scope = resolveScope(target, { repoRoot: REPO, docsRoot: DOCS });
  const cases = [...scope.features.flatMap((f) => testCases(f.dir)), ...tags];
  let hit = cases.filter((c) => matches(target, c));
  if (!hit.length && /^AC-/.test(target)) { // fall back to the AC's requirement
    const fr = `FR-${target.split('-').slice(1, 3).join('-')}`;
    hit = cases.filter((c) => matches(fr, c));
  }
  if (!/^(TC|AC|FR|NFR)-/.test(target)) { // code tags count only when they verify something in scope
    const nums = new Set(scope.features.map((f) => f.id.slice(5)));
    hit = hit.filter((c) => c.tc !== '@trace' || c.verifies.some((id) => nums.has(featureNumberOf(id))));
  }
  for (const c of hit) selected.set(`${c.tc}|${c.tests.join(',')}`, { ...c, target });
}

const cases = [...selected.values()];
const files = [...new Set(cases.flatMap((c) => c.tests))];
const local = files.filter((f) => fs.existsSync(path.join(REPO, f)));
const legacy = files.filter((f) => !local.includes(f));
const noTest = cases.filter((c) => !c.tests.length);

if (json) {
  console.log(JSON.stringify({ targets, cases, local, legacy }, null, 1));
} else {
  for (const c of cases) console.log(`${c.tc.padEnd(12)} ${c.title}\n${' '.repeat(13)}verifies ${c.verifies.join(', ') || '—'}\n${' '.repeat(13)}${c.tests.join(', ') || 'NO TEST FILE BOUND'}`);
  console.log(`\n${cases.length} test case(s), ${files.length} test file(s)` + (noTest.length ? `, ${noTest.length} with no test file` : ''));
  if (!cases.length) console.log('Nothing verifies this — add a TC to the feature\'s verification.md (STD-001 R7).');
  if (local.length) console.log(`\nRun here:\n  npx vitest run ${local.join(' ')}`);
  if (legacy.length) {
    const byApp = {};
    for (const f of legacy) { const m = f.match(/^(apps\/[^/]+)\/(.+)$/); const k = m ? m[1] : 'apps/server' /* zuri-ai: bare paths are Server-relative */; (byApp[k] ||= []).push(m ? m[2] : f); }
    console.log('\nNot in this repository (bound to the zuri-ai tree). Run in a zuri-ai checkout:');
    for (const [app, list] of Object.entries(byApp)) console.log(`  npm --prefix ${app} exec -- vitest run ${list.join(' ')}`);
  }
}
process.exit(cases.length ? 0 : 1);
