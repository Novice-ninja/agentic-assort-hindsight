const CURRENCY_EXCEL_FORMAT: Record<string, string> = {
  EUR: '#,##0.00" €"',
  USD: '"$"#,##0.00',
  GBP: '"£"#,##0.00',
};

export function inferCurrencyCode(formatted?: string | null): string {
  if (formatted == null) return 'USD';
  if (formatted.includes('€') || /EUR/i.test(formatted)) return 'EUR';
  if (formatted.includes('£') || /GBP/i.test(formatted)) return 'GBP';
  if (formatted.includes('$') || /USD/i.test(formatted)) return 'USD';
  return 'USD';
}

export function excelCurrencyFormat(currencyCode: string): string {
  return CURRENCY_EXCEL_FORMAT[currencyCode] ?? `"${currencyCode}"#,##0.00`;
}
