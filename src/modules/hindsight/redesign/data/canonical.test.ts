import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";
import * as d from "./index";
import {
  getFlooringTotals,
  getFlooringMixRows,
} from "../../../../mocks/flooringDemo";
const checks: string[] = [];
const check = (name: string, fn: () => void) => {
  fn();
  checks.push(name);
};
const near = (a: number | null, b: number, epsilon = 0.000001) =>
  assert(a !== null && Math.abs(a - b) < epsilon, `${a} != ${b}`);
const data = d.flooringDataset,
  base = { ...d.createDefaultScope(), window: "SEASON" as const },
  plr = d.createDefaultScope("plr");
const full = d.resolveWorkspace(base),
  total = getFlooringTotals();
check(
  "Canonical master, unique pair-week and snapshot grains remain72 ×45, with valid calendar references.",
  () => {
    assert.equal(data.products.length, 72);
    assert.equal(data.stores.length, 45);
    assert.equal(data.facts.length, 72 * 45 * 104);
    assert.equal(
      new Set(data.facts.map((f) => `${f.itemId}:${f.storeId}:${f.weekId}`))
        .size,
      data.facts.length,
    );
    assert.equal(
      new Set(data.inventory.map((f) => `${f.itemId}:${f.storeId}:${f.asOf}`))
        .size,
      3240,
    );
    assert(data.facts.every((f) => data.weeks.some((w) => w.id === f.weekId)));
    assert.equal(data.calendar!.completeThrough, "2026-07-26");
    assert.equal(
      data.products.find((p) => p.id === "1000037")!.article,
      "NOR-WO-DWR",
    );
  },
);
check(
  "Exact SS26 totals and five brand shares reconcile to frozen priority fixture.",
  () => {
    near(full.overview.sales.value, 8400000);
    near(full.overview.quantity.value, 182400);
    near(full.overview.gmDollars.value, 2654400);
    near(full.overview.gmRate.value, 31.6);
    near(full.overview.ohCost.value, total.ohCost);
    near(full.overview.sellableOh.value, 95707);
    near(full.overview.allocatedArea!.value, 84000);
    near(full.overview.salesPerSqFt!.value, 100);
    for (const field of ["sales", "quantity", "gmDollars", "ohCost"] as const) {
      near(
        full.items.reduce((n, r) => n + r[field].value!, 0),
        full.overview[field].value!,
      );
      near(
        full.stores.reduce((n, r) => n + r[field].value!, 0),
        full.overview[field].value!,
      );
    }
    for (const r of d.getMixRows(base, "brand")) {
      const expected = getFlooringMixRows("brand").find(
        (e) => e.name === r.label,
      )!;
      near(r.sales.value, expected.sales);
      near(r.salesShare.value, expected.salesShare);
    }
    assert.equal(d.getMixRows(base, "gbb")[0].label, "Unknown");
    near(d.getMixRows(base, "gbb")[0].skuShare.value, 100);
  },
);
check(
  "All views share one leaf; Northport1.6M /−29.3% and dated unavailable sellable stock retain separate PO and shared DC.",
  () => {
    const item = full.items.find((i) => i.id === "1000037")!;
    near(item.sales.value, 1600000);
    near(item.salesChange.value, -29.3, 0.000001);
    near(item.sellableOh.value, 0);
    assert(item.physicalOh.value! > 0);
    const p = d.getPairFact("1000037", "ST1001", base)!;
    assert.deepEqual(
      p,
      full.stores
        .find((s) => s.id === "ST1001")!
        .pairs.find((p) => p.itemId === "1000037"),
    );
    near(p.openInbound.value, 200);
    assert.equal(p.supply.find((s) => s.kind === "dc-pool")!.quantity, 900);
    near(full.overview.openInbound.value, 200);
  },
);
check(
  "Full →Bamboo →explicitempty →all reconciles exact rows, mix, cases, local cohorts and scope signatures.",
  () => {
    const bamboo = { ...base, productFacets: { categories: ["Bamboo"] } };
    const cut = d.resolveWorkspace(bamboo);
    near(cut.overview.sales.value, 1049808.28);
    near(cut.overview.quantity.value, 23836);
    assert.equal(cut.items.length, 12);
    assert(!cut.items.some((i) => i.id === "1000037"));
    assert(!cut.cases.some((c) => c.itemId === "1000037"));
    assert.equal(d.getMixRows(bamboo, "color")[0].label, "Walnut");
    const none = { ...base, productSelection: "none" as const };
    assert.equal(d.selectScopedPairs(none).length, 0);
    near(d.resolveWorkspace(none).overview.sales.value, 0);
    assert.equal(d.getMixRows(none, "brand").length, 0);
    assert.equal(d.getBreadth({ ...base, storeSelection: "none" }).length, 0);
    near(d.resolveWorkspace(base).overview.sales.value, 8400000);
    const ids = cut.pairs.slice(0, 2).map((p) => p.id);
    const exact = d.withPairScope(bamboo, ids);
    assert.equal(d.selectScopedPairs(exact).length, 2);
    assert.equal(
      d
        .getMixRows(bamboo, "brand", data, cut.pairs.slice(0, 2))
        .reduce((n, r) => n + r.skuCount, 0),
      1,
    );
    assert.notEqual(d.scopeSignature(base), d.scopeSignature(none));
    assert.equal(
      d.selectScopedPairs(d.withProductIds(none, ["1000037"])).length,
      45,
    );
  },
);
check(
  "R4/R13/R52 phase exactly to priority totals and period presets use completed calendar keys, fixed stock date and real LY mapping.",
  () => {
    for (const [window, expected, length] of [
      ["LW", null, 1],
      ["R4", total.r4Sales, 4],
      ["R13", total.r13Sales, 13],
      ["R52", total.r52Sales, 52],
      ["SEASON", 8400000, 26],
    ] as const) {
      const s = { ...base, window };
      assert.equal(d.selectedWeekIds(s).length, length);
      if (expected !== null)
        near(
          d.aggregatePairs(d.selectScopedPairs(s), data).sales.value,
          expected,
        );
      assert.equal(d.comparisonWeekIds(s).length, length);
      assert(
        d
          .comparisonWeekIds(s)
          .every((id) => data.facts.some((f) => f.weekId === id)),
      );
      assert(d.selectScopedPairs(s).every((p) => p.stockAsOf === "2026-07-31"));
    }
    for (const window of ["MTD", "QTD", "YTD"] as const) {
      const ids = d.selectedWeekIds({ ...base, window });
      assert(ids.length > 0);
      assert(
        ids.every(
          (id) => data.weeks.find((w) => w.id === id)!.end <= "2026-07-26",
        ),
      );
    }
    assert.deepEqual(
      d.selectedWeekIds({
        ...base,
        window: "CUSTOM",
        customStart: "2026-07-06",
        customEnd: "2026-07-19",
      }),
      data.weeks
        .filter((w) => w.start >= "2026-07-06" && w.end <= "2026-07-19")
        .map((w) => w.id),
    );
  },
);
check(
  "Frozen original66-style cohort separates8.8M original,8.1M revision,8.6M latest all72 and later-addition actuals.",
  () => {
    const r = d.getPlrReview(plr);
    assert.equal(r.originalPairCount, 2970);
    near(r.originalSalesPlan.value, 8800000);
    near(r.revisedSalesPlan.value, 8100000);
    near(r.latestPlanAllSales!.value, 8600000);
    near(r.actualSales.value, 8373352.01);
    near(r.laterAdditionSales.value, 26647.99);
    near(r.totalRealizedSales.value, 8400000);
    assert(Object.isFrozen(data.versions[0].pairs));
    assert.equal(new Set(data.versions[0].pairs.map((p) => p.itemId)).size, 66);
    assert(
      d.LATER_ADDITION_IDS.every(
        (id) => !data.versions[0].pairs.some((p) => p.itemId === id),
      ),
    );
    assert.equal(r.duePairs, 2968);
    assert.equal(
      r.onTimePairs + r.latePairs + r.notActivatedPairs + r.unknownHistoryPairs,
      r.duePairs,
    );
    assert.equal(r.notYetDuePairs, 2);
    assert.equal(r.latePairs, 2);
    assert.equal(r.notActivatedPairs, 1);
    assert.equal(r.unknownHistoryPairs, 1);
    assert.equal(r.executionRate.state, "unknown");
    assert(r.executionBounds.upper > r.executionBounds.lower);
    const cut = d.getPlrReview({
      ...plr,
      productFacets: { categories: ["Bamboo"] },
    });
    near(cut.totalRealizedSales.value, 1049808.28);
    near(
      d.getPlrReview({ ...plr, productSelection: "none" }).originalSalesPlan
        .value,
      0,
    );
  },
);
check(
  "Phasing, original buy, receipts, physical ending and blocked/sellable split are distinct and reconcile without adding future PO/DC to availability.",
  () => {
    const r = d.getPlrReview(plr);
    near(r.approvedBuyQuantity.value, 300000);
    assert.notEqual(r.approvedBuyQuantity.value, r.demandPlanQuantity.value);
    near(r.physicalFlowDifference!.value, 0);
    near(r.blockedQuantity!.value, 3374);
    near(r.openOrderQuantity.value, 200);
    assert.equal(r.supplyAvailable.unit, "SELLING_UNIT_TBC");
    assert.equal(
      data.latestPlan!.phasedPlan.reduce((n, p) => n + p.demandQuantity, 0),
      190000,
    );
    const first = data.calendar!.seasonWeekIds.slice(0, 4),
      part = d.getPlrReview({ ...plr, weekIds: first });
    assert(part.originalSalesPlan.value! < r.originalSalesPlan.value!);
    assert.equal(part.plannedEndingInventoryCost.value, null);
    assert.equal(part.elapsedWeeks, 4);
    assert.equal(
      d.getPlrReview({ ...plr, stockAsOf: "2026-07-30" }).endingInventoryCost
        .value,
      null,
    );
  },
);
check(
  "Weekly/monthly weighted trends reconcile and never average rates; exact pair-cohort filtering stays frozen across comparable weeks.",
  () => {
    const weekly = d.getTrend(base),
      monthly = d.getTrend(base, "sales", "month");
    near(
      weekly.reduce((n, p) => n + p.actual.value!, 0),
      8400000,
    );
    near(
      monthly.reduce((n, p) => n + p.actual.value!, 0),
      8400000,
    );
    near(
      d.getTrend(base, "quantity").reduce((n, p) => n + p.actual.value!, 0),
      182400,
    );
    const selected = full.pairs.slice(0, 2),
      scope = d.withPairScope(
        base,
        selected.map((p) => p.id),
      );
    near(
      d.getTrend(scope).reduce((n, p) => n + p.actual.value!, 0),
      d.aggregatePairs(selected, data).sales.value!,
    );
  },
);
check(
  "Guarded comparisons, returns, zero sales, LY-only, unknown history, closure, missing/stale feeds and incompatible units remain distinct states.",
  () => {
    for (const [scenario, state] of [
      ["zero-base", "no-positive-base"],
      ["negative-base", "negative-base"],
    ] as const)
      assert.equal(
        d.getPairFact("1000037", "ST1001", { ...base, window: "R4", scenario })!
          .salesChange.state,
        state,
      );
    assert.equal(
      d.getPairFact("1000037", "ST1001", {
        ...base,
        scenario: "negative-stock",
      })!.matrixState,
      "!",
    );
    assert.equal(
      d.getPairFact("1000037", "ST1001", {
        ...base,
        scenario: "missing-inventory",
      })!.sellableOh.value,
      null,
    );
    assert.equal(
      d.getPairFact("1000037", "ST1001", {
        ...base,
        window: "R4",
        scenario: "return-only",
      })!.asp.value,
      null,
    );
    const ly = d
      .selectScopedPairs({ ...base, scenario: "ly-only" })
      .find((p) => p.id === "1000037:ST1001")!;
    near(ly.sales.value, 0);
    assert(ly.lySales.value! > 0);
    assert.equal(ly.range, "exited");
    assert.equal(
      d.getPairFact("1000037", "ST1001", {
        ...base,
        scenario: "unknown-history",
      })!.matrixState,
      "?",
    );
    assert(
      d
        .resolveWorkspace({ ...base, scenario: "closed-store" })
        .warnings.some((w) => w.includes("closed")),
    );
    assert.equal(
      d.getPairFact("1000037", "ST1001", {
        ...base,
        window: "R4",
        scenario: "missing-sales",
      })!.sales.value,
      null,
    );
    assert.equal(
      d.getPairFact("1000037", "ST1001", {
        ...base,
        window: "R4",
        scenario: "stale-feed",
      })!.sales.state,
      "stale",
    );
    const mixed = d.aggregatePairs(
      d.selectScopedPairs({ ...base, uom: "mixed", scenario: "mixed-uom" }),
    );
    assert.equal(mixed.quantity.value, null);
    assert.equal(mixed.asp.state, "not-applicable");
    assert.equal(
      d.getPlrReview({ ...plr, scenario: "missing-plan" }).connected,
      false,
    );
  },
);
check(
  "Approved PLR prefix4/prefix13/full phase the same frozen cohort without preseason facts or changing approval metadata.",
  () => {
    const ids = data.versions[0].weekIds,
      r4 = d.getPlrReview({ ...plr, weekIds: ids.slice(0, 4) }),
      r13 = d.getPlrReview({ ...plr, weekIds: ids.slice(0, 13) });
    assert.equal(r4.elapsedWeeks, 4);
    assert.equal(r13.elapsedWeeks, 13);
    assert(r4.actualSales.value! < r13.actualSales.value!);
    assert.equal(r4.originalPairCount, 2970);
    assert.equal(r4.duePairs, r13.duePairs);
    assert.equal(r4.plannedEndingInventoryCost.value, null);
    assert(d.isContiguousReviewPrefix({ ...plr, weekIds: ids.slice(0, 4) }));
    assert(!d.isContiguousReviewPrefix({ ...plr, weekIds: ids.slice(-4) }));
    assert.equal(d.getPlrReview({ ...plr, window: "R4" }).elapsedWeeks, 26);
    near(
      r4.actualSales.value,
      d.aggregatePairs(
        d.selectScopedPairs({ ...plr, weekIds: ids.slice(0, 4) }),
        data,
      ).sales.value!,
    );
  },
);
check(
  "Null-state formatting never conflates zero, unknown, restricted, negative base, missing, stale or reconciliation.",
  () => {
    assert.equal(d.formatMetric(d.measure(0, "USD")), "$0");
    assert.equal(
      d.formatMetric(d.measure(200, "USD", "restricted")),
      "Restricted",
    );
    assert.equal(
      d.formatMetric(d.measure(null, "%", "negative-base")),
      "Negative comparison base",
    );
    assert.equal(
      d.formatMetric(d.measure(null, "count", "unknown")),
      "Unknown history",
    );
    assert.equal(
      d.formatMetric(d.measure(null, "USD", "missing")),
      "Missing data",
    );
    assert.equal(
      d.formatMetric(d.measure(null, "weeks", "not-applicable")),
      "Not applicable",
    );
    assert.equal(
      d.formatMetric(d.measure(null, "weeks", "reconcile")),
      "Reconcile",
    );
    assert(d.formatMetric(d.measure(200, "USD", "stale")).includes("200"));
    assert(d.formatMetric(d.measure(200, "USD", "stale")).includes("stale"));
  },
);
check(
  "Unit-explicit metric rules operate at pair grain; unknown values never match, AND/OR and exact IDs do not broaden none.",
  () => {
    const zero = {
      ...base,
      metricFilters: {
        logic: "and" as const,
        rules: [
          {
            metric: "K06",
            operator: "eq" as const,
            value: 0,
            unit: "SELLING_UNIT_TBC",
          },
        ],
      },
    };
    const pairs = d.selectScopedPairs(zero);
    assert(pairs.length > 0);
    assert(pairs.every((p) => p.sellableOh.value === 0));
    assert.equal(
      d.selectScopedPairs({
        ...zero,
        metricFilters: {
          logic: "and",
          rules: [
            {
              metric: "sourceMip",
              operator: "gt",
              value: 6,
              unit: "selling units",
            },
          ],
        },
      }).length,
      0,
    );
    assert.equal(
      d.selectScopedPairs({ ...zero, productSelection: "none" }).length,
      0,
    );
    assert.notEqual(d.scopeSignature(zero), d.scopeSignature(base));
  },
);
check(
  "Permission projection strips underlying COGS, planned GM and margin-derived cases before snapshots, with no zero substitution.",
  () => {
    const deniedCase = {
      ...d.controlDataset.cases[0],
      metric: "K03",
      actual: d.measure(12345, "USD"),
      threshold: "GM <12345",
      observation: "GM12345",
      hypothesis: "Margin12345",
      signals: [
        {
          ruleId: "gm",
          ruleVersion: "v1",
          metric: "K04",
          actual: d.measure(31.6, "%"),
          threshold: "GM31.6%",
          evidenceIds: [],
        },
      ],
    };
    const sample = d.projectDataset(
      { ...d.controlDataset, cases: [deniedCase] },
      "restricted-margin",
    );
    assert.equal(sample.cases[0].actual.value, null);
    assert(!JSON.stringify(sample.cases).includes("12345"));
    assert.equal(sample.cases[0].signals![0].actual.value, null);
    const restricted = d.projectDataset(data, "restricted-margin");
    assert(restricted.facts.every((f) => f.recognizedCogs === null));
    assert(
      restricted.versions.every((v) =>
        v.phasedPlan.every((p) => p.gmDollars === null),
      ),
    );
    assert.equal(restricted.latestPlan!.gmDollars, null);
    const view = d.resolveWorkspace(
      { ...base, access: "restricted-margin" },
      restricted,
    );
    assert.equal(view.overview.gmRate.state, "restricted");
    assert(
      view.pairs.every((p) => p.weeks.every((w) => w.recognizedCogs === null)),
    );
    assert(
      d
        .getTrend({ ...base, access: "restricted-margin" }, "gmRate")
        .every((p) => p.actual.value === null && p.comparison.value === null),
    );
    assert.equal(
      d.getPlrReview({ ...plr, access: "restricted-margin" }).plannedGmRate
        .state,
      "restricted",
    );
  },
);
const input: d.DraftInput = {
  caseId: "FQ01",
  action: "Chase existing inbound",
  pairIds: ["1000037:ST1001"],
  quantity: 200,
  uom: "SELLING_UNIT_TBC",
  reason: "Validate existing supply timing",
  owner: "Merchant",
  effectiveDate: "2026-08-02",
  reviewDate: "2026-08-07",
  evidenceIds: ["PO-NORTHPORT-200"],
};
check(
  "Six queues and immutable trigger timestamps reconcile distinct cases; canonical IDs validate drafts, edits, evidence and inbound commitments.",
  () => {
    const initial = d.createInitialSession();
    assert.equal(new Set(initial.cases.map((c) => c.queue)).size, 6);
    assert(
      initial.cases.every(
        (c) => c.evaluatedAt && c.evaluationScope?.dataVersion === data.version,
      ),
    );
    assert.equal(full.overview.openCaseCount, 6);
    const saved = d.saveDecisionDraft(initial, input);
    assert(saved.ok);
    assert.equal(initial.decisions.length, 0);
    assert(!d.saveDecisionDraft(saved.state, input).ok);
    assert(!d.saveDecisionDraft(initial, { ...input, quantity: 201 }).ok);
    assert(!d.saveDecisionDraft(initial, { ...input, uom: "SQFT" }).ok);
    assert(
      !d.saveDecisionDraft(initial, { ...input, pairIds: ["P101:S102"] }).ok,
    );
    assert(
      !d.saveDecisionDraft(initial, { ...input, evidenceIds: ["arbitrary"] })
        .ok,
    );
    assert(
      d.editDecisionDraft(saved.state, saved.record!.id, {
        ...input,
        quantity: 100,
      }).ok,
    );
    assert(
      !d.editDecisionDraft(saved.state, saved.record!.id, {
        ...input,
        quantity: 201,
      }).ok,
    );
  },
);
check(
  "Supply caps, destination, Swap membership and outgoing/incoming canonical identities prevent false commitments.",
  () => {
    const initial = d.createInitialSession(),
      pair = full.pairs.find(
        (p) => (p.sellableOh.value || 0) > 10 && p.itemId !== "1000037",
      )!;
    const baseInput = {
      ...input,
      caseId:
        initial.cases.find(
          (c) => c.itemId === pair.itemId && c.storeId === pair.storeId,
        )?.id || "FQ02",
      action: "Transfer" as const,
      pairIds: [pair.id],
      evidenceIds: [pair.id],
      quantity: 1,
      destinationStoreId: storesOther(pair.storeId),
    };
    assert(d.saveDecisionDraft(initial, baseInput).ok);
    assert(
      !d.saveDecisionDraft(initial, {
        ...baseInput,
        destinationStoreId: pair.storeId,
      }).ok,
    );
    assert(
      !d.saveDecisionDraft(initial, {
        ...baseInput,
        quantity: pair.sellableOh.value! + 1,
      }).ok,
    );
    assert(
      !d.saveDecisionDraft(initial, {
        ...baseInput,
        action: "Swap",
        outgoingItemId: pair.itemId,
        incomingItemId: "unconnected",
      }).ok,
    );
    assert(
      !d.saveDecisionDraft(initial, {
        ...baseInput,
        action: "Swap",
        outgoingItemId: pair.itemId,
        incomingItemId: "1000037",
      }).ok,
    );
    function storesOther(id: string) {
      return data.stores.find((s) => s.id !== id)!.id;
    }
  },
);
check(
  "Approval, partial acknowledgements, union/retry, idempotence and review remain separate audited mutations.",
  () => {
    const pairs = ["1000037:ST1001", "1000037:ST1002"];
    let state = d.saveDecisionDraft(d.createInitialSession(), {
      ...input,
      action: "Keep",
      pairIds: pairs,
      quantity: undefined,
      uom: undefined,
      evidenceIds: [pairs[0]],
    }).state;
    const id = state.decisions[0].id;
    state = d.advanceDecision(
      state,
      id,
      { type: "submit" },
      { id: "Merchant" },
    ).state;
    assert(
      !d.advanceDecision(state, id, { type: "approve" }, { id: "Viewer" }).ok,
    );
    state = d.advanceDecision(
      state,
      id,
      { type: "approve" },
      { id: "Approver", canApprove: true },
    ).state;
    assert.equal(state.decisions[0].state, "Approved");
    assert(!state.decisions[0].executionRef);
    state = d.advanceDecision(
      state,
      id,
      { type: "await-execution" },
      { id: "Merchant" },
    ).state;
    const ack = {
      type: "execution-ack" as const,
      executionRef: "ACK-A",
      completedPairIds: [pairs[0]],
      failedPairIds: [pairs[1]],
    };
    state = d.advanceDecision(state, id, ack, {
      id: "Executor",
      canExecute: true,
    }).state;
    assert.equal(state.decisions[0].state, "Partially executed");
    const before = state;
    assert.equal(
      d.advanceDecision(state, id, ack, { id: "Executor", canExecute: true })
        .state,
      before,
    );
    state = d.advanceDecision(
      state,
      id,
      {
        type: "execution-ack",
        executionRef: "ACK-B",
        completedPairIds: [pairs[1]],
      },
      { id: "Executor", canExecute: true },
    ).state;
    assert.equal(state.decisions[0].state, "Executed");
    assert.equal(state.decisions[0].completedPairIds.length, 2);
    assert.equal(state.decisions[0].failedPairIds.length, 0);
    state = d.advanceDecision(
      state,
      id,
      {
        type: "review",
        note: "Reviewed outcome; no live execution integration.",
      },
      { id: "Merchant" },
    ).state;
    assert.equal(state.decisions[0].state, "Reviewed");
    assert(
      !d.advanceDecision(state, id, { type: "cancel" }, { id: "Merchant" }).ok,
    );
  },
);
check(
  "Notes, accepted learnings and append-only multi-signal cases do not rewrite frozen plans or counts.",
  () => {
    const initial = d.createInitialSession(),
      before = JSON.stringify(data.versions),
      note = d.saveObservation(initial, {
        text: "Delivery checked",
        author: "Merchant",
        source: "Field observation",
        observedOn: "2026-07-31",
        recordedOn: "2026-08-01T10:00:00Z",
        itemIds: ["1000037"],
        storeIds: ["ST1001"],
        evidenceClass: "merchant-observation",
        visibility: "Review team",
        confidence: "Medium",
        evidenceIds: ["PO-NORTHPORT-200"],
      });
    assert(note.ok);
    const learning = d.saveLearning(note.state, {
      ...initial.learnings[0],
      state: "Accepted",
      reviewedBy: "Reviewer",
      conclusion: "Availability needs review; causality unproven.",
    });
    assert(learning.ok);
    const append = d.saveCase(initial, {
      ...initial.cases[0],
      id: "duplicatePair",
      ruleId: "second-signal",
    });
    assert(append.ok);
    assert.equal(append.state.cases.length, initial.cases.length);
    assert.equal(append.record!.ruleId, initial.cases[0].ruleId);
    assert.equal(append.record!.signals!.length, 1);
    assert.equal(JSON.stringify(data.versions), before);
    assert.equal(d.metricCatalogue.length, 87);
  },
);
check(
  "Signed returns are netted once; transfer, adjustment, observed closing and reconciliation fields form one exact supply bridge.",
  () => {
    const control = structuredClone(d.controlDataset);
    const scope = {
      ...d.createDefaultScope("plr", control),
      stockAsOf: "2026-02-22",
      rangeAsOf: "2026-02-22",
    };
    const row = control.facts.find(
      (f) =>
        f.itemId === "P101" &&
        f.storeId === "S101" &&
        f.weekId === "FY2026-W02",
    )!;
    row.netQuantity -= 20;
    row.netSales -= 120;
    row.recognizedCogs! -= 80;
    const stock = control.inventory.find(
      (i) =>
        i.itemId === "P101" && i.storeId === "S101" && i.asOf === "2026-02-22",
    )!;
    stock.physical! += 70;
    stock.sellable! += 70;
    for (const [kind, quantity] of [
      ["customer-return", 20],
      ["transfer-in", 100],
      ["transfer-out", 40],
      ["adjustment", -10],
    ] as const)
      control.supply.push({
        id: `REPLAY-${kind}`,
        itemId: "P101",
        storeId: "S101",
        kind,
        quantity,
        uom: "SQFT",
        date: "2026-01-05",
        status: "Recorded",
        sourceRef: "SIGNED-RETURN-REPLAY",
        reviewId: control.versions[0].reviewId,
      });
    const review = d.getPlrReview(scope, control);
    near(review.openingQuantity.value, 2000);
    near(review.receivedQuantity.value, 10000);
    near(review.transferInQuantity.value, 100);
    near(review.transferOutQuantity.value, 40);
    near(review.adjustmentQuantity.value, -10);
    near(review.customerReturnQuantity.value, 20);
    near(review.supplyAvailable.value, 12050);
    near(review.actualQuantity.value, 7980);
    near(review.expectedPhysicalEndingQuantity.value, 4070);
    near(review.physicalEndingQuantity.value, 4070);
    near(review.sellableEndingQuantity.value, 4070);
    near(review.blockedEndingQuantity.value, 0);
    near(review.physicalFlowDifference!.value, 0);
    near(review.sellThrough.value, (7980 / 12050) * 100);
    assert.equal(
      d.getPlrReview({ ...scope, stockAsOf: "2026-02-21" }, control)
        .physicalEndingQuantity.value,
      null,
    );
    stock.physical! += 1;
    const mismatch = d.getPlrReview(scope, control);
    near(mismatch.physicalFlowDifference!.value, -1);
    assert.equal(mismatch.physicalFlowDifference!.state, "reconcile");
  },
);
await writeFile(
  "src/modules/hindsight/redesign/data/test-results.json",
  JSON.stringify(
    {
      status: "passed",
      checkCount: checks.length,
      checks,
      dataVersion: data.version,
      canonicalStory: {
        sales: full.overview.sales.value,
        quantity: full.overview.quantity.value,
        gmRate: full.overview.gmRate.value,
      },
      illustrativeNotClientData: true,
    },
    null,
    2,
  ),
);
console.log(
  JSON.stringify(
    { status: "passed", checkCount: checks.length, checks },
    null,
    2,
  ),
);
