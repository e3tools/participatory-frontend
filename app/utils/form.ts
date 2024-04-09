evaluate_depends_on_value = (expression, doc) => {
    let out = null;
    //let doc = this.doc;

    if (!doc && this.get_values) {
        doc = this.get_values(true);
    }

    if (!doc) {
        return;
    }

    let parent = this.frm ? this.frm.doc : this.doc || null;

    if (typeof expression === "boolean") {
        out = expression;
    } else if (typeof expression === "function") {
        out = expression(doc);
    } else if (expression.substr(0, 5) == "eval:") {
        try {
            out = frappe.utils.eval(expression.substr(5), { doc, parent });
            if (parent && parent.istable && expression.includes("is_submittable")) {
                out = true;
            }
        } catch (e) {
            frappe.throw(__('Invalid "depends_on" expression'));
        }
    } else if (expression.substr(0, 3) == "fn:" && this.frm) {
        out = this.frm.script_manager.trigger(
            expression.substr(3),
            this.doctype,
            this.docname
        );
    } else {
        var value = doc[expression];
        if ($.isArray(value)) {
            out = !!value.length;
        } else {
            out = !!value;
        }
    }

    return out;
}
