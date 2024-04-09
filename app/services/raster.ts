import { Frappe } from '../backends/frappe';
import { APP } from '../utils/app';

class RasterService {

    static backend = new Frappe(APP.backendURL)

    static async getRainfall (vector: object) {
        let res = await this.backend.call_api_endpoint('get_raster', { vector: vector });
        res = APP.backendURL + res
        return res;
    }
}

export { RasterService }