import { ObjectHTMLAttributes } from "vue";
import { LEGEND_TYPE } from '../src/enums'

/**
 * Interface to use when deleting from database
 */
interface IDBReadSingleParam {
  doctype: string;
  docname: string;
}

/**
 * Interface to use when querying database
 */
interface IDBReadParam {
  doctype: string;
  filters: Array<[]>;
  or_filters: Array<[]>;
  fields: Array<string>;
  order_by: string;
  limit_start: number;
  limit_page_length: number;
}

/**
 * Interface to use when creating database
 */
interface IDBCreateParam {
  doctype: string;
  data: object;
}

/**
 * Interface to use when updating database
 */
interface IDBUpdateParam extends IDBCreateParam {
  docname: string;
}

/**
 * Interface to use when deleting from database
 */
interface IDBDeleteParam {
  doctype: string;
  docname: string;
}

interface ILegendItem {
  operator: string
  item_type: typeof LEGEND_TYPE,
  // alphatext_value: string,
  // numeric_value: number,
  // date_value: Date,
  absolute_val: object,
  lower_val: object,
  upper_val: object,
  label: string,
  color: string
}

export {
  IDBReadParam,
  IDBReadSingleParam,
  IDBCreateParam,
  IDBUpdateParam,
  IDBDeleteParam,
};
