import type { Product } from '@modules/products';

export const productsFixture: Product[] = [
  { id: 'p_001', name: 'Aurora Jacket', category: 'apparel', status: 'active', price: 129.99, updatedAt: '2026-06-20T10:00:00.000Z' },
  { id: 'p_002', name: 'Nimbus Sneakers', category: 'footwear', status: 'active', price: 89.5, updatedAt: '2026-06-18T09:30:00.000Z' },
  { id: 'p_003', name: 'Cobalt Backpack', category: 'accessories', status: 'draft', price: 64.0, updatedAt: '2026-06-15T14:10:00.000Z' },
  { id: 'p_004', name: 'Solstice Cap', category: 'accessories', status: 'inactive', price: 24.99, updatedAt: '2026-06-12T08:00:00.000Z' },
  { id: 'p_005', name: 'Terra Hoodie', category: 'apparel', status: 'active', price: 74.25, updatedAt: '2026-06-22T16:45:00.000Z' },
];
