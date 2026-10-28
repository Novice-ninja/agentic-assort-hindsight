const fs = require('fs');

function loadMappings(mapFile) {
  if (!mapFile) return [];
  try {
    const raw = fs.readFileSync(mapFile, 'utf8');
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (m) =>
        m &&
        typeof m.oldPath === 'string' &&
        typeof m.newPath === 'string' &&
        m.oldPath.length > 0 &&
        m.newPath.length > 0
    );
  } catch {
    return [];
  }
}

module.exports = function transformer(fileInfo, api, options) {
  const j = api.jscodeshift;
  const root = j(fileInfo.source);
  const mappings = loadMappings(options.mapFile);

  if (mappings.length === 0) {
    return fileInfo.source;
  }

  let changed = false;

  const replaceInValue = (value) => {
    if (typeof value !== 'string' || !value.includes('assets/')) return value;
    let next = value;
    for (const { oldPath, newPath } of mappings) {
      if (next.includes(oldPath)) {
        next = next.split(oldPath).join(newPath);
      }
    }
    if (next !== value) changed = true;
    return next;
  };

  root.find(j.Literal).forEach((p) => {
    if (typeof p.node.value !== 'string') return;
    p.node.value = replaceInValue(p.node.value);
  });

  if (j.StringLiteral) {
    root.find(j.StringLiteral).forEach((p) => {
      p.node.value = replaceInValue(p.node.value);
    });
  }

  root.find(j.TemplateLiteral).forEach((p) => {
    if (p.node.expressions.length > 0) return;
    for (const quasi of p.node.quasis) {
      const cooked = quasi.value && typeof quasi.value.cooked === 'string' ? quasi.value.cooked : null;
      const raw = quasi.value && typeof quasi.value.raw === 'string' ? quasi.value.raw : null;
      if (cooked != null) quasi.value.cooked = replaceInValue(cooked);
      if (raw != null) quasi.value.raw = replaceInValue(raw);
    }
  });

  if (!changed) return null;
  return root.toSource({ quote: 'single' });
};

