/** Join already punctuated insight bullets without creating double full stops. */
export function joinInsightProse(texts: readonly string[]): string {
  return texts.map(text => text.trim().replace(/\.{2,}(?=\s|$)/g, '.'))
    .filter(Boolean)
    .map(text => /[.!?]$/.test(text) ? text : `${text}.`)
    .join(' ');
}
