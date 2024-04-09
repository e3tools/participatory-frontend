import { Frappe } from "../backends/frappe"
import { APP } from "../utils/app";

export class ExporterService {
    constructor() { }    
    static backend = new Frappe(APP.backendURL)

    static export_to_excel = async (doctype: string, fields="*", filters=[]) => {
        const res = await this.backend.call_api_endpoint("export_data", { 
            doctype: doctype,
            title: doctype,
            file_format_type: "Excel",
            view: "Report",
            order_by: "modified desc",
            fields: fields,
            filters: filters
        }, "POST", false, true); 
        return APP.make_backend_url(res);
    }
}
