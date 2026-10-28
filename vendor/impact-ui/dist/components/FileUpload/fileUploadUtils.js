function toCamelCase(value) {
  return value.trim().split(/\s+/).map((word, index) => {
    const lower = word.toLowerCase();
    if (index === 0) return lower;
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  }).join("");
}
function toCamelCaseLabels(labels) {
  return (labels ?? []).map((label) => toCamelCase(label));
}
export {
  toCamelCase,
  toCamelCaseLabels
};
