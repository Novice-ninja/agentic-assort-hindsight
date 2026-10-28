import { http, HttpResponse } from 'msw';
import { locationsFixture } from '@tests/fixtures/locations';

export const locationsHandlers = [
  http.get('*/api/locations', ({ request }) => {
    const url = new URL(request.url);
    const q = url.searchParams.get('q')?.toLowerCase();
    const status = url.searchParams.get('status');
    const regions = url.searchParams.getAll('region');

    let items = locationsFixture;
    if (q) items = items.filter((l) => l.name.toLowerCase().includes(q));
    if (status) items = items.filter((l) => l.status === status);
    if (regions.length) items = items.filter((l) => regions.includes(l.region));

    return HttpResponse.json({
      items,
      total: items.length,
      page: 1,
      pageSize: items.length,
    });
  }),

  http.get('*/api/locations/:id', ({ params }) => {
    const location = locationsFixture.find((l) => l.id === params.id);
    if (!location) {
      return HttpResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Location not found' } },
        { status: 404 },
      );
    }
    return HttpResponse.json(location);
  }),
];
