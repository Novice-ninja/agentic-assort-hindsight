import type { GlobalConfig } from '../types';

/**
 * Baked-in copy of the global config, used until the backend endpoint exists and whenever a
 * fetch fails. It is typed rather than imported as JSON so a drift between this snapshot and
 * the config types is a compile error instead of a runtime surprise.
 *
 * Keep this in step with the backend's authored config: it is the shape every view falls back
 * to, so anything missing here is missing for a user whose config request failed.
 */
export const FALLBACK_GLOBAL_CONFIG: GlobalConfig = {
  version: 1,
  updatedAt: '2026-08-06T00:00:00.000Z',
  hierarchy: {
    levelHierarchies: ['l0_name', 'l1_name', 'l2_name', 'l3_name'],
    attributeHierarchies: [],
  },
  controls: {
    recommendation: {
      type: 'select',
      options: [
        { value: 'all', label: 'All' },
        { value: 'keep', label: 'Keep' },
        { value: 'drop', label: 'Drop' },
      ],
      default: 'all',
      multi: false,
    },

    // Future reusable controls
    // Other examples:
    // metric: {
    //   type: 'select',
    //   options: [
    //     { value: 'qty_sold', label: 'Quantity Sold' },
    //     { value: 'sell_thru_pct', label: 'Sell Through %' },
    //   ],
    //   default: 'qty_sold',
    //   multi: false,
    // },
  },
  modules: {
    planning: {
      views: {
        allPlans: {
          filters: {
            fields: [
              { key: 'stage', multi: true, default: '$all' },
              { key: 'season', multi: true, default: '$all' },
            ],
          },
          components: {
            statusTabs: {
              componentKey: 'statusTabs',
              filters: {
                fields: [
                  { key: 'stage', multi: true, default: '$all' },
                  { key: 'season', multi: true, default: '$all' },
                ],
              },
            },
            plansSummary: { componentKey: 'plansSummary' },
            plansCardGrid: {
              componentKey: 'plansCardGrid',
              cardMetrics: ['aur', 'buy_units', 'gross_margin_pct', 'gross_margin'],
            },
            plansTable: { componentKey: 'plansTable' },
          },
        },
        planHistory: {
          tabs: [
            { key: 'pipeline', componentKey: 'pipeline' },
            { key: 'versionHistory', componentKey: 'versionHistory' },
            { key: 'activityLog', componentKey: 'activityLog' },
          ],
          components: {
            planSummary: { componentKey: 'planSummary' },
            pipeline: { componentKey: 'pipeline' },
            versionHistory: { componentKey: 'versionHistory' },
            activityLog: { componentKey: 'activityLog' },
          },
        },
        createPlan: {
          components: {
            nameCalendar: { componentKey: 'nameCalendar' },
            productScope: { componentKey: 'productScope' },
            clusteringRunMode: { componentKey: 'clusteringRunMode' },
            confidenceThreshold: { componentKey: 'confidenceThreshold' },
            reviewCreate: { componentKey: 'reviewCreate' },
          },
        },
      },
    },
    hindsight: {
      filters: {
        fields: [{ key: 'season', multi: false, default: '$latest' }],
      },
      viewGroups: {
        viewPlan: {
          tabs: [{ key: 'overview' }, { key: 'byItem' }, { key: 'byAttribute' }],
        },
      },
      views: {
        overview: {
          components: {
            seasonScorecard: { componentKey: 'seasonScorecard' },
            productPerformance: {
              componentKey: 'productPerformance',
              kpiList: [
                'revenue',
                'qty_sold',
                'aur',
                'gross_margin',
                'gross_margin_pct',
                'option_count',
              ],
            },
            contribution: {
              componentKey: 'contribution',
              // `limit` is unused: which cards appear is `dimensionList`, not a cap.
              limit: 8,
              dimensionList: ['color', 'article_brand_name', 'product_type'],
            },
            regularPromoSales: {
              componentKey: 'regularPromoSales',
              metricKeys: ['charts-weekly', 'charts-monthly'],
              filters: {
                metricFilter: {
                  type: 'select',
                  default: 'qty_sold',
                  multi: false,
                },
              },
              hierarchyDropdownEnabled: true,
              defaultRollupType: 'weekRollup',
            },
            subCategoryContribution: {
              componentKey: 'subCategoryContribution',
              metricKeys: ['charts-season'],
              filters: {
                metricFilter: {
                  type: 'select',
                  default: 'qty_sold',
                  multi: false,
                },
              },
              hierarchyDropdownEnabled: true,
            },
            carryForward: { componentKey: 'carryForward' },
            topPerformers: { componentKey: 'topPerformers' },
            clusterPerformance: {
              componentKey: 'clusterPerformance',
              metricKeys: ['charts-season'],
              filters: {
                metricFilter: {
                  type: 'select',
                  default: 'qty_sold',
                  multi: false,
                },
              },
            },
            categoryByCluster: {
              componentKey: 'categoryByCluster',
              metricKeys: ['charts-weekly'],
              defaultMetricKey: 'sell_thru_pct',
              filters: {
                metricFilter: {
                  type: 'select',
                  default: 'sell_thru_pct',
                  multi: false,
                },
              },
            },
            storeHexMap: {
              componentKey: 'storeHexMap',
              metricKeys: ['charts-weekly'],
              legend: [
                { min: 20, max: null, label: 'ST% ≥ 20%', color: '#26734b' },
                { min: 10, max: 20, label: '10% ≤ ST% < 20%', color: '#3bb273' },
                { min: 0, max: 10, label: '0% < ST% < 10%', color: '#89d1ab' },
                { min: -10, max: 0, label: '-10% < ST% ≤ 0%', color: '#ed9998' },
                { min: -20, max: -10, label: '-20% < ST% ≤ -10%', color: '#e15554' },
                { min: null, max: -20, label: 'ST% ≤ -20%', color: '#c64746' },
              ],
              filters: {
                metricFilter: {
                  type: 'select',
                  default: 'sell_thru_pct',
                  multi: false,
                },
              },
            },
          },
        },
        byItem: {
          viewModes: ['grid', 'table'],
          components: {
            itemTotals: { componentKey: 'itemTotals' },
            itemCardGrid: {
              componentKey: 'itemCardGrid',
              flipViewConfig: {
                frontViewConfig: {
                  displayMetricList: ['buy_units', 'qty_sold'],
                },
                backViewConfig: {
                  displayMetricList: [
                    'qty_sold',
                    'revenue',
                    'gross_margin_pct',
                    'mark_down_pct',
                    'weeks_on_hand',
                    'sell_thru_pct',
                  ],
                },
              },
              filters: {
                recommendation: {
                  componentSourceKey: 'recommendation',
                },
              },
            },
            itemTable: {
              componentKey: 'itemTable',
              filters: {
                recommendation: {
                  componentSourceKey: 'recommendation',
                },
              },
            },
          },
        },
        byAttribute: {
          components: {
            attributeSelector: { componentKey: 'attributeSelector' },
            attributeHeatmap: {
              componentKey: 'attributeHeatmap',
              defaultMetricKey: 'sell_thru_pct',
            },
            attributeBreakdownTable: {
              componentKey: 'attributeBreakdownTable',
              filters: {
                recommendation: {
                  componentSourceKey: 'recommendation',
                },
              },
            },
          },
        },
      },
    },
    clustering: {
      views: {
        wizard: {
          components: {
            planResume: {
              componentKey: 'planResume',
              statusLanding: {
                ATTRIBUTE_SELECTION_PENDING: { step: 'reviewRun', section: 'attributes' },
                VARIANT_SELECTION_PENDING: { step: 'reviewRun', section: 'variants' },
                SELECT_FINAL_CLUSTER_VARIANT_PENDING: { step: 'finalize', section: 'candidates' },
                GATE_2_APPROVAL_PENDING: { step: 'signOff', section: 'gate2' },
                GATE_2_APPROVAL: { step: 'signOff', section: 'gate2' },
                GATE_3_APPROVAL_PENDING: { step: 'signOff', section: 'gate3' },
                GATE_3_APPROVAL: { step: 'signOff', section: 'gate3' },
                FINALIZED: { step: 'signOff', section: 'complete' },
              },
            },
          },
        },
        finalize: {
          components: {
            performanceClusters: {
              componentKey: 'performanceClusters',
              metricKeys: ['charts-season'],
              filters: {
                xAxis: {
                  type: 'select',
                  default: 'gross_margin',
                  multi: false,
                },
                yAxis: {
                  type: 'select',
                  default: 'qty_sold',
                  multi: false,
                },
                zAxis: {
                  type: 'select',
                  default: 'revenue',
                  multi: false,
                },
              },
            },
          },
        },
      },
    },
  },
};
