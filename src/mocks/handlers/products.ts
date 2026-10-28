import { http, HttpResponse } from 'msw';
import { productsFixture } from '@tests/fixtures/products';

export const productsHandlers = [
  http.get('*/api/products', ({ request }) => {
    const url = new URL(request.url);
    const q = url.searchParams.get('q')?.toLowerCase();
    const status = url.searchParams.get('status');
    const categories = url.searchParams.getAll('category');

    let items = productsFixture;
    if (q) items = items.filter((p) => p.name.toLowerCase().includes(q));
    if (status) items = items.filter((p) => p.status === status);
    if (categories.length) items = items.filter((p) => categories.includes(p.category));

    return HttpResponse.json({
      items,
      total: items.length,
      page: 1,
      pageSize: items.length,
    });
  }),

  http.get('*/api/products/:id', ({ params }) => {
    const product = productsFixture.find((p) => p.id === params.id);
    if (!product) {
      return HttpResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Product not found' } },
        { status: 404 },
      );
    }
    return HttpResponse.json(product);
  }),
];
