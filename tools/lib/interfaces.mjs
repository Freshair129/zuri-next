// Parse the `## Interfaces` section of a design.md (STD-005 R2). Shared by packet.mjs and readiness.mjs.
//
// Grammar (one list item per exported signature, grouped under `### <FR-id>` headings):
//
//   ## Interfaces
//   ### Serving FR-001-001   (never a bare ID heading: STD-002 would read it as a declaration)
//   - CMP-030 · `createTenant(input: CreateTenantInput, viewer: Viewer) → Promise<Tenant>` — application service; audited
//   - CMP-030 · `generateScopeCode(prefix: string, name: string, isTaken: (code: string) => boolean) → string` — pure · type: generator
//     - path: apps/server/src/modules/project-manager/domain/scope-code.js
//     - rule: uppercase, non-alphanumerics collapse to one hyphen, trimmed
//     - acceptance: `generateScopeCode('TNT', 'Acme', () => false)` → `'TNT-ACME'`
//     - holdout: `generateScopeCode('WS', '  Sales  Team ', () => false)` → `'WS-SALES-TEAM'`
//
// A signature whose description contains the word `pure` is a micro-task candidate; `type:` names its
// task type (default `pure-function`); `rule:` lines (≤ 6) and `acceptance:` / `holdout:` cases feed the
// micro-task packet. Holdout cases never reach a worker.
export function parseInterfaces(designText) {
  const txt = designText.replace(/\r\n/g, '\n');
  const m = txt.match(/^## Interfaces\s*\n([\s\S]*?)(?=^## |(?![\s\S]))/m);
  if (!m) return { present: false, byFr: {}, all: [] };
  const byFr = {}; let cur = null; let item = null;
  for (const raw of m[1].split('\n')) {
    const h = raw.match(/^###\s+(?:Serving\s+)?((?:FR|NFR)-\d{3}-\d{3})\b/); if (h) { cur = h[1]; byFr[cur] ??= []; item = null; continue; }
    if (!cur) continue;
    const top = raw.match(/^- (?:(CMP-\d{3,})\s*[·:]\s*)?`([^`]+)`\s*(?:[—–-]+\s*(.*))?$/);
    if (top) {
      const sig = top[2].trim(); const desc = (top[3] || '').trim();
      const name = (sig.match(/^([A-Za-z_$][\w$]*)\s*\(/) || [])[1] || null;
      const typeM = desc.match(/\btype:\s*([a-z-]+)/i);
      item = { fr: cur, cmp: top[1] || null, signature: sig, name, description: desc, pure: /\bpure\b/i.test(desc), task_type: typeM ? typeM[1].toLowerCase() : 'pure-function', path: null, rules: [], acceptance: [], holdout: [] };
      byFr[cur].push(item); continue;
    }
    const sub = raw.match(/^\s{2,}- (path|rule|acceptance|holdout|type):\s*(.*)$/); if (!sub || !item) continue;
    const [, key, val] = sub;
    if (key === 'path') item.path = val.trim();
    else if (key === 'type') item.task_type = val.trim().toLowerCase();
    else if (key === 'rule') item.rules.push(val.trim());
    else { const c = val.match(/^`([^`]+)`\s*(?:→|->|=>)\s*`([^`]*)`\s*$/); if (c) item[key].push({ call: c[1].trim(), expected: c[2].trim() }); else item[key].push({ call: val.trim(), expected: null, malformed: true }); }
  }
  const all = Object.values(byFr).flat();
  return { present: true, byFr, all, micro: all.filter((i) => i.pure) };
}

/** STD-005 R8 eligibility for one interface item. Returns { eligible, failed: ['E1', …], reasons }. */
export function eligibility(item, { promptTokens = 0, budget = 600, sensitive = false } = {}) {
  const failed = [], reasons = [];
  if (!item.name || /\n/.test(item.signature)) { failed.push('E1'); reasons.push('signature is not one named function on one line'); }
  if (!item.pure) { failed.push('E2'); reasons.push('not declared pure in the SDD'); }
  if (!item.path && !item.name) { failed.push('E3'); reasons.push('no target file'); }
  if (item.acceptance.filter((c) => !c.malformed).length < 2 || item.holdout.filter((c) => !c.malformed).length < 1 || item.acceptance.some((c) => c.malformed) || item.holdout.some((c) => c.malformed)) { failed.push('E4'); reasons.push('needs ≥ 2 visible and ≥ 1 holdout case of the form `call` → `expected`'); }
  if (promptTokens > budget) { failed.push('E5'); reasons.push(`prompt ~${promptTokens} tokens exceeds budget ${budget}`); }
  if (sensitive) { failed.push('E6'); reasons.push('security, money or external-contract territory'); }
  if (item.rules.length > 6) { failed.push('E1'); reasons.push('more than six rules: split the function'); }
  return { eligible: failed.length === 0, failed: [...new Set(failed)], reasons };
}
