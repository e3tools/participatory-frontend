import { runInThisContext } from 'vm';
import { IDBReadParam } from '../interfaces';
import { DocTypeService } from './DocTypeService';

class TechnicalAnalysisService /* extends DocTypeService*/ {
  constructor() { 
    //super('Technical Analysis');
  }
  static doctypeService = new DocTypeService(`Technical Analysis`)
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
}

export { TechnicalAnalysisService };
