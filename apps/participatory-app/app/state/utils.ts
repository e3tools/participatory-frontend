import { IDBReadParam } from '../interfaces/database';
import { OrderBy } from './state.types';

export const makeDBSelectConfig = (
  doctype: string,
  fields?: string[],
  filters?: [][],
  orderBy?: OrderBy,
): IDBReadParam => {
  let cfg = {} as IDBReadParam;
  const includeFields = fields ? fields : ['name'];
  //   // If the field is not *, then append name
  //   if (!fields.includes('*')) {
  //     fields.push('name'); //name must be pulled
  //   }
  cfg.doctype = doctype;
  cfg.filters = filters ? filters : [[]];
  cfg.fields = includeFields;
  if (!orderBy) {
    cfg.order_by = `modified DESC`;
  } else {
    cfg.order_by = `${orderBy.field} ${orderBy.direction}`;
  }
  return cfg;
};
