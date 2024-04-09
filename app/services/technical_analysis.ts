import { IDBReadParam } from '../interfaces/database';
import { DocTypeService } from './doctype';
import { APP } from '../utils/app';
import { Frappe } from '../backends/frappe';
import { DATA_TYPE } from '../modules/mapping/enums';

class TechnicalAnalysisService /*extends DocTypeService*/ {
  constructor() { 
    //super('Technical Analysis');
  }
  static doctypeService = new DocTypeService(`Technical Analysis`);
  static backend = new Frappe(APP.backendURL);
  /**
   * Get list of technical analyses
   */
  static async get_analyses() {
    const cfg = {} as IDBReadParam
    cfg.fields = ['name', 'datasource_type', 'analysis_name', "description"];
    cfg.filters = [
                    ["is_published", "=", 1], 
                    ["docstatus", "!=", 2], 
                ] 
    return await this.doctypeService.get_list(cfg)
  }
  
  static async get_analysis(analysis_name: string){
    return await this.doctypeService.get_doc(analysis_name)
  }

  static async get_computation(analysis_name: string, vector_id: string, admin_level:number) {
    const res = await this.backend.call_api_endpoint('get_computation', {
      analysis_name, vector_id, admin_level 
    }, 'POST');
    if (res?.type == DATA_TYPE.RASTER){
      res.result = APP.backendURL + res.result
    }
    return res
  }
}

export { TechnicalAnalysisService };
