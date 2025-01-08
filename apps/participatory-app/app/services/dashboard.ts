import { DB, LocalDB } from 'data-layer/utils/db';

class DashboardService {
  static backend = DB;

  /**
   * Get list of dashboards
   */
  static async getDashboards() {
    let res = null;
    if (await this.backend.is_online()) {
      res = await DB.callApiEndpoint('get_dashboards');
    } else {
      res = await LocalDB.get_all('Dashboard');
    }
    return res;
  }

  /**
   * Get list of charts that make up the dashboard
   * @param dashboard_name name of the dashboard
   */
  static async getDashboardCharts(dashboard_name: string) {
    const res = await this.backend.callApiEndpoint('get_dashboard_charts', {
      dashboard_name: dashboard_name,
    });
    return res;
  }

  /**
   * Load data for a specific chart
   * @param chart_name
   * @returns
   */
  static async getChartData(chart_name: string) {
    if (await this.backend.is_online()) {
      const res = await this.backend.callApiEndpoint('get_dashboard_chart', {
        chart_name: chart_name,
        chart: null,
        no_cache: null,
        filters: null,
        from_date: null,
        to_date: null,
        timespan: null,
        time_interval: null,
        heatmap_year: null,
        refresh: 1,
      });
      return res;
    } else {
      return [];
    }
  }
}

export { DashboardService };
