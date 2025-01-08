import { createAsyncThunk } from '@reduxjs/toolkit';
import { IDBReadParam } from 'data-layer/interfaces/database';
import { DocTypeService } from 'data-layer/services/doctype';
import { DBSelectProps } from '../../state.types';
import { makeDBSelectConfig } from '../../utils';

interface Props {
  doctype: string;
  docname: string;
}

export const getDoc = createAsyncThunk(
  'doctype/getDoc',
  async (data: Props) => {
    const { doctype, docname } = data;
    const response = await new DocTypeService(doctype).get_doc(docname);
    return response;
  },
);

export const getDocs = createAsyncThunk(
  'doctype/getDocs',
  async (data: DBSelectProps) => {
    const { doctype, filters, fields, orderBy, getGlobalCount } = data;
    const cfg: IDBReadParam = makeDBSelectConfig(
      doctype,
      fields,
      filters,
      orderBy,
    );
    const response = await new DocTypeService(doctype).get_list(
      cfg,
      getGlobalCount,
    );
    return response;
  },
);
