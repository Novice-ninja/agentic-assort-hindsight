import { http, HttpResponse } from 'msw';
import type { Recommendation, UserPreferences, Verdict } from '@modules/hindsight/types';
import {
  cardInsightFixture,
  carryForwardFixture,
  categoryByClusterFixture,
  clusterFixtures,
  clusterPerformanceFixture,
  contributionFixtures,
  facetFixtures,
  itemFixtures,
  narrationFixtures,
  permissionScopeFixture,
  productPerformanceFixtures,
  recommendationFixtures,
  scorecardFixtures,
  seasonFixtures,
  tenantConfigFixture,
  userPreferencesFixture,
  versionChartFixtures,
  topStyleColorsFixture,
  overviewRecommendationsFixture,
} from '@tests/fixtures/hindsight';

let preferencesDb: UserPreferences = { ...userPreferencesFixture };
let recommendationsDb: Recommendation[] = recommendationFixtures.map((r) => ({ ...r }));

/**
 * Every data request must name the products, countries, and channels it covers. An absent or
 * empty facet yields an empty result rather than an unbounded one, which is what makes the
 * "too narrow a selection" path reachable and stops a missing parameter from leaking data.
 */
function isScoped(url: URL): boolean {
  return ['productPositionIds', 'countryIds', 'channelIds'].every((key) => {
    const value = url.searchParams.get(key);
    return value !== null && value.length > 0;
  });
}

export const hindsightHandlers = [
  http.get('*/api/hindsight/config', () =>
    HttpResponse.json({ tenant: tenantConfigFixture, preferences: preferencesDb }),
  ),

  http.get('*/api/hindsight/context', () =>
    HttpResponse.json({
      seasons: seasonFixtures,
      facets: facetFixtures,
      scope: permissionScopeFixture,
      clusters: clusterFixtures,
      defaultSeasonId: 'aw25',
    }),
  ),

  http.get('*/api/hindsight/narration', ({ request }) => {
    const url = new URL(request.url);
    if (!isScoped(url)) return HttpResponse.json({ insights: [] });

    const requested = (url.searchParams.get('widgetIds') ?? '').split(',').filter(Boolean);
    const insights =
      requested.length === 0
        ? narrationFixtures
        : narrationFixtures.filter((insight) => requested.includes(insight.widgetId));

    return HttpResponse.json({ insights });
  }),

  http.get('*/api/hindsight/overview', ({ request }) => {
    const url = new URL(request.url);
    if (!isScoped(url)) {
      return HttpResponse.json({
        scorecard: [],
        productPerformance: [],
        contributions: [],
        clusterPerformance: { metricId: 'sell-through', entries: [] },
        categoryByCluster: { metricId: 'sell-through', rows: [], columns: [], cells: [] },
        versionCharts: [],
        carryForward: { view: 'missedOpportunities', threshold: 15, categories: [], series: [], candidates: [] },
      });
    }

    return HttpResponse.json({
      scorecard: scorecardFixtures,
      productPerformance: productPerformanceFixtures,
      contributions: contributionFixtures,
      clusterPerformance: clusterPerformanceFixture,
      categoryByCluster: categoryByClusterFixture,
      versionCharts: versionChartFixtures,
      carryForward: carryForwardFixture,
    });
  }),

  http.get('*/api/hindsight/items', ({ request }) => {
    const url = new URL(request.url);
    if (!isScoped(url)) {
      return HttpResponse.json({ items: [], total: 0, totals: { keep: 0, shop: 0, drop: 0 }, recommendations: [] });
    }

    const keepCount = recommendationsDb.filter((r) => (r.override?.verdict ?? r.agentVerdict) === 'keep').length;
    const shopCount = recommendationsDb.filter((r) => (r.override?.verdict ?? r.agentVerdict) === 'shop').length;
    const dropCount = recommendationsDb.filter((r) => (r.override?.verdict ?? r.agentVerdict) === 'drop').length;

    return HttpResponse.json({
      items: itemFixtures,
      total: itemFixtures.length,
      totals: { keep: keepCount, shop: shopCount, drop: dropCount },
      recommendations: recommendationsDb,
    });
  }),

  http.patch('*/api/hindsight/preferences', async ({ request }) => {
    const patch = (await request.json()) as Partial<UserPreferences>;
    preferencesDb = { ...preferencesDb, ...patch };
    return HttpResponse.json(preferencesDb);
  }),

  http.patch('*/api/hindsight/recommendations/:itemId', async ({ params, request }) => {
    const itemId = String(params.itemId);
    const { verdict } = (await request.json()) as { verdict: Verdict };
    const index = recommendationsDb.findIndex((r) => r.itemId === itemId);

    if (index < 0) return new HttpResponse(null, { status: 404 });

    const current = recommendationsDb[index];
    // Choosing the agent's own verdict clears the override rather than storing a redundant one.
    const next: Recommendation =
      verdict === current.agentVerdict
        ? { itemId: current.itemId, agentVerdict: current.agentVerdict, agentNarrationId: current.agentNarrationId }
        : {
            ...current,
            override: { verdict, at: new Date().toISOString(), by: 'planner-1' },
          };

    recommendationsDb[index] = next;
    return HttpResponse.json(next);
  }),

  http.delete('*/api/hindsight/recommendations/:itemId/override', ({ params }) => {
    const itemId = String(params.itemId);
    const index = recommendationsDb.findIndex((r) => r.itemId === itemId);

    if (index < 0) return new HttpResponse(null, { status: 404 });

    const current = recommendationsDb[index];
    const cleared: Recommendation = {
      itemId: current.itemId,
      agentVerdict: current.agentVerdict,
      agentNarrationId: current.agentNarrationId,
    };
    recommendationsDb[index] = cleared;
    return HttpResponse.json(cleared);
  }),
];

/**
 * Handlers for endpoints the real backend already serves, so they are given to the test server
 * only. The browser worker must leave them alone and let the request reach the live API.
 */
export const hindsightTestHandlers = [
  http.post('*/v1/hindsight/charts', () =>
    HttpResponse.json({
      status: true,
      data: {
        xAxisCategories: ['Dresses', 'Knitwear', 'Outerwear', 'Denim', 'Tops'],
        seriesData: [
          { name: 'Regular', data: [1712000, 1240000, 964000, 542000, 362000] },
          { name: 'Promo', data: [512000, 380000, 296000, 162000, 108000] },
        ],
      },
      message: 'Successful',
    }),
  ),

  http.post('*/v1/hindsight/overview/top-style-colors', async ({ request }) => {
    const body = (await request.json()) as { planCode?: string; topN?: number; cursor?: string };
    const pageSize = typeof body.topN === 'number' ? body.topN : 4;
    const start = body.cursor === 'page-2' ? pageSize : 0;
    const slice = topStyleColorsFixture.slice(start, start + pageSize);
    const hasMore = start + pageSize < topStyleColorsFixture.length;

    return HttpResponse.json({
      status: true,
      message: 'Successful',
      data: {
        planCode: body.planCode ?? '',
        referenceSeasonCode: '74',
        planSeasonCode: '78',
        topN: pageSize,
        items: slice,
        pagination: {
          cursor: hasMore ? 'page-2' : '',
          pageSize,
          hasMore,
          totalCount: topStyleColorsFixture.length,
        },
      },
    });
  }),

  http.post('*/v1/hindsight/overview/recommendations', async ({ request }) => {
    const body = (await request.json()) as {
      planCode?: string;
      recommendationType?: string;
      top?: number;
      cursor?: string;
    };
    const type =
      body.recommendationType === 'carryForwards' ? 'carryForwards' : 'missedOpportunities';
    const products = overviewRecommendationsFixture[type];
    const pageSize = typeof body.top === 'number' ? body.top : 4;
    const start = body.cursor === 'page-2' ? pageSize : 0;
    const slice = products.slice(start, start + pageSize);
    const hasMore = start + pageSize < products.length;

    return HttpResponse.json({
      status: true,
      message: 'Successful',
      data: {
        planCode: body.planCode ?? '',
        referenceSeasonCode: '74',
        planSeasonCode: '78',
        type,
        top: pageSize,
        products: slice,
        pagination: {
          cursor: hasMore ? 'page-2' : '',
          pageSize,
          hasMore,
          totalCount: products.length,
        },
      },
    });
  }),

  // Location Clustering shares this endpoint (`cardType: 'cluster' | 'cluster_performance' |
  // 'cluster_attribute'`);
  // its handler answers those.
  http.post('*/v1/summarize', async ({ request }) => {
    const body = (await request.clone().json().catch(() => null)) as { cardType?: unknown } | null;
    if (typeof body?.cardType === 'string' && body.cardType.startsWith('cluster')) return undefined;
    return HttpResponse.json(cardInsightFixture);
  }),

  http.post('*/v1/plans/by-item/recommendation', async ({ request }) => {
    const body = (await request.json()) as {
      planCode?: string;
      keep?: string[];
      drop?: string[];
      clear?: string[];
    };
    const keep = body.keep ?? [];
    const drop = body.drop ?? [];
    const clear = body.clear ?? [];

    return HttpResponse.json({
      status: true,
      data: {
        planCode: body.planCode ?? '',
        referenceSeasonCode: '70',
        planSeasonCode: '74',
        items: [
          ...keep.map((article) => ({
            article,
            effectiveReco: 'keep',
            overridden: true,
            mandatory: false,
            staleBasis: false,
            source: 'override',
          })),
          ...drop.map((article) => ({
            article,
            effectiveReco: 'drop',
            overridden: true,
            mandatory: false,
            staleBasis: false,
            source: 'override',
          })),
          ...clear.map((article) => ({
            article,
            effectiveReco: 'keep',
            overridden: false,
            mandatory: false,
            staleBasis: false,
            source: 'verdict',
          })),
        ],
      },
      message: 'Successful',
    });
  }),
];

/** Restores the mutable stores, for tests that assert on override behaviour. */
export function resetHindsightMocks(): void {
  preferencesDb = { ...userPreferencesFixture };
  recommendationsDb = recommendationFixtures.map((r) => ({ ...r }));
}
