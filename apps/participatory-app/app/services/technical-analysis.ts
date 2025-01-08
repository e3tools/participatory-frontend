import { IDBReadParam } from 'data-layer/interfaces/database';
import { DocTypeService } from 'data-layer/services/doctype';
import { APP } from 'common';
import { Frappe } from 'data-layer/backends/frappe';
import { DATA_TYPE } from 'gis/enums';
import { LocalDB } from 'data-layer/backends/local-db';

class TechnicalAnalysisService {
  static doctypeService = new DocTypeService(`Technical Analysis`);
  static backend = new Frappe(APP.backendURL);
  /**
   * Get list of technical analyses
   */
  static async get_analyses() {
    const cfg = {} as IDBReadParam;
    cfg.fields = ['name', 'datasource_type', 'analysis_name', 'description'];
    cfg.filters = [
      ['is_published', '=', 1],
      ['docstatus', '!=', 2],
    ];
    if (await this.backend.is_online()) {
      return await this.doctypeService.get_list(cfg);
    } else {
      return await LocalDB.get_list('Technical Analysis', cfg.filters);
    }
  }

  static async get_analysis(analysis_name: string) {
    if (await this.backend.is_online()) {
      return await this.doctypeService.get_doc(analysis_name);
    } else {
      return await LocalDB.get_doc('Technical Analysis', analysis_name);
    }
  }

  static async get_computation(
    analysis_name: string,
    vector_id: string,
    admin_level: number,
  ) {
    if (await this.backend.is_online()) {
      const res = await this.backend.callApiEndpoint(
        'get_computation',
        {
          analysis_name,
          vector_id,
          admin_level,
        },
        'POST',
      );
      if (res?.type === DATA_TYPE.RASTER) {
        res.result = APP.backendURL + res.result;
      }
      return res;
    } else {
      LocalDB.throw_not_implemented('Technical Analysis');
    }
  }
}

export { TechnicalAnalysisService };
