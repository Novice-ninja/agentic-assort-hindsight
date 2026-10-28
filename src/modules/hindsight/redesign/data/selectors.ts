import { availableCompPolicies, evaluateCompPolicy, type CompPolicyResult } from "./compPolicy";
export { availableCompPolicies, DEMO_COMP_POLICY_ID } from "./compPolicy";
export type { CompPolicyResult, CompPolicyState } from "./compPolicy";
import catalogue from "./catalogue.json";
import type {
  Aggregate,
  BreadthRow,
  Dataset,
  ItemRow,
  MetricState,
  MetricValue,
  MixRow,
  Mode,
  PairFact,
  PlrReview,
  Scope,
  SessionState,
  StoreRow,
  SummaryMetrics,
  TrendPoint,
  Uom,
} from "./types";
import {
  DATA_VERSION,
  getScenarioDataset,
  projectDataset,
  PLR_END_DATE,
  REVIEW_ID,
  SNAPSHOT_DATE,
} from "./fixtures";

export interface WorkspaceResult {
  scope: Scope;
  signature: string;
  datasetLabel: string;
  warnings: string[];
  weekIds: string[];
  comparisonWeekIds: string[];
  overview: Aggregate;
  items: ItemRow[];
  stores: StoreRow[];
  pairs: PairFact[];
  cases: Dataset["cases"];
  plr: PlrReview;
}
export const measure = (
  value: number | null,
  unit: string,
  state: MetricState = value === null ? "missing" : "ok",
  reason?: string,
): MetricValue => ({
  value:
    value === null
      ? null
      : Math.round(value * (unit === "USD" ? 100 : 1e8)) /
        (unit === "USD" ? 100 : 1e8),
  unit,
  state,
  ...(reason ? { reason } : {}),
});
const sum = (values: number[]) => values.reduce((a, b) => a + b, 0);
const unique = <T>(values: T[]) => [...new Set(values)];
const key = (item: string, store: string) => `${item}:${store}`;
const missing = (
  unit: string,
  reason: string,
  state: MetricState = "missing",
) => measure(null, unit, state, reason);
const dataFor = (scope: Scope, dataset?: Dataset) =>
  projectDataset(dataset ?? getScenarioDataset(scope.scenario), scope.access);
/** Nonempty IDs anchor legacy detail spreads; explicit selected/none with no IDs means no population. */
export const selectionContains = (
  ids: readonly string[],
  mode: Scope["productSelection"],
  id: string,
) => (ids.length ? ids.includes(id) : mode !== "none" && mode !== "selected");
export const withProductIds = (scope: Scope, ids: string[]): Scope => ({
  ...scope,
  productIds: [...ids],
  productSelection: ids.length ? "selected" : "none",
});
export const withStoreIds = (scope: Scope, ids: string[]): Scope => ({
  ...scope,
  storeIds: [...ids],
  storeSelection: ids.length ? "selected" : "none",
});
export const withPairScope = (scope: Scope, ids: string[]): Scope => ({
  ...scope,
  pairIds: [...ids],
});
const factIndexes = new WeakMap<
  Dataset["facts"],
  Map<string, Map<string, Dataset["facts"][number]>>
>();
const rangeIndexes = new WeakMap<
  Dataset["rangeEvents"],
  Map<string, Dataset["rangeEvents"]>
>();
const inventoryIndexes = new WeakMap<
  Dataset["inventory"],
  Map<string, Dataset["inventory"][number]>
>();
const supplyIndexes = new WeakMap<
  Dataset["supply"],
  Map<string, Dataset["supply"]>
>();
const planIndexes = new WeakMap<
  Dataset["versions"][number]["phasedPlan"],
  Map<string, Dataset["versions"][number]["phasedPlan"]>
>();
function factsIndex(data: Dataset) {
  let idx = factIndexes.get(data.facts);
  if (!idx) {
    idx = new Map();
    data.facts.forEach((f) => {
      const k = key(f.itemId, f.storeId);
      if (!idx!.has(k)) idx!.set(k, new Map());
      idx!.get(k)!.set(f.weekId, f);
    });
    factIndexes.set(data.facts, idx);
  }
  return idx;
}
function histories(data: Dataset) {
  let idx = rangeIndexes.get(data.rangeEvents);
  if (!idx) {
    idx = new Map();
    data.rangeEvents.forEach((f) => {
      const k = key(f.itemId, f.storeId);
      if (!idx!.has(k)) idx!.set(k, []);
      idx!.get(k)!.push(f);
    });
    idx.forEach((rows) =>
      rows.sort(
        (a, b) =>
          a.effectiveOn.localeCompare(b.effectiveOn) ||
          a.id.localeCompare(b.id),
      ),
    );
    rangeIndexes.set(data.rangeEvents, idx);
  }
  return idx;
}
function stockIndex(data: Dataset) {
  let idx = inventoryIndexes.get(data.inventory);
  if (!idx) {
    idx = new Map(
      data.inventory.map((f) => [`${key(f.itemId, f.storeId)}:${f.asOf}`, f]),
    );
    inventoryIndexes.set(data.inventory, idx);
  }
  return idx;
}
function supplyIndex(data: Dataset) {
  let idx = supplyIndexes.get(data.supply);
  if (!idx) {
    idx = new Map();
    data.supply.forEach((f) => {
      const k = f.storeId ? key(f.itemId, f.storeId) : `dc:${f.itemId}`;
      if (!idx!.has(k)) idx!.set(k, []);
      idx!.get(k)!.push(f);
    });
    supplyIndexes.set(data.supply, idx);
  }
  return idx;
}
function planRows(
  rows: Dataset["versions"][number]["phasedPlan"],
  pair: string,
) {
  let idx = planIndexes.get(rows);
  if (!idx) {
    idx = new Map();
    rows.forEach((f) => {
      const k = key(f.itemId, f.storeId);
      if (!idx!.has(k)) idx!.set(k, []);
      idx!.get(k)!.push(f);
    });
    planIndexes.set(rows, idx);
  }
  return idx.get(pair) || [];
}
export function createDefaultScope(
  mode: Mode = "in-season",
  dataset: Dataset = getScenarioDataset(),
): Scope {
  const review = dataset.reviews?.[0],
    snapshot =
      dataset.inventory
        .map((s) => s.asOf)
        .sort()
        .at(-1) || SNAPSHOT_DATE;
  return {
    mode,
    reviewId: review?.id || dataset.versions[0]?.reviewId || REVIEW_ID,
    version: "v1",
    productIds: [],
    storeIds: [],
    productSelection: "all",
    storeSelection: "all",
    population: mode === "plr" ? "original" : "exposure",
    window: mode === "plr" ? "PLR" : "R4",
    comparison: mode === "plr" ? "original" : "ly",
    stockAsOf: snapshot,
    rangeAsOf: snapshot,
    uom:
      dataset.unitPolicy?.sellingUnit ||
      dataset.products[0]?.uom ||
      "SELLING_UNIT_TBC",
    access: "full",
    calendarId: dataset.calendar?.id,
    seasonId: review?.seasonId,
    localFilters: {},
  };
}
export function withSession(dataset: Dataset, session: SessionState): Dataset {
  return {
    ...dataset,
    cases: session.cases,
    observations: session.observations,
    learnings: session.learnings,
  };
}
export function scopeSignature(scope: Scope, dataset?: Dataset): string {
  const data = dataFor(scope, dataset);
  const stable = (value: unknown): unknown =>
    Array.isArray(value)
      ? value
          .map(stable)
          .sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)))
      : value && typeof value === "object"
        ? Object.fromEntries(
            Object.entries(value)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([k, v]) => [k, stable(v)]),
          )
        : value;
  return JSON.stringify(
    stable({
      ...scope,
      dataVersion: data.version,
      calendarVersion: data.calendar?.version,
      metricVersion: "proposed-base-v2",
      compPolicy: scope.compPolicyId ? (()=>{const result=getCompPolicyResult(scope,data);return {id:scope.compPolicyId,version:result.policy?.version,state:result.state,cohortStoreIds:result.cohortStoreIds,cohortActualWeekIds:result.cohortActualWeekIds,cohortComparisonWeekIds:result.cohortComparisonWeekIds};})() : undefined,
    }),
  );
}
export function selectedWeekIds(scope: Scope, dataset?: Dataset): string[] {
  const data = dataFor(scope, dataset),
    current =
      data.calendar?.currentWeekIds ||
      data.weeks.filter((w) => w.id.startsWith("FY2026")).map((w) => w.id),
    all = data.weeks
      .filter((w) => w.complete && current.includes(w.id))
      .sort((a, b) => a.start.localeCompare(b.start));
  const withinReview = (ids: string[]) =>
    scope.mode === "plr"
      ? ids.filter((id) =>
          data.versions
            .find((v) => v.reviewId === scope.reviewId && v.original)
            ?.weekIds.includes(id),
        )
      : ids;
  if (scope.weekIds)
    return withinReview(
      data.weeks
        .filter((w) => w.complete && scope.weekIds!.includes(w.id))
        .map((w) => w.id),
    );
  if (scope.window === "CUSTOM")
    return withinReview(
      all
        .filter(
          (w) =>
            (!scope.customStart || w.start >= scope.customStart) &&
            (!scope.customEnd || w.end <= scope.customEnd),
        )
        .map((w) => w.id),
    );
  if (scope.window === "PLR")
    return (
      data.versions.find((v) => v.reviewId === scope.reviewId && v.original)
        ?.weekIds || []
    );
  if (scope.window === "SEASON")
    return withinReview(data.calendar?.seasonWeekIds || all.map((w) => w.id));
  const end = all.at(-1)?.end || "",
    year = end.slice(0, 4),
    month = end.slice(0, 7),
    quarter = Math.floor((Number(end.slice(5, 7)) - 1) / 3);
  const filtered =
    scope.window === "LW"
      ? all.slice(-1)
      : scope.window === "R4"
        ? all.slice(-4)
        : scope.window === "R13"
          ? all.slice(-13)
          : scope.window === "R52"
            ? all.slice(-52)
            : scope.window === "MTD"
              ? all.filter((w) => w.end.startsWith(month))
              : scope.window === "QTD"
                ? all.filter(
                    (w) =>
                      w.end.startsWith(year) &&
                      Math.floor((Number(w.end.slice(5, 7)) - 1) / 3) ===
                        quarter,
                  )
                : all.filter((w) => w.end.startsWith(year));
  return withinReview(filtered.map((w) => w.id));
}
export function comparisonWeekIds(scope: Scope, dataset?: Dataset): string[] {
  const data = dataFor(scope, dataset),
    ids = selectedWeekIds(scope, data);
  if (scope.comparison === "ly")
    return ids.flatMap((id) => {
      const match = data.weeks.find((w) => w.id === id)?.lyWeekId;
      return match ? [match] : [];
    });
  if (scope.comparison === "previous" && ids.length) {
    const all = data.weeks.filter(
        (w) =>
          w.complete &&
          w.end <= (data.calendar?.completeThrough || scope.rangeAsOf),
      ),
      start = all.findIndex((w) => w.id === ids[0]);
    return all
      .slice(Math.max(0, start - ids.length), Math.max(0, start))
      .map((w) => w.id);
  }
  return [];
}
/** Strategic review supports a complete selling-window prefix only; tactical selectors may inspect arbitrary compatible weeks. */
export function isContiguousReviewPrefix(
  scope: Scope,
  dataset?: Dataset,
): boolean {
  const data = dataFor(scope, dataset),
    ids = data.versions.find(
      (v) => v.reviewId === scope.reviewId && v.original,
    )?.weekIds;
  if (!ids) return false;
  if (!scope.weekIds) return true;
  return (
    scope.weekIds.length > 0 &&
    scope.weekIds.length <= ids.length &&
    scope.weekIds.every((id, i) => id === ids[i])
  );
}
/** Matched membership date follows the selected window's final calendar comparator; no hardcoded LY date. */
export function comparisonRangeDate(
  scope: Scope,
  dataset?: Dataset,
): string | undefined {
  const data = dataFor(scope, dataset),
    ids = selectedWeekIds(scope, data),
    id = data.weeks.find((w) => w.id === ids.at(-1))?.lyWeekId;
  return data.weeks.find((w) => w.id === id)?.end;
}
/** K14/R4 is aligned to the stock snapshot, not to the selected sales display window. */
export function coverageWeekIds(scope: Scope, dataset?: Dataset): string[] {
  return dataFor(scope, dataset)
    .weeks.filter((w) => w.complete && w.end <= scope.stockAsOf)
    .sort((a, b) => a.end.localeCompare(b.end))
    .slice(-4)
    .map((w) => w.id);
}
export function growth(actual: number, base: number): MetricValue {
  return base > 0
    ? measure(((actual - base) / base) * 100, "%")
    : missing(
        "%",
        base < 0
          ? "Negative comparison base; inspect signed absolute change."
          : actual > 0
            ? "New · no positive comparison base; inspect absolute change."
            : "No positive comparison base; inspect absolute change.",
        base < 0 ? "negative-base" : "no-positive-base",
      );
}
export function ratio(
  numerator: number,
  denominator: number,
  unit: string,
  scale = 1,
): MetricValue {
  return denominator > 0
    ? measure((numerator / denominator) * scale, unit)
    : missing(unit, "Denominator must be positive.", "no-positive-base");
}
function rangeAt(data: Dataset, item: string, store: string, asOf: string) {
  return histories(data)
    .get(key(item, store))
    ?.filter((e) => e.effectiveOn <= asOf)
    .at(-1);
}
function addMetrics(values: MetricValue[], unit: string): MetricValue {
  if (values.some((v) => v.state === "restricted"))
    return missing(
      unit,
      "Margin access is restricted in detail, totals, export and Iris.",
      "restricted",
    );
  if (values.some((v) => v.value === null))
    return missing(
      unit,
      "A contributing record is unavailable; blank is not zero.",
    );
  return measure(
    sum(values.map((v) => v.value!)),
    unit,
    values.some((v) => v.state === "stale") ? "stale" : "ok",
  );
}
function quantityTotal(values: { uom: Uom; value: number }[]) {
  const byUom: Partial<Record<Uom, number>> = {};
  values.forEach((v) => {
    byUom[v.uom] = (byUom[v.uom] ?? 0) + v.value;
  });
  const units = Object.keys(byUom) as Uom[];
  return {
    byUom,
    quantity:
      units.length > 1
        ? missing(
            "mixed",
            "Incompatible selling units; inspect separate unit subtotals. No conversion is inferred.",
            "not-applicable",
          )
        : measure(
            units.length ? byUom[units[0]]! : 0,
            units[0] ?? "SELLING_UNIT_TBC",
          ),
  };
}
function buildPair(
  itemId: string,
  storeId: string,
  scope: Scope,
  data: Dataset,
  context?: {
    ids: string[];
    compareIds: string[];
    lyIds: string[];
    coverIds: string[];
  },
): PairFact | undefined {
  const item = data.products.find((p) => p.id === itemId),
    store = data.stores.find((s) => s.id === storeId);
  if (!item || !store) return undefined;
  const ids = context?.ids || selectedWeekIds(scope, data),
    compareIds = context?.compareIds || comparisonWeekIds(scope, data);
  const lyIds =
    context?.lyIds ||
    ids.flatMap((id) => data.weeks.find((w) => w.id === id)?.lyWeekId || []);
  const indexedRows = factsIndex(data).get(key(itemId, storeId));
  const rows = indexedRows ? [...indexedRows.values()] : [];
  const facts = rows.filter((f) => ids.includes(f.weekId)),
    base = rows.filter((f) => compareIds.includes(f.weekId)),
    ly = rows.filter((f) => lyIds.includes(f.weekId));
  const rangeEvent =
      data.feeds.range === "missing"
        ? undefined
        : rangeAt(data, itemId, storeId, scope.rangeAsOf),
    range = rangeEvent?.range ?? "unknown",
    eligibility = rangeEvent?.eligibility ?? "unknown";
  const lyDate = data.weeks.find((w) => w.id === lyIds.at(-1))?.end;
  const stock = stockIndex(data).get(
    `${key(itemId, storeId)}:${scope.stockAsOf}`,
  );
  const supply = [
    ...(supplyIndex(data).get(key(itemId, storeId)) || []),
    ...(supplyIndex(data).get(`dc:${itemId}`) || []),
  ].filter(
    (s) =>
      scope.mode !== "plr" ||
      s.reviewId === scope.reviewId ||
      s.kind === "dc-pool",
  );
  const incomplete =
    data.feeds.sales === "missing" ||
    facts.length !== ids.length ||
    facts.some((f) => f.quality === "missing");
  const state: MetricState =
    data.feeds.sales === "stale" || facts.some((f) => f.quality === "stale")
      ? "stale"
      : "ok";
  const salesSum = sum(facts.map((f) => f.netSales)),
    qtySum = sum(facts.map((f) => f.netQuantity));
  const sales = incomplete
    ? missing("USD", "Sales feed is incomplete for the selected pair-weeks.")
    : measure(salesSum, "USD", state);
  const quantity = incomplete
    ? missing(item.uom, "Quantity feed is incomplete.")
    : measure(qtySum, item.uom, state);
  const gmSum = sum(facts.map((f) => f.netSales - (f.recognizedCogs ?? 0)));
  const gmDollars =
    scope.access === "restricted-margin"
      ? missing("USD", "Margin access restricted.", "restricted")
      : incomplete || facts.some((f) => f.recognizedCogs === null)
        ? missing("USD", "Recognized COGS unavailable.")
        : measure(gmSum, "USD", state);
  const gmRate =
    gmDollars.value === null
      ? missing("%", gmDollars.reason!, gmDollars.state)
      : ratio(gmSum, salesSum, "%", 100);
  const version = data.versions.find(
    (v) =>
      v.reviewId === scope.reviewId &&
      v.id === (scope.comparison === "revision" ? "v2" : "v1"),
  );
  const comparisonSales =
    scope.comparison === "none"
      ? missing("USD", "No comparison selected.", "not-applicable")
      : ["original", "revision"].includes(scope.comparison)
        ? version
          ? measure(
              sum(
                planRows(version.phasedPlan, key(itemId, storeId))
                  .filter((p) => ids.includes(p.weekId))
                  .map((p) => p.sales),
              ),
              "USD",
            )
          : missing("USD", "Plan not connected.")
        : base.length !== compareIds.length
          ? missing("USD", "Comparable weeks unavailable.")
          : measure(sum(base.map((f) => f.netSales)), "USD");
  const stockMetric = (
    field: "physical" | "sellable" | "cost",
    unit: string,
  ) =>
    !stock || stock[field] === null
      ? missing(
          unit,
          "Exact dated snapshot unavailable; current stock is not substituted.",
        )
      : measure(stock[field], unit, stock.quality === "stale" ? "stale" : "ok");
  const physicalOh = stockMetric("physical", item.uom),
    sellableOh = stockMetric("sellable", item.uom),
    ohCost = stockMetric("cost", "USD");
  const exposureUnknown = range === "unknown" || data.feeds.range === "missing";
  const qualifying = facts.filter((f) => f.rangedOpenDays > 0),
    exposure = sum(facts.map((f) => f.rangedOpenDays)) / 7;
  const partialExposure = facts.some(
    (f) => f.rangedOpenDays > 0 && f.rangedOpenDays < 7,
  );
  const qualifyingQuantity = exposureUnknown
    ? missing(item.uom, "Historical range exposure unavailable.", "unknown")
    : incomplete || partialExposure
      ? missing(
          item.uom,
          partialExposure
            ? "Partial open weeks require daily qualifying sales; that numerator is not supplied."
            : "Exposure numerator missing.",
        )
      : measure(sum(qualifying.map((f) => f.netQuantity)), item.uom, state);
  const negative =
    (physicalOh.value !== null && physicalOh.value < 0) ||
    (sellableOh.value !== null && sellableOh.value < 0);
  const coverIds = context?.coverIds || coverageWeekIds(scope, data),
    coverFacts = rows.filter((f) => coverIds.includes(f.weekId));
  const coverIncomplete =
    data.feeds.sales === "missing" ||
    coverIds.length !== 4 ||
    coverFacts.length !== 4 ||
    coverFacts.some((f) => f.quality === "missing" || f.uom !== item.uom);
  const coverDemand = sum(coverFacts.map((f) => f.netQuantity));
  const coverStale =
    data.feeds.sales === "stale" ||
    coverFacts.some((f) => f.quality === "stale") ||
    sellableOh.state === "stale";
  const wos = negative
    ? missing(
        "weeks",
        "Negative physical stock requires reconciliation.",
        "reconcile",
      )
    : sellableOh.value === null || coverIncomplete
      ? missing(
          "weeks",
          "Exact sellable stock or four compatible completed weeks ending at the stock snapshot are unavailable.",
        )
      : coverDemand <= 0
        ? missing(
            "weeks",
            "No positive demand in the four completed weeks ending at the stock snapshot.",
            "no-positive-base",
          )
        : measure(
            sellableOh.value / (coverDemand / 4),
            "weeks",
            coverStale ? "stale" : "ok",
          );
  const matrixState: PairFact["matrixState"] =
    range === "unknown" || sellableOh.value === null
      ? "?"
      : negative
        ? "!"
        : range === "ranged"
          ? sellableOh.value === 0
            ? "R0"
            : "R+"
          : range === "exited" && sellableOh.value > 0
            ? "X+"
            : eligibility === "eligible"
              ? "E"
              : "NR";
  const warnings = [
    state === "stale"
      ? "Sales feed is stale; retain actual source timestamp."
      : "",
    !stock
      ? `Inventory snapshot ${scope.stockAsOf} is missing for this pair.`
      : "",
    partialExposure
      ? "Partial open weeks: daily qualifying numerator unavailable."
      : "",
    negative ? "Reconcile signed physical stock." : "",
    range === "unknown" ? "Unknown membership is not not-ranged." : "",
    range !== "ranged" && salesSum !== 0
      ? "Transactions outside current range remain exposed; confirm dated membership and sell-down context."
      : "",
    store.closedOn && store.closedOn <= scope.rangeAsOf
      ? `Store closed ${store.closedOn}; retained in selected exposure.`
      : "",
  ].filter(Boolean);
  return {
    id: key(itemId, storeId),
    itemId,
    storeId,
    item,
    store,
    range,
    eligibility,
    lyRange: lyDate
      ? (rangeAt(data, itemId, storeId, lyDate)?.range ?? "unknown")
      : "unknown",
    matrixState,
    sales,
    lySales:
      ly.length === lyIds.length
        ? measure(sum(ly.map((f) => f.netSales)), "USD")
        : missing("USD", "Matched LY unavailable."),
    comparisonSales,
    salesChange:
      sales.value === null || comparisonSales.value === null
        ? missing("%", "Comparable values unavailable.")
        : growth(sales.value, comparisonSales.value),
    salesDelta:
      sales.value === null || comparisonSales.value === null
        ? missing("USD", "Comparable values unavailable.")
        : measure(sales.value - comparisonSales.value, "USD"),
    quantity,
    lyQuantity:
      ly.length === lyIds.length
        ? measure(sum(ly.map((f) => f.netQuantity)), item.uom)
        : missing(item.uom, "Matched LY unavailable."),
    quantityByUom:
      quantity.value === null ? {} : { [item.uom]: quantity.value },
    gmDollars,
    gmRate,
    asp:
      sales.value === null || quantity.value === null
        ? missing(`USD/${item.uom}`, "Compatible values unavailable.")
        : ratio(sales.value, quantity.value, `USD/${item.uom}`),
    ohCost,
    physicalOh,
    sellableOh,
    openInbound: measure(
      sum(supply.filter((s) => s.kind === "open-order").map((s) => s.quantity)),
      item.uom,
    ),
    qualifyingSales: exposureUnknown
      ? missing("USD", "Historical range exposure unavailable.", "unknown")
      : incomplete || partialExposure
        ? missing(
            "USD",
            "Exposure numerator needs complete daily qualifying evidence.",
          )
        : measure(sum(qualifying.map((f) => f.netSales)), "USD"),
    qualifyingQuantity,
    exposureWeeks: exposureUnknown
      ? missing(
          "pair-weeks",
          "Historical range exposure unavailable.",
          "unknown",
        )
      : measure(exposure, "pair-weeks"),
    velocity:
      qualifyingQuantity.value === null
        ? missing(`${item.uom}/pair-week`, "Numerator missing.")
        : ratio(qualifyingQuantity.value, exposure, `${item.uom}/pair-week`),
    wos,
    allocatedArea:
      stock?.allocatedAreaSqFt === undefined
        ? missing("sqft", "Allocated selling area not connected.")
        : measure(stock.allocatedAreaSqFt, "sqft"),
    salesPerSqFt:
      stock?.allocatedAreaSqFt === undefined || sales.value === null
        ? missing("USD/sqft", "Allocated selling area or sales unavailable.")
        : ratio(sales.value, stock.allocatedAreaSqFt, "USD/sqft"),
    stockAsOf: scope.stockAsOf,
    rangeAsOf: scope.rangeAsOf,
    caseIds: data.cases
      .filter(
        (c) =>
          c.itemId === itemId &&
          c.storeId === storeId &&
          c.state !== "Resolved",
      )
      .map((c) => c.id),
    rangeHistory: histories(data).get(key(itemId, storeId)) || [],
    supply,
    warnings,
    weeks: facts.map((f) =>
      scope.access === "restricted-margin"
        ? { ...f, recognizedCogs: null }
        : { ...f },
    ),
  };
}
export function getPairFact(
  itemId: string,
  storeId: string,
  scope: Scope,
  dataset?: Dataset,
): PairFact | undefined {
  return buildPair(itemId, storeId, scope, dataFor(scope, dataset));
}
/** Inspectable Comp policy result at the selected location axes, before product aggregation. */
export function getCompPolicyResult(scope:Scope,dataset?:Dataset):CompPolicyResult {
  const data=dataFor(scope,dataset),fields={regions:'region',districts:'district',clusters:'cluster',markets:'market'} as const;
  const candidates=data.stores.filter(store=>selectionContains(scope.storeIds,scope.storeSelection,store.id)&&Object.entries(scope.locationFacets||{}).every(([facet,values])=>!!values?.length&&values.includes(store[fields[facet as keyof typeof fields]])));
  const anchorScope=scope.compPolicyAnchor?{...scope,weekIds:scope.compPolicyAnchor.actualWeekIds,compPolicyAnchor:undefined}:scope;
  return evaluateCompPolicy(scope,data,selectedWeekIds(scope,data),comparisonWeekIds(scope,data),candidates,scope.compPolicyAnchor?comparisonWeekIds(anchorScope,data):undefined);
}
/** Global Apply explicitly establishes a new policy/window/cohort anchor. */
export function anchorCompPolicyScope(scope:Scope,dataset?:Dataset):Scope {
  const fresh={...scope,compPolicyAnchor:undefined};
  if(!scope.compPolicyId)return fresh;
  const result=getCompPolicyResult(fresh,dataset);
  if(!result.valid||!result.policy||!['ly','previous'].includes(scope.comparison))return fresh;
  return {...fresh,compPolicyAnchor:{policyId:result.policy.id,policyVersion:result.policy.version,comparison:scope.comparison as 'ly'|'previous',actualWeekIds:[...result.cohortActualWeekIds],comparisonWeekIds:[...result.cohortComparisonWeekIds],cohortStoreIds:[...result.cohortStoreIds]}};
}
/** Local intervals retain the exact applied Comp cohort, including closure exclusions. */
export function freezeCompCohort(scope:Scope,dataset?:Dataset):Scope {
  return !scope.compPolicyId||scope.compPolicyAnchor?scope:anchorCompPolicyScope(scope,dataset);
}
export function selectedMasters(scope: Scope, dataset?: Dataset) {
  const data = dataFor(scope, dataset),
    search = scope.localFilters.search?.trim().toLowerCase() || "";
  const productFields = {
    categories: "category",
    subcategories: "subcategory",
    brands: "brand",
    colors: "color",
    finishes: "finish",
    species: "species",
    gbb: "gbb",
    lifecycles: "lifecycle",
    focusGroups: "focusGroups",
    vendors: "vendor",
  } as const;
  const locationFields = {
    regions: "region",
    districts: "district",
    clusters: "cluster",
    markets: "market",
  } as const;
  const products = data.products.filter(
    (p) =>
      selectionContains(scope.productIds, scope.productSelection, p.id) &&
      (scope.uom === "mixed" || p.uom === scope.uom) &&
      (!search ||
        `${p.id} ${p.article || ""} ${p.name} ${p.brand}`
          .toLowerCase()
          .includes(search)) &&
      (!scope.localFilters.attribute ||
        String(
          (p as unknown as Record<string, unknown>)[
            scope.localFilters.attribute.lens
          ] ?? "Unknown",
        ) === scope.localFilters.attribute.value) &&
      Object.entries(scope.productFacets || {}).every(([facet, values]) => {
        const value = p[productFields[facet as keyof typeof productFields]];
        return (
          !!values?.length &&
          (Array.isArray(value)
            ? value.some((v) => values.includes(v))
            : values.includes(String(value ?? "Unknown")))
        );
      }),
  );
  const result=getCompPolicyResult(scope,data),allowed=new Set(result.cohortStoreIds);
  const stores=data.stores.filter(store=>allowed.has(store.id));
  return { products, stores };
}
const pairCache = new WeakMap<Dataset["facts"], Map<string, PairFact[]>>();
export function selectScopedPairs(scope: Scope, dataset?: Dataset): PairFact[] {
  const data = dataFor(scope, dataset),
    original = data.versions.find(
      (v) => v.reviewId === scope.reviewId && v.original,
    );
  if ((scope.mode === "plr" || scope.population === "original") && !original)
    return [];
  const cacheKey =
    scopeSignature(scope, data) +
    JSON.stringify(data.cases.map((c) => [c.id, c.state, c.itemId, c.storeId]));
  let cache = pairCache.get(data.facts);
  if (Object.isFrozen(data.facts)) {
    if (!cache) {
      cache = new Map();
      pairCache.set(data.facts, cache);
    }
    const hit = cache.get(cacheKey);
    if (hit) return [...hit];
  }
  const { products, stores } = selectedMasters(scope, data),
    weeks = new Set([
      ...selectedWeekIds(scope, data),
      ...comparisonWeekIds(scope, data),
    ]),
    originalIds = new Set(original?.pairs.map((p) => key(p.itemId, p.storeId)));
  const ids = selectedWeekIds(scope, data),
    context = {
      ids,
      compareIds: comparisonWeekIds(scope, data),
      lyIds: ids.flatMap(
        (id) => data.weeks.find((w) => w.id === id)?.lyWeekId || [],
      ),
      coverIds: coverageWeekIds(scope, data),
    };
  const out: PairFact[] = [];
  for (const p of products)
    for (const st of stores) {
      const id = key(p.id, st.id);
      if (scope.pairIds && !scope.pairIds.includes(id)) continue;
      const pair = buildPair(p.id, st.id, scope, data, context)!;
      const transactions = [...(factsIndex(data).get(id)?.values() || [])].some(
        (f) => weeks.has(f.weekId) && f.transactionCount > 0,
      );
      const included =
        scope.mode === "plr" || scope.population === "original"
          ? originalIds.has(id)
          : scope.population === "all-candidates"
            ? true
            : scope.population === "current-range"
              ? pair.range === "ranged"
              : pair.range === "ranged" ||
                (pair.physicalOh.value !== null &&
                  pair.physicalOh.value !== 0) ||
                (pair.openInbound.value ?? 0) > 0 ||
                transactions;
      const rules = scope.metricFilters?.rules || [],
        matches = rules.map((rule) => {
          const field =
            (
              {
                K01: "sales",
                K02: "quantity",
                K03: "gmDollars",
                K04: "gmRate",
                K05: "asp",
                K06: "sellableOh",
                K14: "wos",
              } as Record<string, string>
            )[rule.metric] || rule.metric;
          const v = (pair as unknown as Record<string, MetricValue>)[field];
          if (
            !v ||
            v.value === null ||
            !["ok", "stale"].includes(v.state) ||
            v.unit !== rule.unit
          )
            return false;
          return rule.operator === "gt"
            ? v.value > rule.value
            : rule.operator === "gte"
              ? v.value >= rule.value
              : rule.operator === "lt"
                ? v.value < rule.value
                : rule.operator === "lte"
                  ? v.value <= rule.value
                  : v.value === rule.value;
        });
      const metricMatch =
        !rules.length ||
        (scope.metricFilters?.logic === "or"
          ? matches.some(Boolean)
          : matches.every(Boolean));
      if (
        included &&
        metricMatch &&
        (!scope.localFilters.rangeState?.length ||
          scope.localFilters.rangeState.includes(pair.range))
      )
        out.push(pair);
    }
  if (cache) {
    if (cache.size >= 6) cache.delete(cache.keys().next().value!);
    cache.set(cacheKey, out);
  }
  return out;
}
const dayIndexes = new WeakMap<Dataset["weeks"], Map<string, number>>();
export function aggregatePairs(
  input: readonly PairFact[],
  _dataset?: Dataset,
): Aggregate {
  const pairs = [...new Map(input.map((p) => [p.id, p])).values()];
  const add = (field: keyof SummaryMetrics, unit: string) =>
    addMetrics(
      pairs.map((p) => p[field] as MetricValue),
      unit,
    );
  const sales = add("sales", "USD"),
    base = add("comparisonSales", "USD"),
    gm = add("gmDollars", "USD");
  const qty = quantityTotal(
    pairs.flatMap((p) =>
      Object.entries(p.quantityByUom).map(([uom, value]) => ({
        uom: uom as Uom,
        value: value!,
      })),
    ),
  );
  const mixed = unique(pairs.map((p) => p.item.uom)).length > 1;
  const compatible = (field: keyof SummaryMetrics) =>
    mixed
      ? missing(
          "mixed",
          "Incompatible quantity units; inspect subtotals.",
          "not-applicable",
        )
      : add(
          field,
          pairs[0]?.item.uom ??
            _dataset?.unitPolicy?.sellingUnit ??
            "SELLING_UNIT_TBC",
        );
  const quantity = pairs.some((p) => p.quantity.value === null)
    ? missing(qty.quantity.unit, "Quantity feed incomplete.")
    : {
        ...qty.quantity,
        state:
          pairs.some((p) => p.quantity.state === "stale") &&
          qty.quantity.value !== null
            ? ("stale" as const)
            : qty.quantity.state,
      };
  const exposure = add("exposureWeeks", "pair-weeks"),
    qualified = compatible("qualifyingQuantity");
  const caseIds = unique(pairs.flatMap((p) => p.caseIds)),
    impacted = pairs.filter((p) => p.caseIds.length);
  const calendar = _dataset?.weeks ?? getScenarioDataset().weeks;
  const storeDays = new Map<string, number>();
  let dayIndex = dayIndexes.get(calendar);
  if (!dayIndex) {
    dayIndex = new Map();
    dayIndexes.set(calendar, dayIndex);
  }
  const weekIndex = new Map(calendar.map((w) => [w.id, w]));
  pairs.forEach((pair) =>
    pair.weeks.forEach((fact) => {
      const dayKey = `${pair.storeId}:${fact.weekId}:${pair.store.openedOn}:${pair.store.closedOn || ""}`;
      let days = dayIndex!.get(dayKey);
      if (days === undefined) {
        const week = weekIndex.get(fact.weekId);
        if (!week) return;
        days = 0;
        for (let d = 0; d < 7; d++) {
          const day = new Date(
            Date.parse(`${week.start}T00:00:00Z`) + d * 86400000,
          )
            .toISOString()
            .slice(0, 10);
          if (
            day >= pair.store.openedOn &&
            (!pair.store.closedOn || day < pair.store.closedOn)
          )
            days++;
        }
        dayIndex!.set(dayKey, days);
      }
      storeDays.set(`${pair.storeId}:${fact.weekId}`, days);
    }),
  );
  const storeWeeks = sum([...storeDays.values()]) / 7;
  const area = addMetrics(
    pairs.map((p) => p.allocatedArea || missing("sqft", "Area not connected.")),
    "sqft",
  );
  return {
    sales,
    lySales: add("lySales", "USD"),
    comparisonSales: base,
    salesChange:
      sales.value === null || base.value === null
        ? missing("%", "Comparable values unavailable.")
        : growth(sales.value, base.value),
    salesDelta:
      sales.value === null || base.value === null
        ? missing("USD", "Comparable values unavailable.")
        : measure(sales.value - base.value, "USD"),
    quantity,
    lyQuantity: compatible("lyQuantity"),
    quantityByUom: qty.byUom,
    gmDollars: gm,
    gmRate:
      gm.value === null
        ? missing("%", gm.reason ?? "Margin unavailable.", gm.state)
        : sales.value === null
          ? missing("%", "Sales unavailable.")
          : ratio(gm.value, sales.value, "%", 100),
    asp:
      sales.value === null || quantity.value === null
        ? missing(
            mixed ? "USD/mixed" : `USD/${quantity.unit}`,
            mixed ? "No mixed-unit ASP." : "Values missing.",
            mixed ? "not-applicable" : "missing",
          )
        : ratio(sales.value, quantity.value, `USD/${quantity.unit}`),
    ohCost: add("ohCost", "USD"),
    physicalOh: compatible("physicalOh"),
    sellableOh: compatible("sellableOh"),
    openInbound: compatible("openInbound"),
    qualifyingSales: add("qualifyingSales", "USD"),
    qualifyingQuantity: qualified,
    exposureWeeks: exposure,
    velocity:
      qualified.value === null || exposure.value === null
        ? missing(
            `${quantity.unit}/pair-week`,
            "Compatible numerator/exposure unavailable.",
            mixed ? "not-applicable" : "missing",
          )
        : ratio(qualified.value, exposure.value, `${quantity.unit}/pair-week`),
    itemCount: unique(pairs.map((p) => p.itemId)).length,
    storeCount: unique(pairs.map((p) => p.storeId)).length,
    pairCount: pairs.length,
    rangedPairCount: pairs.filter((p) => p.range === "ranged").length,
    rangedSkuCount: unique(
      pairs.filter((p) => p.range === "ranged").map((p) => p.itemId),
    ).length,
    rangedStoreCount: unique(
      pairs.filter((p) => p.range === "ranged").map((p) => p.storeId),
    ).length,
    stockoutPairCount: pairs.filter(
      (p) =>
        p.range === "ranged" &&
        p.sellableOh.state === "ok" &&
        p.physicalOh.value !== null &&
        p.physicalOh.value >= 0 &&
        p.sellableOh.value === 0,
    ).length,
    exitedPairCount: pairs.filter((p) => p.range === "exited").length,
    eligibleNotRangedPairCount: pairs.filter(
      (p) => p.eligibility === "eligible" && p.range !== "ranged",
    ).length,
    unknownPairCount: pairs.filter((p) => p.range === "unknown").length,
    openCaseCount: caseIds.length,
    impactedPairCount: impacted.length,
    impactedSkuCount: unique(impacted.map((p) => p.itemId)).length,
    caseIds,
    allocatedArea: area,
    salesPerSqFt:
      area.value === null || sales.value === null
        ? missing("USD/sqft", "Area or sales missing.")
        : ratio(sales.value, area.value, "USD/sqft"),
    storeExposureWeeks: measure(storeWeeks, "store-weeks"),
    salesPerStoreWeek:
      sales.value === null
        ? missing("USD/store-week", "Sales unavailable.")
        : ratio(sales.value, storeWeeks, "USD/store-week"),
    quantityPerStoreWeek:
      quantity.value === null
        ? missing(
            `${quantity.unit}/store-week`,
            "Compatible quantity unavailable.",
          )
        : ratio(quantity.value, storeWeeks, `${quantity.unit}/store-week`),
  };
}
export function getItemRows(scope: Scope, dataset?: Dataset): ItemRow[] {
  const data = dataFor(scope, dataset),
    pairs = selectScopedPairs(scope, data);
  return data.products.flatMap((product) => {
    const children = pairs.filter((p) => p.itemId === product.id);
    return children.length
      ? [
          {
            id: product.id,
            name: product.name,
            product,
            pairs: children,
            ...aggregatePairs(children, data),
          },
        ]
      : [];
  });
}
export function getStoreRows(scope: Scope, dataset?: Dataset): StoreRow[] {
  const data = dataFor(scope, dataset),
    pairs = selectScopedPairs(scope, data);
  return data.stores.flatMap((store) => {
    const children = pairs.filter((p) => p.storeId === store.id);
    return children.length
      ? [
          {
            id: store.id,
            name: store.name,
            store,
            pairs: children,
            ...aggregatePairs(children, data),
          },
        ]
      : [];
  });
}
export const supportedLenses = [
  "color",
  "finish",
  "species",
  "brand",
  "gbb",
  "subcategory",
] as const;
export function getMixRows(
  scope: Scope,
  lens: string,
  dataset?: Dataset,
  contributingPairs?: PairFact[],
): MixRow[] {
  if (!(supportedLenses as readonly string[]).includes(lens)) return [];
  const data = dataFor(scope, dataset),
    pairs = contributingPairs ?? selectScopedPairs(scope, data),
    parent = aggregatePairs(pairs, data),
    original = data.versions.find(
      (v) => v.reviewId === scope.reviewId && v.original,
    );
  const approvedPairs = new Map(
    original?.pairs.map((p) => [key(p.itemId, p.storeId), p]),
  );
  const label = (p: PairFact) => {
    const approved = scope.mode === "plr" ? approvedPairs.get(p.id) : undefined;
    return String(
      scope.mode === "plr" && lens === "color"
        ? (approved?.approvedColor ?? "Unknown")
        : scope.mode === "plr" && lens === "gbb"
          ? (approved?.approvedGbb ?? "Unknown")
          : ((p.item as unknown as Record<string, unknown>)[lens] ?? "Unknown"),
    );
  };
  return unique(pairs.map(label))
    .map((value) => {
      const children = pairs.filter((p) => label(p) === value),
        total = aggregatePairs(children, data),
        skuCount = unique(children.map((p) => p.itemId)).length;
      const skuShare = ratio(skuCount, parent.itemCount, "%", 100),
        salesShare =
          total.sales.value === null || parent.sales.value === null
            ? missing("%", "Sales unavailable.")
            : ratio(total.sales.value, parent.sales.value, "%", 100);
      return {
        id: value,
        label: value,
        itemIds: unique(children.map((p) => p.itemId)),
        pairIds: children.map((p) => p.id),
        attributeAsOf:
          scope.mode === "plr" && (lens === "color" || lens === "gbb")
            ? (original?.approvedOn ?? null)
            : null,
        attributeBasis:
          scope.mode === "plr" && (lens === "color" || lens === "gbb")
            ? "Original approved snapshot"
            : "Current product master; effective assignment date unavailable",
        skuCount,
        sales: total.sales,
        quantity: total.quantity,
        gmRate: total.gmRate,
        asp: total.asp,
        skuShare,
        salesShare,
        quantityShare:
          total.quantity.value === null || parent.quantity.value === null
            ? missing("%", "Compatible quantity unavailable.", "not-applicable")
            : ratio(total.quantity.value, parent.quantity.value, "%", 100),
        productivityIndex:
          salesShare.value === null || skuShare.value === null
            ? missing("x", "Share denominator unavailable.")
            : ratio(salesShare.value, skuShare.value, "x"),
      };
    })
    .sort(
      (a, b) =>
        (b.sales.value ?? -Infinity) - (a.sales.value ?? -Infinity) ||
        a.id.localeCompare(b.id),
    );
}
export function getTrend(
  scope: Scope,
  metric: "sales" | "quantity" | "gmRate" = "sales",
  grain: "week" | "month" | "window" = "week",
  dataset?: Dataset,
): TrendPoint[] {
  const data = dataFor(scope, dataset),
    cohort = selectScopedPairs(scope, data),
    ids = selectedWeekIds(scope, data),
    byWeek = new Map(data.weeks.map((w) => [w.id, w])),
    cohortIds = new Set(cohort.map((p) => p.id));
  const version = data.versions.find(
    (v) =>
      v.reviewId === scope.reviewId &&
      v.id === (scope.comparison === "revision" ? "v2" : "v1"),
  );
  return unique(
    ids.map((id) => (grain === "window" ? "selected-window" : grain === "week" ? id : byWeek.get(id)!.fiscalMonth)),
  ).map((id) => {
    const selected = ids.filter((w) =>
        grain === "window" || (grain === "week" ? w === id : byWeek.get(w)!.fiscalMonth === id),
      ),
      local = { ...scope, weekIds: selected },
      comparisonIds = comparisonWeekIds(local, data);
    const rows = cohort.flatMap((p) =>
        selected.flatMap((w) => {
          const f = factsIndex(data).get(p.id)?.get(w);
          return f ? [f] : [];
        }),
      ),
      base = cohort.flatMap((p) =>
        comparisonIds.flatMap((w) => {
          const f = factsIndex(data).get(p.id)?.get(w);
          return f ? [f] : [];
        }),
      );
    const plan = version?.phasedPlan.filter(
      (p) =>
        selected.includes(p.weekId) && cohortIds.has(key(p.itemId, p.storeId)),
    );
    const value = (facts: Dataset["facts"], expected: number): MetricValue => {
      if (metric === "gmRate" && scope.access === "restricted-margin")
        return missing("%", "Margin access restricted.", "restricted");
      if (
        facts.length !== expected ||
        facts.some((f) => f.quality === "missing")
      )
        return missing(
          metric === "sales" ? "USD" : metric === "quantity" ? scope.uom : "%",
          "Incomplete pair-week history.",
        );
      const sales = sum(facts.map((f) => f.netSales)),
        stale =
          facts.some((f) => f.quality === "stale") ||
          data.feeds.sales === "stale";
      if (metric === "sales")
        return measure(sales, "USD", stale ? "stale" : "ok");
      if (metric === "quantity") {
        const q = quantityTotal(
          facts.map((f) => ({ uom: f.uom, value: f.netQuantity })),
        ).quantity;
        return { ...q, state: q.value !== null && stale ? "stale" : q.state };
      }
      return facts.some((f) => f.recognizedCogs === null)
        ? missing("%", "Comparable COGS unavailable.")
        : ratio(
            sum(facts.map((f) => f.netSales - f.recognizedCogs!)),
            sales,
            "%",
            100,
          );
    };
    let comparison: MetricValue =
      scope.comparison === "none"
        ? missing(
            metric === "sales"
              ? "USD"
              : metric === "quantity"
                ? scope.uom
                : "%",
            "No comparison selected.",
            "not-applicable",
          )
        : value(base, cohort.length * comparisonIds.length);
    if (["original", "revision"].includes(scope.comparison))
      comparison = !plan
        ? missing(
            metric === "sales"
              ? "USD"
              : metric === "quantity"
                ? scope.uom
                : "%",
            "Plan not connected.",
          )
        : metric === "sales"
          ? measure(sum(plan.map((p) => p.sales)), "USD")
          : metric === "quantity"
            ? unique(cohort.map((p) => p.item.uom)).length > 1
              ? missing("mixed", "No mixed-unit plan sum.", "not-applicable")
              : measure(
                  sum(plan.map((p) => p.demandQuantity)),
                  cohort[0]?.item.uom || scope.uom,
                )
            : scope.access === "restricted-margin"
              ? missing("%", "Margin access restricted.", "restricted")
              : plan.some((p) => p.gmDollars === null)
                ? missing("%", "Planned margin unavailable.")
                : ratio(
                    sum(plan.map((p) => p.gmDollars!)),
                    sum(plan.map((p) => p.sales)),
                    "%",
                    100,
                  );
    return {
      id,
      label: grain === "window" ? "Selected window" : grain === "week" ? byWeek.get(selected[0])!.end : id,
      start: byWeek.get(selected[0])!.start,
      end: byWeek.get(selected.at(-1)!)!.end,
      actual: value(rows, cohort.length * selected.length),
      comparison,
    };
  });
}
export function getBreadth(scope: Scope, dataset?: Dataset): BreadthRow[] {
  const data = dataFor(scope, dataset),
    pairs = selectScopedPairs({ ...scope, population: "all-candidates" }, data);
  return selectedMasters(scope, data).stores.map((store) => {
    const group = pairs.filter((p) => p.storeId === store.id),
      ty = group.filter((p) => p.range === "ranged").map((p) => p.itemId),
      ly = group.filter((p) => p.lyRange === "ranged").map((p) => p.itemId);
    return {
      storeId: store.id,
      storeName: store.name,
      ty: unique(ty).length,
      ly: unique(ly).length,
      added: ty.filter((id) => !ly.includes(id)),
      removed: ly.filter((id) => !ty.includes(id)),
      retained: ty.filter((id) => ly.includes(id)),
      unknown: group
        .filter((p) => p.range === "unknown" || p.lyRange === "unknown")
        .map((p) => p.itemId),
    };
  });
}
export function getPlrReview(scope: Scope, dataset?: Dataset): PlrReview {
  const data = dataFor(scope, dataset),
    original = data.versions.find(
      (v) => v.reviewId === scope.reviewId && v.original,
    ),
    revised = data.versions.find(
      (v) => v.reviewId === scope.reviewId && v.id === "v2",
    );
  const plrScope: Scope = {
    ...scope,
    mode: "plr",
    population: "original",
    window: "PLR",
    comparison: "original",
  };
  const ids = selectedWeekIds(plrScope, data),
    last = data.weeks.find((w) => w.id === ids.at(-1))?.end || "",
    review = data.reviews?.find((r) => r.id === scope.reviewId);
  const cutoff = scope.weekIds
    ? scope.weekIds.length === original?.weekIds.length
      ? review?.sellingEnd || last
      : last
    : [scope.rangeAsOf, review?.sellingEnd || last].sort()[0];
  const pairs = selectScopedPairs(plrScope, data),
    total = aggregatePairs(pairs, data),
    selectedIds = new Set(pairs.map((p) => p.id)),
    selected =
      original?.pairs.filter((p) =>
        selectedIds.has(key(p.itemId, p.storeId)),
      ) || [],
    unit = total.quantity.unit;
  let due = 0,
    onTime = 0,
    late = 0,
    notActivated = 0,
    future = 0,
    unknown = 0;
  const exceptions: PlrReview["exceptions"] = [];
  for (const pair of selected) {
    const activation = histories(data)
      .get(key(pair.itemId, pair.storeId))
      ?.filter(
        (e) =>
          e.kind === "activation" &&
          e.effectiveOn >= original!.approvedOn &&
          e.effectiveOn <= cutoff,
      )[0];
    let state = "On time";
    if (pair.targetLaunch > cutoff) {
      future++;
      state = "Not yet due";
    } else {
      due++;
      if (!pair.historyKnown) {
        unknown++;
        state = "History unavailable";
      } else if (!activation) {
        notActivated++;
        state = "Not activated";
      } else if (activation.effectiveOn <= pair.targetLaunch) onTime++;
      else {
        late++;
        state = "Late";
      }
    }
    if (state !== "On time")
      exceptions.push({
        pairId: key(pair.itemId, pair.storeId),
        state,
        targetDate: pair.targetLaunch,
        activatedOn: activation?.effectiveOn,
      });
  }
  const planned = (v: typeof original, field: "sales" | "demandQuantity") =>
    !v
      ? missing(field === "sales" ? "USD" : unit, "Plan not connected.")
      : field === "demandQuantity" && unit === "mixed"
        ? missing("mixed", "No mixed-unit demand sum.", "not-applicable")
        : measure(
            sum(
              v.phasedPlan
                .filter(
                  (p) =>
                    ids.includes(p.weekId) &&
                    selectedIds.has(key(p.itemId, p.storeId)),
                )
                .map((p) => p[field]),
            ),
            field === "sales" ? "USD" : unit,
          );
  const originalPlan = planned(original, "sales"),
    revisedPlan = planned(revised, "sales"),
    planGm = original?.phasedPlan.filter(
      (p) =>
        ids.includes(p.weekId) && selectedIds.has(key(p.itemId, p.storeId)),
    );
  const plannedGmRate =
    scope.access === "restricted-margin"
      ? missing("%", "Margin access restricted.", "restricted")
      : !planGm ||
          planGm.some((p) => p.gmDollars === null) ||
          originalPlan.value === null
        ? missing("%", "Planned margin not available.")
        : ratio(
            sum(planGm.map((p) => p.gmDollars!)),
            originalPlan.value,
            "%",
            100,
          );
  const ledger = data.supply.filter(
      (s) =>
        s.reviewId === scope.reviewId &&
        s.storeId &&
        selectedIds.has(key(s.itemId, s.storeId)),
    ),
    mixed = unit === "mixed" || unique(ledger.map((s) => s.uom)).length > 1;
  const amount = (kind: string) =>
    sum(
      ledger
        .filter((s) => s.kind === kind && s.date <= cutoff)
        .map((s) => s.quantity),
    );
  const available =
    amount("opening") +
    amount("receipt") +
    amount("transfer-in") -
    amount("transfer-out") +
    amount("adjustment");
  // Net sales quantity already includes customer returns. Adding their movement
  // again would count the same returned stock twice in the physical bridge.
  const originalKeys = new Set(
    original?.pairs.map((p) => key(p.itemId, p.storeId)),
  );
  const allPairs = selectScopedPairs(
      {
        ...plrScope,
        mode: "in-season",
        population: "all-candidates",
        comparison: "none",
      },
      data,
    ),
    later = aggregatePairs(
      allPairs.filter((p) => !originalKeys.has(p.id)),
      data,
    );
  const quantityMetric = (value: number) =>
    !original
      ? missing(unit, "Original cohort missing.")
      : mixed
        ? missing(
            "mixed",
            "Incompatible units; inspect separate supply subtotals.",
            "not-applicable",
          )
        : measure(value, unit);
  const endingMetric = (metric: MetricValue): MetricValue =>
    !original
      ? missing(unit, "Original cohort missing.")
      : mixed
        ? missing("mixed", "Incompatible quantity units.", "not-applicable")
        : scope.stockAsOf !== cutoff
          ? missing(
              unit,
              "Exact review-end inventory snapshot unavailable; current stock is not substituted.",
            )
          : metric;
  const physicalEnding = endingMetric(total.physicalOh);
  const sellableEnding = endingMetric(total.sellableOh);
  const blockedEnding = mixed
    ? quantityMetric(0)
    : physicalEnding.value === null || sellableEnding.value === null
      ? missing(
          unit,
          "Exact compatible physical and sellable closing stock are required.",
        )
      : quantityMetric(physicalEnding.value - sellableEnding.value);
  const expectedPhysicalEnding = mixed
    ? quantityMetric(0)
    : total.quantity.value === null
      ? missing(unit, "Compatible net sales quantity is unavailable.")
      : quantityMetric(available - total.quantity.value);
  if (expectedPhysicalEnding.value !== null && total.quantity.state === "stale")
    expectedPhysicalEnding.state = "stale";
  if (
    blockedEnding.value !== null &&
    (physicalEnding.state === "stale" || sellableEnding.state === "stale")
  )
    blockedEnding.state = "stale";
  const flowDifference = mixed
    ? quantityMetric(0)
    : physicalEnding.value === null || expectedPhysicalEnding.value === null
      ? missing(
          unit,
          "Expected and exact observed physical ending quantities are required.",
        )
      : quantityMetric(expectedPhysicalEnding.value - physicalEnding.value);
  if (flowDifference.value !== null && Math.abs(flowDifference.value) > 1e-8) {
    flowDifference.state = "reconcile";
    flowDifference.reason =
      "Available supply less net sales quantity does not equal observed physical ending stock.";
  } else if (
    flowDifference.value !== null &&
    (total.quantity.state === "stale" || physicalEnding.state === "stale")
  ) {
    flowDifference.state = "stale";
  }
  const selectedPairPlan =
    original?.pairPlans.filter((p) =>
      selectedIds.has(key(p.itemId, p.storeId)),
    ) || [];
  const allPairIds = new Set(allPairs.map((p) => p.id));
  const latestRows = data.latestPlan?.phasedPlan.filter(
    (p) => ids.includes(p.weekId) && allPairIds.has(key(p.itemId, p.storeId)),
  );
  return {
    connected: !!original,
    originalVersionId: "v1",
    selectedVersionId: scope.version,
    sellingStart:
      data.weeks.find((w) => w.id === original?.weekIds[0])?.start || "",
    sellingEnd: cutoff,
    originalPairCount: original?.pairs.length || 0,
    selectedOriginalPairCount: selected.length,
    duePairs: due,
    onTimePairs: onTime,
    latePairs: late,
    notActivatedPairs: notActivated,
    notYetDuePairs: future,
    unknownHistoryPairs: unknown,
    executionRate: !original
      ? missing("%", "Plan not connected.")
      : unknown
        ? missing("%", "Unknown history; show explicit bounds.", "unknown")
        : ratio(onTime, due, "%", 100),
    executionBounds: {
      lower: due ? (onTime / due) * 100 : 0,
      upper: due ? ((onTime + unknown) / due) * 100 : 0,
    },
    actualSales: original
      ? total.sales
      : missing("USD", "Original cohort missing."),
    originalSalesPlan: originalPlan,
    revisedSalesPlan: revisedPlan,
    salesVariance:
      total.sales.value === null || originalPlan.value === null
        ? missing("USD", "Plan/actual missing.")
        : measure(total.sales.value - originalPlan.value, "USD"),
    laterAdditionSales: original
      ? later.sales
      : missing("USD", "Original cohort missing."),
    totalRealizedSales:
      original && total.sales.value !== null && later.sales.value !== null
        ? measure(total.sales.value + later.sales.value, "USD")
        : missing("USD", "Original cohort or actual missing."),
    actualQuantity: original
      ? total.quantity
      : missing(unit, "Original cohort missing."),
    demandPlanQuantity: planned(original, "demandQuantity"),
    gmDollars: original
      ? total.gmDollars
      : missing("USD", "Original cohort missing."),
    gmRate: original ? total.gmRate : missing("%", "Original cohort missing."),
    plannedGmRate,
    gmGapPp:
      total.gmRate.value === null || plannedGmRate.value === null
        ? missing(
            "pp",
            "Actual/planned margin unavailable.",
            scope.access === "restricted-margin" ? "restricted" : "missing",
          )
        : measure(total.gmRate.value - plannedGmRate.value, "pp"),
    supplyAvailable: quantityMetric(available),
    sellThrough: mixed
      ? missing("%", "No mixed-unit sell-through.", "not-applicable")
      : total.quantity.value === null
        ? missing("%", "Quantity missing.")
        : ratio(total.quantity.value, available, "%", 100),
    endingInventoryCost: original
      ? scope.stockAsOf === cutoff
        ? total.ohCost
        : missing(
            "USD",
            "Exact review-end inventory snapshot unavailable; current stock is not substituted.",
          )
      : missing("USD", "Original cohort missing."),
    plannedEndingInventoryCost: !original
      ? missing("USD", "Original plan missing.")
      : ids.length < original.weekIds.length
        ? missing("USD", "Final EOP plan is not phased to partial review.")
        : measure(sum(selectedPairPlan.map((p) => p.endingCost)), "USD"),
    approvedBuyQuantity: quantityMetric(
      sum(selectedPairPlan.map((p) => p.approvedBuyQuantity)),
    ),
    receivedQuantity: quantityMetric(amount("receipt")),
    transferInQuantity: quantityMetric(amount("transfer-in")),
    transferOutQuantity: quantityMetric(amount("transfer-out")),
    adjustmentQuantity: quantityMetric(amount("adjustment")),
    customerReturnQuantity: quantityMetric(amount("customer-return")),
    expectedPhysicalEndingQuantity: expectedPhysicalEnding,
    physicalEndingQuantity: physicalEnding,
    sellableEndingQuantity: sellableEnding,
    blockedEndingQuantity: blockedEnding,
    openingQuantity: quantityMetric(amount("opening")),
    openOrderQuantity: quantityMetric(amount("open-order")),
    originalPairs: selected,
    exceptions,
    warnings: [
      !original ? "Plan not connected; no LY substitution." : "",
      !isContiguousReviewPrefix(scope, data)
        ? "This arbitrary week subset is not a valid elapsed PLR review; choose a contiguous approved selling-window prefix."
        : "",
      unknown ? "Unknown history suppresses verified execution rate." : "",
      selected.length !== (original?.pairs.length || 0)
        ? "Selected original cohort; full approval remains reference."
        : "",
      data.latestPlan
        ? "Original approval and latest all-population plan have different cohorts."
        : "",
      "Prototype calendar and selling-unit definition require confirmation.",
    ].filter(Boolean),
    elapsedWeeks: ids.length,
    plannedWeeks: original?.weekIds.length || 0,
    latestPlanAllSales: latestRows
      ? measure(sum(latestRows.map((p) => p.sales)), "USD")
      : missing("USD", "Latest plan unavailable."),
    physicalFlowDifference: flowDifference,
    blockedQuantity: blockedEnding,
  };
}
export function resolveWorkspace(
  scope: Scope,
  dataset?: Dataset,
): WorkspaceResult {
  const data = dataFor(scope, dataset),
    pairs = selectScopedPairs(scope, data),
    pairIds = new Set(pairs.map((p) => p.id)),
    cases = data.cases.filter(
      (c) => c.state !== "Resolved" && pairIds.has(key(c.itemId, c.storeId)),
    );
  const byItem = new Map<string, PairFact[]>(),
    byStore = new Map<string, PairFact[]>();
  pairs.forEach((p) => {
    byItem.set(p.itemId, [...(byItem.get(p.itemId) || []), p]);
    byStore.set(p.storeId, [...(byStore.get(p.storeId) || []), p]);
  });
  return {
    scope: structuredClone(scope),
    signature: scopeSignature(scope, data),
    datasetLabel: data.label,
    warnings: unique(pairs.flatMap((p) => p.warnings)),
    weekIds: selectedWeekIds(scope, data),
    comparisonWeekIds: comparisonWeekIds(scope, data),
    overview: aggregatePairs(pairs, data),
    items: data.products.flatMap((product) => {
      const children = byItem.get(product.id);
      return children
        ? [
            {
              id: product.id,
              name: product.name,
              product,
              pairs: children,
              ...aggregatePairs(children, data),
            },
          ]
        : [];
    }),
    stores: data.stores.flatMap((store) => {
      const children = byStore.get(store.id);
      return children
        ? [
            {
              id: store.id,
              name: store.name,
              store,
              pairs: children,
              ...aggregatePairs(children, data),
            },
          ]
        : [];
    }),
    pairs,
    cases,
    plr: getPlrReview(scope, data),
  };
}
const supported = new Set([
  "K01",
  "K02",
  "K03",
  "K04",
  "K05",
  "K06",
  "K08",
  "K10",
  "K14",
  "K19",
  "K20",
  "K21",
  "K22",
  "K23",
  "K24",
  "K25",
  "K26",
  "K28",
  "K29",
  "K32",
  "K33",
  "K34",
  "K40",
  "K41",
  "K56",
  "K69",
  "K70",
  "K73",
  "K74",
]);
export const metricDefinitions = catalogue.map((metric) => ({
  id: metric.id,
  label: metric.name,
  unit: metric.grain_unit,
  definition: metric.base_definition,
  status: metric.evidence_status,
  sourceAliases: metric.source_labels
    .split(";")
    .map((label) => label.trim())
    .filter(Boolean),
  aggregation: metric.aggregation_guards,
  evidence: metric.evidence,
  version: "proposed-base-v2",
  supported: supported.has(metric.id),
  ...(!supported.has(metric.id)
    ? {
        unavailableReason:
          "Definition/feed not validated in this illustrative prototype; original source label and evidence status are retained.",
      }
    : {}),
}));
