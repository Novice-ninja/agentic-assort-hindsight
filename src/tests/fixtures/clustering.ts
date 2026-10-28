import type {
  ApprovalGate,
  CandidateView,
  ChannelOption,
  Cluster,
  ClusterPlan,
  ClusterResultCandidate,
  ClusteringAttribute,
  ClusteringMetric,
  ClusteringPermissionScope,
  ClusteringRun,
  ClusteringTenantConfig,
  CountryOption,
  PerformanceStoreKpi,
  Pin,
  ProductOption,
  ReferencePeriod,
  RegionOption,
  SeasonOption,
  StoreClusterAssignment,
  Variant,
  VariantMetrics,
} from '@modules/clustering/types';
import { mapStoreKpisToCandidateView } from '@modules/clustering/services/mapStoreKpisToCandidateView';
import type { ClusteringPersonaId } from '@modules/clustering/services/persona';

export const clusteringConfigFixture: ClusteringTenantConfig = {
  significanceCutoff: 0.4,
  newStoreExclusionWeeks: 8,
  startingPoints: 3,
  kValueCount: 5,
};

export const clusteringMetricsFixture: ClusteringMetric[] = [
  {
    id: 'sales',
    labelKey: 'metrics.sales',
    format: 'currency',
    direction: 'higherIsBetter',
  },
  {
    id: 'marginPct',
    labelKey: 'metrics.marginPct',
    format: 'percentage',
    direction: 'higherIsBetter',
  },
  {
    id: 'separation',
    labelKey: 'metrics.separation',
    format: 'score',
    direction: 'higherIsBetter',
  },
];

export const productCatalogueFixture: ProductOption[] = [
  {
    id: 'womenswear',
    labelKey: 'products.womenswear',
    styleCount: 237,
    iconKey: 'womenswear',
  },
  { id: 'menswear', labelKey: 'products.menswear', styleCount: 237, iconKey: 'menswear' },
  { id: 'kidswear', labelKey: 'products.kidswear', styleCount: 237, iconKey: 'kidswear' },
];

export const seasonCatalogueFixture: SeasonOption[] = [
  { id: 'ss26', code: 'SS26', seasonKind: 'springSummer' },
  { id: 'aw26', code: 'AW26', seasonKind: 'autumnWinter' },
  { id: 'ss27', code: 'SS27', seasonKind: 'springSummer' },
  { id: 'aw27', code: 'AW27', seasonKind: 'autumnWinter' },
];

export const channelCatalogueFixture: ChannelOption[] = [
  { id: 'bnm', labelKey: 'channels.bnm', descriptionKey: 'channels.bnmDescription' },
  {
    id: 'wholesale',
    labelKey: 'channels.wholesale',
    descriptionKey: 'channels.wholesaleDescription',
  },
  {
    id: 'store',
    labelKey: 'channels.store',
    descriptionKey: 'channels.storeDescription',
  },
];

export const regionCatalogueFixture: RegionOption[] = [
  { id: 'europe', labelKey: 'regions.europe' },
  { id: 'americas', labelKey: 'regions.americas' },
  { id: 'apac', labelKey: 'regions.apac' },
];

export const countryCatalogueFixture: CountryOption[] = [
  {
    id: 'ua',
    name: 'Ukraine',
    regionId: 'europe',
    regionLabelKey: 'regions.europe',
    flagCode: 'UA',
  },
  {
    id: 'gb',
    name: 'United Kingdom',
    regionId: 'europe',
    regionLabelKey: 'regions.europe',
    flagCode: 'GB',
  },
  {
    id: 'ca',
    name: 'Canada',
    regionId: 'americas',
    regionLabelKey: 'regions.americas',
    flagCode: 'CA',
  },
  {
    id: 'jp',
    name: 'Japan',
    regionId: 'apac',
    regionLabelKey: 'regions.apac',
    flagCode: 'JP',
  },
];

export const fullPermissionScope: ClusteringPermissionScope = {
  productIds: ['womenswear', 'menswear', 'kidswear'],
  countryIds: ['ua', 'gb', 'ca', 'jp'],
  storeIds: ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9', 's10', 's-new'],
};

export const restrictedPermissionScope: ClusteringPermissionScope = {
  productIds: ['womenswear'],
  countryIds: ['ua', 'gb'],
  storeIds: ['s1', 's2'],
};

export const personaScopes: Record<ClusteringPersonaId, ClusteringPermissionScope> = {
  admin: fullPermissionScope,
  planner: fullPermissionScope,
  approver: fullPermissionScope,
  'signoff-owner': fullPermissionScope,
  'restricted-viewer': restrictedPermissionScope,
};

function plan(partial: ClusterPlan): ClusterPlan {
  return partial;
}

export const clusterPlanFixtures: ClusterPlan[] = [
  plan({
    id: 'cp-na-east',
    name: 'North America – East Coast',
    productId: 'womenswear',
    seasonId: 'ss26',
    channelId: 'bnm',
    countryIds: ['ca'],
    status: 'awaitingApproval',
    currentStep: 'signOff',
    clusterCount: null,
    channelLabelKey: 'channels.bnm',
    createdBy: 'Maya Chris',
    createdOn: '2026-05-22T10:00:00.000Z',
    locked: false,
  }),
  plan({
    id: 'cp-emea-west',
    name: 'EMEA – Western Europe',
    productId: 'womenswear',
    seasonId: 'ss26',
    channelId: 'bnm',
    countryIds: ['gb'],
    status: 'approved',
    currentStep: 'signOff',
    clusterCount: 4,
    channelLabelKey: 'channels.bnm',
    createdBy: 'Aiden Taylor',
    createdOn: '2026-05-21T10:00:00.000Z',
    locked: true,
  }),
  plan({
    id: 'cp-apac-jp',
    name: 'APAC – Japan Core',
    productId: 'menswear',
    seasonId: 'aw26',
    channelId: 'bnm',
    countryIds: ['jp'],
    status: 'inputNeeded',
    currentStep: 'reviewRun',
    clusterCount: null,
    channelLabelKey: 'channels.bnm',
    createdBy: 'Priya Shah',
    createdOn: '2026-05-20T10:00:00.000Z',
    locked: false,
    inputNeededReasonKey: 'inputNeededReasons.incompleteHistory',
  }),
  plan({
    id: 'cp-latam-br',
    name: 'LATAM – Brazil South',
    productId: 'kidswear',
    seasonId: 'ss26',
    channelId: 'wholesale',
    countryIds: ['ca'],
    status: 'awaitingApproval',
    currentStep: 'signOff',
    clusterCount: null,
    channelLabelKey: 'channels.wholesale',
    createdBy: 'Luis Romero',
    createdOn: '2026-05-19T10:00:00.000Z',
    locked: false,
  }),
  plan({
    id: 'cp-na-west',
    name: 'North America – West Coast',
    productId: 'womenswear',
    seasonId: 'aw26',
    channelId: 'store',
    countryIds: ['ca'],
    status: 'inputNeeded',
    currentStep: 'reviewRun',
    clusterCount: null,
    channelLabelKey: 'channels.store',
    createdBy: 'Maya Chris',
    createdOn: '2026-05-18T10:00:00.000Z',
    locked: false,
    inputNeededReasonKey: 'inputNeededReasons.incompleteHistory',
  }),
  plan({
    id: 'cp-emea-nordic',
    name: 'EMEA – Nordics',
    productId: 'menswear',
    seasonId: 'ss27',
    channelId: 'bnm',
    countryIds: ['gb'],
    status: 'approved',
    currentStep: 'signOff',
    clusterCount: 6,
    channelLabelKey: 'channels.bnm',
    createdBy: 'Aiden Taylor',
    createdOn: '2026-05-17T10:00:00.000Z',
    locked: true,
  }),
  plan({
    id: 'cp-apac-au',
    name: 'APAC – Australia',
    productId: 'kidswear',
    seasonId: 'ss26',
    channelId: 'bnm',
    countryIds: ['jp'],
    status: 'awaitingApproval',
    currentStep: 'signOff',
    clusterCount: null,
    channelLabelKey: 'channels.bnm',
    createdBy: 'Sam Lee',
    createdOn: '2026-05-16T10:00:00.000Z',
    locked: false,
  }),
  plan({
    id: 'cp-me-gcc',
    name: 'ME – GCC',
    productId: 'womenswear',
    seasonId: 'aw27',
    channelId: 'wholesale',
    countryIds: ['ua'],
    status: 'inputNeeded',
    currentStep: 'reviewRun',
    clusterCount: null,
    channelLabelKey: 'channels.wholesale',
    createdBy: 'Noor Ali',
    createdOn: '2026-05-15T10:00:00.000Z',
    locked: false,
    inputNeededReasonKey: 'inputNeededReasons.incompleteHistory',
  }),
  plan({
    id: 'cp-draft-scope',
    name: 'North America – Draft Scope',
    productId: 'womenswear',
    seasonId: 'ss26',
    channelId: 'bnm',
    countryIds: ['ca', 'gb'],
    status: 'draft',
    currentStep: 'scope',
    clusterCount: null,
    channelLabelKey: 'channels.bnm',
    createdBy: 'Maya Chris',
    createdOn: '2026-05-14T10:00:00.000Z',
    locked: false,
  }),
  plan({
    id: 'cp-review-ready',
    name: 'Review Ready – East',
    productId: 'womenswear',
    seasonId: 'ss26',
    channelId: 'bnm',
    countryIds: ['gb', 'ua'],
    status: 'draft',
    currentStep: 'reviewRun',
    clusterCount: null,
    channelLabelKey: 'channels.bnm',
    createdBy: 'Maya Chris',
    createdOn: '2026-05-13T10:00:00.000Z',
    locked: false,
  }),
  plan({
    id: 'cp-fail-run',
    name: 'Force Fail Run',
    productId: 'womenswear',
    seasonId: 'ss26',
    channelId: 'bnm',
    countryIds: ['gb'],
    status: 'draft',
    currentStep: 'reviewRun',
    clusterCount: null,
    channelLabelKey: 'channels.bnm',
    createdBy: 'Maya Chris',
    createdOn: '2026-05-12T10:00:00.000Z',
    locked: false,
    forceFail: true,
  }),
  plan({
    id: 'cp-finalize',
    name: 'Finalize Ready – Core',
    productId: 'womenswear',
    seasonId: 'ss26',
    channelId: 'bnm',
    countryIds: ['gb', 'ua'],
    status: 'draft',
    currentStep: 'finalize',
    clusterCount: null,
    channelLabelKey: 'channels.bnm',
    createdBy: 'Maya Chris',
    createdOn: '2026-05-11T10:00:00.000Z',
    locked: false,
  }),
];

export const attributeFixtures: ClusteringAttribute[] = [
  {
    id: 'sell-through',
    category: 'performance',
    labelKey: 'attributes.sellThrough',
    significance: 0.92,
    autoSelected: true,
    noData: false,
    userSelected: true,
  },
  {
    id: 'margin',
    category: 'performance',
    labelKey: 'attributes.margin',
    significance: 0.88,
    autoSelected: true,
    noData: false,
    userSelected: true,
  },
  {
    id: 'lost-sales',
    category: 'performance',
    labelKey: 'attributes.lostSales',
    significance: 0.31,
    autoSelected: false,
    noData: false,
    userSelected: false,
    exclusionReasonKey: 'review.cutoffBanner',
  },
  {
    id: 'full-price-mix',
    category: 'performance',
    labelKey: 'attributes.fullPriceMix',
    significance: 0.81,
    autoSelected: true,
    noData: false,
    userSelected: true,
  },
  {
    id: 'brand-tier',
    category: 'product',
    labelKey: 'attributes.brandTier',
    significance: 0.9,
    autoSelected: true,
    noData: false,
    userSelected: true,
  },
  {
    id: 'colour',
    category: 'product',
    labelKey: 'attributes.colour',
    significance: 0,
    autoSelected: false,
    noData: true,
    userSelected: false,
    exclusionReasonKey: 'review.noDataBanner',
  },
  {
    id: 'silhouette',
    category: 'product',
    labelKey: 'attributes.silhouette',
    significance: 0.74,
    autoSelected: true,
    noData: false,
    userSelected: true,
  },
  {
    id: 'climate',
    category: 'store',
    labelKey: 'attributes.climate',
    significance: 0.86,
    autoSelected: true,
    noData: false,
    userSelected: true,
  },
  {
    id: 'store-size',
    category: 'store',
    labelKey: 'attributes.storeSize',
    significance: 0.79,
    autoSelected: true,
    noData: false,
    userSelected: true,
  },
  {
    id: 'urbanicity',
    category: 'store',
    labelKey: 'attributes.urbanicity',
    significance: 0.83,
    autoSelected: true,
    noData: false,
    userSelected: true,
  },
];

export function variantMetricsFixture(
  overrides: Partial<VariantMetrics> = {},
): VariantMetrics {
  return {
    attributeCount: 4,
    average: 1.66,
    normalized: 0.55,
    clusterMin: 2,
    clusterMax: 8,
    clusterCount: 5,
    fitPercent: 55,
    storeCount: 49,
    smallStoreOverride: false,
    kValueCount: 7,
    startingPoints: 3,
    optionCount: 21,
    summary: null,
    ...overrides,
  };
}

/** Compact stand-in for `POST .../attributes/variants/{code}` used by MSW and integration tests. */
export function generateVariantsFixture(clusterPlanCode: string) {
  return {
    strategy: 'RANDOM_SUBSETS',
    variants: [
      {
        variantId: `${clusterPlanCode}-var-1`,
        clusterPlanCode,
        description: 'Random subset 1',
        variantName: 'var_iddf77vq',
        isDiscarded: false,
        isFinal: false,
        isAutoGenerated: true,
        attributesForVariant: { product: [], performance: ['aur'], store: [] },
        metrics: variantMetricsFixture(),
        strategyUsed: 'RANDOM_SUBSETS',
      },
      {
        variantId: `${clusterPlanCode}-var-2`,
        clusterPlanCode,
        description: 'Random subset 2',
        variantName: 'var_lbdv4x5b',
        isDiscarded: false,
        isFinal: false,
        isAutoGenerated: true,
        attributesForVariant: { product: [], performance: [], store: ['region_name'] },
        metrics: variantMetricsFixture({ clusterCount: 4, fitPercent: 40, optionCount: 15 }),
        strategyUsed: 'RANDOM_SUBSETS',
      },
      {
        variantId: `${clusterPlanCode}-var-3`,
        clusterPlanCode,
        description: 'Random subset 3',
        variantName: 'var_ok2q7e5t',
        isDiscarded: false,
        isFinal: false,
        isAutoGenerated: true,
        attributesForVariant: {
          product: ['color'],
          performance: [],
          store: ['region_name'],
        },
        metrics: variantMetricsFixture({ clusterCount: 6, fitPercent: 62, optionCount: 18 }),
        strategyUsed: 'RANDOM_SUBSETS',
      },
    ],
  };
}

/**
 * Stand-in for `POST /v1/summarize` with `cardType: 'cluster'` (Jest-only), shaped like the
 * `finalize_cluster_variant` prompt: `response` holds the section sentences, `cards` one entry
 * per variant (`variantId` + `name` echoed from the request, `response` its sentences).
 */
export function clusterVariantSummaryFixture(
  variants: Array<{ variantId: string; name: string }> = [
    { variantId: 'run-1', name: 'Full Proposal' },
    { variantId: 'run-2', name: 'Performance Lean' },
  ],
) {
  return {
    requestId: 'c1f1a2b3-4d5e-4f60-9a7b-8c9d0e1f2a3b',
    promptKey: 'finalize_cluster_variant',
    promptVersion: 2,
    response: [
      'Full Proposal separates stores most cleanly (silhouette 0.40 vs 0.29) while keeping stability above 0.66.',
      'One consideration: it includes several single-store tracks.',
    ],
    model: 'gpt-6-luna',
    latencyMs: 1480,
    cards: variants.map(({ variantId, name }, index) => ({
      variantId,
      name,
      response: [
        index === 0
          ? 'Highest separation and stability of the set; the recommended pick for a performance-led assortment.'
          : 'Fewer clusters trade separation for simpler store groupings; consider when operational simplicity matters more than fit.',
      ],
    })),
  };
}

/** Stand-in for `POST /v1/summarize` with `cardType: 'cluster_performance'` (Jest-only). */
export function clusterPerformanceSummaryFixture() {
  return {
    requestId: 'd2e2b3c4-5f6a-4b71-8c9d-0e1f2a3b4c5d',
    promptKey: 'cluster_performance',
    promptVersion: 1,
    response: [
      'BnM Tasman/Marlborough is the strongest cluster on margin (100% vs 42% for BnM Nelson) despite a single store.',
      'Bullet 2: BnM Nelson carries two stores but trails on both sales and margin — review its assortment depth before sign-off.',
    ],
    model: 'gpt-4o-mini',
    latencyMs: 1120,
  };
}

/** Stand-in for `POST /v1/summarize` with `cardType: 'cluster_attribute'` (Jest-only). */
export function attributeGradesSummaryFixture(metric = 'attribute') {
  return {
    requestId: 'e3f3c4d5-6a7b-4c82-9d0e-1f2a3b4c5d6e',
    promptKey: 'cluster_attribute',
    promptVersion: 1,
    response: [
      `Core dominates the ${metric} mix in BnM Tasman/Marlborough (65%) while BnM 1 leans Seasonal.`,
      'Bullet 2: Seasonal share is the main differentiator between the two clusters.',
    ],
    model: 'gpt-4o-mini',
    latencyMs: 980,
  };
}

/** Compact stand-in for `POST .../attributes/variants/custom` used by MSW and integration tests. */
export function customVariantFixture(clusterPlanCode: string) {
  return {
    variantId: `${clusterPlanCode}-custom-1`,
    clusterPlanCode,
    variantName: 'Custom Variant 1',
    isDiscarded: false,
    isAutoGenerated: false,
    attributesForVariant: {
      product: ['color'],
      performance: ['qty_sold', 'revenue'],
      store: ['region_name'],
    },
    metrics: variantMetricsFixture({ clusterCount: 3, fitPercent: 48, optionCount: 12 }),
    strategyUsed: 'CUSTOM',
  };
}

/**
 * Stand-in for `POST /v1/clustering/plans/{code}/runs`. One result per requested variant, in
 * request order; names echo the request so tests can assert the mapping end to end.
 */
export function clusterRunFixture(
  clusterPlanCode: string,
  variantNames: string[] = ['Full Proposal', 'Performance Lean'],
) {
  const templates = [
    {
      chosenK: 37,
      stores: 45,
      clusters: [
        { label: 'BnM A7 Auckland', stores: 1 },
        { label: 'BnM A8 Otago', stores: 1 },
        { label: 'BnM A8 Wellington', stores: 1 },
      ],
      scores: {
        silhouette: 0.39880806765617405,
        stability: 0.6635102137712674,
        daviesBouldin: 0.9139605779155714,
        calinskiHarabasz: 245.1344411998461,
      },
    },
    {
      chosenK: 17,
      stores: 45,
      clusters: [
        { label: 'BnM B2 Canterbury', stores: 2 },
        { label: 'BnM B3 Bay Of Plenty', stores: 3 },
      ],
      scores: {
        silhouette: 0.2871,
        stability: 0.5412,
        daviesBouldin: 1.1042,
        calinskiHarabasz: 180.5,
      },
    },
    {
      chosenK: 5,
      stores: 45,
      clusters: [
        { label: 'BnM C1', stores: 9 },
        { label: 'BnM C2', stores: 11 },
        { label: 'BnM C3', stores: 8 },
        { label: 'BnM C4', stores: 10 },
        { label: 'BnM C5', stores: 7 },
      ],
      scores: {
        silhouette: 0.5123,
        stability: 0.7201,
        daviesBouldin: 0.88,
        calinskiHarabasz: 301.2,
      },
    },
  ];
  return {
    clusterPlanCode,
    variants: variantNames.map((name, index) => ({
      name,
      variantId: `${clusterPlanCode}-run-${index + 1}`,
      ...templates[index % templates.length],
    })),
  };
}

/**
 * Stand-in for `GET /v1/clustering/plans/{code}/store_assignments?variantId=…` (Jest-only).
 * Deterministic and different per variant: the variant's trailing number decides K and the
 * store → cluster spread, so "Compare All" shows real disagreement between options.
 */
export function storeAssignmentsFixture(clusterPlanCode: string, variantId: string) {
  const tail = variantId.split('-').pop() ?? variantId;
  const ordinal = /^\d+$/.test(tail)
    ? Number(tail)
    : Math.max(1, tail.toLowerCase().charCodeAt(0) - 'a'.charCodeAt(0) + 1);
  const chosenK = 2 + (ordinal % 3);
  const stores = [
    ['1004', 'Briscoes KeriKeri'],
    ['1008', 'Briscoes Wairau Park'],
    ['1009', 'Briscoes Westgate'],
    ['1010', 'Briscoes Henderson'],
    ['1011', 'Briscoes Botany'],
    ['1012', 'Briscoes Manukau'],
    ['1050', 'Briscoes Salisbury St'],
  ] as const;
  const clusters = Array.from({ length: chosenK }, (_, index) => ({
    clusterName: `Cluster ${index + 1}`,
    label: `C${index + 1}`,
    storeCount: 0,
    productLabel: `BnM ${String.fromCharCode(65 + index)}`,
    performanceLabel: `BnM ${index + 1}`,
    storeLabel: `BnM Cluster ${index + 1}`,
  }));
  const assignments = stores.map(([store_code, storeName], index) => {
    const cluster = clusters[(index + ordinal) % chosenK];
    cluster.storeCount += 1;
    return {
      store_code,
      storeName,
      clusterName: cluster.clusterName,
      label: cluster.label,
    };
  });
  return {
    clusterPlanCode,
    variantId,
    variantName: `Variant ${ordinal}`,
    channel: 'BnM',
    chosenK,
    clusters,
    assignments,
  };
}

/** Catalogue metricKey → camelCase dataset field for the performance scatter. */
export const performanceMetricsMapperFixture: Record<string, string> = {
  revenue: 'revenue',
  qty_sold: 'qtySold',
  gross_margin: 'grossMargin',
  gross_margin_pct: 'grossMarginPct',
  sell_thru_pct: 'sellThruPct',
  mark_down_pct: 'markDownPct',
  weeks_on_hand: 'weeksOnHand',
  receipts_units: 'receiptsUnits',
  receipts_revenue: 'receiptsRevenue',
  aur: 'aur',
  buy_units: 'buyUnits',
  ros: 'ros',
  sell_thru_eop_pct: 'sellThruEopPct',
  receipts_cost: 'receiptsCost',
  sales_contribution: 'salesContribution',
  discount_pct: 'discountPct',
  option_count: 'optionCount',
  depth: 'depth',
  lost_sales: 'lostSales',
  margin: 'margin',
};

/**
 * Stand-in for `POST /v1/clustering/performance/info` (Jest + MSW).
 * Mapper covers every charts-season key so default X/Y/Z (ST% / Margin / AUR) plot.
 */
export function performanceInfoFixture(_clusterPlanCode: string, variantId: string) {
  const tail = variantId.split('-').pop() ?? variantId;
  const shift = /^\d+$/.test(tail)
    ? Number(tail)
    : Math.max(1, tail.toLowerCase().charCodeAt(0) - 'a'.charCodeAt(0) + 1);
  const stores = [
    ['8001', 'BnM 1'],
    ['8002', 'BnM A'],
    ['8003', 'BnM Auckland'],
  ] as const;
  const datasets = stores.map(([storeCode, clusterName], index) => {
    const n = index + shift;
    return {
      clusterName,
      storeCode,
      qtySold: String(7000 + n * 80),
      revenue: String(200000 + n * 12000),
      buyUnits: String(400 + n * 10),
      sellThruPct: String(0.7 + n * 0.02),
      margin: String(4000 + n * 250),
      aur: String(9 + n * 0.4),
      grossMargin: String(3500 + n * 200),
      grossMarginPct: String(0.4 + n * 0.02),
      markDownPct: String(0.1 + n * 0.01),
      weeksOnHand: String(5 + n * 0.3),
      receiptsUnits: String(900 + n * 20),
      receiptsRevenue: String(150000 + n * 5000),
      ros: String(2 + n * 0.1),
      sellThruEopPct: String(0.65 + n * 0.02),
      receiptsCost: String(80000 + n * 2000),
      salesContribution: String(0.05 + n * 0.01),
      discountPct: String(0.08 + n * 0.005),
      optionCount: String(80 + n),
      depth: String(12 + n),
      lostSales: String(200 + n * 15),
    };
  });
  const storeCount = datasets.reduce<Record<string, number>>((counts, row) => {
    counts[row.clusterName] = (counts[row.clusterName] ?? 0) + 1;
    return counts;
  }, {});
  return {
    type: 'scatter' as const,
    meta: { metricsMapper: { ...performanceMetricsMapperFixture } },
    datasets,
    storeCount,
  };
}

/** Stand-in for `POST /v1/clustering/get-cluster-plans` (inner body, before the outer `{ data }`). */
export function clusterPlansFixture() {
  return {
    data: [
      {
        clusterName: 'BnM Tasman__ia_char_03Marlborough',
        suggestedName: 'BnM Tasman__ia_char_03Marlborough',
        stores: 1,
        sales: 12985.5,
        marginPct: 100,
        productLabel: 'BnM Tasman',
        performanceLabel: 'BnM 1',
        storeLabel: 'BnM Marlborough',
      },
      {
        clusterName: 'BnM Nelson',
        suggestedName: '',
        stores: 2,
        sales: 8400,
        marginPct: 42,
      },
    ],
    meta: {
      kpiColumns: [
        { label: 'Cluster Name', value: 'clusterName' },
        { label: 'Suggested Name', value: 'suggestedName' },
        { label: 'Stores', value: 'stores' },
        { label: 'Sales', value: 'sales' },
        { label: 'Margin Pct', value: 'marginPct' },
      ],
    },
  };
}

/** Stand-in for `POST /v1/clustering/kpi-breakdown` (inner body, before the outer `{ data }`). */
export function kpiBreakdownFixture() {
  return {
    data: [
      {
        articleValueStreamDescription: 95721.48,
        clusterName: 'BnM 4',
        color: 23794.01,
        qtySold: 3246.38,
        revenue: 96038.52,
        storeCodes: ['8003', '8011', '8056', '8068'],
        stores: 4,
      },
      {
        articleValueStreamDescription: 0,
        clusterName: 'BnM Tasman__ia_char_03Marlborough',
        color: 0,
        qtySold: 0,
        revenue: 0,
        storeCodes: ['8059', '8089'],
        stores: 2,
      },
    ],
    meta: {
      kpiColumns: [
        { label: 'Article Value Stream Description', value: 'articleValueStreamDescription' },
        { label: 'Color', value: 'color' },
        { label: 'Quantity Sold', value: 'qtySold' },
        { label: 'Revenue', value: 'revenue' },
      ],
    },
  };
}

/** Stand-in for `POST /v1/clustering/plans/{code}/approved`; echoes the submitted variant. */
export function clusterApprovalFixture(clusterPlanCode: string, variantId: string) {
  return {
    clusterPlanCode,
    variantId,
    approvedVariantId: `${variantId}-approved`,
    approvedVariantName: 'Full Proposal',
    chosenK: 37,
    stores: 45,
  };
}

/** Compact stand-in for `POST .../significance-score/{code}` used by MSW and integration tests. */
export function attributeSignificanceScoreFixture(clusterPlanCode: string) {
  return {
    meta: {
      strategy: 'TOP_K_WITH_THRESHOLD',
      scoreThreshold: 0.5,
      topKAttributes: 4,
      targetTotalAttributes: 5,
    },
    performanceAttributes: {
      recommended: [
        {
          clusterPlanCode,
          attributeName: 'revenue',
          score: 0.63,
          rank: 1,
          isRecommended: true,
        },
        {
          clusterPlanCode,
          attributeName: 'gross_margin',
          score: 0.62,
          rank: 2,
          isRecommended: true,
        },
        {
          clusterPlanCode,
          attributeName: 'qty_sold',
          score: 0.55,
          rank: 3,
          isRecommended: true,
        },
      ],
      excluded: [
        {
          clusterPlanCode,
          attributeName: 'sell_thru_pct',
          score: 0.22,
          rank: 4,
          isRecommended: false,
          exclusionReason:
            'excluded — its score is under the 0.50 cutoff, so it barely separates your stores.',
        },
        {
          clusterPlanCode,
          attributeName: 'aur',
          score: 0.11,
          rank: 5,
          isRecommended: false,
          exclusionReason:
            'excluded — its score is under the 0.50 cutoff, so it barely separates your stores.',
        },
      ],
    },
    productAttributes: {
      recommended: [
        {
          clusterPlanCode,
          attributeName: 'color',
          score: 8.05,
          rank: 1,
          isRecommended: true,
        },
      ],
      excluded: [
        {
          clusterPlanCode,
          attributeName: 'article_brand_name',
          score: 1.95,
          rank: 5,
          isRecommended: false,
          exclusionReason:
            'excluded — it ranks lower than the top-performing attributes selected for this scope.',
        },
      ],
    },
    storeAttributes: {
      recommended: [
        {
          cluster_plan_code: clusterPlanCode,
          attribute_name: 'region_name',
          isRecommended: true,
        },
      ],
      excluded: [],
    },
  };
}

export const variantFixtures: Variant[] = [
  {
    id: 'variant-a',
    labelKey: 'variants.fullProposal',
    attributeIds: [
      'sell-through',
      'margin',
      'full-price-mix',
      'brand-tier',
      'silhouette',
      'climate',
      'store-size',
      'urbanicity',
    ],
    removed: false,
    isAutoGenerated: true,
    aiSummary: 'Full proposal keeps every confirmed attribute.',
    metrics: variantMetricsFixture(),
  },
  {
    id: 'variant-b',
    labelKey: 'variants.performanceLean',
    attributeIds: ['sell-through', 'margin', 'full-price-mix'],
    removed: false,
    isAutoGenerated: true,
    aiSummary: 'Performance lean keeps the scoring attributes.',
    metrics: variantMetricsFixture({ clusterCount: 8, fitPercent: 40, optionCount: 15 }),
  },
  {
    id: 'variant-c',
    labelKey: 'variants.highestScores',
    attributeIds: ['sell-through', 'brand-tier', 'climate'],
    removed: false,
    isAutoGenerated: true,
    metrics: null,
  },
];

export const periodFixtures: ReferencePeriod[] = [
  {
    id: 'ss26',
    labelKey: 'periods.ss26',
    startDate: '2026-02-01',
    endDate: '2026-07-31',
    completenessPct: 98,
  },
  {
    id: 'aw25',
    labelKey: 'periods.aw25',
    startDate: '2025-08-01',
    endDate: '2026-01-31',
    completenessPct: 100,
  },
  {
    id: 'ss25',
    labelKey: 'periods.ss25',
    startDate: '2025-02-01',
    endDate: '2025-07-31',
    completenessPct: 72,
  },
];

export const candidateFixtures: ClusterResultCandidate[] = [
  {
    id: 'cand-1',
    planId: 'cp-finalize',
    runId: 'run-finalize',
    variantId: 'variant-a',
    name: 'Full Proposal · K4',
    k: 4,
    separation: 0.86,
    stability: 0.81,
    businessFit: 0.9,
    storesPerCluster: [12, 10, 9, 14],
    storesChangedCount: 6,
    storesChangedPct: 13,
    recommended: true,
    selected: false,
  },
  {
    id: 'cand-2',
    planId: 'cp-finalize',
    runId: 'run-finalize',
    variantId: 'variant-b',
    name: 'Performance Lean · K5',
    k: 5,
    separation: 0.91,
    stability: 0.77,
    businessFit: 0.84,
    storesPerCluster: [8, 11, 9, 7, 10],
    storesChangedCount: 9,
    storesChangedPct: 20,
    recommended: false,
    selected: false,
  },
  {
    id: 'cand-3',
    planId: 'cp-finalize',
    runId: 'run-finalize',
    variantId: 'variant-c',
    name: 'Highest Scores · K4',
    k: 4,
    separation: 0.8,
    stability: 0.88,
    businessFit: 0.79,
    storesPerCluster: [15, 8, 12, 10],
    storesChangedCount: 4,
    storesChangedPct: 9,
    recommended: false,
    selected: false,
  },
];

const openedLongAgo = '2024-01-01T00:00:00.000Z';
const openedRecently = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();

export const assignmentFixtures: StoreClusterAssignment[] = [
  {
    storeId: 's1',
    storeName: 'Oxford Street',
    clusterId: 'c1',
    confidence: 0.92,
    onFence: false,
    pinned: false,
    excluded: false,
    openedOn: openedLongAgo,
  },
  {
    storeId: 's2',
    storeName: 'Kingston',
    clusterId: 'c1',
    confidence: 0.61,
    onFence: true,
    pinned: false,
    excluded: false,
    openedOn: openedLongAgo,
  },
  {
    storeId: 's3',
    storeName: 'Manchester',
    clusterId: 'c2',
    confidence: 0.88,
    onFence: false,
    pinned: false,
    excluded: false,
    openedOn: openedLongAgo,
  },
  {
    storeId: 's4',
    storeName: 'Leeds',
    clusterId: 'c2',
    confidence: 0.84,
    onFence: false,
    pinned: false,
    excluded: false,
    openedOn: openedLongAgo,
  },
  {
    storeId: 's5',
    storeName: 'Kyiv Centre',
    clusterId: 'c3',
    confidence: 0.9,
    onFence: false,
    pinned: false,
    excluded: false,
    openedOn: openedLongAgo,
  },
  {
    storeId: 's-new',
    storeName: 'New Flagship',
    clusterId: 'c1',
    confidence: 0.5,
    onFence: false,
    pinned: false,
    excluded: true,
    exclusionReasonKey: 'finalize.exclusion.openWeeks',
    openedOn: openedRecently,
  },
];

export const clusterFixtures: Cluster[] = [
  {
    id: 'c1',
    candidateId: 'cand-1',
    name: 'C1 – Urban Premium',
    defaultName: 'C1 – Urban Premium',
    storeCount: 12,
    sales: 4200000,
    marginPct: 0.42,
    onFenceCount: 1,
  },
  {
    id: 'c2',
    candidateId: 'cand-1',
    name: 'C2 – Suburban Core',
    defaultName: 'C2 – Suburban Core',
    storeCount: 10,
    sales: 3100000,
    marginPct: 0.38,
    onFenceCount: 0,
  },
  {
    id: 'c3',
    candidateId: 'cand-1',
    name: 'C3 – Value',
    defaultName: 'C3 – Value',
    storeCount: 9,
    sales: 1800000,
    marginPct: 0.31,
    onFenceCount: 0,
  },
  {
    id: 'c4',
    candidateId: 'cand-1',
    name: 'C4 – Outlet',
    defaultName: 'C4 – Outlet',
    storeCount: 14,
    sales: 2200000,
    marginPct: 0.28,
    onFenceCount: 0,
  },
];

/** Tiny store slice for unit tests — same shape as the Finalize JSON dummy. */
export const finalizeStoreKpiFixtures: PerformanceStoreKpi[] = [
  {
    store_code: 'NL0001',
    store_name: 'Beek Makado',
    performance_cluster_name: 'Netherlands 2',
    attribute_cluster_name: 'Netherlands A',
    cluster_display_name: null,
    store_cluster_name: 'Netherlands Cooler',
    climate: 'Cooler',
    store_sizing: 'S',
    is_highlight: true,
    attribute_value: JSON.stringify({
      good_better_best__Best: 0.2,
      good_better_best__Good: 0.1,
      good_better_best__Better: 0.7,
      good_better_best__Other_Good_Better_Best: 0,
    }),
    st: '0.79',
    APS: '2.6',
    AUR: '10.66',
    GMROI: '410',
    margin: '5544',
    margin_perc: '0.60',
    sales_units: '859',
    sales_retail: '9158',
    unit_receipts: '1301',
  },
  {
    store_code: 'BE0001',
    store_name: 'Antwerp Meir',
    performance_cluster_name: 'Belgium 1',
    attribute_cluster_name: 'Belgium A',
    cluster_display_name: null,
    store_cluster_name: 'Belgium Mixed',
    climate: 'Mild',
    store_sizing: 'M',
    is_highlight: false,
    attribute_value: JSON.stringify({
      good_better_best__Best: 0.1,
      good_better_best__Good: 0.3,
      good_better_best__Better: 0.5,
      good_better_best__Other_Good_Better_Best: 0.1,
    }),
    st: '0.71',
    APS: '2.1',
    AUR: '9.4',
    GMROI: '300',
    margin: '4100',
    margin_perc: '0.50',
    sales_units: '640',
    sales_retail: '7200',
    unit_receipts: '980',
  },
];

export function candidateViewFixture(candidateId: string): CandidateView {
  return mapStoreKpisToCandidateView(finalizeStoreKpiFixtures, candidateId);
}

export const gateFixturesFor = (planId: string): ApprovalGate[] => [
  { planId, gate: 2, status: 'pending', actionedBy: null, actionedOn: null },
  { planId, gate: 3, status: 'pending', actionedBy: null, actionedOn: null },
];

export const signOffContextFixture = {
  approverName: 'Alex Morgan',
  approverRoleKey: ' Merchandising Director',
  scopeLabel: 'Womenwear · SS26 · Brick And Mortar',
  scopeDepartmentKey: 'products.womenswear',
};

/**
 * `POST /v1/clustering/season_info` response (Jest-only). Season code 11 answers with the
 * documented example; any other code derives distinct LY / LLY entries from it so tests can
 * prove a season change refreshes the data.
 */
export function seasonInfosFixture(seasonCode: number) {
  if (seasonCode === 11) {
    return {
      ly: {
        seasonCode: 9,
        seasonName: '2027 Autumn__ia_char_03Winter',
        seasonStartDate: '2026-12-28',
        seasonEndDate: '2027-07-04',
        seasonCoverage: 50,
      },
      lly: {
        seasonCode: 7,
        seasonName: '2026 Autumn__ia_char_03Winter',
        seasonStartDate: '2025-12-29',
        seasonEndDate: '2026-06-28',
        seasonCoverage: 50,
      },
    };
  }
  return {
    ly: {
      seasonCode: seasonCode - 2,
      seasonName: `LY Season ${seasonCode - 2}__ia_char_03Ref`,
      seasonStartDate: '2025-02-01',
      seasonEndDate: '2025-07-31',
      seasonCoverage: 63,
    },
    lly: {
      seasonCode: seasonCode - 4,
      seasonName: `LLY Season ${seasonCode - 4}__ia_char_03Ref`,
      seasonStartDate: '2024-02-01',
      seasonEndDate: '2024-07-31',
      seasonCoverage: 37,
    },
  };
}

/** `PUT /v1/clustering/plans/state-transition/{code}` response (Jest-only). */
export function stateTransitionFixture(clusterPlanCode: string, section: string) {
  return {
    clusterPlanCode,
    section,
    status: 'AWAITING_APPROVAL',
    substatus: 'GATE_2_APPROVAL_PENDING',
  };
}

/** `GET /v1/auth/me` — the authenticated user, shown as the Gate 3 approver (Jest-only). */
export const authMeFixture = {
  uid: '123456',
  email: 'qa@impactanalytics.co',
  name: 'QA Approver',
  email_verified: true,
  user_id: 'local_dummy_user',
  tenant: 'local',
  auth_provider: 'Firebase',
};

export const succeededRunFixture: ClusteringRun = {
  id: 'run-finalize',
  planId: 'cp-finalize',
  status: 'succeeded',
  startedAt: '2026-05-11T11:00:00.000Z',
  completedAt: '2026-05-11T11:01:20.000Z',
  expectedSeconds: 60,
  proposedK: 4,
  modelFitPct: 0.87,
};

export const pinFixtures: Pin[] = [];
