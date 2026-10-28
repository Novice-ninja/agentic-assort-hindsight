/** Proposed design-session data. This is not connected client history or an approved KPI model. */
export type Mode = "in-season" | "plr";
export type Uom = "SELLING_UNIT_TBC" | "SQFT" | "EA";
export type SelectionMode = "all" | "selected" | "none";
export type CaseQueue =
  | "Shortages"
  | "Coverage/excess"
  | "New item"
  | "Nonproductive"
  | "Bulk out"
  | "Lifecycle/exit";
export type Population =
  "exposure" | "current-range" | "all-candidates" | "original";
export type WindowId =
  | "LW"
  | "R4"
  | "R13"
  | "R52"
  | "MTD"
  | "QTD"
  | "YTD"
  | "SEASON"
  | "CUSTOM"
  | "PLR";
export type Comparison = "ly" | "original" | "revision" | "previous" | "none";
export type RangeState =
  "ranged" | "exited" | "never-ranged" | "not-ranged" | "unknown";
export type Eligibility = "eligible" | "ineligible" | "unknown";
export type Scenario =
  | "baseline"
  | "unknown-history"
  | "negative-stock"
  | "missing-inventory"
  | "stale-feed"
  | "mixed-uom"
  | "zero-base"
  | "negative-base"
  | "zero-sales"
  | "closed-store"
  | "missing-plan"
  | "ly-only"
  | "return-only"
  | "missing-sales";
export type MetricState =
  | "ok"
  | "missing"
  | "restricted"
  | "not-applicable"
  | "no-positive-base"
  | "negative-base"
  | "unknown"
  | "stale"
  | "reconcile";
export interface MetricValue {
  value: number | null;
  state: MetricState;
  unit: string;
  reason?: string;
}
export interface Scope {
  mode: Mode;
  reviewId: string;
  version: "v1" | "v2";
  productIds: string[];
  storeIds: string[];
  population: Population;
  productSelection?: SelectionMode;
  storeSelection?: SelectionMode;
  /** Explicit illustrative Comp policy; absent means all selected locations. */
  compPolicyId?: string;
  /** Freeze applied Comp membership while local interval drills change displayed weeks. */
  compPolicyAnchor?: { policyId:string; policyVersion:string; comparison:'ly'|'previous'; actualWeekIds:string[]; comparisonWeekIds:string[]; cohortStoreIds:string[] };
  pairIds?: string[];
  metricFilters?: {
    logic: "and" | "or";
    rules: {
      metric: string;
      operator: "gt" | "gte" | "lt" | "lte" | "eq";
      value: number;
      unit: string;
    }[];
  };
  calendarId?: string;
  seasonId?: string;
  customStart?: string;
  customEnd?: string;
  productFacets?: Partial<
    Record<
      | "categories"
      | "subcategories"
      | "brands"
      | "colors"
      | "finishes"
      | "species"
      | "gbb"
      | "lifecycles"
      | "focusGroups"
      | "vendors",
      string[]
    >
  >;
  locationFacets?: Partial<
    Record<"regions" | "districts" | "clusters" | "markets", string[]>
  >;
  window: WindowId;
  comparison: Comparison;
  stockAsOf: string;
  rangeAsOf: string;
  uom: Uom | "mixed";
  access: "full" | "restricted-margin";
  scenario?: Scenario;
  /** Optional custom fiscal weeks; otherwise the named window supplies exact keys. */
  weekIds?: string[];
  localFilters: {
    search?: string;
    attribute?: { lens: string; value: string };
    rangeState?: RangeState[];
  };
}
export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory: string;
  brand: string;
  color: string | null;
  finish: string | null;
  species: string | null;
  gbb: "Opening Price Point" | "Good" | "Better" | "Best" | null;
  uom: Uom;
  lifecycle: string;
  focusGroups: string[];
  vendor: string;
  provenance: "illustrative-demo";
  imageUrl?: string;
  article?: string;
  sourceMip?: number | null;
  sourceMipStatus?: "illustrative" | "unavailable" | "observed";
  allocatedAreaSqFt?: number;
  definitionStatus?: string;
}
export interface Store {
  id: string;
  name: string;
  region: string;
  district: string;
  market: string;
  cluster: string;
  openedOn: string;
  closedOn?: string;
  channel: "Store";
}
export interface CompPolicy {
  id:string;
  version:string;
  name:string;
  status:'illustrative-governed'|'unknown';
  approval:string;
  rationale:string;
  effectiveFrom:string;
  effectiveTo:string;
  members:{storeId:string;state:'eligible'|'ineligible'|'unknown';reason:string;validFrom?:string;validTo?:string}[];
}
export interface FiscalWeek {
  id: string;
  start: string;
  end: string;
  fiscalMonth: string;
  lyWeekId: string;
  complete: boolean;
}
export interface ItemStoreWeek {
  itemId: string;
  storeId: string;
  weekId: string;
  netSales: number;
  netQuantity: number;
  recognizedCogs: number | null;
  uom: Uom;
  transactionCount: number;
  rangedOpenDays: number;
  quality: "complete" | "missing" | "stale";
  sourceVersion: string;
}
export interface InventorySnapshot {
  itemId: string;
  storeId: string;
  asOf: string;
  physical: number | null;
  sellable: number | null;
  cost: number | null;
  allocatedAreaSqFt?: number;
  uom: Uom;
  quality: "complete" | "missing" | "stale";
  refreshedAt: string;
}
export interface RangeEvent {
  id: string;
  itemId: string;
  storeId: string;
  effectiveOn: string;
  range: RangeState;
  eligibility: Eligibility;
  kind: "activation" | "exit" | "eligibility" | "history";
  source: string;
  note: string;
}
export interface SupplyLine {
  id: string;
  itemId: string;
  storeId?: string;
  dcId?: string;
  kind:
    | "opening"
    | "receipt"
    | "transfer-in"
    | "transfer-out"
    | "adjustment"
    | "open-order"
    | "dc-pool"
    | "customer-return";
  quantity: number;
  uom: Uom;
  date: string;
  eta?: string;
  allocated?: number;
  status: string;
  sourceRef: string;
  reviewId?: string;
}
export interface OriginalPair {
  itemId: string;
  storeId: string;
  targetLaunch: string;
  historyKnown: boolean;
  approvedColor: string | null;
  approvedGbb: Product["gbb"];
}
export interface PlannedWeek {
  itemId: string;
  storeId: string;
  weekId: string;
  sales: number;
  demandQuantity: number;
  gmDollars: number | null;
}
export interface PlrVersion {
  reviewId: string;
  id: "v1" | "v2";
  name: string;
  approvedOn: string;
  original: boolean;
  weekIds: string[];
  pairs: OriginalPair[];
  phasedPlan: PlannedWeek[];
  approvedBuyQuantity: number;
  approvedBuyCost: number;
  plannedEopQuantity: number;
  plannedEopCost: number;
  pairPlans: {
    itemId: string;
    storeId: string;
    approvedBuyQuantity: number;
    endingQuantity: number;
    endingCost: number;
  }[];
}
export interface CaseRecord {
  id: string;
  title: string;
  itemId: string;
  storeId: string;
  priority: "Critical" | "High" | "Watch";
  queue: CaseQueue;
  state: "Open" | "In review" | "Resolved";
  owner: string;
  reviewDate: string;
  ruleId: string;
  ruleVersion: string;
  metric: string;
  signals?: {
    ruleId: string;
    ruleVersion: string;
    metric: string;
    actual: MetricValue;
    threshold: string;
    evidenceIds: string[];
    evaluatedAt?: string;
  }[];
  evaluatedAt?: string;
  evaluationScope?: Partial<Scope> & { dataVersion?: string };
  actual: MetricValue;
  threshold: string;
  observation: string;
  hypothesis: string;
  evidenceIds: string[];
}
export interface Observation extends AuthoredProvenance {
  /** Exact affected canonical pairs; legacy records may retain item/store axis scope. */
  pairIds?: string[];
  visibility?: "Review team" | "Category team";
  confidence?: "Low" | "Medium" | "High";
  evidenceIds?: string[];
  id: string;
  text: string;
  author: string;
  observedOn: string;
  recordedOn: string;
  itemIds: string[];
  storeIds: string[];
  source: string;
  evidenceClass: "merchant-observation" | "hypothesis" | "reviewed-conclusion";
}
export interface Learning extends AuthoredProvenance {
  reviewedBy?: string;
  reviewedAt?: string;
  id: string;
  reviewId: string;
  version: string;
  question: string;
  evidenceIds: string[];
  hypothesis: string;
  conclusion: string;
  owner: string;
  confidence: string;
  pairIds: string[];
  nextReviewId: string;
  state: "Pending" | "Accepted";
}
export type ActionType =
  | "Keep"
  | "Add"
  | "Drop"
  | "Swap"
  | "Chase existing inbound"
  | "Transfer"
  | "Bulk out"
  | "Stop buy";
export type DecisionState =
  | "Draft"
  | "Awaiting approval"
  | "Approved"
  | "Awaiting execution"
  | "Partially executed"
  | "Executed"
  | "Reviewed"
  | "Cancelled"
  | "Superseded";
export interface AuthoredProvenance {
  author?: string;
  recordedAt?: string;
  scope?: Scope;
  visibility?: "Review team" | "Category team";
}
export interface DecisionRecord extends AuthoredProvenance {
  id: string;
  caseId: string;
  action: ActionType;
  pairIds: string[];
  outgoingItemId?: string;
  incomingItemId?: string;
  quantity?: number;
  uom?: Uom;
  destinationStoreId?: string;
  linkedSupplyId?: string;
  linkedDecisionId?: string;
  beforeScope?: string[];
  afterScope?: string[];
  reason: string;
  owner: string;
  effectiveDate: string;
  reviewDate: string;
  evidenceIds: string[];
  state: DecisionState;
  createdAt: string;
  updatedAt: string;
  executionRef?: string;
  acknowledgementRefs?: string[];
  completedPairIds: string[];
  failedPairIds: string[];
  history: { at: string; actor: string; state: DecisionState; note: string }[];
}
export interface SessionState {
  cases: CaseRecord[];
  decisions: DecisionRecord[];
  learnings: Learning[];
  observations: Observation[];
}
export interface CalendarMetadata {
  id: string;
  version: string;
  completeThrough: string;
  currentWeekIds: string[];
  seasonWeekIds: string[];
  periodOptions: { id: WindowId; label: string; definition: string }[];
  definitionStatus: string;
}
export interface ReviewMetadata {
  id: string;
  name: string;
  seasonId: string;
  calendarId: string;
  sellingStart: string;
  sellingEnd: string;
  versionIds: string[];
}
export interface Dataset {
  id: string;
  version: string;
  label: string;
  products: Product[];
  stores: Store[];
  /** Optional explicit registry. An empty array means no connected Comp eligibility. */
  compPolicies?: CompPolicy[];
  weeks: FiscalWeek[];
  facts: ItemStoreWeek[];
  inventory: InventorySnapshot[];
  rangeEvents: RangeEvent[];
  supply: SupplyLine[];
  calendar?: CalendarMetadata;
  reviews?: ReviewMetadata[];
  unitPolicy?: { sellingUnit: Uom; confirmed: boolean; note: string };
  latestPlan?: {
    sales: number;
    quantity: number;
    gmDollars: number | null;
    weekIds: string[];
    phasedPlan: PlannedWeek[];
  };
  versions: PlrVersion[];
  cases: CaseRecord[];
  observations: Observation[];
  learnings: Learning[];
  feeds: {
    sales: "complete" | "missing" | "stale";
    inventory: "complete" | "missing" | "stale";
    range: "complete" | "missing" | "stale";
    refreshedAt: string;
  };
}
export interface SummaryMetrics {
  sales: MetricValue;
  lySales: MetricValue;
  comparisonSales: MetricValue;
  salesChange: MetricValue;
  salesDelta: MetricValue;
  quantity: MetricValue;
  lyQuantity: MetricValue;
  quantityByUom: Partial<Record<Uom, number>>;
  gmDollars: MetricValue;
  gmRate: MetricValue;
  asp: MetricValue;
  ohCost: MetricValue;
  physicalOh: MetricValue;
  sellableOh: MetricValue;
  openInbound: MetricValue;
  qualifyingSales: MetricValue;
  qualifyingQuantity: MetricValue;
  exposureWeeks: MetricValue;
  velocity: MetricValue;
}
export interface PairFact extends SummaryMetrics {
  id: string;
  itemId: string;
  storeId: string;
  item: Product;
  store: Store;
  range: RangeState;
  lyRange: RangeState;
  eligibility: Eligibility;
  matrixState: "R+" | "R0" | "X+" | "E" | "NR" | "?" | "!";
  wos: MetricValue;
  allocatedArea?: MetricValue;
  salesPerSqFt?: MetricValue;
  stockAsOf: string;
  rangeAsOf: string;
  caseIds: string[];
  rangeHistory: RangeEvent[];
  supply: SupplyLine[];
  warnings: string[];
  weeks: ItemStoreWeek[];
}
export interface Aggregate extends SummaryMetrics {
  itemCount: number;
  storeCount: number;
  pairCount: number;
  rangedPairCount: number;
  rangedSkuCount: number;
  rangedStoreCount: number;
  stockoutPairCount: number;
  exitedPairCount: number;
  eligibleNotRangedPairCount: number;
  unknownPairCount: number;
  openCaseCount: number;
  impactedPairCount: number;
  impactedSkuCount: number;
  caseIds: string[];
  allocatedArea?: MetricValue;
  salesPerSqFt?: MetricValue;
  storeExposureWeeks: MetricValue;
  salesPerStoreWeek: MetricValue;
  quantityPerStoreWeek: MetricValue;
}
export interface ItemRow extends Aggregate {
  id: string;
  name: string;
  product: Product;
  pairs: PairFact[];
}
export interface StoreRow extends Aggregate {
  id: string;
  name: string;
  store: Store;
  pairs: PairFact[];
}
export interface MixRow {
  id: string;
  label: string;
  itemIds: string[];
  /** Exact historical/current group members; a SKU can have different dated assignments by pair. */
  pairIds: string[];
  attributeAsOf: string | null;
  attributeBasis: string;
  skuCount: number;
  sales: MetricValue;
  quantity: MetricValue;
  gmRate: MetricValue;
  asp: MetricValue;
  skuShare: MetricValue;
  salesShare: MetricValue;
  quantityShare: MetricValue;
  productivityIndex: MetricValue;
}
export interface TrendPoint {
  id: string;
  label: string;
  start: string;
  end: string;
  actual: MetricValue;
  comparison: MetricValue;
}
export interface BreadthRow {
  storeId: string;
  storeName: string;
  ty: number;
  ly: number;
  added: string[];
  removed: string[];
  retained: string[];
  unknown: string[];
}
export interface PlrReview {
  connected: boolean;
  originalVersionId: string;
  selectedVersionId: string;
  sellingStart: string;
  sellingEnd: string;
  originalPairCount: number;
  selectedOriginalPairCount: number;
  duePairs: number;
  onTimePairs: number;
  latePairs: number;
  notActivatedPairs: number;
  notYetDuePairs: number;
  unknownHistoryPairs: number;
  executionRate: MetricValue;
  executionBounds: { lower: number; upper: number };
  actualSales: MetricValue;
  originalSalesPlan: MetricValue;
  revisedSalesPlan: MetricValue;
  salesVariance: MetricValue;
  laterAdditionSales: MetricValue;
  totalRealizedSales: MetricValue;
  actualQuantity: MetricValue;
  demandPlanQuantity: MetricValue;
  gmDollars: MetricValue;
  gmRate: MetricValue;
  plannedGmRate: MetricValue;
  gmGapPp: MetricValue;
  supplyAvailable: MetricValue;
  sellThrough: MetricValue;
  endingInventoryCost: MetricValue;
  plannedEndingInventoryCost: MetricValue;
  approvedBuyQuantity: MetricValue;
  receivedQuantity: MetricValue;
  transferInQuantity: MetricValue;
  transferOutQuantity: MetricValue;
  adjustmentQuantity: MetricValue;
  /** Informational return movements: net sales quantity already includes these returns. */
  customerReturnQuantity: MetricValue;
  expectedPhysicalEndingQuantity: MetricValue;
  physicalEndingQuantity: MetricValue;
  sellableEndingQuantity: MetricValue;
  blockedEndingQuantity: MetricValue;
  openingQuantity: MetricValue;
  openOrderQuantity: MetricValue;
  originalPairs: OriginalPair[];
  exceptions: {
    pairId: string;
    state: string;
    targetDate: string;
    activatedOn?: string;
  }[];
  warnings: string[];
  elapsedWeeks: number;
  plannedWeeks: number;
  latestPlanAllSales?: MetricValue;
  physicalFlowDifference?: MetricValue;
  blockedQuantity?: MetricValue;
}
