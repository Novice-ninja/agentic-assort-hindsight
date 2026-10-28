import { http, HttpResponse } from 'msw';
import type { RequestHandler } from 'msw';
import type { PlanDto, PlansApiResponse } from '@modules/planning/api/getPlans';
import type {
  FilterConfigData,
  FilterOption,
  FilterValuesData,
  FilterValuesFilter,
  FilterValuesRequest,
  SeasonYear,
} from '@modules/planning/types';
import type {
  ContributionCardDto,
  HindsightSummaryResponse,
  KpiSeason,
  KpiTrend,
  OverviewRecommendationsPayload,
  ProductContributionResponse,
  ProductPerformanceKpi,
  ProductPerformanceKpisResponse,
  RecommendationProductWire,
  KpiSeasonsResponse,
  TopStyleColorApiProduct,
  TopStyleColorsApiData,
} from '@modules/hindsight/types';
import carryForwardJson from '../../pdfData/OV-carry-forward.json';
import contributionJson from '../../pdfData/OV-contribution.json';
import filterConfigJson from '../../pdfData/FL-filter-config.json';
import filterValuesJson from '../../pdfData/FL-filter-values.json';
import kpisJson from '../../pdfData/OV-kpis.json';
import missedOppsJson from '../../pdfData/OV-missed-opps.json';
import plansJson from '../../pdfData/PL-plans.json';
import seasonSummaryJson from '../../pdfData/OV-season-summary.json';
import seasonsJson from '../../pdfData/PL-seasons.json';
import kpiSeasonsJson from '../../pdfData/OV-seasons.json';
import topStyleColorsJson from '../../pdfData/OV-top-style-colors.json';
import { flooringItems, getFlooringTotals, getFlooringMixRows, getFlooringNarratives, getFlooringInsight, selectFlooringItems, type FlooringFilters } from '../../flooringDemo';
import { flooringRequestFilters } from '../../flooringDemo/requestScope';
import { FALLBACK_GLOBAL_CONFIG } from '@modules/appConfig/fallback/globalConfig';

const OK_MESSAGE = 'Successful';

/** `{ status, data, message }` envelope the Go API wraps its payloads in. */
function envelope<T>(data: T) {
  return { status: true, data, message: OK_MESSAGE };
}

async function readJson<T>(request: Request): Promise<Partial<T>> {
  try {
    return ((await request.json()) ?? {}) as Partial<T>;
  } catch {
    return {};
  }
}

/* -------------------------------------------------------------------------------------------
 * Plans
 * ----------------------------------------------------------------------------------------- */

/** PDF hierarchy labels -> the `levelNo` keys the filter config uses. */
const LEVEL_NO_BY_LABEL: Record<string, string> = {
  Division: 'l0_name',
  Category: 'l1_name',
  'Sub Category': 'l2_name',
};

/** Matches the "(select all)" marker the PDF prints instead of listing every value. */
const SELECT_ALL_PATTERN = /\(select all\)/i;

/** PDF metric fields -> the metric keys the Plans card (`cardMetrics`) reads. */
const PLAN_METRIC_KEYS = [
  ['aur', 'aur'],
  ['buyUnits', 'buy_units'],
  ['gmPct', 'gross_margin_pct'],
  ['grossMargin', 'gross_margin'],
] as const;

type PdfPlan = (typeof plansJson.data)[number];

/** Parses `"Division: A; Category: B, C"` into the structured `hierarchyScope` array. */
function parseHierarchyScope(scope: string): PlanDto['hierarchyScope'] {
  return scope
    .split(';')
    .map((part) => part.trim())
    .filter((part) => part.length > 0)
    .flatMap((part): PlanDto['hierarchyScope'] => {
      const separator = part.indexOf(':');
      if (separator < 0) return [];
      const levelName = part.slice(0, separator).trim();
      const levelNo = LEVEL_NO_BY_LABEL[levelName];
      if (levelNo === undefined) return [];
      const values = part
        .slice(separator + 1)
        .split(',')
        .map((value) => value.trim())
        .filter((value) => value.length > 0);
      if (values.some((value) => SELECT_ALL_PATTERN.test(value))) {
        return [{ levelName, levelNo, select_all: true }];
      }
      return [{ levelName, levelNo, selectedValues: values }];
    });
}

function toPlanDto(plan: PdfPlan): PlanDto {
  const source = plan as unknown as Record<string, number | null | undefined>;
  return {
    planCode: plan.planCode,
    planName: plan.planName,
    fiscalYear: plan.fiscalYear,
    planSeasonCode: plan.planSeasonCode,
    planSeasonName: plan.planSeason,
    referenceSeasonCode: plan.referenceSeasonCode,
    referenceSeasonName: plan.referenceSeason,
    pipelineMode: plan.pipelineMode,
    thresholdPct: plan.thresholdPct,
    status: plan.status,
    isDeleted: plan.isDeleted,
    hierarchyScope: parseHierarchyScope(plan.hierarchyScope),
    // A draft plan has no computed metrics yet: the PDF prints null, so the slot is omitted.
    metrics: PLAN_METRIC_KEYS.flatMap(([field, key]) => {
      const value = source[field];
      return typeof value === 'number' ? [{ key, value }] : [];
    }),
    createdBy: plan.createdBy,
    createdAt: plan.createdAt,
  };
}

const planDtos: PlanDto[] = plansJson.data.map(toPlanDto);

/** Fiscal years with their trading seasons, as `GET /v1/plans/seasons` nests them. */
function buildSeasonYears(): SeasonYear[] {
  const byYear = new Map<number, SeasonYear>();
  for (const season of seasonsJson.data) {
    const year = byYear.get(season.fiscalYear) ?? { year: season.fiscalYear, seasons: [] };
    year.seasons.push({
      seasonCode: season.seasonCode,
      name: season.season,
      seasonType: season.type,
      seasonStatus: season.active,
      seasonStartDate: season.start,
      seasonEndDate: season.end,
      seasonDisplayName: season.displayName,
    });
    byYear.set(season.fiscalYear, year);
  }
  return [...byYear.values()].sort((a, b) => a.year - b.year);
}

/* -------------------------------------------------------------------------------------------
 * Filters
 * ----------------------------------------------------------------------------------------- */

const PATH_SEPARATOR = '____';

type PdfFilterConfig = (typeof filterConfigJson.data)['default'];

function toFilterConfigData(config: PdfFilterConfig): FilterConfigData {
  return {
    config_hash: config.configHash,
    fields: config.fields.map((field) => ({
      key: field.fieldKey,
      label: field.label,
      dimension: field.dimension,
      type: field.type,
      mandatory: field.mandatory,
      multi_select: field.multiSelect,
    })),
  };
}

const filterConfigs: Record<string, FilterConfigData> = {
  default: toFilterConfigData(filterConfigJson.data.default),
  cluster_config: toFilterConfigData(filterConfigJson.data.cluster_config),
};

/** Option plus the bookkeeping the cascade needs. */
interface PdfFilterOption {
  attribute: string;
  option: FilterOption;
  segments: string[];
}

const productOptionGroups=new Map<string,{attribute:string;value:string;segments:string[];ids:Set<string>}>();
const productLevels=['l0_name','l1_name','l2_name'] as const;
flooringItems.forEach(item=>productLevels.forEach((attribute,index)=>{
  const segments=productLevels.slice(0,index+1).map(key=>item[key]);
  const path=segments.join(PATH_SEPARATOR),groupKey=`${attribute}:${path}`;
  const group=productOptionGroups.get(groupKey)??{attribute,value:item[attribute],segments,ids:new Set<string>()};
  group.ids.add(item.styleId);productOptionGroups.set(groupKey,group);
}));
const filterOptions: PdfFilterOption[] = [...productOptionGroups.values()].map(group=>({
  attribute:group.attribute,segments:group.segments,
  option:{value:group.value,id:group.value,label:group.value,path:group.segments.join(PATH_SEPARATOR),styleCount:group.ids.size},
})).sort((a,b)=>filterValuesJson.data.findIndex(row=>row.attribute===a.attribute&&row.path===a.option.path)-filterValuesJson.data.findIndex(row=>row.attribute===b.attribute&&row.path===b.option.path));
filterOptions.push(...filterValuesJson.data.filter(row=>!productLevels.includes(row.attribute as typeof productLevels[number])).map((row) => ({
  attribute: row.attribute,
  segments: row.path.split(PATH_SEPARATOR),
  option: {
    value: row.value,
    id: row.value,
    label: row.label,
    path: row.path,
    ...('styleCount' in row ? { styleCount: row.styleCount } : {}),
  },
})));

/** Hierarchy depth of each cascaded product field, in config order (`l0_name` -> 0). */
const levelIndexByKey = new Map<string, number>(
  filterConfigs.default.fields
    .filter((field) => field.dimension === 'product' && field.type === 'cascaded')
    .map((field, index) => [field.key, index]),
);

function matchesNeedles(label: string, needles: readonly string[]): boolean {
  const haystack = label.toLowerCase();
  return needles.some((needle) => haystack.includes(needle.toLowerCase()));
}

/** The set of values a filter clause selects at its own level. */
function selectedValuesFor(filter: FilterValuesFilter): Set<string> {
  if (!('select_all' in filter)) return new Set(filter.values);

  const universe = filterOptions.filter((entry) => entry.attribute === filter.key);
  const search = filter.search ?? [];
  const exceptSearch = filter.except_search ?? [];
  const except = new Set(filter.except ?? []);
  const selected = new Set<string>();
  for (const { option } of universe) {
    if (except.has(option.value)) continue;
    if (search.length > 0 && !matchesNeedles(option.label, search)) continue;
    if (exceptSearch.length > 0 && matchesNeedles(option.label, exceptSearch)) continue;
    selected.add(option.value);
  }
  for (const id of filter.include ?? []) selected.add(id);
  return selected;
}

function buildFilterValues(request: Partial<FilterValuesRequest>): FilterValuesData {
  const attributes = request.attributes ?? [];
  const filters = request.filters ?? [];
  const search = request.search?.trim().toLowerCase() ?? '';
  const limit = typeof request.limit === 'number' && request.limit > 0 ? request.limit : 0;
  const offset = limit > 0 ? Math.max(0, request.offset ?? 0) : 0;

  // Ancestor clauses only: a clause at depth k narrows options deeper than k, matching the
  // k-th segment of the option's path. Unrelated dimensions (channel, region) are untouched.
  const clauses = filters
    .map((filter) => ({
      level: levelIndexByKey.get(filter.key),
      allowed: selectedValuesFor(filter),
    }))
    .filter((clause): clause is { level: number; allowed: Set<string> } => clause.level !== undefined);

  const values: Record<string, FilterOption[]> = {};
  const totals: Record<string, number> = {};

  for (const attribute of attributes) {
    const ownLevel = levelIndexByKey.get(attribute);
    const matching = filterOptions
      .filter((entry) => entry.attribute === attribute)
      .filter((entry) =>
        ownLevel === undefined
          ? true
          : clauses.every(
              (clause) => clause.level >= ownLevel || clause.allowed.has(entry.segments[clause.level]),
            ),
      )
      .filter((entry) => search.length === 0 || entry.option.label.toLowerCase().includes(search))
      .map((entry) => entry.option);

    totals[attribute] = matching.length;
    values[attribute] = limit > 0 ? matching.slice(offset, offset + limit) : matching;
  }

  return {
    snapshot_id: request.snapshot_id ?? '',
    config_hash: filterConfigs.default.config_hash,
    values,
    totals,
  };
}

/* -------------------------------------------------------------------------------------------
 * Product performance (Overview KPIs, seasons, contribution)
 * ----------------------------------------------------------------------------------------- */

type PdfKpi = (typeof kpisJson.data)[number];

function toKpi(kpi: PdfKpi): ProductPerformanceKpi {
  return {
    key: kpi.kpi,
    value: kpi.value,
    format: kpi.format,
    trend: kpi.comparisons.map(
      (comparison): KpiTrend => ({
        direction: comparison.direction as KpiTrend['direction'],
        delta: comparison.delta,
        deltaUnit: comparison.unit as KpiTrend['deltaUnit'],
        comparisonLabel: comparison.label,
        sentiment: comparison.sentiment as KpiTrend['sentiment'],
      }),
    ),
  };
}
function flooringKpis(filters:FlooringFilters):ProductPerformanceKpi[] {
  const t=getFlooringTotals(filters);
  const rows:[string,number,string,number?][]=[
    ['revenue',t.sales,'$0.0a',t.lyRevenue?((t.sales-t.lyRevenue)/t.lyRevenue*100):0],
    ['qty_sold',t.units,'0,0',t.lyUnits?((t.units-t.lyUnits)/t.lyUnits*100):0],
    ['aur',t.units?t.sales/t.units:0,'$0,0.00'],['gross_margin',t.grossMargin,'$0.0a'],
    ['gross_margin_pct',t.gmPct/100,'0.0%'],['option_count',t.itemCount,'0,0'],
    ['sell_thru_pct',t.sellThroughPct/100,'0.0%'],['buy_units',t.buyUnits,'0,0'],['mark_down_pct',.12,'0.0%'],
  ];
  return rows.map(([key,value,format,delta])=>({key,value,format,trend:delta===undefined?[]:[{direction:delta>0?'up':delta<0?'down':'flat',delta:Math.abs(delta),deltaUnit:'percent',comparisonLabel:'vs LY',sentiment:delta>=0?'positive':'negative'}]}));
}

const kpiSeasons: KpiSeason[] = kpiSeasonsJson.data.map((season) => ({
  seasonCode: season.seasonCode,
  name: season.name,
  seasonType: season.type,
  seasonStatus: season.active,
  year: season.year,
  seasonStartDate: season.start,
  seasonEndDate: season.end,
  seasonDisplayName: season.display,
}));

/** Segments the backend keeps before folding the rest into `others`. */
const CONTRIBUTION_TOP_N = 5;

const contributionCards: ContributionCardDto[] = contributionJson.data.map((card) => ({
  dimension: card.dimension,
  title: card.cardTitle,
  insight: { available: card.aiInsight.length > 0, text: card.aiInsight },
  segments: card.segments.map((segment) => ({
    id: segment.id,
    label: segment.name,
    percentage: segment.sharePct,
  })),
}));
function flooringContributionCards(filters:FlooringFilters):ContributionCardDto[] {
  return contributionJson.data.map(card=>({dimension:card.dimension,title:card.cardTitle,
    insight:{available:true,text:getFlooringInsight(card.dimension,filters).join(' ')},
    segments:getFlooringMixRows(card.dimension,filters).map(r=>({id:r.name.toLowerCase().replaceAll(' ','-'),label:r.name,percentage:r.salesShare}))}));
}

/* -------------------------------------------------------------------------------------------
 * Overview recommendations and top style-colors
 * ----------------------------------------------------------------------------------------- */

const DEFAULT_PAGE_SIZE = 4;
const MAX_PAGE_SIZE = 50;
/** Season codes this endpoint echoes as strings (reference / plan season of the default plan). */
const REFERENCE_SEASON_CODE = String(plansJson.data[0].referenceSeasonCode);
const PLAN_SEASON_CODE = String(plansJson.data[0].planSeasonCode);

function toRecommendationProduct(
  product: (typeof missedOppsJson.data)[number],
): RecommendationProductWire {
  const item=flooringItems.find(i=>i.article===product.article);
  if(!item)throw new Error(`Unknown recommendation article ${product.article}`);
  return {
    product_id: item.styleId,
    style_id: item.styleId,
    article: product.article,
    product_name: item.name,
    imageUrl: item.imageUrl,
    label: `${Math.round(item.units/26).toLocaleString('en-US')}/week · $${(item.revenue/1000).toFixed(1)}K`,
    status: product.status,
    hierarchy: null,
    revenue: null,
    summary: item.availabilityReason,
    rank: product.rank,
  };
}

/** Currency the PDF's `$` revenue figures are in. */
const REVENUE_CURRENCY = 'USD';

function toStyleColorProduct(
  product: Pick<(typeof topStyleColorsJson.data)[number],'article'|'rank'>,
): TopStyleColorApiProduct {
  const item=flooringItems.find(i=>i.article===product.article);
  if(!item)throw new Error(`Unknown style-colour article ${product.article}`);
  return {
    productId: item.styleId,
    styleId: item.styleId,
    article: product.article,
    productName: item.name,
    imageUrl: item.imageUrl,
    // Sell-through, e.g. "88.4%".
    label: `${item.stPct.toFixed(1)}%`,
    hierarchy: {
      l3: item.l1_name,
      l4: item.l2_name,
      label: `${item.species} · ${item.finish}`,
    },
    revenue: {
      value: item.revenue,
      formattedValue: `$${(item.revenue/1000).toFixed(1)}K`,
      currency: REVENUE_CURRENCY,
    },
    summary: item.availabilityReason,
    rank: product.rank,
  };
}

const recommendationProducts: Record<string, RecommendationProductWire[]> = {
  missedOpportunities: missedOppsJson.data.map(toRecommendationProduct),
  carryForwards: carryForwardJson.data.map(toRecommendationProduct),
};

const styleColorProducts: TopStyleColorApiProduct[] = flooringItems.map((item,index)=>toStyleColorProduct({article:item.article,rank:index+1}));

/** Cursors are opaque to the client; here one just encodes the next offset. */
const CURSOR_PREFIX = 'pdf-offset:';

function decodeCursor(cursor: unknown): number {
  if (typeof cursor !== 'string' || !cursor.startsWith(CURSOR_PREFIX)) return 0;
  const offset = Number.parseInt(cursor.slice(CURSOR_PREFIX.length), 10);
  return Number.isFinite(offset) && offset > 0 ? offset : 0;
}

function pageOf<T>(items: readonly T[], body: { top?: unknown; cursor?: unknown }) {
  const requested = typeof body.top === 'number' && Number.isFinite(body.top) ? body.top : 0;
  const top = requested > 0 ? Math.min(MAX_PAGE_SIZE, Math.trunc(requested)) : DEFAULT_PAGE_SIZE;
  const start = decodeCursor(body.cursor);
  const end = start + top;
  const hasMore = end < items.length;
  return {
    top,
    page: items.slice(start, end),
    pagination: {
      cursor: hasMore ? `${CURSOR_PREFIX}${end}` : '',
      pageSize: top,
      hasMore,
      totalCount: items.length,
    },
  };
}

interface RecommendationsBody {
  planCode?: string;
  recommendationType?: string;
  top?: number;
  cursor?: string;
  metric?:string;
}

async function answerRecommendations(request: Request, forceTopStyleColors = false) {
  const body = await readJson<RecommendationsBody>(request);
  const planCode = body.planCode ?? '';
  const allowed=new Set(selectFlooringItems(flooringRequestFilters(body as Record<string,unknown>)).map(i=>i.article));

  if (forceTopStyleColors || body.recommendationType === 'topStyleColors') {
    const metric=String(body.metric??'revenue');
    const metricValue=(p:TopStyleColorApiProduct)=>{
      const item=flooringItems.find(i=>i.article===p.article)!;
      return /qty|units|slsu/i.test(metric)?item.units:/gm%|gross_margin_pct/.test(metric)?item.gmPct:/st%|sell_thru/.test(metric)?item.stPct:item.revenue;
    };
    const ranked=styleColorProducts.filter(p=>allowed.has(p.article??'')).sort((a,b)=>metricValue(b)-metricValue(a)).map((p,index)=>({...p,rank:index+1}));
    const { top, page, pagination } = pageOf(ranked, body);
    const data: TopStyleColorsApiData = {
      planCode,
      referenceSeasonCode: REFERENCE_SEASON_CODE,
      planSeasonCode: PLAN_SEASON_CODE,
      type: 'topStyleColors',
      top,
      products: page,
      pagination,
    };
    return HttpResponse.json(envelope(data));
  }

  const type = body.recommendationType === 'carryForwards' ? 'carryForwards' : 'missedOpportunities';
  const { top, page, pagination } = pageOf(recommendationProducts[type].filter(p=>allowed.has(p.article??'')), body);
  const data: OverviewRecommendationsPayload = {
    planCode,
    referenceSeasonCode: REFERENCE_SEASON_CODE,
    planSeasonCode: PLAN_SEASON_CODE,
    type,
    top,
    products: page,
    pagination,
  };
  return HttpResponse.json(envelope(data));
}

/* -------------------------------------------------------------------------------------------
 * Handlers
 * ----------------------------------------------------------------------------------------- */

/** Plans, filters, season and Overview (non-chart) endpoints backed by src/mocks/pdfData. */
export const pdfOverviewHandlers: RequestHandler[] = [
  // The priority flooring master has three actual hierarchy levels. A phantom L3 made
  // the existing Pareto helper request an unrepresented breakdown and show No data.
  http.get('*/v1/global-config',()=>HttpResponse.json(envelope({...FALLBACK_GLOBAL_CONFIG,hierarchy:{...FALLBACK_GLOBAL_CONFIG.hierarchy,levelHierarchies:[...productLevels]}}))),
  http.get('*/v1/plans', ({ request }) => {
    const isDeleted = new URL(request.url).searchParams.get('is_deleted') === 'true';
    const body: PlansApiResponse = {
      status: true,
      data: { plans: planDtos.filter((plan) => plan.isDeleted === isDeleted) },
      message: OK_MESSAGE,
    };
    return HttpResponse.json(body);
  }),

  http.get('*/v1/plans/seasons', () => HttpResponse.json(envelope({ years: buildSeasonYears() }))),

  http.get('*/v1/filters/config', ({ request }) => {
    const key = new URL(request.url).searchParams.get('config_key');
    const config = (key ? filterConfigs[key] : undefined) ?? filterConfigs.default;
    return HttpResponse.json(envelope(config));
  }),

  http.post('*/v1/filters/values', async ({ request }) => {
    const body = await readJson<FilterValuesRequest>(request);
    return HttpResponse.json(envelope(buildFilterValues(body)));
  }),

  http.post('*/v1/plans/product-performance/kpis', async ({ request }) => {
    const body = await readJson<{ planCode: string; seasonCode: string; compareTo: string[] }>(request);
    const season = kpiSeasons.find((entry) => String(entry.seasonCode) === String(body.seasonCode));
    const response: ProductPerformanceKpisResponse = {
      status: true,
      data: {
        planCode: body.planCode ?? '',
        timeline: season?.name ?? kpiSeasons[0].name,
        compareTo: body.compareTo ?? [],
        kpis: flooringKpis(flooringRequestFilters(body)),
      },
      message: OK_MESSAGE,
    };
    return HttpResponse.json(response);
  }),

  http.get('*/v1/plans/product-performance/kpi-seasons', ({ request }) => {
    const planCode = new URL(request.url).searchParams.get('planCode') ?? '';
    const response: KpiSeasonsResponse = {
      status: true,
      data: { planCode, seasons: kpiSeasons },
      message: OK_MESSAGE,
    };
    return HttpResponse.json(response);
  }),

  http.get('*/v1/plans/product-performance/contribution', ({ request }) => {
    const planCode = new URL(request.url).searchParams.get('planCode') ?? '';
    const response: ProductContributionResponse = {
      status: true,
      data: { planId: planCode, topN: CONTRIBUTION_TOP_N, cards: flooringContributionCards(flooringRequestFilters({planCode})) },
      message: OK_MESSAGE,
    };
    return HttpResponse.json(response);
  }),

  // The app posts both Missed / Carry-Forward and Top Style-Colors to this one path, told apart
  // by `recommendationType`.
  http.post('*/v1/hindsight/overview/recommendations', ({ request }) =>
    answerRecommendations(request),
  ),

  // Documented path for Top Style-Colors; same payload as `recommendationType: topStyleColors`.
  http.post('*/v1/hindsight/overview/top-style-colors', ({ request }) =>
    answerRecommendations(request, true),
  ),

  http.post('*/v1/plans/:planCode/hindsight-summary', async ({ params,request }) => {
    const { data } = seasonSummaryJson;
    const body=await readJson<Record<string,unknown>>(request);
    const sections=getFlooringNarratives(flooringRequestFilters({...body,planCode:params.planCode}));
    // The agent answers with a bare snake_case body (no `{ status, data }` envelope).
    const response: HindsightSummaryResponse = {
      request_id: 'pdf-mock-hindsight-summary',
      plan_code: String(params.planCode ?? data.planCode),
      rules_version: 'pdf-mock',
      ly_season_code: data.lySeason,
      lly_season_code: data.llySeason,
      summary: {
        assortment_and_attributes: sections.assortmentAndAttributes,
        whats_working: sections.whatsWorking,
        whats_not_working: sections.whatsNotWorking,
        where_to_adjust: sections.whereToAdjust,
      },
      generated_at: new Date().toISOString(),
      cached: true,
      model: 'pdf-mock',
      query_ms: 0,
      llm_ms: 0,
      input_tokens: 0,
      output_tokens: 0,
      cost_usd: 0,
    };
    return HttpResponse.json(response);
  }),
];
