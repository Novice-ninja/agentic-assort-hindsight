// The deployed bundle imports only this helper from the retired icon-tab component.
export function displayLabel(value: string, id: string): string {
  if (id === 'brand') return 'Brands';
  if (id === 'colour') return 'Color';
  if (id === 'sleeve-length') return 'Sleeve Length';
  return value;
}
