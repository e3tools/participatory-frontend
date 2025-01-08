import { Frappe } from 'data-layer/backends/frappe';
import { APP } from 'common';

class RasterService {
  static backend = new Frappe(APP.backendURL);

  static async getRainfall(vector: object) {
    let res = await this.backend.callApiEndpoint('get_raster', {
      vector: vector,
    });
    res = APP.backendURL + res;
    return res;
  }
}

export { RasterService };
