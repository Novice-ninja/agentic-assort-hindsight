import type { PlanDto } from '@modules/planning/api';
import type {
  ClusteringScenario,
  FilterFieldConfig,
  FilterOption,
  FiscalYear,
  Plan,
  ProductHierarchyNode,
  SeasonYear,
} from '@modules/planning/types';

/**
 * Deterministic stand-in for `GET /v1/filters/config` (any `config_key`): two cascaded product
 * levels plus a non-product `channel` field, which `toHierarchyLevels` must ignore.
 */
export const filterConfigFieldFixtures: FilterFieldConfig[] = [
  {
    key: 'division',
    label: 'Division',
    dimension: 'product',
    type: 'cascaded',
    mandatory: true,
    multi_select: true,
  },
  {
    key: 'department',
    label: 'Department',
    dimension: 'product',
    type: 'cascaded',
    mandatory: false,
    multi_select: true,
  },
  {
    key: 'channel',
    label: 'Channel',
    dimension: 'store',
    type: 'list',
    mandatory: false,
    multi_select: false,
  },
];

export const filterConfigHashFixture = 'cfg-hash-test';

/** Values served by the test `POST /v1/filters/values` handler, keyed by attribute. */
export const filterValueFixtures: Record<string, FilterOption[]> = {
  division: [
    { value: 'womenswear', id: 'womenswear', label: 'Womenswear', path: 'womenswear' },
    { value: 'menswear', id: 'menswear', label: 'Menswear', path: 'menswear' },
  ],
  department: [
    {
      value: 'dresses',
      id: 'dresses',
      label: 'Dresses',
      path: 'womenswear____dresses',
    },
    { value: 'tops', id: 'tops', label: 'Tops', path: 'womenswear____tops' },
    { value: 'suits', id: 'suits', label: 'Suits', path: 'menswear____suits' },
  ],
  channel: [
    { value: 'BnM', id: 'BnM', label: 'BnM', path: 'BnM' },
    { value: 'WEB', id: 'WEB', label: 'WEB', path: 'WEB' },
    { value: 'WHS', id: 'WHS', label: 'WHS', path: 'WHS' },
  ],
};

export const fiscalYearFixtures: FiscalYear[] = [
  { id: 'fy2025', label: 'FY2025', tag: 'complete', seasons: ['AW24', 'SS25'] },
  { id: 'fy2026', label: 'FY2026', tag: 'current', seasons: ['AW25', 'SS26'] },
  { id: 'fy2027', label: 'FY2027', tag: 'future', seasons: ['AW26', 'SS27'] },
];

let seasonCodeSeed = 70;

function season(name: string, startDate: string, endDate: string) {
  return {
    seasonCode: ++seasonCodeSeed,
    name,
    seasonType: name.startsWith('SS') ? 'Spring/Summer' : 'Autumn/Winter',
    seasonStatus: true,
    seasonStartDate: startDate,
    seasonEndDate: endDate,
    seasonDisplayName: name,
  };
}

/** What `/v1/plans/seasons` answers with: fiscal years, each holding its trading seasons. */
export const seasonYearFixtures: SeasonYear[] = [
  {
    year: 2025,
    seasons: [
      season('AW24', '2024-08-01', '2025-01-31'),
      season('SS25', '2025-02-01', '2025-07-31'),
    ],
  },
  {
    year: 2026,
    seasons: [
      season('AW25', '2025-08-01', '2026-01-31'),
      season('SS26', '2026-02-01', '2026-07-31'),
    ],
  },
  {
    year: 2027,
    seasons: [
      season('AW26', '2026-08-01', '2027-01-31'),
      season('SS27', '2027-02-01', '2027-07-31'),
    ],
  },
];

export const taxonomyFixtures: ProductHierarchyNode[] = [
  { id: 'dep-ww', level: 'department', label: 'Womenswear', styleCount: 234 },
  { id: 'dep-mw', level: 'department', label: 'Menswear', styleCount: 188 },
  { id: 'dep-kw', level: 'department', label: 'Kidswear', styleCount: 96 },
  { id: 'cls-tops', level: 'class', parentId: 'dep-ww', label: 'Tops', styleCount: 42 },
  { id: 'cls-bottoms', level: 'class', parentId: 'dep-ww', label: 'Bottoms', styleCount: 38 },
  { id: 'cls-dresses', level: 'class', parentId: 'dep-ww', label: 'Dresses', styleCount: 27 },
  { id: 'cls-outerwear', level: 'class', parentId: 'dep-ww', label: 'Outerwear', styleCount: 19 },
  { id: 'sub-tees', level: 'subClass', parentId: 'cls-tops', label: 'Tees', styleCount: 14 },
  { id: 'sub-blouses', level: 'subClass', parentId: 'cls-tops', label: 'Blouses', styleCount: 12 },
  { id: 'sub-denim', level: 'subClass', parentId: 'cls-bottoms', label: 'Denim', styleCount: 9 },
  { id: 'sub-skirts', level: 'subClass', parentId: 'cls-bottoms', label: 'Skirts', styleCount: 7 },
  {
    id: 'sku-wm7291',
    level: 'sku',
    parentId: 'sub-tees',
    label: 'Classic Crew Tee',
    skuCode: 'WM-7291',
    productType: 'tee',
    styleCount: 1,
  },
  {
    id: 'sku-wm7314',
    level: 'sku',
    parentId: 'sub-tees',
    label: 'Relaxed Pocket Tee',
    skuCode: 'WM-7314',
    productType: 'tee',
    styleCount: 1,
  },
  {
    id: 'sku-wm8002',
    level: 'sku',
    parentId: 'sub-denim',
    label: 'High-Rise Straight Jean',
    skuCode: 'WM-8002',
    productType: 'denim',
    styleCount: 1,
  },
];

export const clusteringScenarioFixtures: ClusteringScenario[] = [
  {
    id: 'cs-revenue',
    name: 'Revenue-Tiered',
    confidencePct: 91,
    tag: 'recommended',
    description: 'Segments stores into revenue tiers. Ideal for depth planning and buy allocation.',
    segmentBreakdown: '18 Premium Stores, 34 High Street, 22 Suburban, 7 Outlet',
    iconUrl: '/src/assets/icons/planning/revenue-tiered-icon.png',
    iconBg: '#FFFBE5',
    confidenceColor: '#26734B',
    segments: [
      { label: '18 Premium Stores' },
      { label: '34 High Street' },
      { label: '22 Suburban' },
      { label: '7 Outlet' },
    ],
  },
  {
    id: 'cs-format',
    name: 'Format & Geography',
    confidencePct: 84,
    tag: 'alternative',
    description: 'Group by store format and proximity for better ranging and assortment.',
    segmentBreakdown: '12 Large City, 34 Std. City, 44 Std. Suburban, 22 Small City, 7 Outlet',
    iconUrl: '/src/assets/icons/planning/format-geography-icon.png',
    iconBg: '#F5F9EC',
    confidenceColor: '#9D831C',
    segments: [
      { label: '12 Large City' },
      { label: '34 Std. City' },
      { label: '44 Std.Suburban' },
      { label: '22 Small City' },
      { label: '7 Outlet' },
    ],
  },
  {
    id: 'cs-st',
    name: 'ST% Performance',
    confidencePct: 77,
    tag: 'experimental',
    description: 'Groups by sell-through rate history. Useful for markdown planning.',
    segmentBreakdown: 'ST (≥75%)- 24 Stores, ST (65-75%)- 14 Stores, ST (<65%)- 14 Stores',
    iconUrl: '/src/assets/icons/planning/st-performance-icon.png',
    iconBg: '#ECEEFD',
    confidenceColor: '#9D831C',
    segments: [
      { label: 'ST (≥75%)- 24 Stores', color: 'success' },
      { label: 'ST (65-75%)- 14 Stores', color: 'warning' },
      { label: 'ST (<65%)- 14 Stores', color: 'error' },
    ],
  },
];

function makePlan(overrides: Partial<Plan> & Pick<Plan, 'id' | 'name' | 'status'>): Plan {
  return {
    isDeleted: false,
    fiscalYearId: 'fy2026',
    season: 'SS26',
    referenceSeasonCode: 70,
    startingPoint: 'startFresh',
    scope: { departmentId: 'dep-ww', classIds: ['cls-tops'], subClassIds: [], skuIds: [] },
    hierarchyScope: [
      { levelName: 'Department', levelNo: 'l0_name', selectedValues: ['Womenswear'] },
      { levelName: 'Category', levelNo: 'l1_name', selectedValues: ['Tops'] },
    ],
    clusteringScenarioId: 'cs-revenue',
    runMode: 'gated',
    confidenceThreshold: 80,
    pipelineMode: 'gated',
    currentStep: 1,
    metrics: [
      { key: 'Revenue', value: 51_400_000 },
      { key: 'Qty Sold', value: 1_240_000 },
      { key: 'Margin', value: 29_812_000 },
    ],
    tags: { season: 'SS26', categories: ['Womenswear'], cluster: 'A, B, C' },
    createdBy: 'planner@impactanalytics.co',
    createdAt: '2026-07-01T09:00:00.000Z',
    updatedAt: '2026-07-20T09:00:00.000Z',
    ...overrides,
  };
}

export const planFixtures: Plan[] = [
  makePlan({
    id: 'plan-001',
    name: 'SS26 Womenswear – Scenario B',
    status: 'inProgress',
    currentStep: 5,
  }),
  makePlan({
    id: 'plan-002',
    name: 'SS26 Menswear – Core',
    status: 'inProgress',
    currentStep: 3,
    tags: { season: 'SS26', categories: ['Menswear'], cluster: 'A, B' },
    metrics: [
      { key: 'Revenue', value: 38_900_000 },
      { key: 'Qty Sold', value: 940_000 },
      { key: 'Margin', value: 21_395_000 },
    ],
  }),
  makePlan({
    id: 'plan-003',
    name: 'AW26 Womenswear – Outerwear Push',
    status: 'inProgress',
    season: 'AW26',
    fiscalYearId: 'fy2027',
    currentStep: 2,
    tags: { season: 'AW26', categories: ['Womenswear'], cluster: 'B, C' },
  }),
  makePlan({ id: 'plan-004', name: 'SS26 Kidswear – Value', status: 'draft', currentStep: 1 }),
  makePlan({
    id: 'plan-005',
    name: 'SS26 Womenswear – Premium',
    status: 'draft',
    currentStep: 1,
  }),
  makePlan({ id: 'plan-006', name: 'AW26 Menswear – Draft', status: 'draft', currentStep: 1 }),
  makePlan({
    id: 'plan-007',
    name: 'SS25 Womenswear – Review',
    status: 'review',
    fiscalYearId: 'fy2025',
    season: 'SS25',
    currentStep: 9,
  }),
  makePlan({
    id: 'plan-008',
    name: 'SS25 Menswear – Approved',
    status: 'approved',
    fiscalYearId: 'fy2025',
    season: 'SS25',
    currentStep: 10,
  }),
  makePlan({
    id: 'plan-009',
    name: 'AW24 Womenswear – Approved',
    status: 'approved',
    fiscalYearId: 'fy2025',
    season: 'AW24',
    currentStep: 10,
  }),
];

/**
 * Fixtures in the shape returned by the plans list API (`GET /api/v1/plans`).
 * These are the exact sample rows from the real contract, used to stub the endpoint in tests.
 */
export const planDtoFixtures: PlanDto[] = [
  {
    planCode: 'b55782f2-3634-4148-90f0-f08d0f7c7b89',
    planName: 'SS26 Kids Tops',
    fiscalYear: '2026',
    planSeasonCode: 3,
    planSeasonName: '2026 Spring__ia_char_03Summer',
    referenceSeasonCode: 70,
    pipelineMode: 'gated',
    thresholdPct: 15.5,
    status: 'draft',
    isDeleted: false,
    hierarchyScope: [
      { levelName: 'Department', levelNo: 'l0_name', selectedValues: ['Kids'] },
      { levelName: 'Category', levelNo: 'l1_name', selectedValues: ['Knitwear', 'Tops'] },
    ],
    metrics: [
      { key: 'Margin', value: 26600 },
      { key: 'Revenue', value: 38000 },
      { key: 'Qty Sold', value: 12000 },
    ],
    createdBy: 'suraj.negi@impactanalytics.co',
    createdAt: '2026-08-04T09:47:38Z',
  },
  {
    planCode: '8f8b9c02-026d-4694-86e6-1859abc41ff7',
    planName: 'SS26 Womens Tops',
    fiscalYear: '2026',
    planSeasonCode: 3,
    planSeasonName: '2026 Spring__ia_char_03Summer',
    referenceSeasonCode: 70,
    pipelineMode: 'gated',
    thresholdPct: 15.5,
    status: 'draft',
    isDeleted: false,
    hierarchyScope: [
      { levelName: 'Category', levelNo: 'l1_name', selectedValues: ['Knitwear', 'Tops'] },
      { levelName: 'Department', levelNo: 'l0_name', selectedValues: ['Womens'] },
    ],
    metrics: [
      { key: 'Margin', value: 25600 },
      { key: 'Revenue', value: 32000 },
      { key: 'Qty Sold', value: 9000 },
    ],
    createdBy: 'suraj.negi@impactanalytics.co',
    createdAt: '2026-08-04T09:43:35Z',
  },
  {
    planCode: '20fd0113-7a13-403b-8bb1-91926286a9dd',
    planName: 'SS26 Mens Tops',
    fiscalYear: '2026',
    planSeasonCode: 3,
    planSeasonName: '2026 Spring__ia_char_03Summer',
    referenceSeasonCode: 70,
    pipelineMode: 'gated',
    thresholdPct: 15.5,
    status: 'draft',
    isDeleted: false,
    hierarchyScope: [
      { levelName: 'Category', levelNo: 'l1_name', selectedValues: ['Knitwear', 'Tops'] },
      { levelName: 'Department', levelNo: 'l0_name', selectedValues: ['Mens'] },
    ],
    metrics: [
      { key: 'Margin', value: 135876 },
      { key: 'Revenue', value: 338000 },
      { key: 'Qty Sold', value: 71000 },
    ],
    createdBy: 'suraj.negi@impactanalytics.co',
    createdAt: '2026-08-04T09:32:15Z',
  },
];

export const stageFilterFixtures = [
  'Location Clustering',
  'Hindsight Analysis',
  'Strategy & Scenarios',
  'Line Planning',
];

export const seasonFilterFixtures = ['SS26', 'AW26', 'SS25', 'AW24'];
