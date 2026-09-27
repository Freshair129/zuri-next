// Scope resolution shared by the tools: turns an ID or a path into the documentation
// files it covers. Uses metadata (owner, participants) — never folder position alone —
// so a domain scope includes the cross-domain features it participates in (STD-003).
import fs from 'node:fs';
import path from 'node:path';

const fmOf = (file) => (fs.readFileSync(file, 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---/) || [, ''])[1];
const get = (fm, key) => ((fm.match(new RegExp(`^${key}:\\s*(.*)$`, 'm')) || [, ''])[1]).replace(/\s+#.*$/, '').replace(/^["']|["']$/g, '').trim();

export function loadDomains(repoRoot) {
  const yaml = fs.readFileSync(path.join(repoRoot, 'registry/domains.yaml'), 'utf8');
  return [...yaml.matchAll(/code:\s*([A-Z]{3})\s*\n\s*slug:\s*([a-z-]+)/g)].map((m) => ({ id: `DOM-${m[1]}`, code: m[1], slug: m[2] }));
}

export function loadFeatures(docsRoot) {
  const dir = path.join(docsRoot, 'features');
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).filter((e) => e.isDirectory()).flatMap((e) => {
    const file = path.join(dir, e.name, 'feature.md');
    if (!fs.existsSync(file)) return [];
    const fm = fmOf(file);
    return [{
      id: get(fm, 'id'), dir: `features/${e.name}`, owner: get(fm, 'owner'), type: get(fm, 'type'),
      participants: [...fm.matchAll(/-\s*domain:\s*(DOM-[A-Z]{3})/g)].map((m) => m[1]),
    }];
  });
}

/** The feature number an ID belongs to, or null for standalone IDs. */
export function featureNumberOf(id) {
  const m = id.match(/^(?:FEAT|FR|NFR|TC|SDD)-(\d{3,})(?:-|$)/) || id.match(/^AC-(\d{3,})-/);
  if (!m) return null;
  if (/^NFR-\d{3,}$/.test(id)) return null; // system NFR
  return m[1];
}

/**
 * Resolve one scope argument.
 * @returns {{ label: string, prefixes: string[], features: object[] }} docs-relative path prefixes
 */
export function resolveScope(arg, { repoRoot, docsRoot }) {
  const features = loadFeatures(docsRoot);
  const n = featureNumberOf(arg);
  if (n) {
    const f = features.find((x) => x.id === `FEAT-${n}`);
    if (!f) throw new Error(`No feature FEAT-${n} for scope ${arg}`);
    return { label: arg, prefixes: [`${f.dir}/`], features: [f] };
  }
  const dm = arg.match(/^DOM-([A-Z]{3})$/);
  if (dm) {
    const d = loadDomains(repoRoot).find((x) => x.id === arg);
    if (!d) throw new Error(`Unregistered domain ${arg}`);
    const fs2 = features.filter((f) => f.owner === arg || f.participants.includes(arg));
    return { label: arg, prefixes: [`domains/${d.slug}/`, ...fs2.map((f) => `${f.dir}/`)], features: fs2 };
  }
  // A path, relative to the repository or to docs/.
  let p = arg.replace(/\\/g, '/').replace(/^\.\//, '');
  if (p.startsWith('docs/')) p = p.slice(5);
  if (!fs.existsSync(path.join(docsRoot, p))) throw new Error(`Scope ${arg} is not an ID or a path under docs/`);
  const isDir = fs.statSync(path.join(docsRoot, p)).isDirectory();
  const prefix = isDir ? p.replace(/\/?$/, '/') : p;
  return { label: arg, prefixes: [prefix], features: features.filter((f) => prefix.startsWith(`${f.dir}/`) || `${f.dir}/`.startsWith(prefix)) };
}
