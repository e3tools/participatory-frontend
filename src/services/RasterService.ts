import { Frappe } from '../backend/frappe';
import { AppUtil } from "src/utils/app";

class RasterService {

    static backend = new Frappe(AppUtil.backendURL)

    static async getRainfall (vector: object) {
        let res = await this.backend.call_api_endpoint('get_raster', { vector: vector });
        res = AppUtil.backendURL + res
        return res;
    }
}

export { RasterService }