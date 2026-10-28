import type { RequestHandler } from 'msw';
import { productsHandlers } from './handlers/products';
import { locationsHandlers } from './handlers/locations';
import { dashboardHandlers } from './handlers/dashboard';
import { adminHandlers } from './handlers/admin';
import { planningHandlers, planningTestHandlers } from './handlers/planning';
import { hindsightHandlers, hindsightTestHandlers } from './handlers/hindsight';
import { clusteringHandlers, clusteringTestHandlers } from './handlers/clustering';

/**
 * Handlers safe to run in the browser: endpoints the real backend does not serve yet. Anything the
 * live API answers must stay out of this list, or the worker would shadow it and the app would
 * quietly run on fixtures.
 */
export const handlers: RequestHandler[] = [
  ...productsHandlers,
  ...locationsHandlers,
  ...dashboardHandlers,
  ...adminHandlers,
  ...planningHandlers,
  ...hindsightHandlers,
  ...clusteringHandlers,
];

/**
 * What the test server runs: the browser-safe set plus stand-ins for live endpoints, which tests
 * need answered deterministically without reaching the network.
 */
export const testHandlers: RequestHandler[] = [
  ...handlers,
  ...planningTestHandlers,
  ...hindsightTestHandlers,
  ...clusteringTestHandlers,
];
