import { excelCurrencyFormat } from './currencyFormat';
import { sanitizeSheetName } from './filename';
import type { ExcelCellValue, ExcelDefinition, ExcelExportColumn, ExcelNumberFormat, ExcelWorkbookSpec } from './types';
import { buildZipStore } from './zipStore';

const STYLE_INDEX: Record<ExcelNumberFormat, number> = {
  text: 0,
  number: 1,
  integer: 2,
  percent: 3,
  currency: 4,
};

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '');
}

function columnLetter(index: number): string {
  let n = index + 1;
  let label = '';
  while (n > 0) {
    const rem = (n - 1) % 26;
    label = String.fromCharCode(65 + rem) + label;
    n = Math.floor((n - 1) / 26);
  }
  return label;
}

function cellRef(column: number, row: number): string {
  return `${columnLetter(column)}${row}`;
}

function styleFor(format: ExcelNumberFormat | undefined): number {
  return STYLE_INDEX[format ?? 'text'];
}

function cellXml(column: number, row: number, value: ExcelCellValue, format?: ExcelNumberFormat): string {
  const ref = cellRef(column, row);
  if (value == null) return `<c r="${ref}"/>`;
  if (typeof value === 'number' && Number.isFinite(value)) {
    return `<c r="${ref}" s="${styleFor(format)}"><v>${value}</v></c>`;
  }
  return `<c r="${ref}" t="inlineStr"><is><t>${escapeXml(String(value))}</t></is></c>`;
}

function headerRowXml(values: readonly (string | undefined)[], row: number): string {
  const cells = values
    .map((value, column) =>
      value === undefined || value.length === 0 ? '' : cellXml(column, row, value, 'text'),
    )
    .join('');
  return `<row r="${row}">${cells}</row>`;
}

/**
 * Consecutive columns that share a groupHeader become one merged top header, matching DataGrid.
 */
export function groupRanges<Row>(columns: readonly ExcelExportColumn<Row>[]): {
  top: Array<string | undefined>;
  merges: string[];
} {
  const top: Array<string | undefined> = columns.map(() => undefined);
  const merges: string[] = [];
  let index = 0;
  while (index < columns.length) {
    const group = columns[index]?.groupHeader;
    if (group === undefined) {
      index += 1;
      continue;
    }
    let end = index;
    while (end + 1 < columns.length && columns[end + 1]?.groupHeader === group) {
      end += 1;
    }
    top[index] = group;
    if (end > index) {
      merges.push(`${cellRef(index, 1)}:${cellRef(end, 1)}`);
    }
    index = end + 1;
  }
  return { top, merges };
}

function sheetXml<Row>(spec: ExcelWorkbookSpec<Row>): string {
  const hasGroups = spec.columns.some((column) => column.groupHeader !== undefined);
  const headerRow = hasGroups ? 2 : 1;
  const { top, merges } = hasGroups
    ? groupRanges(spec.columns)
    : { top: [] as Array<string | undefined>, merges: [] as string[] };

  const rows: string[] = [];
  if (hasGroups) {
    rows.push(headerRowXml(top, 1));
  }
  rows.push(headerRowXml(spec.columns.map((column) => column.header), headerRow));

  spec.rows.forEach((row, rowIndex) => {
    const excelRow = headerRow + 1 + rowIndex;
    const cells = spec.columns
      .map((column, columnIndex) => cellXml(columnIndex, excelRow, column.value(row), column.format))
      .join('');
    rows.push(`<row r="${excelRow}">${cells}</row>`);
  });

  const mergeXml =
    merges.length > 0
      ? `<mergeCells count="${merges.length}">${merges
          .map((ref) => `<mergeCell ref="${ref}"/>`)
          .join('')}</mergeCells>`
      : '';

  return (
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' +
    `<sheetData>${rows.join('')}</sheetData>${mergeXml}</worksheet>`
  );
}

function stylesXml(currencyCode: string): string {
  const currency = escapeXml(excelCurrencyFormat(currencyCode));
  return (
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' +
    '<numFmts count="4">' +
    '<numFmt numFmtId="164" formatCode="#,##0.00"/>' +
    '<numFmt numFmtId="165" formatCode="#,##0"/>' +
    '<numFmt numFmtId="166" formatCode="0.00&quot;%&quot;"/>' +
    `<numFmt numFmtId="167" formatCode="${currency}"/>` +
    '</numFmts>' +
    '<fonts count="1"><font><sz val="11"/><name val="Calibri"/></font></fonts>' +
    '<fills count="1"><fill><patternFill patternType="none"/></fill></fills>' +
    '<borders count="1"><border/></borders>' +
    '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>' +
    '<cellXfs count="5">' +
    '<xf numFmtId="0" fontId="0" fillId="0" borderId="0"/>' +
    '<xf numFmtId="164" fontId="0" fillId="0" borderId="0" applyNumberFormat="1"/>' +
    '<xf numFmtId="165" fontId="0" fillId="0" borderId="0" applyNumberFormat="1"/>' +
    '<xf numFmtId="166" fontId="0" fillId="0" borderId="0" applyNumberFormat="1"/>' +
    '<xf numFmtId="167" fontId="0" fillId="0" borderId="0" applyNumberFormat="1"/>' +
    '</cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>'
  );
}

export function buildWorkbookBytes<Row>(spec: ExcelWorkbookSpec<Row>): Uint8Array {
  const currencyCode = spec.currencyCode ?? 'USD';
  const sheets = [{ name: spec.metadata ? 'Data' : sanitizeSheetName(spec.sheetName), content: sheetXml(spec) }];
  if (spec.metadata) {
    const value = (input: unknown): string | number | boolean | null => input == null ? null : typeof input === 'string' || typeof input === 'number' || typeof input === 'boolean' ? input : JSON.stringify(input);
    // Excel permits 32,767 characters per cell. Preserve large exact-member or
    // saved-view metadata across numbered rows rather than truncating it.
    const metadataRows = (prefix: string, entries: Record<string, unknown>) => Object.entries(entries).flatMap(([field,input]) => {
      const serialized=value(input);
      if(typeof serialized!=='string'||serialized.length<=30000) return [{field:`${prefix}${field}`,value:serialized}];
      const count=Math.ceil(serialized.length/30000);
      return Array.from({length:count},(_,index)=>({field:`${prefix}${field} (part ${index+1}/${count})`,value:serialized.slice(index*30000,(index+1)*30000)}));
    });
    const rows = [
      { field: 'Export', value: spec.fileName },
      { field: 'Exported at', value: new Date().toISOString() },
      { field: 'Exported rows', value: spec.rows.length },
      { field: 'Source', value: spec.metadata.sourceLabel ?? 'Synthetic local preview' },
      { field: 'Source version', value: spec.metadata.sourceVersion ?? 'Not provided' },
      { field: 'Access policy', value: spec.metadata.accessPolicy ?? 'Synthetic preview values; no production access authorization is asserted.' },
      ...metadataRows('',spec.metadata.scope ?? {}),
      ...metadataRows('View: ',spec.metadata.viewState ?? {}),
    ];
    sheets.push({ name: 'Scope', content: sheetXml({ ...spec, rows, columns: [{ id: 'field', header: 'Scope field', value: row => row.field }, { id: 'value', header: 'Value', value: row => row.value }] }) });
    const definitions: readonly ExcelDefinition[] = spec.metadata.definitions ?? [{ label: 'Definition status', definition: 'Synthetic local preview. Definitions require F&D confirmation.', status: 'Definition TBC' }];
    sheets.push({ name: 'Definitions', content: sheetXml({ ...spec, rows: definitions, columns: [{ id: 'id', header: 'Metric ID', value: row => row.id ?? '' }, { id: 'label', header: 'Metric', value: row => row.label }, { id: 'definition', header: 'Definition', value: row => row.definition }, { id: 'unit', header: 'Unit', value: row => row.unit ?? '' }, { id: 'status', header: 'Status', value: row => row.status ?? 'Definition TBC' }, ...(definitions.some(row=>row.sourceAliases!==undefined)?[{id:'aliases',header:'Source aliases',value:(row:typeof definitions[number])=>row.sourceAliases??''},{id:'aggregation',header:'Aggregation guards',value:(row:typeof definitions[number])=>row.aggregation??''},{id:'version',header:'Definition version',value:(row:typeof definitions[number])=>row.version??''}]:[])] }) });
  }
  const usedNames = new Set(sheets.map(sheet => sheet.name.toLowerCase()));
  for (const additional of spec.additionalSheets ?? []) {
    const base = sanitizeSheetName(additional.name);
    let name = base;
    for (let suffix = 2; usedNames.has(name.toLowerCase()); suffix++) name = `${base.slice(0, 27)} ${suffix}`;
    usedNames.add(name.toLowerCase());
    sheets.push({ name, content: sheetXml({ ...spec, rows: additional.rows, columns: additional.columns }) });
  }
  return buildZipStore([
    {
      name: '[Content_Types].xml',
      content:
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
        '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
        '<Default Extension="xml" ContentType="application/xml"/>' +
        '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>' +
        sheets.map((_, index) => `<Override PartName="/xl/worksheets/sheet${index + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join('') +
        '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>' +
        '</Types>',
    },
    {
      name: '_rels/.rels',
      content:
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
        '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>' +
        '</Relationships>',
    },
    {
      name: 'xl/workbook.xml',
      content:
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">' +
        `<sheets>${sheets.map((sheet, index) => `<sheet name="${escapeXml(sheet.name)}" sheetId="${index + 1}" r:id="rId${index + 1}"/>`).join('')}</sheets></workbook>`,
    },
    {
      name: 'xl/_rels/workbook.xml.rels',
      content:
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
        sheets.map((_, index) => `<Relationship Id="rId${index + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${index + 1}.xml"/>`).join('') +
        `<Relationship Id="rId${sheets.length + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>` +
        '</Relationships>',
    },
    ...sheets.map((sheet, index) => ({ name: `xl/worksheets/sheet${index + 1}.xml`, content: sheet.content })),
    { name: 'xl/styles.xml', content: stylesXml(currencyCode) },
  ]);
}
