import type {
  DashboardSummary,
  DashboardKpi,
  PlatformCard,
  Task,
} from '@modules/dashboard';

export const dashboardSummaryFixture: DashboardSummary = {
  greeting: { name: 'User', productName: 'Agentic Assort' },
  focusCards: [
    {
      id: 'fc_001',
      key: 'attributePlanReady',
      title: 'Attribute Plan Ready',
      description:
        'Top 5 attributes ranked. Earth tones flagged as anchor colour. Oversized fit confirmed as exit.',
      status: 'info',
    },
    {
      id: 'fc_002',
      key: 'earthTonesConfirmed',
      title: 'Earth Tones Confirmed',
      description:
        'Top 5 attributes ranked. Earth tones flagged as anchor colour. Oversized fit confirmed as exit.',
      status: 'success',
    },
    {
      id: 'fc_003',
      key: 'attributePlanReady',
      title: 'Attribute Plan Ready',
      description:
        'Top 5 attributes ranked. Earth tones flagged as anchor colour. Oversized fit confirmed as exit.',
      status: 'info',
    },
    {
      id: 'fc_004',
      key: 'exitOversizedConfirmed',
      title: 'Exit Oversized Confirmed',
      description:
        'Top 5 attributes ranked. Earth tones flagged as anchor colour. Oversized fit confirmed as exit.',
      status: 'warning',
    },
  ],
  widgets: [
    { id: 'w_focus', title: 'Focus', kind: 'focusCards' },
    { id: 'w_tasks', title: 'Tasks', kind: 'tasks' },
  ],
  chartMeta: [
    {
      id: 'revenue',
      titleKey: 'dashboard.charts.revenue',
      ranges: ['week', 'month', 'year'],
      legend: ['revenue', 'expenses'],
      placeholderSummaryKey: 'dashboard.charts.deferred',
    },
    {
      id: 'trend',
      titleKey: 'dashboard.charts.trend',
      ranges: ['month', 'year'],
      legend: ['plan'],
      placeholderSummaryKey: 'dashboard.charts.deferred',
    },
  ],
  highlights: [{ id: 'h_001', text: 'Earth tones: 61% ST, +38% YoY' }],
  weather: {
    tempC: 26,
    location: 'Bengaluru, India',
    condition: 'Overcast',
    high: 31,
    low: 27,
  },
};

export const platformCardsFixture: PlatformCard[] = [
  {
    id: 'pc_hindsight',
    key: 'hindsight',
    title: 'Hindsight',
    description: 'Industry-leading digital analytics platform for',
    status: 'active',
    reviewHref: '/hindsight',
  },
  {
    id: 'pc_strategy',
    key: 'strategy',
    title: 'Strategy',
    description: 'Industry-leading digital analytics platform for',
    status: 'done',
    reviewHref: '/strategy',
  },
  {
    id: 'pc_attributes',
    key: 'attributes',
    title: 'Attributes',
    description: 'Industry-leading digital analytics platform for',
    status: 'inProgress',
    reviewHref: '/attributes',
  },
  {
    id: 'pc_lineplanning',
    key: 'linePlanning',
    title: 'Line Planning',
    description: 'Industry-leading digital analytics platform for',
    status: 'active',
    reviewHref: '/line-planning',
  },
];

export const kpisFixture: DashboardKpi[] = [
  {
    id: 'kpi_plan',
    label: 'Final plan',
    value: 214_000_000,
    unit: 'currency',
    delta: 8.1,
    deltaDirection: 'up',
    deltaLabel: 'final plan',
  },
  {
    id: 'kpi_lastyear',
    label: 'Last year',
    value: 69.4,
    unit: 'percent',
    delta: 5.2,
    deltaDirection: 'up',
    deltaLabel: 'last year',
  },
  {
    id: 'kpi_yoy1',
    label: 'YoY change',
    value: 42.8,
    unit: 'percent',
    delta: 3,
    deltaDirection: 'up',
    deltaLabel: 'YoY change',
  },
  {
    id: 'kpi_yoy2',
    label: 'YoY change',
    value: 18.2,
    unit: 'percent',
    delta: 0.2,
    deltaDirection: 'up',
    deltaLabel: 'YoY change',
  },
];

export const dashboardTasksFixture: Task[] = [
  {
    id: 't_001',
    title: 'Review attribute plan',
    dueAt: '2026-06-30T17:00:00.000Z',
    completed: false,
    assignee: 'user_12',
  },
  {
    id: 't_002',
    title: 'Review attribute plan',
    dueAt: '2026-06-28T12:00:00.000Z',
    completed: false,
    assignee: 'user_08',
  },
  {
    id: 't_003',
    title: 'Review attribute plan',
    dueAt: '2026-07-02T09:00:00.000Z',
    completed: false,
  },
  {
    id: 't_004',
    title: 'Review attribute plan',
    dueAt: '2026-07-05T09:00:00.000Z',
    completed: false,
  },
];
