import { DB } from "../utils/db";

class DashboardService {
  constructor() {
    // const backend = new Frappe(APP.backendURL)
   
  }
  static backend = DB; // new Frappe(APP.backendURL);
  
  /**
   * Get list of dashboards
   */
  static async get_dashboards() {
    
    const res = await DB.call_api_endpoint('get_dashboards');
    return res;
  }

  /**
   * Get list of charts that make up the dashboard
   * @param dashboard_name name of the dashboard
   */
  static async get_dashboard_charts(dashboard_name: string) {
    const res = await this.backend.call_api_endpoint('get_dashboard_charts', {
      dashboard_name: dashboard_name,
    });
    return res;
  }

  /**
   * Load data for a specific chart
   * @param chart_name 
   * @returns 
   */
  static async get_chart_data(chart_name: string) {
    const res = await this.backend.call_api_endpoint('get_dashboard_chart', {
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
  }
}

export { DashboardService };
