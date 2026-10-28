import { http, HttpResponse } from 'msw';
import {
  dashboardSummaryFixture,
  dashboardTasksFixture,
  kpisFixture,
  platformCardsFixture,
} from '@tests/fixtures/dashboard';

export const dashboardHandlers = [
  http.get('*/api/dashboard/summary', () => HttpResponse.json(dashboardSummaryFixture)),

  http.get('*/api/dashboard/platform-cards', () =>
    HttpResponse.json({ items: platformCardsFixture }),
  ),

  http.get('*/api/dashboard/kpis', () => HttpResponse.json({ items: kpisFixture })),

  http.get('*/api/dashboard/tasks', ({ request }) => {
    const url = new URL(request.url);
    const completed = url.searchParams.get('completed');
    let items = dashboardTasksFixture;
    if (completed != null) items = items.filter((t) => String(t.completed) === completed);
    return HttpResponse.json({ items, total: items.length });
  }),

  http.get('*/api/dashboard/weather', () =>
    HttpResponse.json(dashboardSummaryFixture.weather),
  ),
];
