// Minimal YAML subset reader shared by the registry tools (no dependency, STD-003 tools rule):
// nested maps, lists of maps or scalars, inline [a, b] lists, quoted scalars, true/false/null, # comments.
// Enough for registry/*.yaml; anything fancier (anchors, multi-line scalars, flow maps) is refused by shape.
export function parseYaml(txt) {
  const lines = txt.replace(/\r\n/g, '\n').split('\n')
    .map((l) => (/^\s*#/.test(l) ? '' : l.replace(/\s+#(?![^"]*"(?:[^"]*"[^"]*")*[^"]*$).*$/, '')))
    .filter((l) => l.trim());
  const scalar = (s) => {
    s = s.trim();
    if (/^\[.*\]$/.test(s)) return s.slice(1, -1).split(',').map((x) => x.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
    if (/^\{.*\}$/.test(s)) { // flow map: { a: 1, b: two words, c: [x, y] } — commas split only before "key:"
      const o = {};
      for (const part of s.slice(1, -1).split(/,\s*(?=[\w-]+:\s)/)) { const m = part.trim().match(/^([\w-]+):\s*(.*)$/); if (m) o[m[1]] = scalar(m[2]); }
      return o;
    }
    if (s === 'null' || s === '') return null; if (s === 'true') return true; if (s === 'false') return false;
    if (/^-?\d+(\.\d+)?$/.test(s)) return Number(s);
    return s.replace(/^["']|["']$/g, '');
  };
  let i = 0;
  const indentOf = (l) => l.match(/^\s*/)[0].length;
  function block(indent) {
    const isList = /^\s*-(\s|$)/.test(lines[i]);
    const out = isList ? [] : {};
    while (i < lines.length) {
      const l = lines[i]; const ind = indentOf(l); if (ind < indent) break;
      if (ind > indent) throw new Error('yaml: unexpected indent at: ' + l.trim());
      if (isList) {
        if (!/^\s*-(\s|$)/.test(l)) break;
        const rest = l.replace(/^\s*-\s*/, '');
        if (/^[\w-]+:(\s|$)/.test(rest)) { lines[i] = ' '.repeat(ind + 2) + rest; out.push(block(ind + 2)); }
        else { out.push(scalar(rest)); i++; }
      } else {
        const m = l.match(/^\s*([\w-]+):\s*(.*)$/); if (!m) break;
        i++;
        if (m[2].trim() === '>' || m[2].trim() === '|') { // folded / literal block scalar
          const parts = []; while (i < lines.length && indentOf(lines[i]) > ind) parts.push(lines[i++].trim());
          out[m[1]] = parts.join(m[2].trim() === '>' ? ' ' : '\n'); continue;
        }
        if (m[2].trim() === '[]') out[m[1]] = [];
        else if (m[2].trim()) out[m[1]] = scalar(m[2]);
        else if (i < lines.length && indentOf(lines[i]) > ind) out[m[1]] = block(indentOf(lines[i]));
        else out[m[1]] = null;
      }
    }
    return out;
  }
  return block(0);
}
