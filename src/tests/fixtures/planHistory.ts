import type { PlanHistoryDetail } from '@modules/planning/types';

/**
 * Realistic mock for the plan-history endpoint, shaped exactly like the expected API
 * response. Swapping to the real backend = deleting the MSW handler that returns this;
 * the service + UI already consume `PlanHistoryDetail`.
 *
 * Accepts `planId` so the mock echoes the requested plan and can be varied per id later.
 */
export function buildPlanHistoryMock(planId: string): PlanHistoryDetail {
  return {
    planId,
    reviewBanner: {
      stageLabel: 'Buy Planning',
      message: 'Agent has completed this stage and is waiting for your sign-off before proceeding.',
    },
    pipeline: [
      {
        id: 'location-clustering',
        label: 'Location Clustering',
        status: 'completed',
        durationLabel: '4:12 mins',
        progressPct: 91,
        summary:
          '3 scenarios generated. Revenue-Tiered selected (91% conf). Stores grouped into 4 clusters: Premium (18), High Street (34), Suburban (22), Outlet (7).',
        decisions: [
          {
            title: 'Scenario A Chosen Over B/C — Highest Silhouette Score',
            detail:
              'Silhouette Score 0.74 vs 0.61 (Format) and 0.58 (ST%). Revenue tiers showed clearest inter-cluster separation based on 24-month trading history.',
          },
          {
            title: 'Cluster D (Outlet) Isolated From Mainstream Ranging',
            detail:
              'Outlet stores show -18pp ST% vs org avg. Separate depth curve required to avoid over-ranging clearance product into full-price formats.',
          },
          {
            title: 'Geographic Coherence Validated Across All Regions',
            detail:
              'All clusters contain stores from ≥3 countries — no single-country cluster bias that would distort ranging decisions.',
          },
        ],
      },
      { id: 'hindsight-analysis', label: 'Hindsight Analysis', status: 'completed', durationLabel: '2:28 mins', progressPct: 91 },
      { id: 'demand-forecast', label: 'Demand Forecast', status: 'completed', durationLabel: '2:28 mins', progressPct: 91 },
      { id: 'strategy-scenarios', label: 'Strategy & Scenarios', status: 'completed', durationLabel: '2:28 mins', progressPct: 91 },
      { id: 'placeholder-creation', label: 'Placeholder Creation', status: 'completed', durationLabel: '2:28 mins', progressPct: 91 },
      { id: 'shopping-list', label: 'Shopping List', status: 'completed', durationLabel: '2:28 mins', progressPct: 91 },
      { id: 'line-planning', label: 'Line Planning', status: 'completed', durationLabel: '2:28 mins', progressPct: 91 },
      {
        id: 'buy-planning',
        label: 'Buy Planning',
        status: 'inReview',
        durationLabel: '2:28 mins',
        progressPct: 91,
      },
      { id: 'mfp-reconciliation', label: 'MFP Reconciliation', status: 'upcoming' },
      { id: 'final-approval', label: 'Final Approval', status: 'upcoming' },
    ],
    versions: [
      {
        id: 'v-line-planning',
        stageLabel: 'Line Planning',
        timeAgo: '1h ago',
        author: 'Sarah L.',
        summary: '142 → 144 options. Added 2 hero Dresses in Drop 2.',
        cascade: { count: 3, stages: ['Buy Planning', 'MFP Reconciliation', 'Approval'] },
      },
      {
        id: 'v-strategy-1',
        stageLabel: 'Strategy',
        timeAgo: '3h ago',
        author: 'Agent',
        summary: 'Scenario B locked as plan basis (91% conf). Scenario A archived.',
        cascade: {
          count: 3,
          stages: ['Buy Planning', 'MFP Reconciliation', 'Approval', 'Attribute Ranking'],
        },
      },
      {
        id: 'v-strategy-2',
        stageLabel: 'Strategy',
        timeAgo: '3h ago',
        author: 'Agent',
        summary: 'Scenario B locked as plan basis (91% conf). Scenario A archived.',
        cascade: {
          count: 3,
          stages: ['Buy Planning', 'MFP Reconciliation', 'Approval', 'Attribute Ranking'],
        },
      },
    ],
    activity: [
      {
        id: 'a-1',
        timeAgo: '1h ago',
        actor: 'Sarah L.',
        message: 'Approved the Line Planning stage and released it to Buy Planning.',
      },
      {
        id: 'a-2',
        timeAgo: '3h ago',
        actor: 'Agent',
        message: 'Generated 3 clustering scenarios and recommended Revenue-Tiered (91% conf).',
      },
    ],
  };
}
