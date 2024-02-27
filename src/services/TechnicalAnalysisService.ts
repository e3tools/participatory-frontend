import { runInThisContext } from 'vm';
import { IDBReadParam } from '../interfaces';
import { DocTypeService } from './DocTypeService';
import { AppUtil } from 'src/utils/app';
import { Frappe } from '../backend/frappe';
import { DATA_TYPE } from 'src/enums';

class TechnicalAnalysisService /* extends DocTypeService*/ {
  constructor() { 
    //super('Technical Analysis');
  }
  static doctypeService = new DocTypeService(`Technical Analysis`);
  static backend = new Frappe(AppUtil.backendURL);
  /**
   * Get list of technical analyses
   */
  static async get_analyses() {
    const cfg = {} as IDBReadParam
    cfg.filters = [
                    ["is_published", "=", 1], 
                    ["docstatus", "!=", 2], 
                ] 
    return await this.doctypeService.get_list(cfg)
  }
  
  static async get_analysis(analysis_name: str){
    return await this.doctypeService.get_doc(analysis_name)
  }

  static async get_computation(analysis_name: string, vector_id: string, admin_level:number) {
    const res = await this.backend.call_api_endpoint('get_computation', {
      analysis_name, vector_id, admin_level 
    });
    if (res.type == DATA_TYPE.RASTER){
      res.result = AppUtil.backendURL + res.result
    }
    return res
  }
}

export { TechnicalAnalysisService };
