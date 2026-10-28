import type {
  AttributeDefinition,
  AttributeValueRow,
  AttributeView,
  CarryForwardData,
  ChartInstance,
  Cluster,
  ClusterPerformanceData,
  ContributionData,
  FilterFacets,
  GlobalSelection,
  HeatmapData,
  Item,
  MetricCatalogue,
  NarrationInsight,
  PermissionScope,
  ProductPerformanceCard,
  Recommendation,
  ScorecardRow,
  Season,
  SummarizeResponse,
  TenantConfig,
  UserPreferences,
  VersionChartData,
  WidgetConfig,
  TopStyleColorItem,
  RecommendationProductWire,
  RecommendationType,
} from '@modules/hindsight/types';

/**
 * Percentages are fractions throughout, matching the API contract: 78.2% is `0.782`.
 * Currency and unit counts are plain numbers.
 */

export const metricCatalogue: MetricCatalogue = {
  metrics: [
    {
      id: 'sales-value',
      labelKey: 'metrics.salesValue',
      format: 'currency',
      lyComparable: true,
      direction: 'higherIsBetter',
    },
    {
      id: 'sales-units',
      labelKey: 'metrics.salesUnits',
      format: 'unitCount',
      lyComparable: true,
      direction: 'higherIsBetter',
    },
    {
      id: 'sell-through',
      labelKey: 'metrics.sellThrough',
      format: 'percentage',
      lyComparable: true,
      direction: 'higherIsBetter',
    },
    {
      id: 'gross-margin',
      labelKey: 'metrics.grossMargin',
      format: 'percentage',
      lyComparable: true,
      direction: 'higherIsBetter',
    },
    // Markdown coming down is good news; this is the metric that exercises favourability.
    {
      id: 'markdown-percent',
      labelKey: 'metrics.markdownPercent',
      format: 'percentage',
      lyComparable: true,
      direction: 'lowerIsBetter',
    },
    // Not comparable to last year, so every LY column for it renders an em dash.
    {
      id: 'revenue-share',
      labelKey: 'metrics.revenueShare',
      format: 'percentage',
      lyComparable: false,
      direction: 'higherIsBetter',
    },
  ],
  updatedAt: '2026-07-28T09:15:00Z',
  version: 7,
};

export const seasonFixtures: Season[] = [
  {
    id: 'aw25',
    labelKey: 'seasons.aw25',
    hasCompletedData: true,
    hasActivePlan: true,
    priorYearSeasonId: 'aw24',
  },
  {
    id: 'ss25',
    labelKey: 'seasons.ss25',
    hasCompletedData: true,
    hasActivePlan: false,
    priorYearSeasonId: 'ss24',
  },
  {
    id: 'aw24',
    labelKey: 'seasons.aw24',
    hasCompletedData: true,
    hasActivePlan: false,
    priorYearSeasonId: null,
  },
  // No comparable prior year, so its LY columns are empty by construction.
  {
    id: 'ss24',
    labelKey: 'seasons.ss24',
    hasCompletedData: true,
    hasActivePlan: false,
    priorYearSeasonId: null,
  },
];

export const facetFixtures: FilterFacets = {
  levels: [
    { id: 'division', labelKey: 'levels.division', depth: 0, parentLevelId: null },
    {
      id: 'department',
      labelKey: 'levels.department',
      depth: 1,
      parentLevelId: 'division',
    },
    {
      id: 'category',
      labelKey: 'levels.category',
      depth: 2,
      parentLevelId: 'department',
    },
    {
      id: 'subcategory',
      labelKey: 'levels.subcategory',
      depth: 3,
      parentLevelId: 'category',
    },
  ],
  positions: [
    {
      id: 'div-womenswear',
      levelId: 'division',
      labelKey: 'Womenswear',
      parentPositionId: null,
    },
    {
      id: 'div-menswear',
      levelId: 'division',
      labelKey: 'Menswear',
      parentPositionId: null,
    },
    {
      id: 'div-kidswear',
      levelId: 'division',
      labelKey: 'Kidswear',
      parentPositionId: null,
    },
    {
      id: 'dept-dresses',
      levelId: 'department',
      labelKey: 'Dresses',
      parentPositionId: 'div-womenswear',
    },
    {
      id: 'dept-knitwear',
      levelId: 'department',
      labelKey: 'Knitwear',
      parentPositionId: 'div-womenswear',
    },
    {
      id: 'dept-outerwear',
      levelId: 'department',
      labelKey: 'Outerwear',
      parentPositionId: 'div-womenswear',
    },
    {
      id: 'dept-denim',
      levelId: 'department',
      labelKey: 'Denim',
      parentPositionId: 'div-menswear',
    },
    {
      id: 'dept-tops',
      levelId: 'department',
      labelKey: 'Tops',
      parentPositionId: 'div-menswear',
    },
  ],
  countries: [
    { id: 'us', labelKey: 'United States' },
    { id: 'ca', labelKey: 'Canada' },
    { id: 'gb', labelKey: 'United Kingdom' },
    { id: 'ae', labelKey: 'United Arab Emirates' },
  ],
  channels: [
    { id: 'retail', labelKey: 'Retail' },
    { id: 'ecom', labelKey: 'Ecommerce' },
    { id: 'wholesale', labelKey: 'Wholesale' },
    { id: 'outlet', labelKey: 'Outlet' },
  ],
};

/**
 * A deliberately restricted persona: two of three divisions, five of eight departments, two of
 * four countries and three of four channels. Tests rely on this being a strict subset, so that
 * "select all" resolving to the full facet list would be a visible failure.
 */
export const permissionScopeFixture: PermissionScope = {
  personaId: 'planner-womenswear',
  productPositionIds: [
    'div-womenswear',
    'div-menswear',
    'dept-dresses',
    'dept-knitwear',
    'dept-outerwear',
    'dept-denim',
    'dept-tops',
  ],
  countryIds: ['us', 'gb'],
  channelIds: ['retail', 'ecom', 'outlet'],
};

export const clusterFixtures: Cluster[] = [
  { id: 'cluster-a', labelKey: 'clusters.a' },
  { id: 'cluster-b', labelKey: 'clusters.b' },
  { id: 'cluster-c', labelKey: 'clusters.c' },
  { id: 'cluster-d', labelKey: 'clusters.d' },
  { id: 'cluster-e', labelKey: 'clusters.e' },
  { id: 'cluster-f', labelKey: 'clusters.f' },
];

export const widgetConfigFixtures: WidgetConfig[] = [
  {
    widgetId: 'season-scorecard',
    defaultMetricId: 'sales-value',
    enabledMetricIds: 'all',
    narrated: true,
  },
  {
    widgetId: 'product-performance',
    defaultMetricId: 'sales-value',
    enabledMetricIds: 'all',
    narrated: true,
  },
  {
    widgetId: 'contribution',
    defaultMetricId: 'sales-value',
    enabledMetricIds: 'all',
    topN: 5,
    thresholdPercent: 0.15,
    showOthers: true,
    narrated: true,
  },
  {
    widgetId: 'colour-contribution',
    defaultMetricId: 'sales-units',
    enabledMetricIds: ['sales-units', 'sales-value', 'sell-through'],
    topN: 5,
    thresholdPercent: 0.15,
    showOthers: true,
    narrated: true,
  },
  {
    widgetId: 'cluster-performance',
    defaultMetricId: 'sell-through',
    enabledMetricIds: 'all',
    narrated: true,
  },
  {
    widgetId: 'category-by-cluster',
    defaultMetricId: 'sell-through',
    enabledMetricIds: 'all',
    narrated: true,
  },
  {
    widgetId: 'version-chart',
    defaultMetricId: 'sales-value',
    enabledMetricIds: 'all',
    narrated: true,
  },
  {
    widgetId: 'top-performers',
    defaultMetricId: 'sales-units',
    enabledMetricIds: 'all',
    defaultListLength: 20,
    maxListLength: 50,
    narrated: false,
  },
  // Un-narrated: the grid must reserve no space for an insight slot.
  {
    widgetId: 'items-grid',
    defaultMetricId: 'sales-units',
    enabledMetricIds: 'all',
    tyLyDefault: false,
    narrated: false,
  },
  {
    widgetId: 'attribute-heatmap',
    defaultMetricId: 'sell-through',
    enabledMetricIds: 'all',
    narrated: false,
  },
  {
    widgetId: 'attribute-breakdown',
    defaultMetricId: 'revenue-share',
    enabledMetricIds: 'all',
    thresholdPercent: 0.12,
    narrated: true,
  },
  {
    widgetId: 'carry-forward',
    defaultMetricId: 'sales-value',
    enabledMetricIds: 'all',
    thresholdPercent: 15,
    surfacingThresholdBounds: { min: 5, max: 40 },
    narrated: true,
  },
];

export const chartInstanceFixtures: ChartInstance[] = [
  {
    instanceId: 'contribution-department',
    widgetId: 'contribution',
    position: 1,
    defaultMetricId: 'sales-value',
    enabledVersionIds: ['ly'],
  },
  {
    instanceId: 'contribution-colour',
    widgetId: 'colour-contribution',
    position: 2,
    defaultMetricId: 'sales-units',
    enabledVersionIds: ['ly'],
  },
  {
    instanceId: 'version-sales',
    widgetId: 'version-chart',
    position: 3,
    defaultMetricId: 'sales-value',
    enabledVersionIds: ['ly', 'optLy', 'forecast', 'plan'],
    hierarchyPair: { fromLevelId: 'division', toLevelId: 'department' },
  },
  {
    instanceId: 'version-margin',
    widgetId: 'version-chart',
    position: 4,
    defaultMetricId: 'sales-units',
    enabledVersionIds: ['aw23', 'aw24', 'aw25'],
    hierarchyPair: { fromLevelId: 'division', toLevelId: 'department' },
  },
  {
    instanceId: 'version-actual-plan',
    widgetId: 'version-chart',
    position: 5,
    defaultMetricId: 'sell-through',
    enabledVersionIds: ['plan', 'actual'],
    hierarchyPair: { fromLevelId: 'division', toLevelId: 'department' },
  },
];

export const attributeCatalogueFixtures: AttributeDefinition[] = [
  { id: 'brand', labelKey: 'attributes.brand', valueCount: 9 },
  { id: 'colour', labelKey: 'attributes.colour', valueCount: 3 },
  { id: 'collar', labelKey: 'attributes.collar', valueCount: 3 },
  { id: 'neckline', labelKey: 'attributes.neckline', valueCount: 1 },
  { id: 'sleeve-length', labelKey: 'attributes.sleeveLength', valueCount: 2 },
];

export const tenantConfigFixture: TenantConfig = {
  catalogue: metricCatalogue,
  attributeCatalogue: attributeCatalogueFixtures,
  widgets: widgetConfigFixtures,
  chartInstances: chartInstanceFixtures,
  updatedAt: '2026-07-28T09:15:00Z',
  version: 7,
};

export const userPreferencesFixture: UserPreferences = {
  scorecardMetricIds: ['sales-value', 'sales-units', 'sell-through', 'gross-margin'],
  metricByInstanceId: {},
  metricByWidgetId: {},
  listLengthByWidgetId: { 'top-performers': 20 },
  sortByWidgetId: {},
  surfacingThreshold: 15,
  tyLyEnabled: false,
  itemViewMode: 'visual',
  carryForwardView: 'missedOpportunities',
  overridesEnabled: true,
};

export const defaultSelection: GlobalSelection = {
  seasonId: 'aw25',
  productLevelId: 'department',
  productPositionIds: ['dept-dresses', 'dept-knitwear', 'dept-outerwear'],
  countryIds: ['us', 'gb'],
  channelIds: ['retail', 'ecom'],
};

interface ItemSeed {
  id: string;
  styleNumber: string;
  description: string;
  clusterId: string;
  hasImage: boolean;
  salesValue: number;
  salesUnits: number;
  sellThrough: number;
  grossMargin: number;
  markdown: number;
  share: number;
}

const itemSeeds: ItemSeed[] = [
  [
    'w-1041',
    'Ribbed Roll-Neck Knit',
    'cluster-a',
    true,
    486000,
    12400,
    0.862,
    0.615,
    0.081,
    0.101,
  ],
  [
    'w-1042',
    'Cable Wool Crew Jumper',
    'cluster-a',
    true,
    412500,
    9800,
    0.814,
    0.598,
    0.094,
    0.086,
  ],
  [
    'w-1078',
    'Belted Wool Overcoat',
    'cluster-b',
    true,
    398200,
    3120,
    0.742,
    0.643,
    0.112,
    0.083,
  ],
  [
    'w-1079',
    'Quilted Shell Jacket',
    'cluster-b',
    false,
    341800,
    4260,
    0.688,
    0.571,
    0.148,
    0.071,
  ],
  [
    'w-1103',
    'Bias-Cut Midi Dress',
    'cluster-c',
    true,
    512400,
    11200,
    0.891,
    0.652,
    0.062,
    0.107,
  ],
  [
    'w-1104',
    'Pleated Georgette Dress',
    'cluster-c',
    true,
    288600,
    6400,
    0.734,
    0.588,
    0.121,
    0.06,
  ],
  [
    'w-1131',
    'Merino Funnel-Neck Top',
    'cluster-d',
    true,
    197400,
    7900,
    0.652,
    0.541,
    0.186,
    0.041,
  ],
  [
    'w-1132',
    'Boucle Cropped Cardigan',
    'cluster-d',
    false,
    164200,
    5100,
    0.588,
    0.512,
    0.214,
    0.034,
  ],
  [
    'm-2011',
    'Wide-Leg Cropped Denim',
    'cluster-e',
    true,
    376900,
    8600,
    0.771,
    0.604,
    0.104,
    0.078,
  ],
  [
    'm-2012',
    'Straight Rigid Selvedge Jean',
    'cluster-e',
    true,
    302500,
    6900,
    0.718,
    0.582,
    0.132,
    0.063,
  ],
  [
    'm-2044',
    'Brushed Flannel Overshirt',
    'cluster-f',
    true,
    241300,
    8200,
    0.694,
    0.556,
    0.158,
    0.05,
  ],
  [
    'm-2045',
    'Heavyweight Jersey Tee',
    'cluster-f',
    false,
    128700,
    14300,
    0.612,
    0.488,
    0.228,
    0.027,
  ],
  [
    'm-2061',
    'Waffle Henley Long Sleeve',
    'cluster-a',
    true,
    176500,
    8100,
    0.641,
    0.523,
    0.192,
    0.037,
  ],
  [
    'w-1155',
    'Satin Slip Column Dress',
    'cluster-b',
    true,
    224800,
    4700,
    0.706,
    0.612,
    0.138,
    0.047,
  ],
].map(
  ([
    styleNumber,
    description,
    clusterId,
    hasImage,
    salesValue,
    salesUnits,
    sellThrough,
    grossMargin,
    markdown,
    share,
  ]) =>
    ({
      id: styleNumber as string,
      styleNumber: (styleNumber as string).toUpperCase(),
      description: description as string,
      clusterId: clusterId as string,
      hasImage: hasImage as boolean,
      salesValue: salesValue as number,
      salesUnits: salesUnits as number,
      sellThrough: sellThrough as number,
      grossMargin: grossMargin as number,
      markdown: markdown as number,
      share: share as number,
    }) satisfies ItemSeed,
);

function shirtImage(fill: string, shadow: string, sleeve: 'short' | 'long' = 'short'): string {
  const garmentPath =
    sleeve === 'long'
      ? 'M167 48 197 34 239 53l45 101-36 17-28-62-4 162H101L97 109l-28 62-36-17L78 53l42-19 30 14h17Z'
      : 'M129 51 92 70 55 154l55 29 28-58v147h152V125l28 58 55-29-37-84-37-19-31 23H160l-31-23Z';

  return `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 459 303">
      <rect width="459" height="303" rx="12" fill="#f7f7f4"/>
      <path d="${garmentPath}" fill="${fill}"/>
      <path d="M157 49h57l-8 34h-41l-8-34Z" fill="#f3f0f7" opacity=".82"/>
      <path d="M116 271h120" stroke="${shadow}" stroke-width="7" opacity=".22"/>
      <path d="M151 48c15 12 48 12 64 0" stroke="#ffffff" stroke-width="4" opacity=".38"/>
    </svg>`,
  )}`;
}

const itemImages = [
  shirtImage('#E7E2ED', '#BEB6C8', 'long'),
  shirtImage('#19C896', '#087C5D'),
  shirtImage('#202124', '#000000'),
  shirtImage('#F9FAFF', '#C9CEDD'),
  shirtImage('#242629', '#050505'),
  shirtImage('#315BD8', '#142E83'),
] as const;

export const itemFixtures: Item[] = itemSeeds.map((seed, index) => ({
  id: seed.id,
  styleNumber: seed.styleNumber,
  description: seed.description,
  imageUrl: itemImages[index % itemImages.length],
  clusterId: seed.clusterId,
  metricValues: {
    'sales-value': seed.salesValue,
    'sales-units': seed.salesUnits,
    'sell-through': seed.sellThrough,
    'gross-margin': seed.grossMargin,
    'markdown-percent': seed.markdown,
    'revenue-share': seed.share,
  },
  // Only half the range carries a comparable prior year.
  lyMetricValues:
    index % 2 === 0
      ? {
          'sales-value': Math.round(seed.salesValue * 0.93),
          'sales-units': Math.round(seed.salesUnits * 0.96),
          'sell-through': Number((seed.sellThrough * 0.95).toFixed(3)),
          'gross-margin': Number((seed.grossMargin * 0.98).toFixed(3)),
          'markdown-percent': Number((seed.markdown * 1.12).toFixed(3)),
          'revenue-share': null,
        }
      : undefined,
}));

const verdictPattern = [
  'keep',
  'keep',
  'shop',
  'drop',
  'keep',
  'shop',
  'keep',
  'drop',
  'keep',
  'keep',
  'shop',
  'drop',
  'keep',
  'keep',
] as const;

export const recommendationFixtures: Recommendation[] = itemFixtures.map(
  (item, index) => {
    const agentVerdict = verdictPattern[index % verdictPattern.length];
    const base: Recommendation = {
      itemId: item.id,
      agentVerdict,
      agentNarrationId: `narr-item-${item.id}`,
    };

    // Three planner disagreements, so the agent verdict staying recoverable is observable.
    if (item.id === 'w-1079') {
      return {
        ...base,
        override: { verdict: 'keep', at: '2026-07-30T14:02:00Z', by: 'planner-1' },
      };
    }
    if (item.id === 'm-2045') {
      return {
        ...base,
        override: { verdict: 'shop', at: '2026-07-30T14:06:00Z', by: 'planner-1' },
      };
    }
    if (item.id === 'w-1131') {
      return {
        ...base,
        override: { verdict: 'drop', at: '2026-07-31T09:41:00Z', by: 'planner-1' },
      };
    }
    return base;
  },
);

export const scorecardFixtures: ScorecardRow[] = [
  { metricId: 'sales-value', season: 4820000, ly: 4510000, optimisedLy: 4680000 },
  { metricId: 'sales-units', season: 111000, ly: 106400, optimisedLy: 109200 },
  { metricId: 'sell-through', season: 0.782, ly: 0.741, optimisedLy: 0.764 },
  { metricId: 'gross-margin', season: 0.596, ly: 0.581, optimisedLy: 0.589 },
  { metricId: 'markdown-percent', season: 0.118, ly: 0.142, optimisedLy: 0.126 },
  // Not LY-comparable, so both comparison columns are absent rather than zero.
  { metricId: 'revenue-share', season: 1, ly: null, optimisedLy: null },
];

export const productPerformanceFixtures: ProductPerformanceCard[] = [
  {
    metricId: 'sales-value',
    displayLabel: 'Sales R',
    value: 186000000,
    deltaPercent: -0.03,
    deltaTone: 'danger',
    comparisonKey: 'productPerformance.vsLastWeek',
  },
  {
    metricId: 'sales-value',
    displayLabel: 'Sales R',
    value: 186000000,
    deltaPercent: -0.03,
    deltaTone: 'warning',
    comparisonKey: 'productPerformance.vsLastWeek',
  },
  {
    metricId: 'sales-value',
    displayLabel: 'Sales R',
    value: 186000000,
    deltaPercent: 0.03,
    deltaTone: 'success',
    comparisonKey: 'productPerformance.vsLastWeek',
  },
  {
    metricId: 'sales-value',
    displayLabel: 'Sales R',
    value: 186000000,
    deltaPercent: 0.03,
    deltaTone: 'success',
    comparisonKey: 'productPerformance.vsLastWeek',
  },
  {
    metricId: 'sales-value',
    displayLabel: 'Sales R',
    value: 186000000,
    deltaPercent: -0.03,
    deltaTone: 'danger',
    comparisonKey: 'productPerformance.vsLastWeek',
  },
  {
    metricId: 'sales-value',
    displayLabel: 'Sales R',
    value: 186000000,
    deltaPercent: -0.03,
    deltaTone: 'danger',
    comparisonKey: 'productPerformance.vsLastWeek',
  },
];

/**
 * A summarize reply as the agent service actually sends one for a contribution card: clean
 * sentences with no `Bullet N:` scaffolding, the last one carrying the recommendation.
 */
export const cardInsightFixture: SummarizeResponse = {
  requestId: '6584c9b5-d9fa-444f-be9c-e2710abb8852',
  promptKey: 'segment_contribution',
  promptVersion: 1,
  response: [
    'The top segments are "6-fraulich, unscheinbar" at 59.0% and "3-Damen" at 31.0%.',
    'The "Others" bucket is 1.0%, indicating a high concentration in the top segments.',
    'Recommendation: Focus on reweighting the top segments to optimize inventory.',
  ],
  model: 'gpt-4o-mini',
  latencyMs: 1206,
};

export const contributionFixtures: ContributionData[] = [
  {
    instanceId: 'contribution-department',
    metricId: 'sales-value',
    dimension: 'department',
    slices: [
      {
        id: 'dept-dresses',
        labelKey: 'Dresses',
        value: 1712000,
        sharePercent: 0.355,
        isOthers: false,
      },
      {
        id: 'dept-knitwear',
        labelKey: 'Knitwear',
        value: 1240000,
        sharePercent: 0.257,
        isOthers: false,
      },
      {
        id: 'dept-outerwear',
        labelKey: 'Outerwear',
        value: 964000,
        sharePercent: 0.2,
        isOthers: false,
      },
      {
        id: 'dept-denim',
        labelKey: 'Denim',
        value: 542000,
        sharePercent: 0.112,
        isOthers: false,
      },
      {
        id: 'dept-tops',
        labelKey: 'Tops',
        value: 362000,
        sharePercent: 0.076,
        isOthers: false,
      },
    ],
  },
  {
    instanceId: 'contribution-colour',
    metricId: 'sales-units',
    dimension: 'colour',
    slices: [
      {
        id: 'black',
        labelKey: 'Black',
        value: 34100,
        sharePercent: 0.307,
        isOthers: false,
      },
      {
        id: 'navy',
        labelKey: 'Navy',
        value: 24600,
        sharePercent: 0.222,
        isOthers: false,
      },
      {
        id: 'ecru',
        labelKey: 'Ecru',
        value: 18200,
        sharePercent: 0.164,
        isOthers: false,
      },
      {
        id: 'grey-marl',
        labelKey: 'Grey marl',
        value: 14300,
        sharePercent: 0.129,
        isOthers: false,
      },
      {
        id: 'olive',
        labelKey: 'Olive',
        value: 9800,
        sharePercent: 0.088,
        isOthers: false,
      },
      {
        id: 'burgundy',
        labelKey: 'Burgundy',
        value: 5400,
        sharePercent: 0.049,
        isOthers: false,
      },
      { id: 'rust', labelKey: 'Rust', value: 4600, sharePercent: 0.041, isOthers: false },
    ],
  },
  {
    instanceId: 'contribution-colour',
    metricId: 'sales-units',
    dimension: 'colour',
    slices: [
      {
        id: 'black',
        labelKey: 'Black',
        value: 34100,
        sharePercent: 0.307,
        isOthers: false,
      },
      {
        id: 'navy',
        labelKey: 'Navy',
        value: 24600,
        sharePercent: 0.222,
        isOthers: false,
      },
      {
        id: 'ecru',
        labelKey: 'Ecru',
        value: 18200,
        sharePercent: 0.164,
        isOthers: false,
      },
      {
        id: 'grey-marl',
        labelKey: 'Grey marl',
        value: 14300,
        sharePercent: 0.129,
        isOthers: false,
      },
      {
        id: 'olive',
        labelKey: 'Olive',
        value: 9800,
        sharePercent: 0.088,
        isOthers: false,
      },
      {
        id: 'burgundy',
        labelKey: 'Burgundy',
        value: 5400,
        sharePercent: 0.049,
        isOthers: false,
      },
      { id: 'rust', labelKey: 'Rust', value: 4600, sharePercent: 0.041, isOthers: false },
    ],
  },
];

export const clusterPerformanceFixture: ClusterPerformanceData = {
  metricId: 'sell-through',
  entries: [
    { clusterId: 'premium', labelKey: 'Premium', value: 0.37, lyValue: null },
    { clusterId: 'high-st', labelKey: 'High ST', value: 0.3, lyValue: null },
    { clusterId: 'suburban', labelKey: 'Suburban', value: 0.11, lyValue: null },
    { clusterId: 'tourist', labelKey: 'Tourist', value: 0.25, lyValue: null },
    { clusterId: 'outlet', labelKey: 'Outlet', value: 0.26, lyValue: null },
  ],
};

const departmentRows = [
  { id: 'dept-dresses', labelKey: 'Dresses' },
  { id: 'dept-knitwear', labelKey: 'Knitwear' },
  { id: 'dept-outerwear', labelKey: 'Outerwear' },
  { id: 'dept-denim', labelKey: 'Denim' },
  { id: 'dept-tops', labelKey: 'Tops' },
];

const storeCategoryRows = [
  { id: 'dept-knitwear', labelKey: 'Knitwear' },
  { id: 'dept-outerwear', labelKey: 'Outerwear' },
  { id: 'dept-tops', labelKey: 'Tops' },
  { id: 'dept-bottoms', labelKey: 'Bottoms' },
  { id: 'dept-accessories', labelKey: 'Accessories' },
  { id: 'dept-denim', labelKey: 'Denim' },
];

const storeClusterColumns = [
  { id: 'a', labelKey: 'A' },
  { id: 'b', labelKey: 'B' },
  { id: 'c', labelKey: 'C' },
  { id: 'd', labelKey: 'D' },
  { id: 'e', labelKey: 'E' },
];

const storeCategoryClusterValues: Record<string, (number | null)[]> = {
  'dept-knitwear': [0.79, 0.79, 0.79, 0.79, 0.79],
  'dept-outerwear': [0.79, 0.79, 0.79, 0.79, 0.79],
  'dept-tops': [0.79, 0.79, 0.79, 0.79, 0.79],
  'dept-bottoms': [0.73, 0.73, 0.73, 0.73, 0.73],
  'dept-accessories': [0.79, 0.79, 0.79, 0.79, 0.79],
  'dept-denim': [0.79, 0.79, 0.79, 0.79, 0.79],
};

export const categoryByClusterFixture: HeatmapData = {
  metricId: 'sell-through',
  rows: storeCategoryRows,
  columns: storeClusterColumns,
  cells: storeCategoryRows.flatMap((row) =>
    storeClusterColumns.map((cluster, index) => ({
      rowId: row.id,
      columnId: cluster.id,
      value: storeCategoryClusterValues[row.id][index],
      metricId: 'sell-through',
    })),
  ),
};

export const versionChartFixtures: VersionChartData[] = [
  {
    instanceId: 'version-sales',
    metricId: 'sales-value',
    categories: departmentRows,
    series: [
      {
        versionId: 'ly',
        labelKey: 'versions.ly',
        values: [1598000, 1164000, 902000, 512000, 334000],
      },
      {
        versionId: 'optLy',
        labelKey: 'versions.optLy',
        values: [1662000, 1208000, 938000, 528000, 344000],
      },
      {
        versionId: 'forecast',
        labelKey: 'versions.forecast',
        values: [1740000, 1252000, 972000, 548000, 366000],
      },
      {
        versionId: 'plan',
        labelKey: 'versions.plan',
        values: [1712000, 1240000, 964000, 542000, 362000],
      },
    ],
  },
  {
    instanceId: 'version-margin',
    metricId: 'sales-units',
    categories: [
      { id: 'women-tops', labelKey: 'Women Tops' },
      { id: 'women-dresses', labelKey: 'Women Dresses' },
      { id: 'women-bottoms', labelKey: 'Women Bottoms' },
      { id: 'men-tops', labelKey: 'Men Tops' },
      { id: 'men-bottoms', labelKey: 'Men Bottoms' },
    ],
    series: [
      {
        versionId: 'aw23',
        labelKey: 'AW23',
        values: [4800, 1000, 3400, 6600, 2400],
      },
      {
        versionId: 'aw24',
        labelKey: 'AW24',
        values: [1200, 5600, 1800, 5200, 7000],
      },
      {
        versionId: 'aw25',
        labelKey: 'AW25',
        values: [3800, 3000, 1100, 6600, 2600],
      },
    ],
  },
  {
    instanceId: 'version-actual-plan',
    metricId: 'sell-through',
    categories: [
      { id: 'accessories', labelKey: 'Accessories' },
      { id: 'knitwear', labelKey: 'Knitwear' },
      { id: 'denim', labelKey: 'Denim' },
      { id: 'tops', labelKey: 'Tops' },
      { id: 'footwear', labelKey: 'Footwear' },
      { id: 'dresses', labelKey: 'Dresses' },
      { id: 'bottoms', labelKey: 'Bottoms' },
      { id: 'outerwear', labelKey: 'Outerwear' },
    ],
    series: [
      {
        versionId: 'plan',
        labelKey: 'versions.plan',
        values: [0.48, 0.1, 0.34, 0.67, 0.24, 0.24, 0.24, 0.24],
      },
      {
        versionId: 'actual',
        labelKey: 'Actual',
        values: [0.38, 0.31, 0.11, 0.67, 0.26, 0.26, 0.26, 0.26],
      },
    ],
  },
];

export const topStyleColorsFixture: TopStyleColorItem[] = [
  {
    article: '8209425-001',
    styleColor: {
      id: '8209425',
      name: 'Camel Tailored Recycled Coat',
      imageUrl: '',
    },
    hierarchy: {
      l3: 'Outerwear',
      l4: 'Coats',
      label: 'Outerwear · Coats',
    },
    revenue: {
      value: 18400000,
      formattedValue: '$18.4M',
      currency: 'USD',
    },
    sellThrough: {
      value: 72,
      formattedValue: '72.0%',
    },
    summary: 'Consistent Performer. Full-Price To End Of Season.',
    rank: 1,
  },
  {
    article: '8209426-001',
    styleColor: {
      id: '8209426',
      name: 'Burgundy V-Neck Merino',
      imageUrl: '',
    },
    hierarchy: {
      l3: 'Knitwear',
      l4: 'Jumpers',
      label: 'Knitwear · Jumpers',
    },
    revenue: {
      value: 12100000,
      formattedValue: '$12.1M',
      currency: 'USD',
    },
    sellThrough: {
      value: 68,
      formattedValue: '68.0%',
    },
    summary: 'Strong sell-through into peak weeks.',
    rank: 2,
  },
  {
    article: '8209427-001',
    styleColor: {
      id: '8209427',
      name: 'Wide Leg Denim Trouser',
      imageUrl: '',
    },
    hierarchy: {
      l3: 'Denim',
      l4: 'Trousers',
      label: 'Denim · Trousers',
    },
    revenue: {
      value: 9800000,
      formattedValue: '$9.8M',
      currency: 'USD',
    },
    sellThrough: {
      value: 64,
      formattedValue: '64.0%',
    },
    summary: 'Steady demand across clusters.',
    rank: 3,
  },
  {
    article: '8209428-001',
    styleColor: {
      id: '8209428',
      name: 'Cream Utility Overshirt',
      imageUrl: '',
    },
    hierarchy: {
      l3: 'Tops',
      l4: 'Shirts',
      label: 'Tops · Shirts',
    },
    revenue: {
      value: 7600000,
      formattedValue: '$7.6M',
      currency: 'USD',
    },
    sellThrough: {
      value: 71,
      formattedValue: '71.0%',
    },
    summary: 'Full-price leaner through mid-season.',
    rank: 4,
  },
  {
    article: '8209429-001',
    styleColor: {
      id: '8209429',
      name: 'Navy Belted Midi Dress',
      imageUrl: '',
    },
    hierarchy: {
      l3: 'Dresses',
      l4: 'Midi',
      label: 'Dresses · Midi',
    },
    revenue: {
      value: 6400000,
      formattedValue: '$6.4M',
      currency: 'USD',
    },
    sellThrough: {
      value: 59,
      formattedValue: '59.0%',
    },
    summary: 'Rank held with promo support.',
    rank: 5,
  },
];

/**
 * Overview → Missed Opportunities and Carry-Forward & Flags.
 *
 * `hierarchy` and `revenue` are omitted deliberately: the contract only fills them for Top
 * Style-Colors, so these rows exercise the absent case. `status` is present so the tone and icon
 * mapping is covered end to end once the backend ships the field.
 */
export const overviewRecommendationsFixture: Record<
  RecommendationType,
  RecommendationProductWire[]
> = {
  missedOpportunities: [
    {
      product_id: '8209425-001',
      style_id: '8209425',
      article: '8209425-001',
      product_name: 'Earth Slim Denim Jean',
      imageUrl: '',
      label: '91/wk • $1.6M',
      status: 'flagged',
      summary: 'Bottoms-Pre-buy 40% Deeper For SS26. Online-First Allocation.',
      rank: 1,
    },
    {
      product_id: '8209426-001',
      style_id: '8209426',
      article: '8209426-001',
      product_name: 'Burgundy V-Neck Merino',
      imageUrl: '',
      label: '132/week • $1.6M',
      status: 'watch',
      summary: 'Tops-Add Contingency Receipt +15% From W4.',
      rank: 2,
    },
    {
      product_id: '8209427-001',
      style_id: '8209427',
      article: '8209427-001',
      product_name: 'Camel Tailored Recycled Coat',
      imageUrl: '',
      label: '132/week • $1.6M',
      status: 'flagged',
      summary: 'Dresses-Increase Depth By 20% In Cluster A/B.',
      rank: 3,
    },
    {
      product_id: '8209428-001',
      style_id: '8209428',
      article: '8209428-001',
      product_name: 'Cream Utility Overshirt',
      imageUrl: '',
      label: '88/week • $1.2M',
      status: 'watch',
      summary: 'Tops-Hold Depth, Widen Cluster Coverage.',
      rank: 4,
    },
    {
      product_id: '8209429-001',
      style_id: '8209429',
      article: '8209429-001',
      product_name: 'Navy Belted Midi Dress',
      imageUrl: '',
      label: '76/week • $0.9M',
      status: 'flagged',
      summary: 'Dresses-Bring Receipts Forward Two Weeks.',
      rank: 5,
    },
  ],
  carryForwards: [
    {
      product_id: 'cf-earth-tones',
      style_id: '9001',
      article: 'cf-earth-tones',
      product_name: 'Buy More Earth Tones',
      imageUrl: '',
      label: 'In-Season Action',
      status: 'action',
      summary: 'Raise To 12% Of Colour Budget For SS25 (Was 8%). Signal Is Strong And Growing.',
      rank: 1,
    },
    {
      product_id: 'cf-slim-relaxed',
      style_id: '9002',
      article: 'cf-slim-relaxed',
      product_name: 'Slim & Relaxed Only',
      imageUrl: '',
      label: 'Flagged',
      status: 'flagged',
      summary: 'Remove Oversized From SS25 Options. Redirect Budget To Slim (+5%) And Relaxed (+5%).',
      rank: 2,
    },
    {
      product_id: 'cf-markdown-trigger',
      style_id: '9003',
      article: 'cf-markdown-trigger',
      product_name: 'Move Markdown Trigger Earlier',
      imageUrl: '',
      label: 'In-Season Action',
      status: 'action',
      summary: 'Set Markdown Activation At W16, Not W18. Saves ~$1.5M In Margin Annually.',
      rank: 3,
    },
    {
      product_id: 'cf-outerwear-breadth',
      style_id: '9004',
      article: 'cf-outerwear-breadth',
      product_name: 'Outerwear Breadth',
      imageUrl: '',
      label: 'Flagged',
      status: 'flagged',
      summary: 'Options Grew 18% While Sell-Through Fell. Cut Breadth, Hold Depth.',
      rank: 4,
    },
    {
      product_id: 'cf-camel-earth',
      style_id: '9005',
      article: 'cf-camel-earth',
      product_name: 'AW26 Lead With Camel/Earth',
      imageUrl: '',
      label: 'In-Season Action',
      status: 'action',
      summary: 'Carry The Palette Into AW26 Launch Windows.',
      rank: 5,
    },
  ],
};

export const carryForwardFixture: CarryForwardData = {
  view: 'missedOpportunities',
  threshold: 15,
  categories: [
    { id: 'ss24', labelKey: 'seasons.ss24' },
    { id: 'aw24', labelKey: 'seasons.aw24' },
    { id: 'ss25', labelKey: 'seasons.ss25' },
    { id: 'aw25', labelKey: 'seasons.aw25' },
  ],
  series: [
    {
      versionId: 'actual',
      labelKey: 'versions.ly',
      values: [3940000, 4180000, 4510000, 4820000],
    },
    {
      versionId: 'plan',
      labelKey: 'versions.plan',
      values: [4020000, 4160000, 4460000, 4740000],
    },
  ],
  candidates: [
    {
      id: 'cf-knitwear-roll-neck',
      labelKey: 'Camel Tailored Recycled Coat',
      supportingValues: { 'sell-through': 0.862, 'sales-value': 486000 },
      triggerMetricId: 'sell-through',
      flagged: true,
    },
    {
      id: 'cf-bias-midi',
      labelKey: 'Burgundy V-Neck Merino',
      supportingValues: { 'sell-through': 0.891, 'sales-value': 512400 },
      triggerMetricId: 'sell-through',
      flagged: true,
    },
    {
      id: 'cf-wide-leg-denim',
      labelKey: 'Camel Tailored Recycled Coat',
      supportingValues: { 'sell-through': 0.771, 'sales-value': 376900 },
      triggerMetricId: 'sell-through',
      flagged: false,
    },
    {
      id: 'cf-knitwear-roll-neck',
      labelKey: 'Camel Tailored Recycled Coat',
      supportingValues: { 'sell-through': 0.862, 'sales-value': 486000 },
      triggerMetricId: 'sell-through',
      flagged: true,
    },
    {
      id: 'cf-bias-midi',
      labelKey: 'Camel Tailored Recycled Coat',
      supportingValues: { 'sell-through': 0.891, 'sales-value': 512400 },
      triggerMetricId: 'sell-through',
      flagged: true,
    },
    {
      id: 'cf-wide-leg-denim',
      labelKey: 'Camel Tailored Recycled Coat',
      supportingValues: { 'sell-through': 0.771, 'sales-value': 376900 },
      triggerMetricId: 'sell-through',
      flagged: false,
    },
    {
      id: 'cf-knitwear-roll-neck',
      labelKey: 'Camel Tailored Recycled Coat',
      supportingValues: { 'sell-through': 0.862, 'sales-value': 486000 },
      triggerMetricId: 'sell-through',
      flagged: true,
    },
    {
      id: 'cf-bias-midi',
      labelKey: 'Camel Tailored Recycled Coat',
      supportingValues: { 'sell-through': 0.891, 'sales-value': 512400 },
      triggerMetricId: 'sell-through',
      flagged: true,
    },
  ],
};

function attributeRow(
  valueId: string,
  labelKey: string,
  share: number,
  sellThrough: number,
  margin: number,
  trend: number | null,
  signal: 'grow' | 'hold' | 'exit',
  clusterValues: (number | null)[],
): AttributeValueRow {
  return {
    valueId,
    labelKey,
    orgLevel: {
      'revenue-share': share,
      'sell-through': sellThrough,
      'gross-margin': margin,
      'sales-value': Math.round(share * 4820000),
      'sales-units': Math.round(share * 111000),
      'markdown-percent': Number((0.24 - margin * 0.2).toFixed(3)),
    },
    byCluster: Object.fromEntries(
      clusterFixtures.map((cluster, index) => [
        cluster.id,
        {
          value: clusterValues[index],
          delta:
            clusterValues[index] === null
              ? null
              : Number(((index - 2) * 0.018).toFixed(3)),
        },
      ]),
    ),
    trendYoy: trend,
    signal,
    aboveThreshold: share >= 0.12,
  };
}

const colourRows: AttributeValueRow[] = [
  attributeRow(
    'black',
    'Black',
    0.307,
    0.842,
    0.612,
    0.048,
    'grow',
    [0.901, 0.868, 0.842, 0.788, 0.724, 0.662],
  ),
  attributeRow(
    'navy',
    'Navy',
    0.222,
    0.801,
    0.598,
    0.031,
    'grow',
    [0.864, 0.828, 0.801, 0.752, 0.694, 0.631],
  ),
  attributeRow('ecru', 'Ecru', 0.164, 0.762, 0.584, 0.012, 'hold', [
    0.812,
    0.786,
    0.762,
    0.718,
    0.664,
    null,
  ]),
  attributeRow(
    'grey-marl',
    'Grey marl',
    0.129,
    0.718,
    0.561,
    -0.008,
    'hold',
    [0.768, 0.742, 0.718, 0.678, 0.622, 0.571],
  ),
  attributeRow(
    'olive',
    'Olive',
    0.088,
    0.664,
    0.532,
    -0.042,
    'exit',
    [0.712, 0.688, 0.664, 0.624, 0.572, 0.518],
  ),
  attributeRow('burgundy', 'Burgundy', 0.049, 0.598, 0.504, -0.071, 'exit', [
    0.641,
    0.618,
    0.598,
    0.562,
    null,
    0.462,
  ]),
  attributeRow(
    'rust',
    'Rust',
    0.041,
    0.562,
    0.488,
    -0.094,
    'exit',
    [0.604, 0.582, 0.562, 0.528, 0.484, 0.438],
  ),
];

const brandRows: AttributeValueRow[] = [
  attributeRow(
    'own-label',
    'Own Label',
    0.32,
    0.74,
    0.32,
    0.87,
    'grow',
    [0.74, 0.74, 0.74, 0.62, 0.74, 0.74],
  ),
  attributeRow(
    'nike',
    'Nike',
    0.64,
    0.69,
    0.42,
    0.44,
    'grow',
    [0.85, 0.80, 0.80, 0.62, 0.80, 0.80],
  ),
  attributeRow(
    'adidas',
    'Adidas',
    0.48,
    0.66,
    0.64,
    0.29,
    'hold',
    [0.80, 0.74, 0.32, 0.74, 0.32, 0.74],
  ),
  attributeRow('zara', 'Zara', 0.76, 0.75, 0.75, 0.33, 'grow', [
    0.74,
    0.74,
    0.74,
    0.32,
    0.32,
    0.85,
  ]),
  attributeRow(
    'hm',
    'H&M',
    0.52,
    0.61,
    0.38,
    0.76,
    'hold',
    [0.62, 0.85, 0.62, 0.62, 0.62, 0.85],
  ),
];

function attributeViewFor(attributeId: string, rows: AttributeValueRow[]): AttributeView {
  return {
    attributeId,
    metricId: 'sell-through',
    heatmap: {
      metricId: 'sell-through',
      rows: rows.map((row) => ({ id: row.valueId, labelKey: row.labelKey })),
      columns: clusterFixtures.map((c) => ({ id: c.id, labelKey: c.labelKey })),
      cells: rows.flatMap((row) =>
        clusterFixtures.map((cluster) => ({
          rowId: row.valueId,
          columnId: cluster.id,
          value: row.byCluster[cluster.id]?.value ?? null,
          metricId: 'sell-through',
        })),
      ),
    },
    rows,
    aboveThresholdCount: rows.filter((row) => row.aboveThreshold).length,
  };
}

export const attributeViewFixtures: Record<string, AttributeView> = {
  colour: attributeViewFor('colour', colourRows),
  brand: attributeViewFor('brand', brandRows),
  collar: attributeViewFor('collar', colourRows.slice(0, 4)),
  neckline: attributeViewFor('neckline', colourRows.slice(0, 5)),
  'sleeve-length': attributeViewFor('sleeve-length', brandRows.slice(0, 4)),
};

export const narrationFixtures: NarrationInsight[] = [
  {
    id: 'narr-scorecard',
    widgetId: 'season-scorecard',
    contextKey: 'aw25|department|sales-value',
    text: 'Sales value closed 6.8% ahead of last year at $4.82m, with sell-through up four points to 78.2%.',
    sourceValues: { 'sales-value': 4820000, 'sell-through': 0.782 },
    fallbackTextKey: 'narration.fallback.scorecard',
    generatedAt: '2026-07-28T02:00:00Z',
  },
  {
    id: 'narr-product-performance',
    widgetId: 'product-performance',
    contextKey: 'aw25|department|sales-value',
    text: 'Markdown fell to 11.8% from 14.2%, the largest favourable movement of the season.',
    sourceValues: { 'markdown-percent': 0.118 },
    fallbackTextKey: 'narration.fallback.scorecard',
    generatedAt: '2026-07-28T02:00:00Z',
  },
  {
    id: 'narr-contribution-department',
    widgetId: 'contribution',
    contextKey: 'aw25|department|sales-value',
    text: 'Dresses led the range at 35.5% of sales value, ahead of Knitwear at 25.7%.',
    sourceValues: { 'dept-dresses': 1712000, 'dept-knitwear': 1240000 },
    fallbackTextKey: 'narration.fallback.contribution',
    generatedAt: '2026-07-28T02:00:00Z',
  },
  {
    id: 'narr-contribution-colour',
    widgetId: 'colour-contribution',
    contextKey: 'aw25|department|sales-units',
    text: 'Black took 30.7% of units, with Navy second at 22.2%.',
    sourceValues: { black: 34100, navy: 24600 },
    fallbackTextKey: 'narration.fallback.contribution',
    generatedAt: '2026-07-28T02:00:00Z',
  },
  {
    id: 'narr-cluster-performance',
    widgetId: 'cluster-performance',
    contextKey: 'aw25|department|sell-through',
    text: 'Premium Urban led on sell-through at 87.1%; Outlet trailed at 60.2%.',
    sourceValues: { 'cluster-a': 0.871, 'cluster-f': 0.602 },
    fallbackTextKey: 'narration.fallback.cluster',
    generatedAt: '2026-07-28T02:00:00Z',
  },
  {
    id: 'narr-carry-forward',
    widgetId: 'carry-forward',
    contextKey: 'aw25|department|sales-value',
    text: 'Two styles cleared the 15% surfacing threshold on sell-through and are candidates to carry forward.',
    sourceValues: { 'sell-through': 0.891 },
    fallbackTextKey: 'narration.fallback.carryForward',
    generatedAt: '2026-07-28T02:00:00Z',
  },
  /**
   * Intentionally stale: this asserts a category-by-cluster figure that no longer matches the
   * overview data, so it must degrade to its template rather than being shown. It exists to
   * make the grounding check observable in tests and in Storybook.
   */
  {
    id: 'narr-category-by-cluster-stale',
    widgetId: 'category-by-cluster',
    contextKey: 'aw25|department|sell-through',
    text: 'Dresses reached 99.4% sell-through in Premium Urban, the highest of any category.',
    sourceValues: { 'dept-dresses|cluster-a': 0.994 },
    fallbackTextKey: 'narration.fallback.cluster',
    generatedAt: '2026-07-28T02:00:00Z',
  },
];
