import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { LoadStatus } from '@shared/types';
import {
  getDashboardSummary,
  getDashboardTasks,
  getKpis,
  getPlatformCards,
} from '../api';
import type {
  ChartWidgetMeta,
  DashboardKpi,
  FocusCard,
  Greeting,
  PlatformCard,
  SeasonHighlight,
  Task,
  Weather,
} from '../types';

export interface DashboardState {
  greeting?: Greeting;
  platformCards: PlatformCard[];
  focusCards: FocusCard[];
  kpis: DashboardKpi[];
  highlights: SeasonHighlight[];
  chartMeta: ChartWidgetMeta[];
  tasks: Task[];
  weather?: Weather;
  status: LoadStatus;
  error?: string;
}

const initialState: DashboardState = {
  platformCards: [],
  focusCards: [],
  kpis: [],
  highlights: [],
  chartMeta: [],
  tasks: [],
  status: 'idle',
};

export const fetchDashboard = createAsyncThunk('dashboard/fetch', async () => {
  const [summary, tasks, platform, kpis] = await Promise.all([
    getDashboardSummary(),
    getDashboardTasks(),
    getPlatformCards(),
    getKpis(),
  ]);
  return {
    summary,
    tasks: tasks.items,
    platformCards: platform.items,
    kpis: kpis.items,
  };
});

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending, (state) => {
        state.status = 'loading';
        state.error = undefined;
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.greeting = action.payload.summary.greeting;
        state.focusCards = action.payload.summary.focusCards;
        state.chartMeta = action.payload.summary.chartMeta;
        state.highlights = action.payload.summary.highlights;
        state.weather = action.payload.summary.weather;
        state.tasks = action.payload.tasks;
        state.platformCards = action.payload.platformCards;
        state.kpis = action.payload.kpis;
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const dashboardReducer = dashboardSlice.reducer;
