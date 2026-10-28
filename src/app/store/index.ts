import { configureStore } from '@reduxjs/toolkit';
import { appConfigReducer } from '@modules/appConfig';
import { productsReducer } from '@modules/products';
import { locationsReducer } from '@modules/locations';
import { dashboardReducer } from '@modules/dashboard';
import { adminReducer } from '@modules/admin';
import { planningReducer } from '@modules/planning';
// Imported from the store slice directly rather than the module barrel: the barrel also
// exports the module's components, and pulling those in here would undo the route's
// code splitting.
import { hindsightReducer } from '@modules/hindsight/store';
import { clusteringReducer } from '@modules/clustering/store';

export const rootReducer = {
  appConfig: appConfigReducer,
  products: productsReducer,
  locations: locationsReducer,
  dashboard: dashboardReducer,
  admin: adminReducer,
  planning: planningReducer,
  hindsight: hindsightReducer,
  clustering: clusteringReducer,
};

export function createStore() {
  return configureStore({ reducer: rootReducer });
}

export const store = createStore();

export type AppStore = ReturnType<typeof createStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
