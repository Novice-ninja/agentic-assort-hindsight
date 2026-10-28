import type {
  AgentChartData,
  AgentChartKind,
  AgentChartSeries,
  AgentFileData,
  AgentResult,
  AgentTableColumn,
  AgentTableData,
  AgentValueFormat,
} from './types';

const EMPTY_TEXT: AgentResult = { content_type: 'text', data: '' };

const EMPTY_CHART: AgentChartData = {
  kind: 'column',
  title: '',
  categories: [],
  series: [],
};

const EMPTY_TABLE: AgentTableData = {
  columns: [],
  rows: [],
};

const CHART_KINDS = new Set<AgentChartKind>([
  'column',
  'bar',
  'line',
  'area',
  'pie',
  'heatmap',
]);

const VALUE_FORMATS = new Set<AgentValueFormat>(['number', 'currency', 'percent']);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function asPlotValue(value: unknown): number | null {
  if (value === null) return null;
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function asFormat(value: unknown): AgentValueFormat | undefined {
  return typeof value === 'string' && VALUE_FORMATS.has(value as AgentValueFormat)
    ? (value as AgentValueFormat)
    : undefined;
}

function contentTypeOf(value: Record<string, unknown>): string {
  const raw = value.content_type ?? value.type;
  return typeof raw === 'string' ? raw.trim().toLowerCase() : '';
}

function parseChartSeries(value: unknown): AgentChartSeries[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((entry) => {
    if (!isRecord(entry)) return [];
    const values = Array.isArray(entry.values) ? entry.values.map(asPlotValue) : [];
    return [{ name: asString(entry.name), values }];
  });
}

function parseChartData(value: unknown): AgentChartData {
  if (!isRecord(value)) return { ...EMPTY_CHART };

  const kindRaw = asString(value.kind);
  const kind = CHART_KINDS.has(kindRaw as AgentChartKind)
    ? (kindRaw as AgentChartKind)
    : EMPTY_CHART.kind;

  const categories = Array.isArray(value.categories)
    ? value.categories.filter((item): item is string => typeof item === 'string')
    : [];

  const format = asFormat(value.format);
  const stacked = value.stacked === true ? true : undefined;

  return {
    kind,
    title: asString(value.title),
    categories,
    series: parseChartSeries(value.series),
    ...(format !== undefined ? { format } : {}),
    ...(stacked !== undefined ? { stacked } : {}),
  };
}

function parseTableColumns(value: unknown): AgentTableColumn[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((entry) => {
    if (!isRecord(entry)) return [];
    const key = asString(entry.key);
    if (key.length === 0) return [];
    const format = asFormat(entry.format);
    return [
      {
        key,
        header: asString(entry.header, key),
        ...(format !== undefined ? { format } : {}),
      },
    ];
  });
}

function parseTableRow(value: unknown): Record<string, string | number | null> | null {
  if (!isRecord(value)) return null;
  const row: Record<string, string | number | null> = {};
  for (const [key, cell] of Object.entries(value)) {
    if (typeof cell === 'string' || (typeof cell === 'number' && Number.isFinite(cell))) {
      row[key] = cell;
    } else if (cell === null) {
      row[key] = null;
    }
  }
  return row;
}

function parseTableData(value: unknown): AgentTableData {
  if (!isRecord(value)) return { ...EMPTY_TABLE };

  const title = asString(value.title);
  const rows = Array.isArray(value.rows)
    ? value.rows.flatMap((entry) => {
        const row = parseTableRow(entry);
        return row === null ? [] : [row];
      })
    : [];

  return {
    ...(title.length > 0 ? { title } : {}),
    columns: parseTableColumns(value.columns),
    rows,
  };
}

function filenameFromUrl(url: string): string {
  try {
    const path = url.includes('://') ? new URL(url).pathname : url.split('?')[0] ?? url;
    const segment = path.split('/').filter(Boolean).pop() ?? '';
    return segment.trim();
  } catch {
    return '';
  }
}

/**
 * Requires a non-empty `url`. `filename` falls back to the last path segment, then `download`.
 * `mime` defaults to `application/octet-stream` when omitted.
 */
function parseFileData(value: unknown): AgentFileData | null {
  if (!isRecord(value)) return null;
  const url = asString(value.url).trim();
  if (url.length === 0) return null;

  const filename =
    asString(value.filename).trim() || filenameFromUrl(url) || 'download';
  const mime = asString(value.mime).trim() || 'application/octet-stream';

  return { filename, mime, url };
}

/**
 * Normalises one `{ content_type, data }` block.
 *
 * Accepts the `{ content_type, data }` envelope. `content_type` may also arrive as `type`,
 * and `string` is treated as `text`. A bare string becomes a text block.
 */
export function parseAgentResult(raw: unknown): AgentResult {
  if (typeof raw === 'string') {
    return { content_type: 'text', data: raw };
  }
  if (!isRecord(raw)) return EMPTY_TEXT;

  const contentType = contentTypeOf(raw);

  if (contentType === 'text' || contentType === 'string') {
    return { content_type: 'text', data: asString(raw.data) };
  }
  if (contentType === 'chart') {
    return { content_type: 'chart', data: parseChartData(raw.data) };
  }
  if (contentType === 'table') {
    return { content_type: 'table', data: parseTableData(raw.data) };
  }
  if (contentType === 'file') {
    const data = parseFileData(raw.data);
    // Invalid file payloads collapse to empty text so the list drop keeps the reply clean.
    return data === null ? EMPTY_TEXT : { content_type: 'file', data };
  }

  return EMPTY_TEXT;
}

function isEmptyText(block: AgentResult): boolean {
  return block.content_type === 'text' && block.data.trim().length === 0;
}

/**
 * Normalises `done.result` to a list of blocks.
 *
 * The live contract is an array. A legacy string or a single object is wrapped as one item.
 * Empty text blocks are dropped so a trailing blank entry does not take a slot in the stack.
 */
export function parseAgentResultList(raw: unknown): AgentResult[] {
  if (Array.isArray(raw)) {
    return raw.flatMap((entry) => {
      const block = parseAgentResult(entry);
      return isEmptyText(block) ? [] : [block];
    });
  }

  const block = parseAgentResult(raw);
  return isEmptyText(block) ? [] : [block];
}
