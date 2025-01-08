import { DashboardService } from '@/app/services/dashboard';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { DocTypeService } from 'data-layer/services/doctype';

export const getDashboards = createAsyncThunk(
  'dashboard/getDashboards',
  async () => {
    const dashboards = await DashboardService.getDashboards();
    return dashboards;
  },
);

export const getDashboard = createAsyncThunk(
  'dashboard/getDashboard',
  async (dashboardId: string) => {
    const dashboard = await DashboardService.getDashboardCharts(dashboardId);
    return dashboard;
  },
);

export const getDashboardCharts = createAsyncThunk(
  'dashboard/getDashboardCharts',
  async (dashboardId: string) => {
    const dashCharts = await DashboardService.getDashboardCharts(dashboardId);
    for (let i = 0; i < dashCharts.length; i++) {
      let dc = await new DocTypeService('Dashboard Chart').get_doc(
        dashCharts[i].chart,
      );
      dashCharts[i].chart_type = dc.type;
    }
    return dashCharts;
  },
);
