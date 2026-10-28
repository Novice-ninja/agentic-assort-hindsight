import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { LoadStatus } from '@shared/types';
import { getGlobalConfig, getMetricConfig } from '../api';
import { FALLBACK_GLOBAL_CONFIG, FALLBACK_METRIC_CONFIGS } from '../fallback';
import type { GlobalConfig, MetricCatalogue } from '../types';

/** Where the config currently in the store came from. */
export type ConfigSource = 'api' | 'fallback';

export interface AppConfigState {
  /** Never null: it starts as the fallback so no consumer has to handle "config not loaded". */
  global: GlobalConfig;
  /** Metrics indexed by key, so a widget labelling a value does a lookup rather than a scan. */
  metrics: MetricCatalogue;
  statuses: {
    global: LoadStatus;
    metrics: LoadStatus;
  };
  sources: {
    global: ConfigSource;
    metrics: ConfigSource;
  };
  /** Why the last fetch failed. Kept even while the fallback serves the UI, for diagnostics. */
  errors: {
    global?: string;
    metrics?: string;
  };
}

const initialState: AppConfigState = {
  global: FALLBACK_GLOBAL_CONFIG,
  metrics: [...FALLBACK_METRIC_CONFIGS],
  statuses: { global: 'idle', metrics: 'idle' },
  sources: { global: 'fallback', metrics: 'fallback' },
  errors: {},
};

function selectSelf(state: unknown): AppConfigState {
  return (state as { appConfig: AppConfigState }).appConfig;
}

export const fetchGlobalConfig = createAsyncThunk('appConfig/fetchGlobal', getGlobalConfig, {
  // Drop a dispatch while one is already in flight, so React StrictMode's double-invoked
  // bootstrap effect does not fire the request twice on mount.
  condition: (_arg, { getState }) => selectSelf(getState()).statuses.global !== 'loading',
});

export const fetchMetricConfig = createAsyncThunk('appConfig/fetchMetrics', getMetricConfig, {
  condition: (_arg, { getState }) => selectSelf(getState()).statuses.metrics !== 'loading',
});

const appConfigSlice = createSlice({
  name: 'appConfig',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGlobalConfig.pending, (state) => {
        state.statuses.global = 'loading';
      })
      .addCase(fetchGlobalConfig.fulfilled, (state, action) => {
        state.statuses.global = 'succeeded';
        state.global = action.payload;
        state.sources.global = 'api';
        state.errors.global = undefined;
      })
      // A failure deliberately leaves `global` and `sources.global` untouched: on first load
      // that is the fallback, and on a refetch it is the last config that did load. The app is
      // always configured — only the status and error say the fetch did not work.
      .addCase(fetchGlobalConfig.rejected, (state, action) => {
        state.statuses.global = 'failed';
        state.errors.global = action.error.message;
      })

      .addCase(fetchMetricConfig.pending, (state) => {
        state.statuses.metrics = 'loading';
      })
      .addCase(fetchMetricConfig.fulfilled, (state, action) => {
        state.statuses.metrics = 'succeeded';
        state.metrics = action.payload;
        state.sources.metrics = 'api';
        state.errors.metrics = undefined;
      })
      .addCase(fetchMetricConfig.rejected, (state, action) => {
        state.statuses.metrics = 'failed';
        state.errors.metrics = action.error.message;
      });
  },
});

export const appConfigReducer = appConfigSlice.reducer;
