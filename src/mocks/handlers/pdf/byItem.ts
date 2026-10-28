import { http, HttpResponse } from 'msw';
import type { RequestHandler } from 'msw';
import { flooringItems, selectFlooringItems, totalsFor, type FlooringItem } from '../../flooringDemo';
import { flooringRequestFilters } from '../../flooringDemo/requestScope';
import plans from '../../pdfData/PL-plans.json';

/**
 * By Item endpoints backed by src/mocks/pdfData/BI-items.json (72 flooring items).
 *
 * Serves the live `/v1/plans/by-item/*` contracts: visual-view (cards), table-data (rows),
 * summary (KPI + recommendation cards) and recommendation (keep / drop / mandatory / clear).
 * Overrides live in memory per plan, so a refetch after a write reflects it while the system
 * verdict (`aiRecommendation`) stays recoverable through `clear`.
 */

type Verdict = 'keep' | 'drop';

type BiItem = FlooringItem;

const ITEMS = flooringItems;
const ITEM_BY_ARTICLE = new Map(ITEMS.map((item) => [item.article, item]));
const PLAN_SEASON = '78';
const REFERENCE_SEASON = '74';
const PLAN_SEASON_LABEL = 'SS26';
const REFERENCE_SEASON_LABEL = 'SS25';
const DEFAULT_PAGE_SIZE = 100;
const OPTIONS: Verdict[] = ['keep', 'drop'];

/* ------------------------------------------------------------------------------------------ */
/* Override state                                                                              */
/* ------------------------------------------------------------------------------------------ */

interface PlanOverrides {
  reco: Map<string, Verdict>;
  mandatory: Set<string>;
}

const overridesByPlan = new Map<string, PlanOverrides>();

function overridesFor(planCode: string): PlanOverrides {
  let state = overridesByPlan.get(planCode);
  if (state === undefined) {
    state = { reco: new Map(), mandatory: new Set() };
    overridesByPlan.set(planCode, state);
  }
  return state;
}

/** Clears every override written so far (for tests). */
export function resetPdfByItemOverrides(): void {
  overridesByPlan.clear();
}

interface ItemState {
  effective: Verdict;
  overridden: boolean;
  mandatory: boolean;
  source: 'override' | 'verdict';
}

function toVerdict(value: string): Verdict {
  return value === 'drop' ? 'drop' : 'keep';
}

function stateOf(planCode: string, item: BiItem): ItemState {
  const overrides = overridesFor(planCode);
  const picked = overrides.reco.get(item.article);
  return {
    effective: picked ?? toVerdict(item.aiVerdict),
    overridden: picked !== undefined,
    mandatory: item.mandatory || overrides.mandatory.has(item.article),
    source: picked !== undefined ? 'override' : 'verdict',
  };
}

/* ------------------------------------------------------------------------------------------ */
/* Request helpers                                                                             */
/* ------------------------------------------------------------------------------------------ */

type Json = Record<string, unknown>;

async function readBody(request: Request): Promise<Json> {
  const body: unknown = await request.json().catch(() => null);
  return typeof body === 'object' && body !== null ? (body as Json) : {};
}

function asRecord(value: unknown): Json {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    ? (value as Json)
    : {};
}

function toStringList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((v): v is string => typeof v === 'string');
  }
  return typeof value === 'string' && value.length > 0 ? [value] : [];
}

function planSeasonCodes(planCode: string): { plan: string; reference: string } {
  const plan = (plans.data as Array<{ planCode: string; planSeasonCode: number; referenceSeasonCode: number }>).find(
    (p) => p.planCode === planCode,
  );
  return plan
    ? { plan: String(plan.planSeasonCode), reference: String(plan.referenceSeasonCode) }
    : { plan: PLAN_SEASON, reference: REFERENCE_SEASON };
}

/** Item properties a filter or sort key can address, keyed by lowercase alias. */
const FIELD_ALIASES: Record<string, keyof BiItem> = {
  article: 'article',
  styleid: 'styleId',
  colorid: 'colorId',
  name: 'name',
  styledescription: 'name',
  stylename: 'styleName',
  l0_name: 'l0_name',
  l1_name: 'l1_name',
  l2_name: 'l2_name',
  department: 'l1_name',
  category: 'l1_name',
  subcategory: 'l2_name',
  division: 'l0_name',
  brand: 'brand',
  species: 'species',
  finish: 'finish',
  colour: 'colour',
  color: 'colour',
  revenue: 'revenue',
  'sls$': 'revenue',
  units: 'units',
  qty_sold: 'units',
  slsu: 'units',
  buy_units: 'buyUnits',
  buyunits: 'buyUnits',
  'buy-$': 'buyDollars',
  buy_dollars: 'buyDollars',
  aur: 'aur',
  gross_margin: 'grossMargin',
  'gm$': 'grossMargin',
  gross_margin_pct: 'gmPct',
  'gm%': 'gmPct',
  gm: 'gmPct',
  mark_down_pct: 'mdPct',
  'md%': 'mdPct',
  md: 'mdPct',
  sell_thru_pct: 'stPct',
  'st%': 'stPct',
  st: 'stPct',
  sell_thru_eop_pct: 'stEopPct',
  ros: 'ros',
  woh: 'woh',
  r4_sales:'r4Sales',r13_sales:'r13Sales',r52_sales:'r52Sales',
  sales_per_sq_ft:'salesPerSqFt',plr_baseline:'plrBaseline',ly_revenue:'lyRevenue',plan_revenue:'planRevenue',
};

function fieldFor(key: string): keyof BiItem | undefined {
  return FIELD_ALIASES[key.trim().toLowerCase()];
}

interface Criteria {
  recommendation: 'all' | Verdict;
  /** Allowed values per item property. */
  include: Map<keyof BiItem, Set<string>>;
  /** Excluded values per item property (hierarchy `select_all` with `except`). */
  exclude: Map<keyof BiItem, Set<string>>;
}

const RESERVED_FILTER_KEYS = new Set([
  'planCode',
  'recommendation',
  'cursor',
  'pageSize',
  'hierarchyScope',
  'sort',
  'sorts',
  'sortBy',
  'sortOrder',
  'sortDirection',
  'search',
]);

function addTo(map: Map<keyof BiItem, Set<string>>, field: keyof BiItem, values: string[]): void {
  const set = map.get(field) ?? new Set<string>();
  values.forEach((v) => set.add(v.toLowerCase()));
  map.set(field, set);
}

function criteriaFrom(filters: Json): Criteria {
  const recommendation =
    filters.recommendation === 'keep' || filters.recommendation === 'drop'
      ? filters.recommendation
      : 'all';
  const include = new Map<keyof BiItem, Set<string>>();
  const exclude = new Map<keyof BiItem, Set<string>>();

  // Flat filters: `l1_name: ['Hardwood']`, `brand: 'Bruce'`, ...
  for (const [key, value] of Object.entries(filters)) {
    if (RESERVED_FILTER_KEYS.has(key)) continue;
    const field = fieldFor(key);
    const values = toStringList(value);
    if (field !== undefined && values.length > 0) addTo(include, field, values);
  }

  // Hierarchy recipes are resolved once by selectFlooringItems before recommendation filtering.

  return { recommendation, include, exclude };
}

function matches(planCode: string, item: BiItem, criteria: Criteria): boolean {
  if (criteria.recommendation !== 'all' && stateOf(planCode, item).effective !== criteria.recommendation) {
    return false;
  }
  for (const [field, allowed] of criteria.include) {
    if (!allowed.has(String(item[field]).toLowerCase())) return false;
  }
  for (const [field, blocked] of criteria.exclude) {
    if (blocked.has(String(item[field]).toLowerCase())) return false;
  }
  return true;
}

interface SortSpec {
  field: keyof BiItem;
  desc: boolean;
}

/** Reads `sort` / `sorts` / `sortBy`+`sortOrder` from the body or its filters, as far as they appear. */
function sortFrom(body: Json, filters: Json): SortSpec[] {
  const specs: SortSpec[] = [];
  const push = (key: unknown, dir: unknown): void => {
    if (typeof key !== 'string') return;
    const field = fieldFor(key);
    if (field === undefined) return;
    const d = typeof dir === 'string' ? dir.toLowerCase() : 'asc';
    specs.push({ field, desc: d === 'desc' || d === 'descending' || d === '-1' });
  };
  for (const source of [body, filters]) {
    for (const key of ['sort', 'sorts', 'sortModel']) {
      const value = source[key];
      const list = Array.isArray(value) ? value : value === undefined ? [] : [value];
      for (const raw of list) {
        if (typeof raw === 'string') {
          push(raw.replace(/^-/, ''), raw.startsWith('-') ? 'desc' : 'asc');
        } else {
          const entry = asRecord(raw);
          push(entry.field ?? entry.colId ?? entry.key ?? entry.column, entry.direction ?? entry.order ?? entry.sort);
        }
      }
    }
    push(source.sortBy, source.sortOrder ?? source.sortDirection);
  }
  return specs;
}

function sortItems(items: BiItem[], specs: SortSpec[]): BiItem[] {
  if (specs.length === 0) return items;
  return [...items].sort((a, b) => {
    for (const { field, desc } of specs) {
      const av = a[field];
      const bv = b[field];
      const cmp =
        typeof av === 'number' && typeof bv === 'number'
          ? av - bv
          : String(av).localeCompare(String(bv));
      if (cmp !== 0) return desc ? -cmp : cmp;
    }
    return 0;
  });
}

/** Opaque keyset token: `o:<offset>`. A bare number is accepted too. */
function parseCursor(cursor: unknown): number {
  if (typeof cursor !== 'string' || cursor.length === 0) return 0;
  const n = Number(cursor.startsWith('o:') ? cursor.slice(2) : cursor);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
}

function page(
  all: BiItem[],
  filters: Json,
): { slice: BiItem[]; pagination: { cursor: string; pageSize: number; hasMore: boolean; totalCount: number } } {
  const size =
    typeof filters.pageSize === 'number' && filters.pageSize > 0
      ? Math.floor(filters.pageSize)
      : DEFAULT_PAGE_SIZE;
  const start = parseCursor(filters.cursor);
  const end = start + size;
  const hasMore = end < all.length;
  return {
    slice: all.slice(start, end),
    pagination: {
      cursor: hasMore ? `o:${end}` : '',
      pageSize: size,
      hasMore,
      totalCount: all.length,
    },
  };
}

function selectItems(body: Json): { planCode: string; filters: Json; items: BiItem[] } {
  const filters = asRecord(body.filters);
  const planCode = typeof filters.planCode === 'string' ? filters.planCode : 'PLAN-KB-001';
  const criteria = criteriaFrom(filters);
  const filtered = selectFlooringItems(flooringRequestFilters(body)).filter((item) => matches(planCode, item, criteria));
  return { planCode, filters, items: sortItems(filtered, sortFrom(body, filters)) };
}

/* ------------------------------------------------------------------------------------------ */
/* Cell / card builders                                                                        */
/* ------------------------------------------------------------------------------------------ */

const SWATCH: Record<string, string> = {
  Espresso: '#4a3426',
  Natural: '#d9b88a',
  Honey: '#c98f3f',
  Driftwood: '#a89a8a',
  Ash: '#c9c3b8',
  Walnut: '#6b4a32',
  Chestnut: '#8a5a38',
  'Smoke Gray': '#8c8c8c',
};

/** Small plank-pattern SVG in the item's colourway; the PDF carries no photography. */
function placeholderImage(item: BiItem): string {
  return item.imageUrl;
}

function signed(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  return `${rounded > 0 ? '+' : ''}${rounded}%`;
}

function sentimentOf(delta: number): 'positive' | 'negative' | 'neutral' {
  if (delta > 0) return 'positive';
  if (delta < 0) return 'negative';
  return 'neutral';
}

interface MetricDef {
  field: string;
  name: string;
  label: string;
  format: string;
  value: (item: BiItem) => number;
  /** Growth vs LY (percent) when the data carries one. */
  growth?: (item: BiItem) => number;
  growthMetric?: string;
}

const FMT_INT = '0,0';
const FMT_USD = '$0,0';
const FMT_USD2 = '$0,0.00';
const FMT_PCT = '0.0%';

/** Table columns, in display order. */
const TABLE_METRICS: MetricDef[] = [
  { field: 'buy_units', name: 'buy_units', label: 'Buy Units', format: FMT_INT, value: (i) => i.buyUnits },
  { field: 'buy-$', name: 'buy-$', label: 'Buy $', format: FMT_USD, value: (i) => i.buyDollars },
  {
    field: 'qty_sold',
    name: 'qty_sold',
    label: 'SlsU',
    format: FMT_INT,
    value: (i) => i.units,
  },
  {
    field: 'revenue',
    name: 'revenue',
    label: 'Sls$',
    format: FMT_USD,
    value: (i) => i.revenue,
    growth: (i) => i.growthVsLy,
    growthMetric: 'vs LY',
  },
  {field:'ly_revenue',name:'ly_revenue',label:'LY sales $',format:FMT_USD,value:i=>i.lyRevenue},
  {field:'plan_revenue',name:'plan_revenue',label:'Plan sales $ · synthetic',format:FMT_USD,value:i=>i.planRevenue},
  {field:'plr_baseline',name:'plr_baseline',label:'PLR baseline $ · definition TBC',format:FMT_USD,value:i=>i.plrBaseline},
  {field:'r4_sales',name:'r4_sales',label:'R4 sales $ · definition TBC',format:FMT_USD,value:i=>i.r4Sales},
  {field:'r13_sales',name:'r13_sales',label:'R13 sales $ · definition TBC',format:FMT_USD,value:i=>i.r13Sales},
  {field:'r52_sales',name:'r52_sales',label:'R52 sales $ · definition TBC',format:FMT_USD,value:i=>i.r52Sales},
  {field:'sales_per_sq_ft',name:'sales_per_sq_ft',label:'Sales / sq ft · definition TBC',format:FMT_USD2,value:i=>i.salesPerSqFt},
  { field: 'aur', name: 'aur', label: 'AUR', format: FMT_USD2, value: (i) => i.aur },
  { field: 'gross_margin', name: 'gross_margin', label: 'GM$', format: FMT_USD, value: (i) => i.grossMargin },
  { field: 'gross_margin_pct', name: 'gross_margin_pct', label: 'GM%', format: FMT_PCT, value: (i) => i.gmPct },
  { field: 'mark_down_pct', name: 'mark_down_pct', label: 'MD%', format: FMT_PCT, value: (i) => i.mdPct },
  { field: 'ros', name: 'ros', label: 'ROS', format: '0,0.00', value: (i) => i.ros },
  {
    field: 'sell_thru_pct',
    name: 'sell_thru_pct',
    label: 'ST%',
    format: FMT_PCT,
    value: (i) => i.stPct,
    growth: (i) => i.stGrowthVsLy,
    growthMetric: 'vs LY',
  },
  { field: 'sell_thru_eop_pct', name: 'sell_thru_eop_pct', label: 'ST EOP', format: FMT_PCT, value: (i) => i.stEopPct },
  { field: 'woh', name: 'woh', label: 'WOH', format: FMT_INT, value: (i) => i.woh },
];

function tableCell(def: MetricDef, item: BiItem): Json {
  const cell: Json = { name: def.name, label: def.label, value: def.value(item), format: def.format };
  const ratioBasis:Record<string,{numerator:number;denominator:number;multiplier:number}>={
    gross_margin_pct:{numerator:item.grossMargin,denominator:item.revenue,multiplier:100},
    sell_thru_pct:{numerator:item.units,denominator:item.buyUnits,multiplier:100},
    sell_thru_eop_pct:{numerator:item.units,denominator:item.buyUnits,multiplier:100},
    sales_per_sq_ft:{numerator:item.revenue,denominator:item.allocatedAreaSqFt,multiplier:1},
    aur:{numerator:item.revenue,denominator:item.units,multiplier:1},
    ros:{numerator:item.units,denominator:26*45,multiplier:1},
  };
  if(ratioBasis[def.field])cell.aggregation=ratioBasis[def.field];
  if (def.growth !== undefined) {
    const delta = def.growth(item);
    cell.change = {
      value: delta,
      label: signed(delta),
      metric: def.growthMetric ?? def.label,
      status: sentimentOf(delta),
    };
  }
  return cell;
}

function workingPlanCell(planCode: string, item: BiItem): Json {
  const state = stateOf(planCode, item);
  return {
    value: state.effective,
    options: OPTIONS,
    editable: true,
    overridden: state.overridden,
    mandatory: state.mandatory,
    staleBasis: null,
    source: state.source,
  };
}

function aiCell(item: BiItem): Json {
  return { value: item.aiVerdict, narration: item.narration };
}

function tableRow(planCode: string, item: BiItem): Json {
  const row: Json = {
    article: { value: item.article },
    productId: { value: item.styleId },
    styleId: { value: item.styleId },
    colorId: { value: item.colorId },
    styleDescription: {
      value: item.name,
      image: { url: placeholderImage(item), alt: `${item.name} · illustrative flooring swatch` },
    },
    department: { value: item.l1_name ?? '' },
    l0_name: { value: item.l0_name ?? 'Flooring' },
    l1_name: { value: item.l1_name ?? '' },
    l2_name: { value: item.l2_name ?? '' },
  };
  for (const def of TABLE_METRICS) row[def.field] = tableCell(def, item);
  row.aiRecommendation = aiCell(item);
  row.workingPlan = workingPlanCell(planCode, item);
  return row;
}

function kpi(
  name: string,
  label: string,
  value: number,
  format: string,
  growth?: number,
  basis = 'vs LY',
): Json {
  const out: Json = { name, key: name, label, value, format };
  if (growth !== undefined) {
    out.comparison = {
      basis,
      label: basis,
      delta: growth,
      deltaUnit: '%',
      sentiment: sentimentOf(growth),
    };
  }
  return out;
}

function visualItem(planCode: string, item: BiItem): Json {
  const state = stateOf(planCode, item);
  const wp = workingPlanCell(planCode, item);
  return {
    product: {
      id: item.styleId,
      article: item.article,
      styleId: item.styleId,
      colorId: item.colorId,
      style: item.styleName ?? item.name,
      color: item.colour,
      name: item.name,
      category: item.l1_name ?? '',
      imageUrl: placeholderImage(item),
      hasAiInsight: true,
      showImage: true,
    },
    kpisFront: [
      kpi('buy_units', 'Buy Units', item.buyUnits, FMT_INT),
      kpi('slsu', 'SlsU', item.units, FMT_INT, item.unitsGrowthVsLy),
    ],
    kpisBack: [
      kpi('slsu', 'Units', item.units, FMT_INT, item.unitsGrowthVsLy),
      kpi('sls$', 'Revenue', item.revenue, FMT_USD, item.growthVsLy),
      kpi('gm%', 'GM%', item.gmPct, FMT_PCT),
      kpi('md%', 'MD%', item.mdPct, FMT_PCT),
      kpi('woh', 'WOH', item.woh, FMT_INT),
      kpi('st%', 'ST%', item.stPct, FMT_PCT, item.stGrowthVsLy),
    ],
    recommendation: {
      id: 'recommendation',
      type: 'dropdown',
      label: 'Recommendation',
      selected: state.effective,
      clearable: state.overridden,
      overridden: state.overridden,
      mandatory: state.mandatory,
      staleBasis: null,
      source: state.source,
      options: [
        { value: 'keep', label: 'Keep' },
        { value: 'drop', label: 'Drop' },
      ],
    },
    aiRecommendation: aiCell(item),
    workingPlan: wp,
  };
}

/* ------------------------------------------------------------------------------------------ */
/* Summary                                                                                     */
/* ------------------------------------------------------------------------------------------ */

function sum(items: BiItem[], pick: (item: BiItem) => number): number {
  return items.reduce((acc, item) => acc + pick(item), 0);
}

function round(value: number, places = 2): number {
  const f = 10 ** places;
  return Math.round(value * f) / f;
}

/** Summary stat with a LY comparison derived from per-item growth. */
function summaryKpi(
  name: string,
  label: string,
  format: string,
  unit: string,
  value: number,
  compareValue: number | null,
  seasons: { plan: string; reference: string },
): Json {
  let comparison: Json[] | null = null;
  if (compareValue !== null && compareValue !== 0) {
    const delta = round(((value - compareValue) / Math.abs(compareValue)) * 100, 1);
    comparison = [
      {
        baseLabel: PLAN_SEASON_LABEL,
        baseSeasonCode: seasons.plan,
        baseValue: round(value),
        compareLabel: REFERENCE_SEASON_LABEL,
        compareSeasonCode: seasons.reference,
        compareValue: round(compareValue),
        delta,
        deltaUnit: '%',
        direction: delta > 0 ? 'up' : delta < 0 ? 'down' : 'flat',
        availability: 'available',
      },
    ];
  }
  return { name, key: name, label, variant: 'stat', value: round(value), format, unit, comparison };
}

function buildSummary(planCode: string, source: string, items:BiItem[]): Json {
  const seasons = planSeasonCodes(planCode);
  const totals=totalsFor(items),revenue=totals.sales,units=totals.units,lyRevenue=totals.lyRevenue,lyUnits=totals.lyUnits,gm=totals.grossMargin;

  const counts: Record<Verdict, number> = { keep: 0, drop: 0 };
  for (const item of items) {
    const verdict = source === 'ai' ? toVerdict(item.aiVerdict) : stateOf(planCode, item).effective;
    counts[verdict] += 1;
  }

  return {
    planCode,
    referenceSeasonCode: seasons.reference,
    planSeasonCode: seasons.plan,
    cards: {
      planCode,
      referenceSeasonCode: seasons.reference,
      kpis: [
        summaryKpi('sls$', 'Sls$', '$0,0.0a', '$', revenue, lyRevenue, seasons),
        summaryKpi('slsu', 'SlsU', '0,0.0a', 'number', units, lyUnits, seasons),
        summaryKpi('buy_units', 'Buy Units', '0,0.0a', 'number', totals.buyUnits, null, seasons),
        summaryKpi('gm$', 'GM $', '$0,0.0a', '$', gm, null, seasons),
        summaryKpi('gm%', 'GM%', FMT_PCT, 'percent', revenue === 0 ? 0 : (gm / revenue) * 100, null, seasons),
        summaryKpi('st%', 'ST%', FMT_PCT, 'percent', totals.sellThroughPct, null, seasons),
      ],
      recommendation: {
        key: 'recommendations',
        label: 'Recommendations',
        variant: 'breakdown',
        source,
        items: [
          {
            key: 'keep',
            value: counts.keep,
            formattedValue: String(counts.keep),
            badge: { text: 'Keep', color: 'green' },
          },
          {
            key: 'drop',
            value: counts.drop,
            formattedValue: String(counts.drop),
            badge: { text: 'Drop', color: 'red' },
          },
        ],
      },
    },
  };
}

/* ------------------------------------------------------------------------------------------ */
/* Handlers                                                                                    */
/* ------------------------------------------------------------------------------------------ */

function envelope(data: unknown): Response {
  return HttpResponse.json({ status: true, message: 'Successful', data });
}

function rejection(errorMessage: string): Response {
  return HttpResponse.json(
    { errorCode: 'BAD_REQUEST', errorDescription: errorMessage, errorMessage },
    { status: 400 },
  );
}

function overrideItem(planCode: string, item: BiItem): Json {
  const state = stateOf(planCode, item);
  return {
    article: item.article,
    effectiveReco: state.effective,
    overridden: state.overridden,
    mandatory: state.mandatory,
    staleBasis: false,
    source: state.source,
    workingPlan: {
      value: state.effective,
      options: OPTIONS,
      editable: true,
      overridden: state.overridden,
    },
    aiRecommendation: aiCell(item),
  };
}

export const pdfByItemHandlers: RequestHandler[] = [
  http.post('*/v1/plans/by-item/visual-view', async ({ request }) => {
    const body = await readBody(request);
    const { planCode, filters, items } = selectItems(body);
    const { slice, pagination } = page(items, filters);
    const seasons = planSeasonCodes(planCode);
    return envelope({
      planCode,
      referenceSeasonCode: seasons.reference,
      planSeasonCode: seasons.plan,
      items: slice.map((item) => visualItem(planCode, item)),
      pagination,
    });
  }),

  http.post('*/v1/plans/by-item/table-data', async ({ request }) => {
    const body = await readBody(request);
    const { planCode, filters, items } = selectItems(body);
    const { slice, pagination } = page(items, filters);
    const seasons = planSeasonCodes(planCode);
    return envelope({
      planCode,
      referenceSeasonCode: seasons.reference,
      planSeasonCode: seasons.plan,
      rowData: slice.map((item) => tableRow(planCode, item)),
      pagination,
    });
  }),

  http.post('*/v1/plans/by-item/summary', async ({ request }) => {
    const body = await readBody(request);
    const planCode = typeof body.planCode === 'string' ? body.planCode : 'PLAN-KB-001';
    const source = typeof body.recommendationSource === 'string' ? body.recommendationSource : 'ai';
    return envelope(buildSummary(planCode, source, selectFlooringItems(flooringRequestFilters(body))));
  }),

  http.post('*/v1/plans/by-item/recommendation', async ({ request }) => {
    const body = await readBody(request);
    const planCode = typeof body.planCode === 'string' ? body.planCode : '';
    const keep = toStringList(body.keep);
    const drop = toStringList(body.drop);
    const mandatory = toStringList(body.mandatory);
    const clear = toStringList(body.clear);

    if (planCode.length === 0) return rejection('planCode is required');
    if (keep.length + drop.length + mandatory.length + clear.length === 0) {
      return rejection('at least one article required in keep, drop, mandatory, or clear');
    }
    const both = keep.find((article) => drop.includes(article));
    if (both !== undefined) return rejection(`article ${both} appears in both keep and drop`);

    const overrides = overridesFor(planCode);
    const touched: string[] = [];
    const apply = (articles: string[], action: (article: string) => void): void => {
      for (const article of articles) {
        if (!ITEM_BY_ARTICLE.has(article)) continue;
        action(article);
        if (!touched.includes(article)) touched.push(article);
      }
    };
    apply(keep, (a) => overrides.reco.set(a, 'keep'));
    apply(drop, (a) => overrides.reco.set(a, 'drop'));
    apply(mandatory, (a) => overrides.mandatory.add(a));
    apply(clear, (a) => overrides.reco.delete(a));

    const seasons = planSeasonCodes(planCode);
    return HttpResponse.json({
      status: true,
      message: 'Successful',
      data: {
        planCode,
        referenceSeasonCode: seasons.reference,
        planSeasonCode: seasons.plan,
        items: touched.map((article) => overrideItem(planCode, ITEM_BY_ARTICLE.get(article) as BiItem)),
      },
    });
  }),
];
