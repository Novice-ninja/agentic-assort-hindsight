import type { Dataset, Scenario } from "./types";
import {
  flooringDataset,
  deepFreeze,
  SNAPSHOT_DATE,
  R4_WEEKS,
} from "./flooringDataset";
export * from "./flooringDataset";
export {
  controlDataset,
  controlProducts,
  controlStores,
  getControlScenarioDataset,
} from "./controlFixtures";
export const demoDataset = flooringDataset;
export const getDefaultDataset = () => flooringDataset;
const scenarios = new Map<Scenario, Dataset>();
export function getScenarioDataset(scenario: Scenario = "baseline"): Dataset {
  if (scenario === "baseline") return flooringDataset;
  if (scenarios.has(scenario)) return scenarios.get(scenario)!;
  const data: Dataset = {
    ...flooringDataset,
    products: flooringDataset.products.map((p) => ({ ...p })),
    stores: flooringDataset.stores.map((s) => ({ ...s })),
    facts: [...flooringDataset.facts],
    inventory: flooringDataset.inventory.map((s) => ({ ...s })),
    rangeEvents: flooringDataset.rangeEvents.map((e) => ({ ...e })),
    supply: flooringDataset.supply.map((s) => ({ ...s })),
    versions: flooringDataset.versions.map((v) => ({
      ...v,
      pairs: v.pairs.map((p) => ({ ...p })),
    })),
    feeds: { ...flooringDataset.feeds },
  };
  const mutateFacts = (
    pred: (f: Dataset["facts"][number]) => boolean,
    fn: (f: Dataset["facts"][number]) => void,
  ) => {
    data.facts = data.facts.map((f) => {
      if (!pred(f)) return f;
      const row = { ...f };
      fn(row);
      return row;
    });
  };
  data.id += `:${scenario}`;
  data.version += `:${scenario}`;
  data.label += ` ·${scenario}`;
  const item = "1000037",
    store = "ST1001",
    other = data.products.at(-1)!.id;
  const pair = (r: { itemId: string; storeId: string }) =>
    r.itemId === item && r.storeId === store;
  if (scenario === "unknown-history") {
    data.versions.forEach((v) => {
      const p = v.pairs.find(pair);
      if (p) p.historyKnown = false;
    });
    data.rangeEvents = data.rangeEvents.filter((e) => !pair(e));
    data.rangeEvents.push({
      id: "scenario-unknown",
      itemId: item,
      storeId: store,
      effectiveOn: "2024-01-01",
      range: "unknown",
      eligibility: "unknown",
      kind: "history",
      source: "Missing membership feed",
      note: "Unknown does not mean not-ranged.",
    });
  }
  if (scenario === "negative-stock") {
    const s = data.inventory.find(pair)!;
    s.physical = -5;
    s.sellable = -5;
    s.cost = -20;
  }
  if (scenario === "missing-inventory") {
    data.inventory = data.inventory.filter((i) => !pair(i));
    data.feeds.inventory = "missing";
  }
  if (scenario === "stale-feed") {
    data.feeds.sales = "stale";
    mutateFacts(
      (f) => R4_WEEKS.includes(f.weekId),
      (f) => (f.quality = "stale"),
    );
  }
  if (scenario === "mixed-uom") {
    data.products.find((p) => p.id === other)!.uom = "EA";
    mutateFacts(
      (f) => f.itemId === other,
      (f) => (f.uom = "EA"),
    );
    data.inventory
      .filter((f) => f.itemId === other)
      .forEach((f) => (f.uom = "EA"));
    data.supply
      .filter((f) => f.itemId === other)
      .forEach((f) => (f.uom = "EA"));
  }
  if (scenario === "zero-base" || scenario === "negative-base") {
    const ly = new Set(
      data.weeks.filter((w) => R4_WEEKS.includes(w.id)).map((w) => w.lyWeekId),
    );
    mutateFacts(
      (f) => pair(f) && ly.has(f.weekId),
      (f) => {
        f.netSales = scenario === "zero-base" ? 0 : -100;
        f.netQuantity = scenario === "zero-base" ? 0 : -10;
        f.recognizedCogs = scenario === "zero-base" ? 0 : -80;
        f.transactionCount = 1;
      },
    );
  }
  if (scenario === "zero-sales")
    mutateFacts(
      (f) => pair(f) && R4_WEEKS.includes(f.weekId),
      (f) => {
        f.netSales = 0;
        f.netQuantity = 0;
        f.recognizedCogs = 0;
        f.transactionCount = 0;
      },
    );
  if (scenario === "closed-store") {
    data.stores.find((s) => s.id === store)!.closedOn = "2026-07-15";
    mutateFacts(
      (f) => f.storeId === store,
      (f) => {
        const w = data.weeks.find((w) => w.id === f.weekId)!;
        f.rangedOpenDays = Math.min(
          f.rangedOpenDays,
          Math.max(
            0,
            Math.min(
              7,
              (Date.parse("2026-07-15") - Date.parse(w.start)) / 86400000,
            ),
          ),
        );
      },
    );
  }
  if (scenario === "ly-only") {
    data.rangeEvents = data.rangeEvents.filter(
      (e) => !(pair(e) && e.effectiveOn >= "2025-07-28"),
    );
    mutateFacts(
      (f) => pair(f) && data.calendar!.currentWeekIds.includes(f.weekId),
      (f) => {
        f.netSales = 0;
        f.netQuantity = 0;
        f.recognizedCogs = 0;
        f.transactionCount = 0;
        f.rangedOpenDays = 0;
      },
    );
    data.inventory.filter(pair).forEach((s) => {
      s.physical = 0;
      s.sellable = 0;
      s.cost = 0;
    });
    data.supply = data.supply.filter(
      (s) => !(s.storeId === store && s.itemId === item),
    );
    data.rangeEvents.push({
      id: "scenario-ly-only-exit",
      itemId: item,
      storeId: store,
      effectiveOn: "2025-07-28",
      range: "exited",
      eligibility: "ineligible",
      kind: "exit",
      source: "Synthetic scenario",
      note: "LY activity only; retained in exposure, never removed from original approval.",
    });
  }
  if (scenario === "return-only")
    mutateFacts(
      (f) => pair(f) && R4_WEEKS.includes(f.weekId),
      (f) => {
        f.netSales = -100;
        f.netQuantity = -2;
        f.recognizedCogs = -60;
        f.transactionCount = 1;
      },
    );
  if (scenario === "missing-sales") {
    data.feeds.sales = "missing";
    mutateFacts(
      (f) => pair(f) && R4_WEEKS.includes(f.weekId),
      (f) => (f.quality = "missing"),
    );
  }
  if (scenario === "missing-plan") {
    data.versions = [];
    delete data.latestPlan;
  }
  const result = deepFreeze(data);
  scenarios.set(scenario, result);
  return result;
}
const projections = new WeakMap<Dataset, Dataset>();
const marginFacts = new WeakMap<Dataset["facts"], Dataset["facts"]>();
const marginVersions = new WeakMap<Dataset["versions"], Dataset["versions"]>();
const marginPlans = new WeakMap<
  NonNullable<Dataset["latestPlan"]>,
  NonNullable<Dataset["latestPlan"]>
>();
/** Permission projection removes underlying restricted values before freezing an Iris context/export. */
export function projectDataset(
  data: Dataset,
  access: "full" | "restricted-margin",
): Dataset {
  if (access === "full") return data;
  const cached = projections.get(data);
  if (cached) return cached;
  const marginMetric = (metric: string) =>
    /gm|margin|cogs/i.test(metric) ||
    ["K03", "K04", "K37", "K65"].includes(metric);
  const restricted = (unit: string) => ({
    value: null,
    unit,
    state: "restricted" as const,
    reason: "Margin access restricted.",
  });
  const redact = (c: Dataset["cases"][number]) => ({
    ...c,
    ...(marginMetric(c.metric)
      ? {
          actual: restricted(c.actual.unit),
          observation: "Margin evidence restricted.",
          hypothesis: "Margin reasoning restricted.",
          threshold: "Restricted",
        }
      : {}),
    signals: c.signals?.map((s) => ({
      ...s,
      ...(marginMetric(s.metric)
        ? { actual: restricted(s.actual.unit), threshold: "Restricted" }
        : {}),
    })),
  });
  let facts = marginFacts.get(data.facts);
  if (!facts) {
    facts = data.facts.map((f) => ({ ...f, recognizedCogs: null }));
    marginFacts.set(data.facts, facts);
    marginFacts.set(facts, facts);
  }
  let versions = marginVersions.get(data.versions);
  if (!versions) {
    versions = data.versions.map((v) => ({
      ...v,
      phasedPlan: v.phasedPlan.map((p) => ({ ...p, gmDollars: null })),
    }));
    marginVersions.set(data.versions, versions);
    marginVersions.set(versions, versions);
  }
  let latestPlan = data.latestPlan
    ? marginPlans.get(data.latestPlan)
    : undefined;
  if (data.latestPlan && !latestPlan) {
    latestPlan = {
      ...data.latestPlan,
      gmDollars: null,
      phasedPlan: data.latestPlan.phasedPlan.map((p) => ({
        ...p,
        gmDollars: null,
      })),
    };
    marginPlans.set(data.latestPlan, latestPlan);
    marginPlans.set(latestPlan, latestPlan);
  }
  const result: Dataset = {
    ...data,
    facts,
    versions,
    latestPlan,
    cases: data.cases.map(redact),
  };
  projections.set(data, result);
  projections.set(result, result);
  return result;
}

export const scenarioOptions: { id: Scenario; label: string }[] = [
  "baseline",
  "unknown-history",
  "negative-stock",
  "missing-inventory",
  "stale-feed",
  "mixed-uom",
  "zero-base",
  "negative-base",
  "zero-sales",
  "closed-store",
  "missing-plan",
  "ly-only",
  "return-only",
  "missing-sales",
].map((id) => ({ id: id as Scenario, label: id.replaceAll("-", " ") }));
export const caseQueues = [
  "Shortages",
  "Coverage/excess",
  "New item",
  "Nonproductive",
  "Bulk out",
  "Lifecycle/exit",
] as const;
