import { DashboardService } from "@/app/services/dashboard";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { DocTypeService } from "data-layer/services/doctype";

export const getDashboards = createAsyncThunk(
    'dashboard/getDashboards',
    async () => {
        const dashboards = await DashboardService.get_dashboards();
        return dashboards;
    }
);

export const getDashboard = createAsyncThunk(
    'dashboard/getDashboard',
    async (dashboardId: string) => {
        const dashboard = await DashboardService.get_dashboard_charts(dashboardId);
        return dashboard;
    }
);

export const getDashboardCharts = createAsyncThunk(
    'dashboard/getDashboardCharts',
    async(dashboardId: string) => {
        const dash_charts = await DashboardService.get_dashboard_charts(dashboardId); 
        for(let i=0; i < dash_charts.length; i++){
          let dc = await new DocTypeService("Dashboard Chart").get_doc(dash_charts[i].chart);
          dash_charts[i].chart_type = dc.type;
        } 
        return dash_charts;
    }
)