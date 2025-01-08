import { LocalDBState$ } from 'data-layer/utils/db';
import { APP } from 'common';

const ID_PROPERTY = '_name';
const NEW_RECORD_MARKER_PROPERTY = '_new';

const LocalDB = class LocalDB {
  /**
   * Remove all records in the local storage
   */
  static clear = async () => {
    LocalDBState$.clearAll();
  };

  /**
   * Insert new records
   */
  static insert = async (doctype: string, doc: object) => {
    let docs = await this.get_all(doctype);
    doc[NEW_RECORD_MARKER_PROPERTY] = 1;
    doc['doctype'] = doctype;
    doc[ID_PROPERTY] = APP.generate_random_string(10);
    let arr = [...docs, doc];
    this._persist(doctype, arr);
  };

  /**
   * Update existing record
   * @param doctype
   * @param doc
   */
  static update = async (doctype: string, doc: object) => {
    const existing = await this.get_doc(doctype, doc[ID_PROPERTY]);
    if (existing) {
      const docs = await this.get_all(doctype);
      const index = docs.findIndex(
        (el) => el[ID_PROPERTY] === doc[ID_PROPERTY],
      );
      docs[index] = doc;
      this._persist(doctype, docs);
    }
    throw APP._('GLOBAL.DELETE_NOT_EXIST');
  };

  /**
   * Delete existing record
   * @param doctype
   * @param docname
   */
  static delete = async (doctype: string, docname: string) => {
    const docs = await this.get_all(doctype);
    let others = docs.filter((el) => el[ID_PROPERTY] !== docname);
    if (docs.length === others.length || docs.length === 0) {
      throw APP._('GLOBAL.DELETE_NOT_EXIST');
    }
    this._persist(doctype, others);
  };

  /**
   * Delete multiple exisiting records
   * @param doctype
   * @param docnames
   */
  static delete_many = async (doctype: string, docnames: []) => {
    const docs = await this.get_all(doctype);
    let others = docs.filter((el) => !docnames.includes(el[ID_PROPERTY]));
    if (docs.length === others.length || docs.length === 0) {
      throw APP._('GLOBAL.DELETE_NOT_EXIST');
    }
    this._persist(doctype, others);
  };

  /**
   * Get all records stored locally
   * @param doctype
   * @returns
   */
  static get_all = async (doctype: string) => {
    let docs = LocalDBState$.getString(doctype);
    return docs ? JSON.parse(docs) : [];
  };

  /**
   * Get document
   * @param doctype
   * @param docname
   * @returns
   */
  static get_doc = async (doctype: string, docname: string) => {
    const docs = await this.get_all(doctype);
    return docs.filter((el) => el[ID_PROPERTY] === docname);
  };

  /**
   * Internal method to save records in localdb
   * @param doctype
   * @param docs
   */
  static _persist = (doctype: string, docs: []) => {
    // get current recs
    const recs = LocalDBState$.data.get();
    recs[doctype] = docs;
    LocalDBState$.data.set(JSON.stringify(docs));
  };
};

export { LocalDB };
