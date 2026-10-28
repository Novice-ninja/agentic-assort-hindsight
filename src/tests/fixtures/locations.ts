import type { Location } from '@modules/locations';

export const locationsFixture: Location[] = [
  { id: 'l_001', name: 'Downtown Flagship', region: 'north', status: 'open', coordinates: { lat: 40.7128, lng: -74.006 }, updatedAt: '2026-06-18T08:30:00.000Z' },
  { id: 'l_002', name: 'Harbor Outlet', region: 'east', status: 'pending', coordinates: { lat: 42.3601, lng: -71.0589 }, updatedAt: '2026-06-17T11:00:00.000Z' },
  { id: 'l_003', name: 'Sunset Store', region: 'west', status: 'open', coordinates: { lat: 34.0522, lng: -118.2437 }, updatedAt: '2026-06-14T13:20:00.000Z' },
  { id: 'l_004', name: 'Prairie Depot', region: 'central', status: 'closed', coordinates: { lat: 41.8781, lng: -87.6298 }, updatedAt: '2026-06-10T09:00:00.000Z' },
];
