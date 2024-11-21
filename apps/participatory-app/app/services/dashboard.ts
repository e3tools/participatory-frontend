import { DB, LocalDB } from "data-layer/utils/db";
import { store } from "../state/store";
import { isOnline } from "./backend";


class DashboardService {
  constructor() {
    // const backend = new Frappe(APP.backendURL)
   
  }
  static backend = DB; // new Frappe(APP.backendURL);
  
  /**
   * Get list of dashboards
   */
  static async get_dashboards() {  
    let res = null;
    if(await this.backend.is_online()){
      res = await DB.call_api_endpoint('get_dashboards'); 
    } else {
      res = await LocalDB.get_all('Dashboard')
    }
    console.log("Dashboards: ", res)
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
    if(await this.backend.is_online()){ 
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
    } else {
      return []
    }
  }
}

export { DashboardService };
