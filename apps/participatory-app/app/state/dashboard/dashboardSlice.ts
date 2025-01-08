import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Dashboard } from '../state.types';
import {
  getDashboard,
  getDashboardCharts,
  getDashboards,
} from './actions/dashboard.action';

interface DashboardState {
  dashboards: Dashboard[];
  loading: boolean;
  currentDashboard: Dashboard | null;
}

const initialState: () => DashboardState = () => ({
  dashboards: [],
  loading: false,
  currentDashboard: null,
});

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: initialState(),
  reducers: {
    setCurrentDashboard: (state, action: PayloadAction<Dashboard>) => {
      state.currentDashboard = action.payload;
    },
  },
  extraReducers: (builder) => {
    // get list of dashboards
    builder
      .addCase(getDashboards.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDashboards.fulfilled, (state, action) => {
        state.dashboards = action.payload;
        state.loading = false;
      })
      .addCase(getDashboards.rejected, (state) => {
        state.loading = false;
      })
      // get single dashboard
      .addCase(getDashboard.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDashboard.fulfilled, (state, action) => {
        state.currentDashboard = action.payload;
        state.loading = false;
      })
      .addCase(getDashboard.rejected, (state) => {
        state.loading = false;
      })
      // get dashboard charts
      .addCase(getDashboardCharts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDashboardCharts.fulfilled, (state, action) => {
        if (state.currentDashboard) {
          state.currentDashboard.charts = action.payload;
        }
        state.loading = false;
      })
      .addCase(getDashboardCharts.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setCurrentDashboard } = dashboardSlice.actions;

export default dashboardSlice.reducer;
