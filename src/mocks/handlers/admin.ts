import { http, HttpResponse } from 'msw';
import type { AdminLocation } from '@modules/admin/types';
import {
  defaultFilterContext,
  exceptionFixtures,
  facetFixtures,
  locationFixtures,
  moduleStatusFixtures,
  productFixtures,
} from '@tests/fixtures/admin';

const locationsDb = [...locationFixtures];
let exceptionsDb = [...exceptionFixtures];

function hasFilters(url: URL): boolean {
  return (
    url.searchParams.has('departments') ||
    url.searchParams.has('seasons') ||
    url.searchParams.has('regions')
  );
}

export const adminHandlers = [
  http.get('*/api/admin/module-status', () =>
    HttpResponse.json({ items: moduleStatusFixtures }),
  ),

  http.get('*/api/admin/filters/facets', () =>
    HttpResponse.json({ items: facetFixtures }),
  ),

  http.get('*/api/admin/products', ({ request }) => {
    const url = new URL(request.url);
    if (!hasFilters(url)) {
      return HttpResponse.json({ items: [], total: 0 });
    }
    return HttpResponse.json({ items: productFixtures, total: productFixtures.length });
  }),

  http.get('*/api/admin/locations', ({ request }) => {
    const url = new URL(request.url);
    if (!hasFilters(url)) {
      return HttpResponse.json({ items: [], total: 0 });
    }
    let items = [...locationsDb];
    const customerType = url.searchParams.get('customerType');
    const q = url.searchParams.get('q')?.toLowerCase();
    if (customerType && customerType !== 'all') {
      items = items.filter((l) => l.customerType === customerType);
    }
    if (q) {
      items = items.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          (l.city?.toLowerCase().includes(q) ?? false) ||
          l.id.toLowerCase().includes(q),
      );
    }
    return HttpResponse.json({ items, total: items.length });
  }),

  http.patch('*/api/admin/locations/:id', async ({ params, request }) => {
    const patch = (await request.json()) as Partial<AdminLocation>;
    const idx = locationsDb.findIndex((l) => l.id === params.id);
    if (idx < 0) {
      return HttpResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Location not found' } },
        { status: 404 },
      );
    }
    locationsDb[idx] = { ...locationsDb[idx], ...patch };
    return HttpResponse.json(locationsDb[idx]);
  }),

  http.get('*/api/admin/exceptions', ({ request }) => {
    const url = new URL(request.url);
    if (!hasFilters(url)) {
      return HttpResponse.json({ items: [], total: 0 });
    }
    let items = [...exceptionsDb];
    const customerType = url.searchParams.get('customerType');
    const q = url.searchParams.get('q')?.toLowerCase();
    if (customerType && customerType !== 'all') {
      items = items.filter((e) => e.customerType === customerType);
    }
    if (q) {
      items = items.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.geography.name.toLowerCase().includes(q) ||
          e.id.toLowerCase().includes(q),
      );
    }
    return HttpResponse.json({ items, total: items.length });
  }),

  http.patch('*/api/admin/exceptions/:id', async ({ params, request }) => {
    const patch = (await request.json()) as { rules?: typeof exceptionsDb[0]['rules'] };
    const idx = exceptionsDb.findIndex((e) => e.id === params.id);
    if (idx < 0) {
      return HttpResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Exception not found' } },
        { status: 404 },
      );
    }
    exceptionsDb[idx] = { ...exceptionsDb[idx], ...patch };
    return HttpResponse.json(exceptionsDb[idx]);
  }),

  http.delete('*/api/admin/exceptions/:id', ({ params }) => {
    const idx = exceptionsDb.findIndex((e) => e.id === params.id);
    if (idx < 0) {
      return HttpResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Exception not found' } },
        { status: 404 },
      );
    }
    exceptionsDb = exceptionsDb.filter((e) => e.id !== params.id);
    return new HttpResponse(null, { status: 204 });
  }),
];

export { defaultFilterContext };
