import {
  allocate,
  flooringItems,
  flooringItemStores,
  getFlooringStores,
} from "../../../../mocks/flooringDemo";
import type {
  Dataset,
  FiscalWeek,
  ItemStoreWeek,
  OriginalPair,
  PlannedWeek,
  Product,
  RangeEvent,
  SupplyLine,
  CaseQueue,
} from "./types";
export const SNAPSHOT_DATE = "2026-07-31";
export const PLR_END_DATE = SNAPSHOT_DATE;
export const REVIEW_ID = "PLR-SS26-FLOORING";
export const DATA_VERSION = "flooring-ledger-ss26-v2";
export const SEASON_ID = "SS26";
export const CALENDAR_ID = "prototype-52-week-monday-v1";
export const datePlus = (date: string, days: number) =>
  new Date(Date.parse(`${date}T00:00:00Z`) + days * 86400000)
    .toISOString()
    .slice(0, 10);
export function deepFreeze<T>(value: T): T {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.values(value).forEach(deepFreeze);
    Object.freeze(value);
  }
  return value;
}
const weights = [
  5, 5.5, 6, 6.5, 7, 7.5, 8, 11.5, 12, 8.5, 8, 8, 7.8, 7, 6.5, 6.5, 8, 7, 5,
  4.5, 4.5, 6, 4.5, 4.5, 4.5, 4,
];
export const products: Product[] = flooringItems.map((i) => ({
  id: i.styleId,
  article: i.article,
  name: i.name,
  description: i.styleName || i.name,
  category: i.l1_name,
  subcategory: i.l2_name,
  brand: i.brand,
  color: i.colour || null,
  finish: i.finish || null,
  species: i.species || null,
  gbb: null,
  uom: "SELLING_UNIT_TBC",
  lifecycle: "Active",
  focusGroups: [],
  vendor: "Unknown",
  provenance: "illustrative-demo",
  imageUrl: i.imageUrl,
  sourceMip: null,
  sourceMipStatus: "unavailable",
  allocatedAreaSqFt: i.allocatedAreaSqFt,
  definitionStatus: "Synthetic · definition TBC",
}));
export const stores = getFlooringStores().map((s) => ({
  id: s.storeId,
  name: s.name,
  cluster: s.cluster,
  region: "Unknown",
  district: "Unknown",
  market: s.name,
  openedOn: "2018-01-01",
  channel: "Store" as const,
}));
const weeks: FiscalWeek[] = Array.from({ length: 156 }, (_, i) => ({
  id: `PW-${String(i + 1).padStart(3, "0")}`,
  start: datePlus("2023-07-31", i * 7),
  end: datePlus("2023-07-31", i * 7 + 6),
  fiscalMonth: datePlus("2023-07-31", i * 7 + 6).slice(0, 7),
  lyWeekId: i >= 52 ? `PW-${String(i - 51).padStart(3, "0")}` : "",
  complete: true,
}));
// Only the final 104 weeks carry facts: 52 TY and 52 matched LY. Earlier keys anchor LY comparisons honestly.
const currentWeeks = weeks.slice(-52),
  lyWeeks = weeks.slice(-104, -52),
  seasonWeeks = currentWeeks.slice(-26);
export const R4_WEEKS = currentWeeks.slice(-4).map((w) => w.id);
export const PLR_WEEKS = seasonWeeks.map((w) => w.id);
/** Integer transport matrix: every row and column marginal is exact, including pennies. */
export function balancedAllocation(
  rowTotals: number[],
  columnTotals: number[],
  precision = 0,
): number[][] {
  const scale = 10 ** precision,
    rows = rowTotals.map((v) => Math.round(v * scale)),
    cols = columnTotals.map((v) => Math.round(v * scale));
  if (rows.reduce((a, b) => a + b, 0) !== cols.reduce((a, b) => a + b, 0))
    throw new Error("Transport marginal mismatch.");
  const remaining = [...cols];
  return rows.map((target, r) => {
    const last = r === rows.length - 1;
    const shares = last ? [...remaining] : allocate(target, remaining);
    shares.forEach((v, c) => (remaining[c] -= v));
    return shares.map((v) => v / scale);
  });
}
const lowest = [...flooringItems]
  .sort((a, b) => a.revenue - b.revenue || a.styleId.localeCompare(b.styleId))
  .slice(0, 6)
  .map((i) => i.styleId);
export const LATER_ADDITION_IDS = lowest;
const originalIds = new Set(
  products.filter((p) => !lowest.includes(p.id)).map((p) => p.id),
);
const rangeEvents: RangeEvent[] = [],
  facts: ItemStoreWeek[] = [],
  supply: SupplyLine[] = [],
  inventory: Dataset["inventory"] = [];
const allLeaves = new Map(
  flooringItemStores.map((r) => [`${r.styleId}:${r.storeId}`, r]),
);
const globalBlocked = flooringItems.reduce(
  (n, i) => n + i.buyUnits - i.units - i.sellableUnits,
  0,
);
const northLeaves = flooringItemStores.filter((r) => r.styleId === "1000037");
const blocked = allocate(
  globalBlocked,
  northLeaves.map((r) => r.quantity),
);
const physicalByPair = new Map<string, number>();
for (const [pi, item] of flooringItems.entries()) {
  const leaves = flooringItemStores.filter((r) => r.styleId === item.styleId);
  const beforeSales = allocate(
      item.revenue * (0.82 + (pi % 5) * 0.03),
      weights,
      2,
    ),
    beforeQty = allocate(item.units * (0.82 + (pi % 5) * 0.03), weights);
  const tySales = [...beforeSales, ...allocate(item.revenue, weights, 2)],
    tyQty = [...beforeQty, ...allocate(item.units, weights)];
  const lySales = [
      ...allocate(item.lyRevenue * (0.82 + (pi % 5) * 0.03), weights, 2),
      ...allocate(item.lyRevenue, weights, 2),
    ],
    lyQty = [
      ...allocate(item.lyUnits * (0.82 + (pi % 5) * 0.03), weights),
      ...allocate(item.lyUnits, weights),
    ];
  const tySeasonGm = allocate(item.grossMargin, weights, 2),
    tyGm = [
      ...allocate(item.grossMargin * (0.82 + (pi % 5) * 0.03), weights, 2),
      ...tySeasonGm,
    ];
  const periodMatrices = (
    sale: number[],
    qty: number[],
    gm: number[],
    season: boolean,
  ) => ({
    s: balancedAllocation(
      season
        ? leaves.map((r) => r.sales)
        : allocate(
            sale.reduce((a, b) => a + b, 0),
            leaves.map((r) => r.sales),
            2,
          ),
      sale,
      2,
    ),
    q: balancedAllocation(
      season
        ? leaves.map((r) => r.quantity)
        : allocate(
            qty.reduce((a, b) => a + b, 0),
            leaves.map((r) => r.quantity),
          ),
      qty,
    ),
    g: balancedAllocation(
      season
        ? leaves.map((r) => r.gmDollars)
        : allocate(
            gm.reduce((a, b) => a + b, 0),
            leaves.map((r) => r.gmDollars),
            2,
          ),
      gm,
      2,
    ),
  });
  const tyPre = periodMatrices(
      tySales.slice(0, 26),
      tyQty.slice(0, 26),
      tyGm.slice(0, 26),
      false,
    ),
    tySeason = periodMatrices(
      tySales.slice(26),
      tyQty.slice(26),
      tyGm.slice(26),
      true,
    );
  const lyGm = lySales.map((v) => Math.round(v * 0.316 * 100) / 100);
  const lyPre = periodMatrices(
      lySales.slice(0, 26),
      lyQty.slice(0, 26),
      lyGm.slice(0, 26),
      false,
    ),
    lySeason = periodMatrices(
      lySales.slice(26),
      lyQty.slice(26),
      lyGm.slice(26),
      false,
    );
  leaves.forEach((leaf, si) => {
    const pair = `${item.styleId}:${leaf.storeId}`,
      isLater = lowest.includes(item.styleId),
      isNorth = item.styleId === "1000037";
    // History is illustrative, never inferred from transaction presence.
    rangeEvents.push({
      id: `${pair}:history`,
      itemId: item.styleId,
      storeId: leaf.storeId,
      effectiveOn: "2024-07-01",
      range: "ranged",
      eligibility: "eligible",
      kind: "history",
      source: "Synthetic versioned membership feed",
      note: "Prototype historical membership; not client history.",
    });
    rangeEvents.push({
      id: `${pair}:prelaunch`,
      itemId: item.styleId,
      storeId: leaf.storeId,
      effectiveOn: isLater ? "2026-01-18" : "2026-01-25",
      range: "not-ranged",
      eligibility: "eligible",
      kind: "eligibility",
      source: "Synthetic frozen range setup",
      note: "Explicit prelaunch state; dated launch records determine activation.",
    });
    rangeEvents.push({
      id: `${pair}:activation`,
      itemId: item.styleId,
      storeId: leaf.storeId,
      effectiveOn: isLater ? "2026-01-19" : "2026-01-26",
      range: "ranged",
      eligibility: "eligible",
      kind: "activation",
      source: "Synthetic range execution",
      note: isLater
        ? "Post-approval addition, before the selling window; excluded from original cohort."
        : "Original approval activation record.",
    });
    for (let wi = 0; wi < 52; wi++)
      for (const era of ["ly", "ty"] as const) {
        const matrix =
            era === "ty"
              ? wi < 26
                ? tyPre
                : tySeason
              : wi < 26
                ? lyPre
                : lySeason,
          j = wi % 26,
          w = (era === "ty" ? currentWeeks : lyWeeks)[wi];
        const sales = matrix.s[si][j],
          quantity = matrix.q[si][j],
          gm = matrix.g[si][j];
        facts.push({
          itemId: item.styleId,
          storeId: leaf.storeId,
          weekId: w.id,
          netSales: sales,
          netQuantity: quantity,
          recognizedCogs: Math.round((sales - gm) * 100) / 100,
          uom: "SELLING_UNIT_TBC",
          transactionCount: sales !== 0 || quantity !== 0 ? 1 : 0,
          rangedOpenDays: 7,
          quality: "complete",
          sourceVersion: DATA_VERSION,
        });
      }
    const physical = leaf.sellableQty + (isNorth ? blocked[si] : 0);
    physicalByPair.set(pair, physical);
    inventory.push({
      itemId: item.styleId,
      storeId: leaf.storeId,
      asOf: SNAPSHOT_DATE,
      physical,
      sellable: leaf.sellableQty,
      cost: leaf.onHandCost,
      allocatedAreaSqFt: leaf.allocatedAreaSqFt,
      uom: "SELLING_UNIT_TBC",
      quality: "complete",
      refreshedAt: "2026-08-01T06:00:00Z",
    });
    const available = leaf.quantity + physical,
      opening = Math.floor(available * 0.2);
    const common = {
      itemId: item.styleId,
      storeId: leaf.storeId,
      uom: "SELLING_UNIT_TBC" as const,
      reviewId: originalIds.has(item.styleId) ? REVIEW_ID : undefined,
    };
    supply.push(
      {
        id: `${pair}:opening`,
        ...common,
        kind: "opening",
        quantity: opening,
        date: "2026-01-26",
        status: "Recorded",
        sourceRef: `DEMO-OPEN-${pair}`,
      },
      {
        id: `${pair}:receipt`,
        ...common,
        kind: "receipt",
        quantity: available - opening,
        date: "2026-02-02",
        status: "Received",
        sourceRef: `DEMO-RECEIPT-${pair}`,
      },
    );
  });
}
// Explicit exceptions: exits, late launches, future launches and unavailable history remain in original cohort.
const exceptionPairs = products
  .filter((p) => originalIds.has(p.id) && p.id !== "1000037")
  .slice(0, 7)
  .map((p, i) => ({ itemId: p.id, storeId: stores[i].id }));
const exceptionKey = (n: number) =>
  `${exceptionPairs[n].itemId}:${exceptionPairs[n].storeId}`;
rangeEvents.push({
  id: `${exceptionKey(0)}:exit`,
  ...exceptionPairs[0],
  effectiveOn: "2026-06-01",
  range: "exited",
  eligibility: "ineligible",
  kind: "exit",
  source: "Synthetic lifecycle feed",
  note: "Exit after approval does not remove original performance.",
});
for (const n of [1, 2]) {
  const e = rangeEvents.find((e) => e.id === `${exceptionKey(n)}:activation`)!;
  e.effectiveOn = "2026-02-02";
}
// No activation for one due pair; transactions remain exposed and flagged for reconciliation.
const failed = rangeEvents.findIndex(
  (e) => e.id === `${exceptionKey(3)}:activation`,
);
rangeEvents.splice(failed, 1);
rangeEvents.push({
  id: `${exceptionKey(3)}:inactive`,
  ...exceptionPairs[3],
  effectiveOn: "2026-01-26",
  range: "not-ranged",
  eligibility: "eligible",
  kind: "eligibility",
  source: "Synthetic execution feed",
  note: "No recorded activation; transaction history does not prove activation.",
});
const unknownPair = exceptionKey(4);
rangeEvents
  .filter((e) => `${e.itemId}:${e.storeId}` === unknownPair)
  .forEach((e) => {
    e.range = "unknown";
    e.eligibility = "unknown";
    e.kind = "history";
    e.note = "Membership history unavailable.";
  });
const originalPairs: OriginalPair[] = products
  .filter((p) => originalIds.has(p.id))
  .flatMap((p) =>
    stores.map((s) => ({
      itemId: p.id,
      storeId: s.id,
      targetLaunch: [exceptionKey(5), exceptionKey(6)].includes(
        `${p.id}:${s.id}`,
      )
        ? "2026-08-03"
        : "2026-01-26",
      historyKnown: `${p.id}:${s.id}` !== unknownPair,
      approvedColor: p.color,
      approvedGbb: p.gbb,
    })),
  );
// Exposure days are derived from dated membership and actual open-store days, never current membership only.
const history = new Map<string, RangeEvent[]>();
rangeEvents.forEach((e) => {
  const k = `${e.itemId}:${e.storeId}`;
  history.set(k, [...(history.get(k) || []), e]);
});
history.forEach((events) =>
  events.sort(
    (a, b) =>
      a.effectiveOn.localeCompare(b.effectiveOn) || a.id.localeCompare(b.id),
  ),
);
const weekIndex = new Map(weeks.map((w) => [w.id, w]));
for (const f of facts) {
  const w = weekIndex.get(f.weekId)!;
  const events = history.get(`${f.itemId}:${f.storeId}`)!;
  f.rangedOpenDays = Array.from({ length: 7 }, (_, d) =>
    datePlus(w.start, d),
  ).filter(
    (day) =>
      events.filter((e) => e.effectiveOn <= day).at(-1)?.range === "ranged",
  ).length;
}
const originalWeights = originalPairs.map(
  (p) => allLeaves.get(`${p.itemId}:${p.storeId}`)!.sales,
);
function phased(
  pairs: OriginalPair[],
  target: number,
  qty: number,
  gmRate: number,
): PlannedWeek[] {
  const sales = allocate(target, originalWeights, 2),
    quantity = allocate(qty, originalWeights),
    gm = allocate(target * gmRate, originalWeights, 2);
  return pairs.flatMap((p, i) => {
    const s = allocate(sales[i], weights, 2),
      q = allocate(quantity[i], weights),
      g = allocate(gm[i], weights, 2);
    return PLR_WEEKS.map((weekId, w) => ({
      itemId: p.itemId,
      storeId: p.storeId,
      weekId,
      sales: s[w],
      demandQuantity: q[w],
      gmDollars: g[w],
    }));
  });
}
const pairBuys = allocate(300000, originalWeights),
  pairEop = allocate(60000, originalWeights),
  pairEopCost = allocate(2400000, originalWeights, 2);
const versions = (["v1", "v2"] as const).map((id) => ({
  reviewId: REVIEW_ID,
  id,
  name:
    id === "v1"
      ? "Original approved SS26 ·66 styles"
      : "Approved revision ·same frozen cohort",
  approvedOn: id === "v1" ? "2025-12-15" : "2026-04-06",
  original: id === "v1",
  weekIds: PLR_WEEKS,
  pairs: originalPairs,
  phasedPlan: phased(
    originalPairs,
    id === "v1" ? 8800000 : 8100000,
    id === "v1" ? 200000 : 190000,
    0.32,
  ),
  approvedBuyQuantity: 300000,
  approvedBuyCost: 12000000,
  plannedEopQuantity: 60000,
  plannedEopCost: 2400000,
  pairPlans: originalPairs.map((p, i) => ({
    ...p,
    approvedBuyQuantity: pairBuys[i],
    endingQuantity: pairEop[i],
    endingCost: pairEopCost[i],
  })),
}));
const latestQuantities = allocate(
  190000,
  flooringItemStores.map((l) => l.sales),
);
const latestPlan: PlannedWeek[] = flooringItemStores.flatMap((leaf, li) => {
  const item = flooringItems.find((i) => i.styleId === leaf.styleId)!;
  const share = leaf.sales / item.revenue,
    s = allocate(
      item.planRevenue,
      flooringItemStores
        .filter((l) => l.styleId === item.styleId)
        .map((l) => l.sales),
      2,
    )[stores.findIndex((st) => st.id === leaf.storeId)];
  const sales = allocate(s, weights, 2),
    qty = allocate(latestQuantities[li], weights);
  return PLR_WEEKS.map((weekId, w) => ({
    itemId: leaf.styleId,
    storeId: leaf.storeId,
    weekId,
    sales: sales[w],
    demandQuantity: qty[w],
    gmDollars: Math.round(sales[w] * 0.32 * 100) / 100,
  }));
});
supply.push(
  {
    id: "PO-NORTHPORT-200",
    itemId: "1000037",
    storeId: "ST1001",
    dcId: "DC01",
    kind: "open-order",
    quantity: 200,
    uom: "SELLING_UNIT_TBC",
    date: SNAPSHOT_DATE,
    eta: "2026-08-04",
    allocated: 200,
    status: "Open · allocated",
    sourceRef: "DEMO-PO-NORTHPORT",
    reviewId: REVIEW_ID,
  },
  {
    id: "DC-NORTHPORT-900",
    itemId: "1000037",
    dcId: "DC01",
    kind: "dc-pool",
    quantity: 900,
    uom: "SELLING_UNIT_TBC",
    date: SNAPSHOT_DATE,
    allocated: 200,
    status: "Shared pool · count once",
    sourceRef: "DEMO-DC-NORTHPORT",
  },
);
const queueNames: CaseQueue[] = [
  "Shortages",
  "Coverage/excess",
  "New item",
  "Nonproductive",
  "Bulk out",
  "Lifecycle/exit",
];
const casePairs = [
  { itemId: "1000037", storeId: "ST1001" },
  ...exceptionPairs.slice(0, 5),
];
const cases = casePairs.map((p, i) => {
  const stock = inventory.find(
    (s) => s.itemId === p.itemId && s.storeId === p.storeId,
  )!;
  return {
    id: `FQ${String(i + 1).padStart(2, "0")}`,
    title: `${queueNames[i]} review ·${p.itemId} at ${p.storeId}`,
    ...p,
    priority:
      i === 0
        ? ("Critical" as const)
        : i < 3
          ? ("High" as const)
          : ("Watch" as const),
    queue: queueNames[i],
    state: "Open" as const,
    owner: "Demo category merchant",
    reviewDate: "2026-08-07",
    ruleId: `demo-${queueNames[i].toLowerCase().replace(/[^a-z]+/g, "-")}`,
    ruleVersion: "illustrative-v2",
    metric: i === 0 ? "K06" : "K56",
    actual: {
      value: i === 0 ? stock.sellable : stock.cost,
      state: "ok" as const,
      unit: i === 0 ? "SELLING_UNIT_TBC" : "USD",
    },
    threshold:
      i === 0
        ? "Ranged and zero sellable stock"
        : "Merchant review candidate; production predicate not confirmed",
    observation:
      i === 0
        ? "Northport chain product sales are $1.6M for SS26, -29.3% vs matched LY. This Houston pair has zero sellable stock; blocked physical stock is unavailable. Existing inbound 200 and shared DC 900 are separate. Current pair facts below use the applied period and comparator."
        : "Synthetic case demonstrates review workflow; this is not a claimed validated exception rule.",
    hypothesis:
      "Confirm demand, membership, supply and field evidence before choosing an action.",
    evidenceIds: [
      `${p.itemId}:${p.storeId}`,
      ...(i === 0 ? ["PO-NORTHPORT-200", "DC-NORTHPORT-900"] : []),
    ],
    evaluatedAt: "2026-08-01T06:00:00Z",
    evaluationScope: {
      window: "SEASON" as const,
      stockAsOf: SNAPSHOT_DATE,
      rangeAsOf: SNAPSHOT_DATE,
      dataVersion: DATA_VERSION,
    },
  };
});
export const flooringDataset: Dataset = deepFreeze({
  id: "flooring-72x45-ss26",
  version: DATA_VERSION,
  label: "SS26 flooring ·72 styles ×45 stores ·synthetic, definitions TBC",
  products,
  stores,
  weeks,
  facts,
  inventory,
  rangeEvents,
  supply,
  versions,
  cases,
  observations: [
    {
      id: "FO01",
      text: "Illustrative field report: replenishment timing may constrain Northport. Demand causality and lost sales are unproven.",
      author: "Demo field merchant",
      observedOn: "2026-07-30",
      recordedOn: "2026-08-01T08:00:00Z",
      itemIds: ["1000037"],
      storeIds: ["ST1001"],
      source: "Synthetic field note; no client attachment",
      evidenceClass: "merchant-observation",
    },
  ],
  learnings: [
    {
      id: "FL01",
      reviewId: REVIEW_ID,
      version: "v1",
      question:
        "Did the original assortment depth and launch execution support realized demand?",
      evidenceIds: ["1000037:ST1001"],
      hypothesis:
        "Availability and launch execution qualify the demand interpretation.",
      conclusion: "",
      owner: "Demo category lead",
      confidence: "Pending review",
      pairIds: ["1000037:ST1001"],
      nextReviewId: "PLR-SS27-FLOORING",
      state: "Pending",
    },
  ],
  calendar: {
    id: CALENDAR_ID,
    version: "1.0-TBC",
    completeThrough: "2026-07-26",
    currentWeekIds: currentWeeks.map((w) => w.id),
    seasonWeekIds: PLR_WEEKS,
    periodOptions: [
      ["LW", "Last completed week"],
      ["R4", "Last4 completed weeks"],
      ["R13", "Last13 completed weeks"],
      ["R52", "Last52 completed weeks"],
      ["MTD", "Month to date"],
      ["QTD", "Quarter to date"],
      ["YTD", "Year to date"],
      ["SEASON", "SS26 selling season"],
      ["CUSTOM", "Custom completed weeks"],
    ].map(([id, label]) => ({
      id: id as import("./types").WindowId,
      label,
      definition:
        "Prototype Monday–Sunday calendar; fiscal alignment requires F&D confirmation.",
    })),
    definitionStatus: "Synthetic prototype calendar · fiscal definition TBC",
  },
  reviews: [
    {
      id: REVIEW_ID,
      name: "SS26 Flooring PLR",
      seasonId: SEASON_ID,
      calendarId: CALENDAR_ID,
      sellingStart: seasonWeeks[0].start,
      sellingEnd: SNAPSHOT_DATE,
      versionIds: ["v1", "v2"],
    },
  ],
  unitPolicy: {
    sellingUnit: "SELLING_UNIT_TBC",
    confirmed: false,
    note: "Synthetic selling units. No SQFT or pack conversion inferred. Allocated selling area is separately measured in sqft.",
  },
  latestPlan: {
    sales: 8600000,
    quantity: 190000,
    gmDollars: 2752000,
    weekIds: PLR_WEEKS,
    phasedPlan: latestPlan,
  },
  feeds: {
    sales: "complete",
    inventory: "complete",
    range: "complete",
    refreshedAt: "2026-08-01T06:00:00Z",
  },
});
